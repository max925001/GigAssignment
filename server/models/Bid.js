import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
    gigId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gig',
        required: true
    },
    freelancerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: [true, 'Please provide a proposal message']
    },
    price: {
        type: Number,
        required: [true, 'Please provide a bid price']
    },
    status: {
        type: String,
        enum: ['pending', 'hired', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

const Bid = mongoose.model('Bid', bidSchema);
export default Bid;
