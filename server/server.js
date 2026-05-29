import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Stripe (checks if key is configured, fallback to dummy check in route)
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Allow requests from Vite frontend
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', stripeConfigured: !!stripe });
});

// Endpoint to create Stripe Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { movieTitle, selectedSeats, showPrice, totalAmount, date, time, movieId } = req.body;

    // Validate inputs
    if (!movieTitle || !selectedSeats || !selectedSeats.length || !showPrice || !totalAmount || !date || !time || !movieId) {
      return res.status(400).json({ error: 'Missing required booking details.' });
    }

    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('sk_test_51Pt00000000')) {
      return res.status(400).json({
        error: 'Stripe Secret Key is not configured. Please open server/.env and replace STRIPE_SECRET_KEY with your actual Stripe API secret key.'
      });
    }

    if (!stripe) {
      return res.status(500).json({ error: 'Stripe client is not initialized.' });
    }

    const formattedTime = new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Create the session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd', // Default to USD for the ticket
            product_data: {
              name: `Movie Ticket: ${movieTitle}`,
              description: `Seats: ${selectedSeats.join(', ')} | Date: ${date} | Time: ${formattedTime}`,
            },
            unit_amount: Math.round(showPrice * 100), // in cents
          },
          quantity: selectedSeats.length,
        },
      ],
      mode: 'payment',
      // Dynamic Success URL redirects user to frontend success page with booking details embedded
      success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}&movie=${encodeURIComponent(movieTitle)}&seats=${selectedSeats.join(',')}&amount=${totalAmount}&price=${showPrice}&date=${date}&time=${encodeURIComponent(time)}`,
      // Redirect back to seat layout page on cancel
      cancel_url: `http://localhost:5173/movies/${movieId}/${date}`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating Stripe Checkout Session:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
