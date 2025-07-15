const puppeteer = require('puppeteer');

async function testTemplatePreview() {
  console.log('🎨 Testing Template Preview Generator...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1200, height: 800 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    console.log('🌐 Navigating to Template Preview Generator...');
    await page.goto('http://localhost:3000/template-preview', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Take a screenshot
    await page.screenshot({ path: 'template-preview-test.png', fullPage: true });
    console.log('📸 Screenshot saved as template-preview-test.png');
    
    // Check current URL
    const currentUrl = page.url();
    console.log('📍 Current URL:', currentUrl);
    
    // Get page title
    const title = await page.title();
    console.log('📄 Page title:', title);
    
    // Look for template selector
    const templateSelector = await page.$('[data-testid="template-selector"]');
    if (templateSelector) {
      console.log('✅ Template selector found!');
      
      // Count template cards
      const templateCards = await page.$$('[data-testid="template-card"]');
      console.log(`📋 Found ${templateCards.length} template cards`);
      
      if (templateCards.length > 0) {
        console.log('🎉 SUCCESS! Template preview generator is working!');
        
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
        console.log('🖱️ Testing click on first template...');
        await templateCards[0].click();
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check for preview
        const preview = await page.$('[data-testid="cv-preview"]');
        if (preview) {
          console.log('✅ CV preview found after clicking template!');
          
          // Take another screenshot after clicking
          await page.screenshot({ path: 'template-preview-clicked.png', fullPage: true });
          console.log('📸 Screenshot saved as template-preview-clicked.png');
          
          return true; // Success!
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
      
      console.log('📝 Page content (first 500 chars):', pageText.substring(0, 500));
    }
    
  } catch (error) {
    console.error('❌ Error during test:', error);
  } finally {
    await browser.close();
  }
  
  return false;
}

testTemplatePreview().then(success => {
  if (success) {
    console.log('\n🎉 READY TO GENERATE TEMPLATE PREVIEWS!');
    console.log('The template preview generator is working correctly.');
    console.log('Now we can create the automated screenshot generation script.');
  } else {
    console.log('\n❌ Need to fix the template preview generator first.');
  }
}).catch(console.error); 