import express from 'express'
import { updateCustomerprofile,getCustomerbyId} from '../controllers/customer/customerController.js'

const router = express.Router();
router.put("/updateprofile", updateCustomerprofile);
router.get("/getprofile", getCustomerbyId);

export default router;