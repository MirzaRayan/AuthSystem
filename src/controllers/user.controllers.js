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

const getLoggedInUserData = async (req, res) => {
    try {

        // returning the data of the loggedIn user from req.user
        return res.status(200).json({
            message: 'successfully fetched data of loggedIn user',
            data: req.user
        })


    } catch (error) {
        console.log('Error while getting data of loggedIN user',error);
        return res.status(500).json({
            message:'Server error while getting data of the loggedIn user'
        })
    }
}

const updateUser = async (req, res) => {
    try {

        // this will get the the input fields that user send
        const key = Object.keys(req.body);


        // this is a check ----- that user can only change this field
        const allowedFields = ['name','email'];


        // validating if user's fields match with the allowedFields
        const validField = key.every((field) => allowedFields.includes(field));


        // if it is not valid field then throw error 
        if(!validField) {
            return res.status(401).json({
                message: 'User cannot update this field'
            })
        }



        // getting data of the user that want to update his profile
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            req.body,
            { new: true }
        ).select('-password')


        // checking if updatedUser exists
        if(!updatedUser) {
            return res.status(404).json({
                message: 'User Not Found'
            })
        }

        // returning response 
        return res.status(200).json({
            message: 'User Updated Successfully',
            data: updatedUser
        })

    } catch (error) {
        console.log('Server Error while updating user',error);
        return res.status(500).json({
            message: 'Server error while updating user'
        })
    }
}

const deleteUser = async (req, res) => {
    try {

        // deleting user using his id
        const deletedUser = await User.findByIdAndDelete(req.user._id)

        // checking if user exists or not 
        if(!deleteUser) {
            return res.status(404).json({
                message: 'user does not found'
            })
        }

        // returning response and clearning cookies
        return res.status(200)
        .clearCookie('accessToken')
        .json({
            message: 'User deleted Successfully',
        })


    } catch (error) {
        console.log('Server Error while deleting User',error);
        return res.status(500).json({
            message: 'Server Error while deleting User'
        })
        
    }
}



export {registerUser, loginUser, getLoggedInUserData, updateUser, deleteUser}