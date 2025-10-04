//Initialize socket io server

import express from 'express';
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { initializeSocket } from './game/socketManager.js'; 
import * as dotenv from 'dotenv'

dotenv.config()

const CORS_ORIGINS = process.env.SERVER_CORS_ORIGINS;
const CORS_METHODS = process.env.SERVER_CORS_METHODS.split(',');
const TRANSPORTS = process.env.SERVER_TRANSPORTS.split(',');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: CORS_ORIGINS,
        methods: CORS_METHODS
    },
    transports: TRANSPORTS
});

// Initialize the socket manager and pass it the io instance
initializeSocket(io);

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});