const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { amount, currency, userId, successUrl, cancelUrl } = req.body;

    if (!amount || !currency || !userId) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    // Create or retrieve customer
    let customer;
    try {
      const customers = await stripe.customers.list({
        metadata: { userId },
        limit: 1
      });
      
      if (customers.data.length > 0) {
        customer = customers.data[0];
      } else {
        customer = await stripe.customers.create({
          metadata: { userId }
        });
      }
    } catch (error) {
      console.error('Customer creation error:', error);
      return res.status(500).json({ message: 'Failed to create customer' });
    }

    // Create checkout session for one-time payment
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: 'CV Analysis - Pay as you go',
              description: 'Single detailed CV analysis with AI-powered insights'
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        type: 'pay_as_you_go',
        analysisCredits: '1'
      }
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe payment session error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
} 