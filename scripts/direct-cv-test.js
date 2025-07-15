const puppeteer = require('puppeteer');

async function directCVTest() {
  console.log('🎯 Direct CV Builder test...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1200, height: 800 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    console.log('🎨 Navigating directly to CV Builder...');
    await page.goto('http://localhost:3000/cv-builder', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Take a screenshot
    await page.screenshot({ path: 'direct-cv-test.png', fullPage: true });
    console.log('📸 Screenshot saved as direct-cv-test.png');
    
    // Check current URL
    const currentUrl = page.url();
    console.log('📍 Current URL:', currentUrl);
    
    // Get page title
    const title = await page.title();
    console.log('📄 Page title:', title);
    
    // Check if we're redirected to login/homepage
    if (currentUrl.includes('/login') || currentUrl === 'http://localhost:3000/') {
      console.log('⚠️ Redirected to login/homepage - authentication required');
      
      // Look for any login-related elements
      const loginElements = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const loginRelated = Array.from(elements).filter(el => {
          const text = el.textContent?.toLowerCase() || '';
          return text.includes('login') || text.includes('sign in') || text.includes('welcome');
        });
        return loginRelated.slice(0, 5).map(el => ({
          tagName: el.tagName,
          text: el.textContent?.substring(0, 100)
        }));
      });
      
      console.log('🔑 Login-related elements found:');
      loginElements.forEach((el, index) => {
        console.log(`  ${index + 1}. ${el.tagName} - ${el.text}`);
      });
      
    } else {
      console.log('✅ Successfully on CV Builder page');
      
      // Look for template selector
      const templateSelector = await page.$('[data-testid="template-selector"]');
      if (templateSelector) {
        console.log('✅ Template selector found!');
        
        // Count template cards
        const templateCards = await page.$$('[data-testid="template-card"]');
        console.log(`📋 Found ${templateCards.length} template cards`);
        
        if (templateCards.length > 0) {
          console.log('🎉 SUCCESS! Template selector is working!');
          
          // Get template IDs
          const templateIds = await page.evaluate(() => {
            const cards = document.querySelectorAll('[data-testid="template-card"]');
            return Array.from(cards).map(card => card.getAttribute('data-template-id'));
          });
          
          console.log('📝 Template IDs found:');
          templateIds.forEach((id, index) => {
            console.log(`  ${index + 1}. ${id}`);
          });
          
          return true; // Success!
        }
      } else {
        console.log('❌ Template selector not found');
        
        // Check what's actually on the page
        const pageText = await page.evaluate(() => {
          return document.body.innerText;
        });
        
        console.log('📝 Page content (first 500 chars):', pageText.substring(0, 500));
      }
    }
    
  } catch (error) {
    console.error('❌ Error during test:', error);
  } finally {
    await browser.close();
  }
  
  return false;
}

directCVTest().then(success => {
  if (success) {
    console.log('\n🎉 READY TO GENERATE TEMPLATE PREVIEWS!');
    console.log('The template selector is working correctly.');
  } else {
    console.log('\n❌ Need to fix authentication or routing issues first.');
  }
}).catch(console.error); 