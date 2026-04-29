import mongoose from 'mongoose';

const dealSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    value: {
        type: Number,
        default: 0,
    },
    stage: {
        type: String,
        enum: ['proposal', 'negotiation' , 'won', 'lost'],
        default: 'proposal',
    },
    expectedCloseDate: {
        type: Date,
    },
    notes: {
        type: String,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });

export default mongoose.model('Deal', dealSchema);