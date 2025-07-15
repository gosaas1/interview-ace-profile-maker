const puppeteer = require('puppeteer');

async function testWithAuth() {
  console.log('🔐 Testing with authentication...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1200, height: 800 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    console.log('🌐 Navigating to homepage...');
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check if we're on the homepage and need to log in
    const currentUrl = page.url();
    console.log('📍 Current URL:', currentUrl);
    
    // Look for login button
    const loginButton = await page.$('button:has-text("Login")');
    if (loginButton) {
      console.log('🔑 Found login button, clicking...');
      await loginButton.click();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if we need to fill in login form
      const emailInput = await page.$('input[type="email"]');
      if (emailInput) {
        console.log('📧 Found email input, filling test credentials...');
        await emailInput.type('test@example.com');
        
        const passwordInput = await page.$('input[type="password"]');
        if (passwordInput) {
          await passwordInput.type('testpassword123');
          
          const submitButton = await page.$('button[type="submit"]');
          if (submitButton) {
            console.log('🚀 Submitting login form...');
            await submitButton.click();
            await new Promise(resolve => setTimeout(resolve, 3000));
          }
        }
      }
    }
    
    // Now try to navigate to CV Builder
    console.log('🎨 Navigating to CV Builder...');
    await page.goto('http://localhost:3000/cv-builder', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Take a screenshot
    await page.screenshot({ path: 'auth-test.png', fullPage: true });
    console.log('📸 Screenshot saved as auth-test.png');
    
    // Check current URL again
    const cvBuilderUrl = page.url();
    console.log('📍 CV Builder URL:', cvBuilderUrl);
    
    // Look for template selector
    const templateSelector = await page.$('[data-testid="template-selector"]');
    if (templateSelector) {
      console.log('✅ Template selector found!');
      
      // Count template cards
      const templateCards = await page.$$('[data-testid="template-card"]');
      console.log(`📋 Found ${templateCards.length} template cards`);
      
      // Get template IDs
      const templateIds = await page.evaluate(() => {
        const cards = document.querySelectorAll('[data-testid="template-card"]');
        return Array.from(cards).map(card => card.getAttribute('data-template-id'));
      });
      
      console.log('📝 Template IDs found:');
      templateIds.forEach((id, index) => {
        console.log(`  ${index + 1}. ${id}`);
      });
      
      // Test clicking first template
      if (templateCards.length > 0) {
        console.log('🖱️ Testing click on first template...');
        await templateCards[0].click();
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check for preview
        const preview = await page.$('[data-testid="cv-preview"]');
        if (preview) {
          console.log('✅ CV preview found after clicking template!');
        } else {
          console.log('❌ CV preview not found after clicking template');
        }
      }
      
    } else {
      console.log('❌ Template selector not found');
      
      // Check what's actually on the page
      const pageText = await page.evaluate(() => {
        return document.body.innerText;
      });
      
      console.log('📝 Page content (first 300 chars):', pageText.substring(0, 300));
      
      // Look for any error messages or redirects
      const errorElements = await page.$$('.error, .alert, .warning');
      if (errorElements.length > 0) {
        console.log('⚠️ Found error/warning elements');
      }
    }
    
  } catch (error) {
    console.error('❌ Error during test:', error);
  } finally {
    await browser.close();
  }
}

testWithAuth().catch(console.error); 