import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        image:{type: String, required: false},
        verifyCode: { type: String, required: false },
        verifyCodeExpiry: { type: String, required: false },
        isVerified: { type: Boolean, default: false },
        
    },
    {
        timestamps: true
    }
)

const User = mongoose.models?.User || mongoose.model("User",userSchema)

export default User