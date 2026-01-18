// import Product from '../models/productsModel.js'
import Vendor from '../../models/vendor/vendorModel.js'
import User from '../../models/admin/adminModels.js'
// import VendorOrder from '../models/venderwiseOrder.js'


//get all products
export const getAllproducts = async(req,res)=>{
    try{
   const products = await Product.find().populate("vendor_id","shopName email mobile").sort({ createdAt: -1});
   res.status("200").json({success:true,count:products.length,products})
    }
        catch(error){
        res.status(500).json({success:false,message:"server error",error:error.message})
    }

};
//get product by id
export const  getproductById = async(req,res)=>{
    try{
const {id} = req.params;
const products = await Product.findById(id).populate("vendor_id","shopName email mobile")
 if(!products){
  res.status(404).json({ success: false,message: "Product not found",})
  
 }

res.status(200).json({success:true,products})
}
    catch(error){
   res.status(500).json({success:false,message:"server error",error:error.message})
   
    }
};

///delete product

export const deleteProduct = async(req,res)=>{
    try{
  const {id} = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
  res.status(200).json({
    success: true,
      message: "Product deleted successfully",
  })
}
    catch(error){
        res.status(500).json({
            success:false,
            message:"sever error",
            error:error.message
        })
    }
};
/////get products endorwise
export const getvendorwiseProduct = async(req,res)=>{
    try{
     const {vendorId} =req.params;
     const products = await Product.find({vendor_id:vendorId}).sort({createdAt: -1,});
res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
    }
        catch(error){
        res.status(500).json({
            success:false,
            message:"sever error",
            error:error.message
        })
    }

};

//////update product

export const updateProduct = async(req,res)=>{
    try{
      const{id} = req.params;
      const product = await Product.findById(id);
      if(!product){
        res.status(404).json({success:false,message:"product not found"});
      }
          // Update fields
    product.vendor_id = req.body.vendor_id || product.vendor_id;
    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.category = req.body.category || product.category;
    product.brand = req.body.brand || product.brand;
    product.images = req.body.images || product.images;
    product.price = req.body.price ?? product.price;
    product.discountPercent = req.body.discountPercent ?? product.discountPercent;
    product.stock = req.body.stock ?? product.stock;
    product.sku = req.body.sku || product.sku;
    product.isActive = req.body.isActive ?? product.isActive;
    
/////calculate discounted price
    let discountedPrice = product.price;
    if (product.discountPercent > 0) {
      discountedPrice =
        product.price - (product.price * product.discountPercent) / 100;
    }
    product.discountedPrice = discountedPrice;

  await product.save();
  
 res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });

}
       catch(error){
        res.status(500).json({
            success:false,
            message:"sever error",
            error:error.message
        })
    }

};

//////Get vendorwise customers orders list
export const getVendorwiseCustomerorder = async(req,res)=>{
try{
const userId = req.loggedUser._id;
const vendor = await Vendor.findOne({user_id:userId})
const orders = await VendorOrder.find({vendor_id:vendor._id}).populate("customer_id", "customerName mobile address")
.populate("items.product_id", "name price")
      .populate("order_id", "orderNumber paymentStatus status createdAt");

res.status(200).json({ success: true, data: orders });
}
  catch(error){
   res.status(500).json({message:"Server error", error: error.message});   
}
};
//////get vendor by id
export const getVendorbyId =async(req,res)=>{
    try{
      const userId = req.loggedUser._id;
      const vendor = await User.findOne({_id:userId});
      res.status(200).json({ success: true, data: vendor });
    }
    catch(error){
         res.status(500).json({message:"Server error", error: error.message});   
  }
}

/**
 * @desc    Create or update vendor profile
 * @route   POST /api/vendor/profile
 * @access  Private (Vendor)
 */
export const updateVendorprofile = async (req, res) => {
  try {
    const userId = req.loggedUser._id; // from JWT middleware

    // Check if vendor profile already exists
    let vendor = await Vendor.findOne({ user_id: userId });
   
    if (vendor) {
      // UPDATE EXISTING PROFILE
      vendor = await Vendor.findOneAndUpdate(
        { user_id: userId },
        { ...req.body },
        { new: true, runValidators: true }
      );

      return res.status(200).json({
        success: true,
        message: "Vendor profile updated successfully",
        data: vendor,
      });
    }

    // CREATE NEW PROFILE
    vendor = await Vendor.create({
      user_id: userId,
      ...req.body,
    });

    return res.status(201).json({
      success: true,
      message: "Vendor profile created successfully",
      data: vendor,
    });
  } catch (error) {
    console.error("Vendor profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to save vendor profile",
    });
  }
};

