# 🔗 STRIPE PRODUCT & PRICING SETUP GUIDE

## **STEP 1: LOGIN TO STRIPE DASHBOARD**
1. Go to [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Login with your Stripe account
3. Make sure you're in **LIVE MODE** (toggle in top left)

## **STEP 2: CREATE PRODUCTS**

### **Product 1: ApplyAce Starter**
- **Name**: ApplyAce Starter
- **Description**: Perfect for students & early career professionals
- **Statement Descriptor**: APPLYACE STARTER

### **Product 2: ApplyAce Professional** 
- **Name**: ApplyAce Professional
- **Description**: For active job seekers with unlimited analyses
- **Statement Descriptor**: APPLYACE PRO

### **Product 3: ApplyAce Career Pro**
- **Name**: ApplyAce Career Pro  
- **Description**: Premium features with human review
- **Statement Descriptor**: APPLYACE CAREER

### **Product 4: ApplyAce Elite Executive**
- **Name**: ApplyAce Elite Executive
- **Description**: AI-backed 1-on-1 coaching for executives
- **Statement Descriptor**: APPLYACE ELITE

## **STEP 3: CREATE PRICES FOR EACH PRODUCT**

### **Starter Plan Prices:**
1. **Monthly**: £9.99/month (recurring)
2. **6-Month**: £41.96 every 6 months (recurring) 
3. **Annual**: £59.94/year (recurring)

### **Professional Plan Prices:**
1. **Monthly**: £14.99/month (recurring)
2. **6-Month**: £62.96 every 6 months (recurring)
3. **Annual**: £89.94/year (recurring)

### **Career Pro Plan Prices:**
1. **Monthly**: £29.99/month (recurring)
2. **6-Month**: £125.96 every 6 months (recurring)
3. **Annual**: £179.94/year (recurring)

### **Elite Executive Plan Prices:**
1. **Monthly**: £59.99/month (recurring)
2. **6-Month**: £251.96 every 6 months (recurring)
3. **Annual**: £359.94/year (recurring)

## **STEP 4: COPY PRICE IDs**

After creating each price, copy the Price ID (starts with `price_`) and update your `src/lib/stripe.ts` file:

```javascript
export const STRIPE_PRICES = {
  starter: {
    monthly: 'price_XXXXXXXXXX', // Replace with actual ID
    sixMonth: 'price_XXXXXXXXXX', // Replace with actual ID  
    annual: 'price_XXXXXXXXXX', // Replace with actual ID
  },
  professional: {
    monthly: 'price_XXXXXXXXXX', // Replace with actual ID
    sixMonth: 'price_XXXXXXXXXX', // Replace with actual ID
    annual: 'price_XXXXXXXXXX', // Replace with actual ID
  },
  careerPro: {
    monthly: 'price_XXXXXXXXXX', // Replace with actual ID
    sixMonth: 'price_XXXXXXXXXX', // Replace with actual ID
    annual: 'price_XXXXXXXXXX', // Replace with actual ID
  },
  eliteExecutive: {
    monthly: 'price_XXXXXXXXXX', // Replace with actual ID
    sixMonth: 'price_XXXXXXXXXX', // Replace with actual ID
    annual: 'price_XXXXXXXXXX', // Replace with actual ID
  }
};
```

## **STEP 5: SETUP WEBHOOK**

1. Go to **Developers > Webhooks** in Stripe Dashboard
2. Click **Add endpoint**
3. **Endpoint URL**: `https://yourdomain.com/api/stripe/webhook`
4. **Events to send**:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated` 
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Webhook Signing Secret** and add to `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXX
   ```

## **STEP 6: TEST PAYMENTS**

1. Use Stripe test cards for testing:
   - **Success**: `4242 4242 4242 4242`
   - **Declined**: `4000 0000 0000 0002`
2. Test each pricing tier and billing period
3. Verify webhooks are received correctly

## **NEXT STEPS**

Once you have the Price IDs, update your `src/lib/stripe.ts` file and test the payment flow! 