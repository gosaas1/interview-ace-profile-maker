const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { priceId, userId, successUrl, cancelUrl } = req.body;

    if (!priceId || !userId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Determine if this is a one-time payment or subscription
    // Pay-as-you-go price ID indicates one-time payment
    const isOneTimePayment = priceId === 'price_1RezXMHO6B9cGpZ7nX82Srib';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: isOneTimePayment ? 'payment' : 'subscription',
      success_url: successUrl || `${req.headers.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.origin}/payment-failed`,
      client_reference_id: userId,
      metadata: {
        userId: userId,
        priceId: priceId,
      },
      // Add customer email if available
      customer_email: req.body.customerEmail || undefined,
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

    res.status(200).json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Stripe checkout session creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error.message 
    });
  }
} 