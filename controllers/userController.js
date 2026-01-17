import User from '../models/admin/adminModels.js'
import Customer from '../models/customer/customerModel.js'
import Vendor from '../models/vendor/vendorModel.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'


// User Registration
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, usertype, mobile } = req.body;

    if (!username || !email || !password || !mobile || !usertype) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "Username/Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "vendor", 
    });

    res.status(201).json({ message: "Vendor registered", user: newUser, vendor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// User Signin
export const loginUser =async(req,res)=>{
try{
    const {username,email,password} =req.body;
    //validation
    if(!username || !email || !password ){
        return res.status(400).json({message:"All fields are required"});          
    }
    //user existance
    const user = await User.findOne({$or:[{username},{email}],}).select("+password");
    if(!user){
        return res.status(400).json({message:"Invalid Username/email"});
    }
    //check user active  or not
    if (!user.isActive) {
        return res.status(403).json({ message: "Account is inactive by admin, Contact admin" });
    }

    // Authentication 
    const matchedPassword= await bcrypt.compare(password,user.password);
    
     if(!matchedPassword){
        res.status(400).json({message:"invalid password"});    
     }

    user.lastLoginAt = new Date();
    await user.save();


     ///create jwt token
     const token = jwt.sign({id:user._id,username,role:user.role},process.env.SECRET,{expiresIn: process.env.EXPIRES_IN});
      //set token  in cookie
      res.cookie("token",token,{
     httpOnly: true,
     secure: true,        // REQUIRED for production
     sameSite: "none",    // REQUIRED for cross-site cookies  
      }); 
     res.status(201).json({message:"login successful",token:token,user:{id:user._id,username:user.username,role:user.role,lastLoginAt: user.lastLoginAt}});
}
  catch(err){
        res.status(500).json({message:err.message});
}
};