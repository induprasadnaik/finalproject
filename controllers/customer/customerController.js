// import Order  from '../models/customerOrderModel.js'
// import vendorOrder from '../../vendor/models/venderwiseOrder.js'
// import Product from '../../vendor/models/productsModel.js'
import Customer from '../../models/customer/customerModel.js';

export const createOrder = async(res,req)=>{
    try{
    const user_id =req.loggedUser._id; //authmiddleware
    const {customer_id,
          items,  //[{ product_id, quantity }]
          paymentMethod,
          paymentStatus,
          deliveryAddress,
          tax=0,
          discount=0,

    } =req.body;
    if(!customer_id || !items?.length) {
         return res.status(400).json({ message: "customer_id and items required" });

    }
    ////get product details
    const productIDs = items.map((i)=>i.product_id);
    const products = await Product.find({_id:{$in:productIDs}});
    ///price+vendorids
    const  allItems = items.map((i)=>{
        const product = products.find((p)=>p._id.toString()===i.product_id.toString());
    return {
       product_id: product._id,
        vendor_id: product.vendor_id,
        quantity: i.quantity,
        price: product.price,
        total: product.price * i.quantity, 
    };
    });
    //total calculation
const subTotal = allItems.reduce((sum, i)=>sum + i.total,0);
const grandTotal = subTotal+tax-discount;
   //save in orderschema
   const order = await Order.create({
    orderNumber: "ORD-" + Date.now(),
      user_id,
      customer_id,
      totalItems: allItems.reduce((sum, i) => sum + i.quantity, 0),
      subTotal,
      tax,
      discount,
      grandTotal,
      paymentMethod,
      paymentStatus,
      orderStatus: "placed",
      deliveryAddress,
   });
   // Split vendor-wise
   const vendorWise ={};
   allItems.forEach((item)=>{
const vendorId = item.vendor_id.toString();
   if (!vendorWise[vendorId]) vendorWise[vendorId] = [];
vendorWise[vendorId].push({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      });
});
//insert vendor wise order
const vendorOrders = await Promise.all(
    Object.keys(vendorWise).map(async (vendorId)=>{
     const vendorItems = vendorWise[vendorId];
       const vendorSubTotal = vendorItems.reduce((sum, i) => sum + i.total, 0);
        return await VendorOrder.create({
          order_id: order._id,
          vendor_id: vendorId,
          customer_id:customer_id,
          items: vendorItems,
          subTotal: vendorSubTotal,
          vendorEarning: vendorSubTotal * 0.9, // vendor gets 90%
          platformCommisson: vendorSubTotal * 0.1, // platform gets 10%
          vendorPaymentStatus: "pending",
          orderStatus: "pending",
        });
    })
);
  return res.status(201).json({
      message: "Order created successfully",
      order,
      vendorOrders,
    });

}

    catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
//fetch all main orders
export const getallOrders = async(req,res)=>{
    try{
const orders = await Order.find().populate("user_id","username email").populate("customer_id","customerName mobile").sort({createdAt: -1});
res.status(200).json({message:"Orders fetched successfully", orders });
}
    catch(error){
        res.status(500).json({ message: "Server error", error: error.message })
    }
};
//get order with vendor order
export const getOrderbyId = async(req,res)=>{
    try{
        const {id} =req.params;
const order = await Order.findById(id).populate("user_id","username email") .populate("customer_id", "customerName mobile");
 if(!order) {
     return res.status(404).json({ message: "Order not found" });
 }  
 const vendorOrders  = await vendorOrder.find({order_id:id}).populate("vendor_id", "vendorName shopName email").populate("items.product_id", "productName price");
 res.status(200).json({
      message: "Order fetched successfully",
      order,
      vendorOrders,
    });
}
    catch(error){
        res.status(500).json({message:"Server error", error: error.message})
    }
};

///delete orders
export const deleteOrders = async(req,res)=>{
try{
const{id} = req.params;
const order = await Order.findById(id);
if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
//delete main order
await Order.findByIdAndDelete(id);
//vendor order llinked to this order
await vendorOrder.deleteMany({order_id:id});
res.status(200).json({message:"order deleted successfully"});
}
catch(error){
         res.status(500).json({message:"Server error", error: error.message})
   
}
};
//////customer profile update
export const updateCustomerprofile = async (req, res) => {
  try {
    const userId = req.loggedUser._id; // from JWT middleware

    let customer = await Customer.findOne({ user_id: userId });

    if (customer) {
      // UPDATE PROFILE
      customer = await Customer.findOneAndUpdate(
        { user_id: userId },
        { ...req.body },
        { new: true, runValidators: true }
      );

      return res.status(200).json({
        success: true,
        message: "Customer profile updated successfully",
        data: customer
      });
    }

    // CREATE PROFILE
    customer = await Customer.create({
      user_id: userId,
      ...req.body
    });

    return res.status(201).json({
      success: true,
      message: "Customer profile created successfully",
      data: customer
    });
  } catch (error) {
    console.error("Customer profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to save customer profile",
      error: error.message
    });
  }
};
////get customer details by id
export const getCustomerbyId =async(req,res)=>{
    try{
    const userId = req.loggedUser._id;
    const customer = await Customer.findOne({user_id:userId});
    res.status(200).json({ success: true, data: customer });
        }
        catch(error){
            res.status(500).json({message:"Server error", error: error.message});   
    }
}

//get customer address
export const getaddressByCustomerbyId = async(req,res) => {
    try{
        const userId = req.loggedUser._id;
        const customer = await Customer.findOne({user_id:userId});
        res.status(200).json({ success: true, data: customer.address });
    }catch(error){
            res.status(500).json({message:"Server error", error: error.message});   
    }
}

//get customer address
export const getaddressByCustomeraddressbyId = async (req, res) => {
  try {
    const userId = req.loggedUser._id;
    const { addressId } = req.params;
    const customer = await Customer.findOne({
      user_id: userId,
      "address._id": addressId
    },
    {
      "address.$": 1
    });
    if (!customer || !customer.address.length) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json({
      success: true,
      data: customer.address[0]
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching address",
      error: error.message
    });
  }
};

//add new address
export const addCustomerAddress = async (req, res) => {
  try {
    const userId = req.loggedUser._id;
    const newAddress = req.body;

    const customer = await Customer.findOneAndUpdate(
      { user_id: userId },
      { $push: { address: newAddress } },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ message: "Customer profile not found" });
    }

    res.status(200).json({
      success: true,
      message: "Address added successfully",
      data: customer.address
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding address",
      error: error.message
    });
  }
};

//update existing address
export const updateCustomerAddress = async (req, res) => {
  try {
    const userId = req.loggedUser._id;
    const { addressId } = req.params;

    const updatedAddress = req.body;

    const customer = await Customer.findOneAndUpdate(
      {
        user_id: userId,
        "address._id": addressId
      },
      {
        $set: {
          "address.$": updatedAddress
        }
      },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: customer.address
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating address",
      error: error.message
    });
  }
};

