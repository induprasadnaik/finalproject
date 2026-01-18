import Customer from "../../models/customer/customerModel.js"
import Vendor from "../../models/vendor/vendorModel.js"
import User from "../../models/admin/adminModels.js"

export const getadminDashboardStats =async(req,res)=>{
    try{
       const customerCount  = await Customer.countDocuments({ isActive: true })
       const vendorCount = await Vendor.countDocuments({ status: "approved" })
       const pendingVendors= await Vendor.countDocuments({status:"pending"})
       const activeVendors =await Vendor.find({isActive:true,status:"approved"}).sort({ lastLoginAt: -1 }).limit(5).select("shopName vendorName lastLoginAt")
      res.status(201).json({success:true,data:{customerCount,vendorCount,pendingVendors,activeVendors}})
    
    }
    catch(error){
        res.status(500).json({message:error.message})
    }
}
export const pendingApprovals = async(req,res)=>{
    try{
       const pendings = await Vendor.find({status:"pending"});
       res.status(201).json({success:true,pendings})
    }
    catch(error){
    res.status(500).json({message:error.message})
  
    }
}
export const updateVendorStatus =async(req,res)=>{
    try{
      const {id}  =req.params;
      const{status} = req.body;
      if(!["approved", "rejected"].includes(status)){
       return res.status(400).json({success:true,message:"invalid status"});
      }
    const vendor = await Vendor.findByIdAndUpdate(id,{status,isActive: status === "approved"}, { new: true });
    if(!vendor){
        return res.status(404).json({
        success: true,
        message: "vendor not found",
        });
    }
      return res.status(201).json({
      success: true,
      message: "successdully",
      data:vendor
    });
}
     catch(error){
    res.status(500).json({success: false,message:error.message});
    }
};
////fetch all customers list
export const getAllCustomers =async(req,res)=>{
    try{
  const customers = await Customer.find().populate("user_id","username email role isActive createdAt");
  res.status(200).json({ success: true, data: customers});
}
  catch(error){
    res.status(500).json({success: false,message:error.message});  
    }
};
/////fetch all vendors list
export const getAllVendors= async(req,res)=>{
    try{
        const vendors =await Vendor.find().populate("user_id","username email role isActive createdAt");
        res.status(200).json({ success: true, data: vendors});    
    }catch(error){
    res.status(500).json({success: false,message:error.message});  
    }
};
/////block  vendor/customer
export const blockUser = async(req,res)=>{
    try{
        const {id} = req.params;
const user = await User.findByIdAndUpdate(id,{ isActive: false },
    { new: true });
   await Customer.updateOne({ user_id: id },{$set:{isActive: false}});
   await Vendor.updateOne({ user_id: id },{$set:{isActive: false}});
   res.status(200).json({ success: true, message: "User blocked", data: user });

}
      catch(error){
    res.status(500).json({success: false,message:error.message});  
    }
};
////unblock user
export const unblockUser = async(req,res)=>{
    try{
   const {id} =req.params;
const user = await User.findByIdAndUpdate(id,{ isActive: true },
    { new: true });
       await Customer.updateOne({ user_id: id },{$set:{isActive: true}});
   await Vendor.updateOne({ user_id: id },{$set:{isActive: true}});
   res.status(200).json({ success: true, message: "User unblocked", data: user });
    }
     catch(error){
    res.status(500).json({success: false,message:error.message});  
    }
};


