import { Router } from "express";
import { getAllUsers, getOneUser } from "../controllers/admin.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from '../middlewares/verifyAdmin.middleware.js'

const router = Router();

// protected routes
router.route('/getAllUsers').get(verifyJWT, isAdmin, getAllUsers)
router.route('/getSingleUser/:id').get(verifyJWT, isAdmin, getOneUser)




export default router