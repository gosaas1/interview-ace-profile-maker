import { toast } from 'sonner';

// Mock mode flag - set this to true for testing without real Stripe
export const MOCK_MODE = import.meta.env.VITE_MOCK_PAYMENTS === 'true';

// Mock successful payment with delay
export const mockCreateCheckoutSession = async (
  priceId: string,
  userId: string,
  tier: string,
  billingPeriod: string
) => {
  console.log('🧪 MOCK CHECKOUT SESSION:', { 
    priceId, 
    userId, 
    tier, 
    billingPeriod,
    timestamp: new Date().toISOString()
  });
  
  // Show loading toast
  toast.loading('Processing mock payment...', { id: 'mock-payment' });
  
  // Simulate API delay (1-3 seconds)
  const delay = Math.random() * 2000 + 1000;
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // Simulate 90% success rate
  const isSuccess = Math.random() > 0.1;
  
  if (isSuccess) {
    toast.success('Mock payment successful!', { id: 'mock-payment' });
    
    // Simulate successful payment redirect
    setTimeout(() => {
      window.location.href = `/payment/success?session_id=mock_cs_${Date.now()}&payment=subscription&tier=${tier}&billing=${billingPeriod}`;
    }, 500);
  } else {
    toast.error('Mock payment failed - testing error handling', { id: 'mock-payment' });
    throw new Error('Mock payment declined');
  }
};

// Mock one-time payment
export const mockCreateOneTimePayment = async (userId: string) => {
  console.log('🧪 MOCK ONE-TIME PAYMENT:', { 
    userId,
    amount: 199, // £1.99 in pence
    timestamp: new Date().toISOString()
  });
  
  toast.loading('Processing mock one-time payment...', { id: 'mock-payment' });
  
  const delay = Math.random() * 2000 + 1000;
  await new Promise(resolve => setTimeout(resolve, delay));
  
  const isSuccess = Math.random() > 0.1;
  
  if (isSuccess) {
    toast.success('Mock one-time payment successful!', { id: 'mock-payment' });
    
    setTimeout(() => {
      window.location.href = `/payment/success?session_id=mock_pi_${Date.now()}&payment=one_time`;
    }, 500);
  } else {
    toast.error('Mock payment failed - testing error handling', { id: 'mock-payment' });
    throw new Error('Mock payment declined');
  }
};

// Mock subscription data for testing
export const mockSubscriptionData = {
  starter: {
    monthly: { amount: 999, currency: 'gbp', interval: 'month' },
    sixMonth: { amount: 4196, currency: 'gbp', interval: 'month', intervalCount: 6 },
    annual: { amount: 5994, currency: 'gbp', interval: 'year' }
  },
  professional: {
    monthly: { amount: 1499, currency: 'gbp', interval: 'month' },
    sixMonth: { amount: 6296, currency: 'gbp', interval: 'month', intervalCount: 6 },
    annual: { amount: 8994, currency: 'gbp', interval: 'year' }
  },
  careerPro: {
    monthly: { amount: 2999, currency: 'gbp', interval: 'month' },
    sixMonth: { amount: 12596, currency: 'gbp', interval: 'month', intervalCount: 6 },
    annual: { amount: 17994, currency: 'gbp', interval: 'year' }
  },
  eliteExecutive: {
    monthly: { amount: 5999, currency: 'gbp', interval: 'month' },
    sixMonth: { amount: 25196, currency: 'gbp', interval: 'month', intervalCount: 6 },
    annual: { amount: 35994, currency: 'gbp', interval: 'year' }
  }
};

// Test different payment scenarios
export const mockPaymentScenarios = {
  success: () => Math.random() > 0,
  decline: () => Math.random() > 0.7,
  requiresAuth: () => Math.random() > 0.8,
  networkError: () => Math.random() > 0.9
};

// Mock webhook events for testing
export const mockWebhookEvent = (eventType: string, data: any) => {
  console.log('🧪 MOCK WEBHOOK EVENT:', {
    type: eventType,
    data,
    timestamp: new Date().toISOString()
  });
  
  // You can simulate webhook processing here
  switch (eventType) {
    case 'checkout.session.completed':
      console.log('✅ Mock: Checkout completed, activating subscription');
      break;
    case 'customer.subscription.created':
      console.log('✅ Mock: Subscription created');
      break;
    case 'invoice.payment_succeeded':
      console.log('✅ Mock: Payment succeeded, resetting usage');
      break;
    case 'invoice.payment_failed':
      console.log('❌ Mock: Payment failed, handling gracefully');
      break;
  }
}; 