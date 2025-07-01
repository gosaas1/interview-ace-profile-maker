// Stripe Auto-Setup Script
// Run with: node stripe-auto-setup.js

import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe('sk_test_51R2YxGHO6B9cGpZ7JepdIHFn77OBENczJBKfYghC7WBzcFTeGfHGkRyr9VtGPmOHTBlcPOXDBtnPOIoBGU8vcHOw00FFlpMAar');

// Product configuration with all pricing tiers
const products = [
  {
    name: 'ApplyAce Pay-as-you-go',
    description: 'Single CV analysis with basic feedback',
    prices: [
      { amount: 249, currency: 'gbp', type: 'one_time' }
    ]
  },
  {
    name: 'ApplyAce Starter',
    description: 'Perfect for students & early career professionals',
    prices: [
      { amount: 1199, currency: 'gbp', type: 'recurring', interval: 'month', label: 'Monthly' },
      { amount: 4196, currency: 'gbp', type: 'recurring', interval: 'month', interval_count: 6, label: '6-Month (30% off)' },
      { amount: 5994, currency: 'gbp', type: 'recurring', interval: 'year', label: 'Annual (50% off)' }
    ]
  },
  {
    name: 'ApplyAce Professional', 
    description: 'For active job seekers with unlimited analyses',
    prices: [
      { amount: 1799, currency: 'gbp', type: 'recurring', interval: 'month', label: 'Monthly' },
      { amount: 6296, currency: 'gbp', type: 'recurring', interval: 'month', interval_count: 6, label: '6-Month (30% off)' },
      { amount: 8994, currency: 'gbp', type: 'recurring', interval: 'year', label: 'Annual (50% off)' }
    ]
  },
  {
    name: 'ApplyAce Career Pro',
    description: 'Premium features with human review and coaching',
    prices: [
      { amount: 3599, currency: 'gbp', type: 'recurring', interval: 'month', label: 'Monthly' },
      { amount: 12596, currency: 'gbp', type: 'recurring', interval: 'month', interval_count: 6, label: '6-Month (30% off)' },
      { amount: 17994, currency: 'gbp', type: 'recurring', interval: 'year', label: 'Annual (50% off)' }
    ]
  },
  {
    name: 'ApplyAce Elite Executive',
    description: 'Everything plus AI-backed 1-on-1 coaching sessions',
    prices: [
      { amount: 6999, currency: 'gbp', type: 'recurring', interval: 'month', label: 'Monthly' },
      { amount: 24496, currency: 'gbp', type: 'recurring', interval: 'month', interval_count: 6, label: '6-Month (30% off)' },
      { amount: 34994, currency: 'gbp', type: 'recurring', interval: 'year', label: 'Annual (50% off)' }
    ]
  }
];

async function createStripeProducts() {
  console.log('🚀 Starting Stripe product creation...\n');
  
  const results = {};
  
  for (const productData of products) {
    try {
      console.log(`📦 Creating product: ${productData.name}`);
      
      // Create product
      const product = await stripe.products.create({
        name: productData.name,
        description: productData.description,
        type: 'service'
      });
      
      console.log(`   ✅ Product created: ${product.id}`);
      
      // Create prices for this product
      const priceIds = [];
      for (const priceData of productData.prices) {
        const priceConfig = {
          product: product.id,
          unit_amount: priceData.amount,
          currency: priceData.currency
        };
        
        if (priceData.type === 'recurring') {
          priceConfig.recurring = { interval: priceData.interval };
          if (priceData.interval_count) {
            priceConfig.recurring.interval_count = priceData.interval_count;
          }
        }
        
        const price = await stripe.prices.create(priceConfig);
        priceIds.push({
          id: price.id,
          label: priceData.label || `£${priceData.amount/100}`,
          amount: priceData.amount
        });
        
        console.log(`   💰 ${priceData.label || 'Price'}: ${price.id} (£${priceData.amount/100})`);
      }
      
      results[productData.name] = {
        productId: product.id,
        prices: priceIds
      };
      
    } catch (error) {
      console.error(`❌ Error creating ${productData.name}:`, error.message);
    }
    
    console.log(''); // Empty line for readability
  }
  
  // Output results in a format ready for stripe.ts
  console.log('\n🎉 STRIPE SETUP COMPLETE! Here are your Price IDs:\n');
  console.log('='.repeat(60));
  
  Object.entries(results).forEach(([productName, data]) => {
    console.log(`\n${productName}:`);
    data.prices.forEach(price => {
      console.log(`  ${price.label}: ${price.id}`);
    });
  });
  
  console.log('\n' + '='.repeat(60));
  console.log('📋 Copy these Price IDs to your stripe.ts file!');
}

// Run the script
createStripeProducts().catch(console.error); 