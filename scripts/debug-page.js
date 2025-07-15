const puppeteer = require('puppeteer');

async function debugPage() {
  console.log('🔍 Debugging CV Builder page...');
  
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
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Take a screenshot to see what's on the page
    await page.screenshot({ path: 'debug-page.png', fullPage: true });
    console.log('📸 Screenshot saved as debug-page.png');
    
    // Get page title
    const title = await page.title();
    console.log('📄 Page title:', title);
    
    // Check for any elements with data-testid
    const testIds = await page.evaluate(() => {
      const elements = document.querySelectorAll('[data-testid]');
      return Array.from(elements).map(el => ({
        testId: el.getAttribute('data-testid'),
        tagName: el.tagName,
        className: el.className,
        text: el.textContent?.substring(0, 100)
      }));
    });
    
    console.log('🔍 Elements with data-testid found:');
    testIds.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.testId} (${item.tagName}) - ${item.text}`);
    });
    
    // Check for any template-related elements
    const templateElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const templateRelated = Array.from(elements).filter(el => {
        const text = el.textContent?.toLowerCase() || '';
        const className = el.className?.toLowerCase() || '';
        return text.includes('template') || className.includes('template');
      });
      return templateRelated.slice(0, 10).map(el => ({
        tagName: el.tagName,
        className: el.className,
        text: el.textContent?.substring(0, 100)
      }));
    });
    
    console.log('🎨 Template-related elements found:');
    templateElements.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.tagName} - ${item.text}`);
    });
    
    // Check for any React components
    const reactElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const reactComponents = Array.from(elements).filter(el => {
        return el.tagName.toLowerCase().includes('div') && 
               (el.className.includes('grid') || el.className.includes('template'));
      });
      return reactComponents.slice(0, 5).map(el => ({
        tagName: el.tagName,
        className: el.className,
        children: el.children.length
      }));
    });
    
    console.log('⚛️ Potential React components found:');
    reactElements.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.tagName} (${item.children} children) - ${item.className}`);
    });
    
    // Check if there are any errors in the console
    const consoleErrors = await page.evaluate(() => {
      return window.consoleErrors || [];
    });
    
    if (consoleErrors.length > 0) {
      console.log('❌ Console errors found:');
      consoleErrors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error during debug:', error);
  } finally {
    await browser.close();
  }
}

debugPage().catch(console.error); 