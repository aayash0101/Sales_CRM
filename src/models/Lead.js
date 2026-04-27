import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema({
    name: {
        type: String,
        requried: true,
    },
    email: String,
    phone: String,
    company: String,
    status: {
        type: String,
        enum: ['new', 'contacted', 'qualified', 'converted'],
        default: 'new',
    },
    createdAt: {
    type: Date,
    default: Date.now,
  },
})