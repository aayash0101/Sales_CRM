import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        trim: true
    },
    company: {
        type: String,
        trim: true
    },
    lead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lead"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    value: {
        type: Number,
        default: 0
    },
    notes: {
        type: String,
        trim: true
    },
},
    { timestamps: true }
)

export default mongoose.model("Customer", customerSchema);