const puppeteer = require('puppeteer');

async function simpleTemplateTest() {
  console.log('🧪 Simple template test starting...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1200, height: 800 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    console.log('🌐 Navigating to CV Builder...');
    await page.goto('http://localhost:3000/cv-builder', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    console.log('⏳ Waiting for page to load...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Take a screenshot to see what's on the page
    await page.screenshot({ path: 'simple-test.png', fullPage: true });
    console.log('📸 Screenshot saved as simple-test.png');
    
    // Get page title
    const title = await page.title();
    console.log('📄 Page title:', title);
    
    // Check for any text content that might indicate templates
    const pageText = await page.evaluate(() => {
      return document.body.innerText;
    });
    
    console.log('📝 Page text (first 500 chars):', pageText.substring(0, 500));
    
    // Look for any buttons or elements that might be template-related
    const buttons = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      return Array.from(buttons).map(btn => ({
        text: btn.textContent?.trim(),
        className: btn.className
      }));
    });
    
    console.log('🔘 Buttons found:');
    buttons.forEach((btn, index) => {
      console.log(`  ${index + 1}. "${btn.text}" (${btn.className})`);
    });
    
    // Look for any divs with grid classes (template selector uses grid)
    const gridDivs = await page.evaluate(() => {
      const divs = document.querySelectorAll('div');
      const gridDivs = Array.from(divs).filter(div => 
        div.className.includes('grid') || 
        div.className.includes('template') ||
        div.className.includes('card')
      );
      return gridDivs.slice(0, 10).map(div => ({
        className: div.className,
        children: div.children.length,
        text: div.textContent?.substring(0, 100)
      }));
    });
    
    console.log('🎨 Grid/Template divs found:');
    gridDivs.forEach((div, index) => {
      console.log(`  ${index + 1}. ${div.className} (${div.children} children) - ${div.text}`);
    });
    
    // Try to find any elements with data attributes
    const dataElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('[data-*]');
      return Array.from(elements).map(el => ({
        tagName: el.tagName,
        attributes: Array.from(el.attributes)
          .filter(attr => attr.name.startsWith('data-'))
          .map(attr => `${attr.name}="${attr.value}"`)
      }));
    });
    
    console.log('🔍 Elements with data attributes:');
    dataElements.forEach((el, index) => {
      console.log(`  ${index + 1}. ${el.tagName} - ${el.attributes.join(', ')}`);
    });
    
    // Check if there are any console errors
    const errors = await page.evaluate(() => {
      return window.consoleErrors || [];
    });
    
    if (errors.length > 0) {
      console.log('❌ Console errors:');
      errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error during test:', error);
  } finally {
    await browser.close();
  }
}

simpleTemplateTest().catch(console.error); 