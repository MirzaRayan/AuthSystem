import e from "express";
import { User } from "../models/User.models.js";

const methodForGeneratingAccessToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken();
        return accessToken;
    } catch (error) {
        console.log('Error while generating accessToken',error);
    }
}

const options = {
    httpOnly: true,
    secure: false,
}

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

        // removing password from the newUser and then returning it 

        const createdUser = await User.findById(newUser._id).select('-password')

        if(!createdUser) {
            return res.status(500).json({
                message:'failed to create user',
            })
        }

        // returning new User

        return res.status(201).json({
            message: 'User created Successfully',
            user: createdUser
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:'Server Error while creating User',
        })
        
    }
}

const loginUser = async (req, res) => {
     try {
        
        // getting data from input field

        const {email, password} = req.body;

        // checking for empty fields

        if(!email || !password) {
            return res.status(400).json({
                message:'email or password is empty'
            })
        }

        // checking if user does not exists

        const user = await User.findOne({
            email
        })

        if(!user) {
            return res.status(404).json({
                message:'user with this email does not exists'
            })
        }

        // comparing password with hashed password

        const isPasswordCorrect = await user.isPasswordCorrect(password)

        if(!isPasswordCorrect) {
            return res.status(401).json({
                message:'invalid credentials'
            })
        }

        // generating accessToken

        const accessToken = await methodForGeneratingAccessToken(user._id)

        // getting user without password 

        const loggedInUser =  await User.findById(user._id).select('-password')
        

        // sending cookies and returning response 
       
        return res.status(200)
        .cookie('accessToken',accessToken,options)
        .json({
            message: 'user LoggedIn successfully',
            data: loggedInUser,
            accessToken: accessToken,
        })

     } catch (error) {
        console.log('Error:',error);
        return res.status(500).json({
            message:'Server Error while logging In User',
        })
        
     }
}




export {registerUser, loginUser}