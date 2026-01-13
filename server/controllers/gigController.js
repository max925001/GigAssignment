import Gig from '../models/Gig.js';

// @desc    Create a new gig
export const createGig = async (req, res) => {
    try {
        const { title, description, budget } = req.body;

        if (!title || !budget) {
            return res.status(400).json({ message: 'Title and budget are required' });
        }

        const gig = await Gig.create({
            title,
            description,
            budget,
            ownerId: req.user._id,
        });

        res.status(201).json(gig);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Server Error during gig creation' });
    }
};

// @desc    Get all gigs
export const getGigs = async (req, res) => {
    try {
        const pageSize = 12;
        const page = Number(req.query.pageNumber) || 1;

        const keyword = req.query.keyword
            ? {
                title: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            }
            : {};

        const count = await Gig.countDocuments({ ...keyword, status: 'open' });
        const gigs = await Gig.find({ ...keyword, status: 'open' })
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ createdAt: -1 });

        res.json({ gigs, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Server Error fetching gigs' });
    }
};

// @desc    Get gigs posted by current user
export const getMyGigs = async (req, res) => {
    try {
        const gigs = await Gig.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
        res.json(gigs);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Server Error fetching your gigs' });
    }
};

// @desc    Get single gig by ID
export const getGigById = async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id).populate('ownerId', 'name email');

        if (gig) {
            res.json(gig);
        } else {
            res.status(404).json({ message: 'Gig not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message || 'Server Error fetching gig details' });
    }
};
