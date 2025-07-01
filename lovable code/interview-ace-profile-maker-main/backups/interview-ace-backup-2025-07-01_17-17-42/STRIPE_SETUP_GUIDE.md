# 🔥 Stripe Account Setup Guide for ApplyAce

## 📋 **STEP 1: CREATE STRIPE ACCOUNT**

### 1.1 Registration
1. **Visit**: [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. **Click**: "Create your Stripe account"

### 1.2 Business Information
```
Business name: ApplyAce Ltd
Business type: Software/SaaS  
Country: United Kingdom
Industry: Software - B2B SaaS
Website: applyace.co.uk (or your domain)
Product description: AI-powered CV analysis and career coaching platform
```

### 1.3 Personal Information
- Your full legal name
- Email address (use your business email)
- Phone number
- Business address

### 1.4 Bank Account (for payouts)
- UK bank account details
- Sort code and account number
- This is where Stripe will send your revenue

## 🔑 **STEP 2: GET API KEYS**

### 2.1 Navigate to API Keys
1. **Dashboard** → **Developers** → **API keys**
2. You'll see **Test keys** and **Live keys**
3. **Start with Test keys** for development

### 2.2 Copy Your Test Keys
```
Publishable key: pk_test_51... (starts with pk_test_)
Secret key: sk_test_51... (starts with sk_test_)
```

## 📁 **STEP 3: ENVIRONMENT CONFIGURATION**

### 3.1 Create .env.local File
In your project root, create `.env.local` with:

```env
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE

# Supabase Configuration (existing)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# AI Configuration (existing)  
VITE_OPENAI_API_KEY=your-openai-key
VITE_GEMINI_API_KEY=your-gemini-key

# App Configuration
VITE_APP_URL=http://localhost:3000
```

### 3.2 Replace Placeholders
- Replace `YOUR_ACTUAL_KEY_HERE` with keys from Stripe Dashboard
- Keep existing Supabase and AI keys as they are

## 💳 **STEP 4: CREATE PRODUCTS & PRICES**

### 4.1 Navigate to Products
1. **Dashboard** → **Products**
2. **Click** "Add product"

### 4.2 Create Each Product

#### **Product 1: Pay-as-you-go Analysis**
```
Name: CV Analysis - Pay as you go
Description: Single detailed CV analysis with AI-powered insights
Price: £1.99
Type: One-time payment
Currency: GBP
```

#### **Product 2: Starter Plan**
```
Name: Starter Plan
Description: Perfect for students and early career professionals
Prices to create:
- Monthly: £9.99/month
- 6-month: £41.96 every 6 months (30% off)
- Annual: £59.94/year (50% off)
Currency: GBP
Type: Recurring subscription
```

#### **Product 3: Professional Plan**
```
Name: Professional Plan  
Description: For active job seekers with unlimited AI analysis
Prices to create:
- Monthly: £14.99/month
- 6-month: £62.96 every 6 months (30% off)
- Annual: £89.94/year (50% off)
Currency: GBP
Type: Recurring subscription
```

#### **Product 4: Career Pro Plan**
```
Name: Career Pro Plan
Description: Premium features with human review and advanced AI
Prices to create:
- Monthly: £29.99/month
- 6-month: £125.96 every 6 months (30% off)
- Annual: £179.94/year (50% off)
Currency: GBP
Type: Recurring subscription
```

#### **Product 5: Elite Executive Plan**
```
Name: Elite Executive Plan
Description: AI-backed 1-on-1 coaching for high-level professionals
Prices to create:
- Monthly: £59.99/month
- 6-month: £251.96 every 6 months (30% off)
- Annual: £359.94/year (50% off)
Currency: GBP
Type: Recurring subscription
```

### 4.3 Copy Price IDs
After creating each price, copy the Price ID (starts with `price_1...`)

## 🔧 **STEP 5: UPDATE PRICE IDS IN CODE**

### 5.1 Open src/lib/stripe.ts
### 5.2 Replace Placeholder Price IDs

```typescript
export const STRIPE_PRICES = {
  // Pay-as-you-go - one-time payment
  payAsYouGo: {
    priceId: 'price_1ABC123...', // Replace with actual Price ID
    amount: 199, // £1.99 in pence
    currency: 'gbp',
    type: 'one_time'
  },
  
  // Monthly subscriptions
  starter: {
    monthly: 'price_1DEF456...', // Replace with actual Price ID
    sixMonth: 'price_1GHI789...', // Replace with actual Price ID  
    annual: 'price_1JKL012...', // Replace with actual Price ID
  },
  
  professional: {
    monthly: 'price_1MNO345...',
    sixMonth: 'price_1PQR678...',
    annual: 'price_1STU901...',
  },
  
  careerPro: {
    monthly: 'price_1VWX234...',
    sixMonth: 'price_1YZA567...',
    annual: 'price_1BCD890...',
  },
  
  eliteExecutive: {
    monthly: 'price_1EFG123...',
    sixMonth: 'price_1HIJ456...',
    annual: 'price_1KLM789...',
  }
};
```

## 🔔 **STEP 6: WEBHOOKS SETUP**

### 6.1 Create Webhook Endpoint
1. **Dashboard** → **Developers** → **Webhooks**
2. **Click** "Add endpoint"
3. **Endpoint URL**: `https://yourdomain.com/api/stripe/webhook`
4. **Events to send**: 
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

### 6.2 Get Webhook Secret
- After creating webhook, copy the **Signing secret**
- Add to `.env.local` as `STRIPE_WEBHOOK_SECRET`

## 🧪 **STEP 7: TEST MODE VERIFICATION**

### 7.1 Test Card Numbers
Use these test cards in Stripe test mode:
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155
```

### 7.2 Test Payment Flow
1. Start your development server
2. Go to pricing page
3. Click any payment button
4. Use test card to complete payment
5. Verify success in Stripe Dashboard

## ✅ **STEP 8: VERIFICATION CHECKLIST**

### Account Setup:
- [ ] Stripe account created and verified
- [ ] Business information completed
- [ ] Bank account added for payouts
- [ ] Test API keys copied

### Products Created:
- [ ] Pay-as-you-go (£1.99 one-time)
- [ ] Starter Plan (3 prices: monthly, 6-month, annual)
- [ ] Professional Plan (3 prices)
- [ ] Career Pro Plan (3 prices)
- [ ] Elite Executive Plan (3 prices)
- [ ] **Total: 13 prices created**

### Integration:
- [ ] .env.local file created with API keys
- [ ] Price IDs updated in src/lib/stripe.ts
- [ ] Webhook endpoint created
- [ ] Test payment completed successfully

## 🚀 **NEXT STEPS AFTER SETUP**

1. **Test All Payment Flows** - Verify each pricing tier works
2. **Implement Backend API** - Create webhook handlers
3. **Add Subscription Management** - User dashboard integration
4. **Go Live** - Switch to live keys when ready

## 💡 **PRO TIPS**

### Security:
- Never commit API keys to git
- Use test mode for all development
- Only switch to live mode after thorough testing

### Optimization:
- Monitor failed payments in Dashboard
- Set up email receipts for customers
- Use Stripe's billing portal for self-service

### Support:
- Stripe docs: https://stripe.com/docs
- Test your integration thoroughly
- Use Stripe's test webhooks for development

---

## 🎯 **IMMEDIATE ACTION ITEMS**

1. **RIGHT NOW**: Create Stripe account (15 minutes)
2. **TODAY**: Set up all 5 products with pricing (30 minutes)
3. **THIS WEEK**: Test payment integration (2 hours)

**Once complete, your payment system will be ready for integration!** 🚀

---

**Questions?** Check Stripe's excellent documentation or test everything in their Dashboard first. 