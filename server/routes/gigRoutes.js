import express from 'express';
const router = express.Router();
import { createGig, getGigs, getMyGigs, getGigById } from '../controllers/gigController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/')
    .get(getGigs)
    .post(protect, createGig);

router.get('/my', protect, getMyGigs);
router.get('/:id', getGigById);

export default router;
