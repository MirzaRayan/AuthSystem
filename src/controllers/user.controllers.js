import { User } from "../models/User.models.js";

const registerUser = async (req, res) => {
    try {

        // getting data from input fields

        const {name, email, password, role} = req.body;

        // checking for empty fields

        if(!name || !email || !password) {
            return res.status(400).json({
                message:'All fields are Required!',
            })
        }

        // checking if user already exist

        const existedUser = await User.findOne({
            email
        })

        if(existedUser) {
            return res.status(400).json({
                message:'User already exist with this email!',
            })
        }

        // creating new User

        const newUser = await User.create({
            name,
            email,
            password,
            role
        })

        if(!newUser) {
            return res.status(500).json({
                message:'failed to create user',
            })
        }

        // returning new User

        return res.status(201).json({
            message: 'User created Successfully',
            user: newUser
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:'Server Error while creating User',
        })
        
    }
}


export {registerUser}