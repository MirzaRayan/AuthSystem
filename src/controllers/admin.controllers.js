import { User } from "../models/User.models.js";


const getAllUsers = async (req, res) => {
    try {

        // getting all the users
        const allUsers = await User.find().select('-password')

        if(!allUsers) {
            return res.status(404).json({
                message: 'No User found'
            })
        }

        // returning response 
        return res.status(200).json({
            message: 'All user fetched successfully',
            length: allUsers.length,
            data: allUsers
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Server Error while getting all users'
        })
    }
}

const getOneUser = async (req, res) => {
    try {

        // getting user from the its id from the URL
        const user = await User.findById(req.params.id).select('-password')


        if(!user) {
            return res.status(404).json({
                message:  'User Not found',
            })
        }


        // returning response user's data
        return res.status(200).json({
            message: 'User found Successfully',
            data: user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Server Error while getting Single User'
        })
    }
}

const deleteUser = async (req, res) => {
    try {

        //getting userid from the url
        const deletedUser =await User.findByIdAndDelete(req.params.id).select('-password')

        if(!deletedUser) {
            return res.status(404).json({
                message: 'User not found',
            })
        }

        return res.status(200).json({
            message: 'User deleted Successfully',
            data: deletedUser
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Serve Error while deleting User'
        })
    }
}



export { getAllUsers, getOneUser, deleteUser }