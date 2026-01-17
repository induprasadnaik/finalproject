import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import connectDB from "./config/db.js"
import userRoutes from "./routes/userRoutes.js"
import adminRoutes from './routes/adminRoutes.js'
import customerRoutes from './routes/customerRoutes.js'
import vendorRoutes from "./routes/vendorRoutes.js"
import {authMiddleware,authorizeRoles} from './middlewares/authmiddleware.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

dotenv.config();
connectDB();
const app = express();
app.use(cookieParser());
app.use(cors({
  origin:"http://localhost:5173",
  credentials: true
})); 

app.use(express.json());
app.use("/api/users",userRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/customer",authMiddleware, authorizeRoles("customer"),customerRoutes);
app.use("/api/vendor",authMiddleware, authorizeRoles("vendor"),vendorRoutes);
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
