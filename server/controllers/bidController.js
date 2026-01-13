import mongoose from 'mongoose';
import Bid from '../models/Bid.js';
import Gig from '../models/Gig.js';
import Notification from '../models/Notification.js';

// @desc    Submit a bid for a gig
export const createBid = async (req, res) => {
    try {
        const { gigId, message, price } = req.body;

        if (!price || !message) {
            return res.status(400).json({ message: 'Price and message are required' });
        }

        const gig = await Gig.findById(gigId).lean();
        if (!gig) {
            return res.status(404).json({ message: 'Gig not found' });
        }

        if (gig.status !== 'open') {
            return res.status(400).json({ message: 'Gig is no longer open for bidding' });
        }

        if (gig.ownerId.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot bid on your own gig' });
        }

        const existingBid = await Bid.findOne({ gigId, freelancerId: req.user._id }).lean();
        if (existingBid) {
            return res.status(400).json({ message: 'You have already submitted a bid' });
        }

        const bid = await Bid.create({
            gigId,
            freelancerId: req.user._id,
            message,
            price
        });

        res.status(201).json(bid);
    } catch (error) {
        res.status(500).json({ message: 'Server Error during bid submission' });
    }
};

// @desc    Get all bids for a specific gig (Owner only)
export const getBidsByGig = async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.gigId).lean();

        if (!gig) {
            return res.status(404).json({ message: 'Gig not found' });
        }

        const isOwner = gig.ownerId.toString() === req.user._id.toString();

        const query = { gigId: req.params.gigId };
        if (!isOwner) {
            query.freelancerId = req.user._id;
        }

        const bids = await Bid.find(query)
            .populate('freelancerId', 'name email')
            .lean();
        res.json(bids);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching bids' });
    }
};

// @desc    Hire a freelancer (Atomic Logic)
export const hireBid = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const bid = await Bid.findById(req.params.bidId).session(session);
        if (!bid) throw new Error('Bid not found');

        const gig = await Gig.findById(bid.gigId).session(session);
        if (!gig) throw new Error('Gig not found');

        if (gig.ownerId.toString() !== req.user._id.toString()) {
            throw new Error('Not authorized to hire for this gig');
        }

        if (gig.status !== 'open') {
            throw new Error('Gig is already assigned');
        }

        bid.status = 'hired';
        await bid.save({ session });

        gig.status = 'assigned';
        await gig.save({ session });

        await Bid.updateMany(
            { gigId: gig._id, _id: { $ne: bid._id } },
            { status: 'rejected' },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        const notification = await Notification.create({
            recipient: bid.freelancerId,
            sender: req.user._id,
            type: 'HIRED',
            message: `You have been hired for "${gig.title}"!`,
            gigId: gig._id
        });

        const io = req.app.get('io');
        if (io) {
            io.to(bid.freelancerId.toString()).emit('notification', {
                _id: notification._id,
                type: 'HIRED',
                message: notification.message,
                gigId: gig._id,
                isRead: false,
                createdAt: notification.createdAt
            });
        }

        res.json({ message: 'Freelancer hired successfully', bid });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get bids by freelancer (Applications)
export const getMyApplications = async (req, res) => {
    try {
        const bids = await Bid.find({ freelancerId: req.user._id })
            .populate('gigId', 'title budget status description')
            .lean();
        res.json(bids);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching applications' });
    }
};
