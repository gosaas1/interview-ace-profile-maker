const puppeteer = require('puppeteer');

async function testTemplateSelector() {
  console.log('🧪 Testing template selector...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1200, height: 800 }
  });
  
  const page = await browser.newPage();
  
  try {
    // Navigate to CV Builder page
    console.log('🌐 Navigating to CV Builder...');
    await page.goto('http://localhost:3000/cv-builder', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Wait for the page to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check if template selector exists
    const selectorExists = await page.$('[data-testid="template-selector"]');
    if (selectorExists) {
      console.log('✅ Template selector found');
    } else {
      console.log('❌ Template selector not found');
    }
    
    // Check for template cards
    const templateCards = await page.$$('[data-testid="template-card"]');
    console.log(`📋 Found ${templateCards.length} template cards`);
    
    // List all template IDs
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
      console.log('\n🖱️ Testing click on first template...');
      await templateCards[0].click();
      
      // Wait for preview to load
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if preview exists
      const previewExists = await page.$('[data-testid="cv-preview"]');
      if (previewExists) {
        console.log('✅ CV preview found after clicking template');
      } else {
        console.log('❌ CV preview not found after clicking template');
      }
    }
    
  } catch (error) {
    console.error('❌ Error during test:', error);
  } finally {
    await browser.close();
  }
}

testTemplateSelector().catch(console.error); 