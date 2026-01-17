import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema(
    {
        // 1. Link to the User Login Table
        user_id: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            required: true, 
            unique: true 
        },

        // 2. Business Details
        shopName: { type: String, required: true },
        ownerName: { type: String, required: true },
        mobile: { type: String, required: true },
        email: { type: String }, 
        
        description: { type: String },  
        
        // 3. Legal & Banking Info
        gstin: { type: String }, 
        licenseNumber: { type: String }, 
        bankAccount: {
            accountNumber: String,
            ifscCode: String,
            bankName: String
        },

        // 4. Address (Single Object now, NOT an array)
        address: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            pincode: { type: String, required: true },
            coordinates: { 
                lat: Number,
                lng: Number
            }
        },

        // 5. Status & Admin Control
        isVerified: { type: Boolean, default: false }, 
        status: {
            type: String,
            enum: ['pending', 'active', 'suspended'],
            default: 'pending'
        },

        isActive: { type: Boolean, default: true }, 
        rating: { type: Number, default: 0 },
        totalReviews: { type: Number, default: 0 }
    },
    { timestamps: true }
);

export default mongoose.model("Vendor", vendorSchema);