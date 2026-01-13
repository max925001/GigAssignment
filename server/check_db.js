import mongoose from 'mongoose';
import Gig from './models/Gig.js';
import dotenv from 'dotenv';
dotenv.config();

const checkGigs = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');
        const gigs = await Gig.find().sort({ createdAt: -1 }).limit(10);
        console.log('Latest 10 Gigs (with status):');
        gigs.forEach(g => console.log(`ID: ${g._id}, Title: ${g.title}, Status: ${g.status}, CreatedAt: ${g.createdAt}`));
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkGigs();
