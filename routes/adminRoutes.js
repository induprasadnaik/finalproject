import express from 'express'
import {getadminDashboardStats,pendingApprovals,updateVendorStatus,getAllCustomers,getAllVendors,blockUser,unblockUser} from "../controllers/admin/adminController.js"

const router = express.Router();
router.get("/dashboard-stats",getadminDashboardStats );
router.get('/pendings',pendingApprovals);
router.patch('/updatestatus/:id',updateVendorStatus);
router.get('/allcustomers',getAllCustomers);
router.get('/allvendors',getAllVendors);
router.put('/blockuser/:id',blockUser);
router.put('/unblockuser/:id',unblockUser);
export default router;