import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import morgan from 'morgan';
dotenv.config();

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import gigRoutes from './routes/gigRoutes.js';
import bidRoutes from './routes/bidRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();
app.set('trust proxy', 1); // Trust first proxy (Vercel)
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ["GET", "POST", "PATCH", "DELETE"],
        credentials: true
    }
});

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Socket.io connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their notification room`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Pass io to routes
app.set('io', io);

// Database Connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => {
    res.send('GigFlow API is running...');
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;
