# 🧪 STRIPE PAYMENT TESTING GUIDE

## **METHOD 1: TEST MODE (SAFEST)**

### **Step 1: Get Test API Keys**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Toggle to **TEST MODE** (top left corner)
3. Go to **Developers > API Keys**
4. Copy your **Test Keys**:
   - **Publishable Key**: `pk_test_...`
   - **Secret Key**: `sk_test_...`

### **Step 2: Update Environment for Testing**
Create `.env.test` file:
```env
# TEST MODE STRIPE KEYS (Safe for testing)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51R2YxGHO6B9cGpZ7YOUR_TEST_KEY_HERE
STRIPE_SECRET_KEY=sk_test_51R2YxGHO6B9cGpZ7YOUR_TEST_SECRET_HERE
VITE_APP_URL=http://localhost:3000
```

## **STRIPE TEST CARDS** 💳

### **✅ SUCCESSFUL PAYMENTS**
```
Card Number: 4242 4242 4242 4242
Expiry: Any future date (e.g., 12/34)
CVC: Any 3 digits (e.g., 123)
ZIP: Any 5 digits (e.g., 12345)
```

### **❌ DECLINED PAYMENTS**
```
Generic Decline: 4000 0000 0000 0002
Insufficient Funds: 4000 0000 0000 9995
Lost Card: 4000 0000 0000 9987
Stolen Card: 4000 0000 0000 9979
Expired Card: 4000 0000 0000 0069
Processing Error: 4000 0000 0000 0119
```

### **🔐 3D SECURE AUTHENTICATION**
```
Authentication Required: 4000 0025 0000 3155
Authentication Fails: 4000 0000 0000 3220
```

### **🌍 INTERNATIONAL CARDS**
```
UK (Visa): 4000 0082 6000 0000
Canada (Visa): 4000 0012 4000 0000
Australia (Visa): 4000 0003 6000 0000
```

## **METHOD 2: LOCAL MOCK TESTING**

### **Step 1: Create Mock Stripe Functions**
Let me create a mock version for local testing:

```typescript
// src/lib/mockStripe.ts
export const MOCK_MODE = import.meta.env.VITE_MOCK_PAYMENTS === 'true';

export const mockCreateCheckoutSession = async (
  priceId: string,
  userId: string,
  tier: string,
  billingPeriod: string
) => {
  console.log('🧪 MOCK PAYMENT:', { priceId, userId, tier, billingPeriod });
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock successful payment - redirect to success page
  window.location.href = `/payment/success?session_id=mock_session_${Date.now()}&payment=subscription`;
};

export const mockCreateOneTimePayment = async (userId: string) => {
  console.log('🧪 MOCK ONE-TIME PAYMENT:', { userId });
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  window.location.href = `/payment/success?session_id=mock_session_${Date.now()}&payment=one_time`;
};
```

### **Step 2: Update Pricing Component for Mock Mode**

## **METHOD 3: STRIPE CHECKOUT TEST MODE**

### **Test Scenarios to Cover:**

1. **✅ Successful Subscription Purchase**
   - Use: `4242 4242 4242 4242`
   - Test all tiers: Starter, Professional, Career Pro, Elite
   - Test all billing periods: Monthly, 6-month, Annual

2. **✅ Successful One-Time Payment**
   - Use: `4242 4242 4242 4242`
   - Test Pay-as-you-go option

3. **❌ Failed Payment Scenarios**
   - Use decline cards to test error handling
   - Verify user gets appropriate error messages

4. **🔐 Authentication Required**
   - Use 3D Secure cards to test authentication flow

5. **🔄 Webhook Testing**
   - Use Stripe CLI to forward webhooks to localhost
   - Test subscription lifecycle events

## **METHOD 4: STRIPE CLI TESTING**

### **Install Stripe CLI**
```bash
# Windows (using Chocolatey)
choco install stripe-cli

# Or download from: https://github.com/stripe/stripe-cli/releases
```

### **Forward Webhooks to Local**
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### **Trigger Test Events**
```bash
# Test successful payment
stripe trigger checkout.session.completed

# Test subscription created
stripe trigger customer.subscription.created

# Test failed payment
stripe trigger invoice.payment_failed
```

## **TESTING CHECKLIST** ✅

### **Frontend Testing:**
- [ ] All pricing buttons work
- [ ] Loading states show correctly
- [ ] Authentication required for payments
- [ ] Error messages display properly
- [ ] Success page loads after payment

### **Payment Flow Testing:**
- [ ] Stripe checkout opens correctly
- [ ] Test cards process successfully
- [ ] Decline cards show errors
- [ ] Success redirects work
- [ ] User sees correct subscription status

### **Backend Testing:**
- [ ] Webhooks receive events
- [ ] User subscriptions are created
- [ ] Usage limits are enforced
- [ ] Database updates correctly

## **QUICK TEST SETUP**

1. **Switch to Test Mode**: Use test keys in `.env.local`
2. **Test a Payment**: Click any pricing button
3. **Use Test Card**: `4242 4242 4242 4242`
4. **Check Success**: Should redirect to success page
5. **Verify Data**: Check if user subscription was created

## **DEBUGGING TIPS**

1. **Check Browser Console**: Look for Stripe errors
2. **Check Network Tab**: Verify API calls are made
3. **Check Stripe Dashboard**: See test payments in dashboard
4. **Use Stripe Logs**: View detailed event logs
5. **Test Error Cases**: Always test failure scenarios

## **GOING LIVE CHECKLIST**

- [ ] Test mode works perfectly
- [ ] All test scenarios pass
- [ ] Webhooks are properly configured
- [ ] Error handling is robust
- [ ] Success flows are smooth
- [ ] Switch to live keys
- [ ] Test with small real payment
- [ ] Monitor for issues 