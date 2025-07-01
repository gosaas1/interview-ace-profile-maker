# 🧪 STRIPE TEST SETUP - STEP BY STEP

## **STEP 1: CREATE .env.local FILE**

Create a file called `.env.local` in your project root with your TEST keys:

```env
# STRIPE TEST KEYS (Safe for testing)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_TEST_PUBLISHABLE_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_TEST_SECRET_KEY_HERE

# Disable mock mode to use real Stripe
VITE_MOCK_PAYMENTS=false

# App configuration
VITE_APP_URL=http://localhost:3000
```

## **STEP 2: UPDATE STRIPE PRICE IDs**

After creating products in Stripe, update `src/lib/stripe.ts` with your real Price IDs:

```javascript
export const STRIPE_PRICES = {
  // Free tier - no Stripe price needed
  free: null,
  
  // Pay-as-you-go - one-time payment (create this as one-time product)
  payAsYouGo: {
    priceId: 'price_YOUR_PAYG_PRICE_ID', // £1.99 one-time
    amount: 199,
    currency: 'gbp',
    type: 'one_time'
  },
  
  // Replace these with your actual Price IDs from Stripe dashboard
  starter: {
    monthly: 'price_YOUR_STARTER_MONTHLY_ID',     // £9.99/month
    sixMonth: 'price_YOUR_STARTER_6MONTH_ID',     // £41.96/6 months
    annual: 'price_YOUR_STARTER_ANNUAL_ID',       // £59.94/year
  },
  
  professional: {
    monthly: 'price_YOUR_PRO_MONTHLY_ID',         // £14.99/month
    sixMonth: 'price_YOUR_PRO_6MONTH_ID',         // £62.96/6 months
    annual: 'price_YOUR_PRO_ANNUAL_ID',           // £89.94/year
  },
  
  careerPro: {
    monthly: 'price_YOUR_CAREER_MONTHLY_ID',      // £29.99/month
    sixMonth: 'price_YOUR_CAREER_6MONTH_ID',      // £125.96/6 months
    annual: 'price_YOUR_CAREER_ANNUAL_ID',        // £179.94/year
  },
  
  eliteExecutive: {
    monthly: 'price_YOUR_ELITE_MONTHLY_ID',       // £59.99/month
    sixMonth: 'price_YOUR_ELITE_6MONTH_ID',       // £251.96/6 months
    annual: 'price_YOUR_ELITE_ANNUAL_ID',         // £359.94/year
  }
};
```

## **STEP 3: CREATE ALL REQUIRED PRICES**

For each product, you need to create multiple prices:

### **Starter Plan Prices:**
1. Monthly: £9.99/month
2. 6-Month: £41.96 every 6 months
3. Annual: £59.94/year

### **Professional Plan Prices:**
1. Monthly: £14.99/month
2. 6-Month: £62.96 every 6 months
3. Annual: £89.94/year

### **Career Pro Plan Prices:**
1. Monthly: £29.99/month
2. 6-Month: £125.96 every 6 months
3. Annual: £179.94/year

### **Elite Executive Plan Prices:**
1. Monthly: £59.99/month
2. 6-Month: £251.96 every 6 months
3. Annual: £359.94/year

### **Pay-as-you-go:**
1. One-time: £1.99 (set as one-time payment, not recurring)

## **STEP 4: TEST CARDS FOR STRIPE**

Use these test cards in Stripe checkout:

### **✅ SUCCESSFUL PAYMENTS:**
- **Card:** `4242 4242 4242 4242`
- **Expiry:** Any future date (e.g., `12/34`)
- **CVC:** Any 3 digits (e.g., `123`)
- **ZIP:** Any 5 digits (e.g., `12345`)

### **❌ DECLINED PAYMENTS:**
- **Generic decline:** `4000 0000 0000 0002`
- **Insufficient funds:** `4000 0000 0000 9995`
- **Lost card:** `4000 0000 0000 9987`

### **🔐 3D SECURE (Authentication):**
- **Requires auth:** `4000 0025 0000 3155`
- **Auth fails:** `4000 0000 0000 3220`

## **STEP 5: TESTING WORKFLOW**

1. **Start your dev server:** `npm run dev`
2. **Visit:** http://localhost:3000
3. **Click any pricing button**
4. **You should be redirected to Stripe Checkout**
5. **Use test card:** `4242 4242 4242 4242`
6. **Complete payment**
7. **You should be redirected to success page**

## **STEP 6: VERIFY IN STRIPE DASHBOARD**

After testing:
1. Go to **Payments** in Stripe dashboard
2. You should see your test payments
3. Go to **Customers** to see created customers
4. Go to **Subscriptions** to see active subscriptions

## **TROUBLESHOOTING**

### **If payments don't work:**
1. Check browser console for errors
2. Verify Price IDs are correct in `stripe.ts`
3. Ensure `.env.local` has correct test keys
4. Make sure `VITE_MOCK_PAYMENTS=false`

### **If Stripe checkout doesn't open:**
1. Check network tab for API errors
2. Verify your backend API routes are working
3. Check that Stripe keys are loaded correctly

## **QUICK START TEMPLATE**

Here's your `.env.local` template:

```env
# Get these from: https://dashboard.stripe.com/test/apikeys
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51R2YxGHO6B9cGpZ7YOUR_TEST_KEY
STRIPE_SECRET_KEY=sk_test_51R2YxGHO6B9cGpZ7YOUR_TEST_SECRET

# Use real Stripe instead of mock
VITE_MOCK_PAYMENTS=false

# Your app URL
VITE_APP_URL=http://localhost:3000
```

## **NEXT STEPS**

1. Create the products in Stripe dashboard
2. Copy all the Price IDs
3. Update `src/lib/stripe.ts` with real Price IDs
4. Create `.env.local` with your test keys
5. Test payments with `4242 4242 4242 4242`
6. Check Stripe dashboard for successful payments

**You're ready to accept real test payments!** 🚀 