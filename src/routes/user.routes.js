import { Router } from "express";
import { getLoggedInUserData, loginUser, registerUser, updateUser, deleteUser } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)

// protected Routes 
router.route('/getUserData').get(verifyJWT, getLoggedInUserData)
router.route('/updateUser').put(verifyJWT, updateUser)
router.route('/deleteUser').delete(verifyJWT, deleteUser)


export default router;