#!/usr/bin/env node

/**
 * ApplyAce Payment System Test Suite
 * Automated testing for Stripe payment integration
 */

import fetch from 'node-fetch';
import chalk from 'chalk';

const BACKEND_URL = 'http://localhost:8080';
const FRONTEND_URL = 'http://localhost:3000';

// Test user ID (same as your current logged-in user)
const TEST_USER_ID = '83e69d6d-c025-49c8-9dfc-82225fced8aa';

// Stripe test price IDs from your configuration
const PRICE_IDS = {
  payAsYouGo: 'price_1RezXMHO6B9cGpZ7nX82Srib',
  starterMonthly: 'price_1RezXMHO6B9cGpZ7TpRdpKJJ',
  professionalMonthly: 'price_1RezXNHO6B9cGpZ7vtNCzvEZ',
  careerProMonthly: 'price_1RezXOHO6B9cGpZ7YBnDIXRe',
  eliteExecutiveMonthly: 'price_1RezXPHO6B9cGpZ7dDuglg9b'
};

// Test scenarios
const TEST_SCENARIOS = [
  {
    name: 'Pay-as-you-go Success',
    priceId: PRICE_IDS.payAsYouGo,
    expectedSuccess: true,
    description: 'Test one-time payment for CV analysis'
  },
  {
    name: 'Starter Monthly Success',
    priceId: PRICE_IDS.starterMonthly,
    expectedSuccess: true,
    description: 'Test monthly subscription for Starter plan'
  },
  {
    name: 'Professional Monthly Success',
    priceId: PRICE_IDS.professionalMonthly,
    expectedSuccess: true,
    description: 'Test monthly subscription for Professional plan'
  },
  {
    name: 'Career Pro Monthly Success',
    priceId: PRICE_IDS.careerProMonthly,
    expectedSuccess: true,
    description: 'Test monthly subscription for Career Pro plan'
  },
  {
    name: 'Elite Executive Monthly Success',
    priceId: PRICE_IDS.eliteExecutiveMonthly,
    expectedSuccess: true,
    description: 'Test monthly subscription for Elite Executive plan'
  }
];

class PaymentTester {
  constructor() {
    this.results = [];
    this.startTime = Date.now();
  }

  async log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const colors = {
      info: chalk.blue,
      success: chalk.green,
      error: chalk.red,
      warning: chalk.yellow
    };
    
    console.log(`[${timestamp}] ${colors[type](message)}`);
  }

  async checkServerHealth() {
    try {
      await this.log('🔍 Checking backend server health...', 'info');
      const response = await fetch(`${BACKEND_URL}/api/health`);
      
      if (!response.ok) {
        throw new Error(`Backend server returned ${response.status}`);
      }
      
      const data = await response.json();
      await this.log(`✅ Backend server is healthy: ${data.message}`, 'success');
      await this.log(`💳 Stripe configured: ${data.stripe_configured}`, 'info');
      
      return true;
    } catch (error) {
      await this.log(`❌ Backend server health check failed: ${error.message}`, 'error');
      return false;
    }
  }

  async checkFrontendHealth() {
    try {
      await this.log('🔍 Checking frontend server health...', 'info');
      const response = await fetch(FRONTEND_URL);
      
      if (!response.ok) {
        throw new Error(`Frontend server returned ${response.status}`);
      }
      
      await this.log('✅ Frontend server is accessible', 'success');
      return true;
    } catch (error) {
      await this.log(`❌ Frontend server health check failed: ${error.message}`, 'error');
      return false;
    }
  }

  async testPaymentSession(scenario) {
    try {
      await this.log(`🧪 Testing: ${scenario.name}`, 'info');
      await this.log(`📝 ${scenario.description}`, 'info');
      
      const response = await fetch(`${BACKEND_URL}/api/stripe/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: scenario.priceId,
          userId: TEST_USER_ID,
          successUrl: `${FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${FRONTEND_URL}/payment-failed`,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.sessionId || !data.url) {
        throw new Error('Invalid response: missing sessionId or url');
      }

      await this.log(`✅ Session created: ${data.sessionId}`, 'success');
      await this.log(`🔗 Checkout URL: ${data.url}`, 'info');
      
      return {
        scenario: scenario.name,
        success: true,
        sessionId: data.sessionId,
        url: data.url,
        error: null
      };
      
    } catch (error) {
      await this.log(`❌ Failed: ${error.message}`, 'error');
      
      return {
        scenario: scenario.name,
        success: false,
        sessionId: null,
        url: null,
        error: error.message
      };
    }
  }

  async runAllTests() {
    await this.log('🚀 Starting ApplyAce Payment System Test Suite', 'info');
    await this.log('=' .repeat(60), 'info');
    
    // Health checks
    const backendHealthy = await this.checkServerHealth();
    const frontendHealthy = await this.checkFrontendHealth();
    
    if (!backendHealthy || !frontendHealthy) {
      await this.log('❌ Server health checks failed. Aborting tests.', 'error');
      return;
    }
    
    await this.log('=' .repeat(60), 'info');
    await this.log('🧪 Running payment session creation tests...', 'info');
    
    // Run payment tests
    for (const scenario of TEST_SCENARIOS) {
      const result = await this.testPaymentSession(scenario);
      this.results.push(result);
      await this.log(''); // Empty line for readability
    }
    
    // Generate report
    await this.generateReport();
  }

  async generateReport() {
    const endTime = Date.now();
    const duration = ((endTime - this.startTime) / 1000).toFixed(2);
    
    await this.log('=' .repeat(60), 'info');
    await this.log('📊 TEST RESULTS SUMMARY', 'info');
    await this.log('=' .repeat(60), 'info');
    
    const successful = this.results.filter(r => r.success).length;
    const failed = this.results.filter(r => !r.success).length;
    
    await this.log(`Total Tests: ${this.results.length}`, 'info');
    await this.log(`Successful: ${successful}`, 'success');
    await this.log(`Failed: ${failed}`, failed > 0 ? 'error' : 'info');
    await this.log(`Duration: ${duration}s`, 'info');
    
    if (failed > 0) {
      await this.log('', 'info');
      await this.log('❌ FAILED TESTS:', 'error');
      this.results.filter(r => !r.success).forEach(async (result) => {
        await this.log(`  • ${result.scenario}: ${result.error}`, 'error');
      });
    }
    
    if (successful > 0) {
      await this.log('', 'info');
      await this.log('✅ SUCCESSFUL TESTS:', 'success');
      this.results.filter(r => r.success).forEach(async (result) => {
        await this.log(`  • ${result.scenario}: Session ${result.sessionId}`, 'success');
      });
    }
    
    await this.log('', 'info');
    await this.log('💡 NEXT STEPS:', 'info');
    await this.log('  1. Test actual payments using Stripe test cards:', 'info');
    await this.log('     - Success: 4242 4242 4242 4242', 'info');
    await this.log('     - Declined: 4000 0000 0000 0002', 'info');
    await this.log('     - Insufficient funds: 4000 0000 0000 9995', 'info');
    await this.log('  2. Visit the debug page: http://localhost:3000/debug/payment-debug', 'info');
    await this.log('  3. Test the main pricing page: http://localhost:3000', 'info');
    
    await this.log('=' .repeat(60), 'info');
  }
}

// Run tests if this script is executed directly
const tester = new PaymentTester();
tester.runAllTests().catch(console.error);

export default PaymentTester; 