import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import { clerkMiddleware } from '@clerk/express';
import { serve } from "inngest/express";

import { inngest, functions } from "./inngest/index.js";
import showRouter from './routes/showRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import userRouter from './routes/userRoutes.js';

import { stripeWebhooks } from './controllers/stripeWebhooks.js';

const app = express();

// Stripe webhook route must be before express.json()
app.post(
  '/api/stripe',
  express.raw({ type: 'application/json' }),
  stripeWebhooks
);

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5175",
  credentials: true
}));
app.use(clerkMiddleware());


// API Routes
app.get('/', (req, res) => res.send('Server is Live!'));

app.use('/api/inngest', serve({ client: inngest, functions }));
app.use('/api/show', showRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

// Server start
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`MovieMint server is running on port ${PORT}`);
  });
});