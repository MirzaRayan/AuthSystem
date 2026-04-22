import { User } from "../models/User.models.js";
import jwt from 'jsonwebtoken'

export const verifyJWT = async (req, res) => {
    try {

        // getting accessToken from cookies
        const token = req.cookie?.accessToken

        // checking if token exists 
        if(!token) {
            return res.status(401).json({
                message:'unAuthorized req'
            })
        }


        // decoding token using jwt method named verify
        const decodedToken = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        )


        // getting access of userid from decodedToken
        const user = await User.findById(decodedToken._id).select('-password')


        // checking if user exists
        if(!user) {
            return res.status(401).send('Invalid Access Token');
        }

        req.user = user
    } catch (error) {
        console.log(error);
        return res.status(500).send("Invalid or expired token");
    }
}