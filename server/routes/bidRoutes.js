import express from 'express';
const router = express.Router();
import { createBid, getBidsByGig, hireBid, getMyApplications } from '../controllers/bidController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/')
    .post(protect, createBid);

router.get('/my', protect, getMyApplications);
router.get('/:gigId', protect, getBidsByGig);
router.patch('/:bidId/hire', protect, hireBid);

export default router;
