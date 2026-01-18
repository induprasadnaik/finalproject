import express from 'express'
import { updateCustomerprofile,getCustomerbyId,getaddressByCustomerbyId,updateCustomerAddress,getaddressByCustomeraddressbyId} from '../controllers/customer/customerController.js'

const router = express.Router();
router.put("/updateprofile", updateCustomerprofile);
router.get("/getprofile", getCustomerbyId);
router.get("/getaddress", getaddressByCustomerbyId);
router.get("/getaddressbyid/:addressId", getaddressByCustomeraddressbyId);
router.put("/updateaddress/:addressId", updateCustomerAddress);

export default router;