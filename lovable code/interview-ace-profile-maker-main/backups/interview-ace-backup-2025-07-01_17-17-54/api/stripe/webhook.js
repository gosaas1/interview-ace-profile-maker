const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
        
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
        
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
        
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
        
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
        
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
        
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
}

async function handleCheckoutCompleted(session) {
  console.log('Checkout completed:', session.id);
  
  const { userId, tier, type } = session.metadata;
  
  if (type === 'pay_as_you_go') {
    // Handle one-time payment - add analysis credits
    await addAnalysisCredits(userId, 1);
  } else if (tier) {
    // Handle subscription start
    await createOrUpdateSubscription(userId, session);
  }
}

async function handleSubscriptionCreated(subscription) {
  console.log('Subscription created:', subscription.id);
  
  const { userId, tier } = subscription.metadata;
  
  if (userId && tier) {
    await createOrUpdateSubscription(userId, null, subscription);
  }
}

async function handleSubscriptionUpdated(subscription) {
  console.log('Subscription updated:', subscription.id);
  
  const { userId } = subscription.metadata;
  
  if (userId) {
    await updateSubscriptionStatus(userId, subscription);
  }
}

async function handleSubscriptionDeleted(subscription) {
  console.log('Subscription deleted:', subscription.id);
  
  const { userId } = subscription.metadata;
  
  if (userId) {
    await cancelUserSubscription(userId, subscription.id);
  }
}

async function handlePaymentSucceeded(invoice) {
  console.log('Payment succeeded:', invoice.id);
  
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
    const { userId } = subscription.metadata;
    
    if (userId) {
      await resetMonthlyUsage(userId);
    }
  }
}

async function handlePaymentFailed(invoice) {
  console.log('Payment failed:', invoice.id);
  
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
    const { userId } = subscription.metadata;
    
    if (userId) {
      await handleFailedPayment(userId, invoice);
    }
  }
}

// Database helper functions (you'll need to implement these based on your database)
async function addAnalysisCredits(userId, credits) {
  // TODO: Implement database logic to add analysis credits
  console.log(`Adding ${credits} analysis credits to user ${userId}`);
}

async function createOrUpdateSubscription(userId, session = null, subscription = null) {
  // TODO: Implement database logic to create/update user subscription
  console.log(`Creating/updating subscription for user ${userId}`);
}

async function updateSubscriptionStatus(userId, subscription) {
  // TODO: Implement database logic to update subscription status
  console.log(`Updating subscription status for user ${userId}`);
}

async function cancelUserSubscription(userId, subscriptionId) {
  // TODO: Implement database logic to cancel user subscription
  console.log(`Canceling subscription ${subscriptionId} for user ${userId}`);
}

async function resetMonthlyUsage(userId) {
  // TODO: Implement database logic to reset monthly usage
  console.log(`Resetting monthly usage for user ${userId}`);
}

async function handleFailedPayment(userId, invoice) {
  // TODO: Implement logic for failed payments (notifications, grace period, etc.)
  console.log(`Handling failed payment for user ${userId}`);
} 