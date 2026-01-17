import express from 'express'
import {registerUser,loginUser} from '../controllers/userController.js'
import {authMiddleware,authorizeRoles} from '../middlewares/authmiddleware.js'
// import User from "../models/admin/adminModel.js"

const router = express.Router();
///setup firsttime admin
// router.post('/setup-admin',setupAdmin);

///////signup
router.post('/register',registerUser);
/////signin
router.post('/login',loginUser);

router.get("/checkUser",authMiddleware ,(req,res)=>{
    res.json({user_id:req.loggedUser._id,username:req.loggedUser.username,role:req.loggedUser.role});
});

router.post("/logout",authMiddleware,(req,res)=>{
    res.clearCookie("token", {
    httpOnly: true,
    secure: true,        // REQUIRED in production
    sameSite: "none"     // REQUIRED for cross-site  
      });
    res.json({message:"logged out successfully"});
});
export default router;