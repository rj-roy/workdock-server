import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { connectDb, disconnectDb } from './config/db.js';
import { Server } from 'node:http';

import workspaceRoutes from './routes/workspace.route.ts'
import bookingRoutes from './routes/booking.route.ts'

dotenv.config();
const app = express();
app.use(express.json());

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

const publicLimiter = rateLimit({
    windowMs: 60_000,
    max: 60
});

const postLimiter = rateLimit({
    windowMs: 60_000,
    max: 3
});

app.use('/api/v1/workspace', publicLimiter, workspaceRoutes);
app.use('/api/v1/booking', postLimiter, bookingRoutes);


const port: number = Number(process.env.PORT) || 5000;
let server: Server;

const startServer = async () => {
    try {
        await connectDb();
        server = app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.log('Failed to start Server', error);
        process.exit(1);
    };
};

const shutdown = async (signal: string) => {
    console.log(`Shutting down because ${signal}`);
    if (server) server.close();
    await disconnectDb();
    process.exit(0);
};

process.on('SIGINT', () => shutdown('CTRL + C'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

startServer();