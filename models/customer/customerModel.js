import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
    {
        user_id: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            required: true 
        },
        customerName: { type: String },
        mobile: { type: String },
        address: [{
            address_type: { 
                type: String, 
                enum: ['Home', 'Work', 'Others'], 
                default: 'Home'
            },
            street: { type: String },
            city: { type: String },
            state: { type: String },
            pincode: { type: String }
        }],

        isActive: { type: Boolean, default: true },
        lastLoginAt: { type: Date }
    },
    { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);