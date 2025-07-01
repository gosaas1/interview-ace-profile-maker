import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'ApplyAce Backend Server Running',
    stripe_configured: !!process.env.STRIPE_SECRET_KEY
  });
});

// Create checkout session endpoint
app.post('/api/stripe/create-checkout-session', async (req, res) => {
  try {
    const { priceId, userId, successUrl, cancelUrl } = req.body;

    if (!priceId || !userId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Determine if this is a one-time payment or subscription
    const isOneTimePayment = priceId === 'price_1RezXMHO6B9cGpZ7nX82Srib';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: isOneTimePayment ? 'payment' : 'subscription',
      success_url: successUrl || `http://localhost:3000/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `http://localhost:3000/payment-failed`,
      client_reference_id: userId,
      metadata: {
        userId: userId,
        priceId: priceId,
      },
      // Add billing address collection
      billing_address_collection: 'required',
      // Add automatic tax calculation for UK VAT
      automatic_tax: {
        enabled: true,
      },
      // Set allowed countries (UK focus)
      shipping_address_collection: {
        allowed_countries: ['GB', 'US', 'CA', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL'],
      },
    });

    console.log(`✅ Created checkout session: ${session.id} for user: ${userId}`);
    
    res.status(200).json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('❌ Stripe checkout session creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error.message 
    });
  }
});

// Webhook endpoint for Stripe events
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`❌ Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log(`✅ Payment successful for session: ${session.id}`);
      // Here you would update your database with the successful payment
      break;
    case 'invoice.payment_failed':
      const invoice = event.data.object;
      console.log(`❌ Payment failed for invoice: ${invoice.id}`);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ApplyAce Backend Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💳 Stripe configured: ${!!process.env.STRIPE_SECRET_KEY}`);
});

export default app; 