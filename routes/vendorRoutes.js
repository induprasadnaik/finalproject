import express from 'express'
import { updateVendorprofile ,getVendorbyId} from '../controllers/vendor/vendorController.js'
import { updateCategory ,deleteCategory,createCategory,getAllCategories} from '../controllers/vendor/categoryController.js'
import {authMiddleware,authorizeRoles} from '../middlewares/authmiddleware.js';

const router = express.Router();
router.get("/getprofile",getVendorbyId)
router.put("/updateprofile",updateVendorprofile)
router.get("/category", getAllCategories);
router.post("/category/create",  authorizeRoles("vendor"),createCategory);
router.put("/category/:id", authorizeRoles("vendor"), updateCategory);
router.delete("/category/:id", authorizeRoles("vendor"), deleteCategory);


export default router;