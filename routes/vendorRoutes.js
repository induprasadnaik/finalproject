import express from 'express'
import { updateVendorprofile ,getVendorbyId} from '../controllers/vendor/vendorController.js'

const router = express.Router();
router.get("/getprofile",getVendorbyId)
router.put("/updateprofile",updateVendorprofile)


export default router;