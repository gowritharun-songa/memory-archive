import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';

import router from "./routes/memoRoute.js";
import connectDB from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config({
    quiet: true
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT;

const allowedOrigins = [
    'https://memory-archive-two.vercel.app',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
];

// middlewares
app.use(express.json());
app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(rateLimiter);

app.use('/api/memories', router);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server started at http://localhost:${PORT}`);
    })
});