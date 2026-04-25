import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

const userSchema = mongoose.Schema({

    name:{
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true,
        minlength: 6
    },
    role:{
        type: String,
        enum:['user','admin'],
        default: 'user'
    },
}, {timestamps: true})



// logic for hashing password

userSchema.pre('save',async function () {
    if(!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password,10);
})


// function for passowrds comparison

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password,this.password)
}

// function to generate Access token

userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id:this._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
}



export const User = mongoose.model('User',userSchema);