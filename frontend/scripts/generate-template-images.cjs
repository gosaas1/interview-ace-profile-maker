const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'http://localhost:3000';
const TEMPLATE_PREVIEW_URL = `${BASE_URL}/template-preview`;
const OUTPUT_DIR = path.join(__dirname, '../public/templates');
const DELAY_BETWEEN_TEMPLATES = 2000; // 2 seconds
const SCREENSHOT_OPTIONS = {
  type: 'png',
  fullPage: false,
  omitBackground: true,
  width: 300,
  height: 400
};

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function generateTemplateImages() {
  console.log('🚀 Starting template image generation...');
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
  console.log(`🌐 Preview URL: ${TEMPLATE_PREVIEW_URL}`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1200, height: 800 });
    
    // Navigate to template preview page
    console.log('📄 Navigating to template preview page...');
    await page.goto(TEMPLATE_PREVIEW_URL, { waitUntil: 'networkidle0' });
    
    // Wait for the page to load
    await page.waitForSelector('[data-testid="template-preview"]', { timeout: 10000 });
    
    const generatedImages = [];
    
    // Get total number of templates
    const templateCount = await page.evaluate(() => {
      const templateElements = document.querySelectorAll('[data-template-index]');
      return templateElements.length;
    });
    
    console.log(`📊 Found ${templateCount} templates to process`);
    
    // Process each template
    for (let i = 0; i < templateCount; i++) {
      try {
        console.log(`\n🔄 Processing template ${i + 1}/${templateCount}...`);
        
        // Navigate to specific template
        await page.evaluate((index) => {
          // Find and click the template in the list
          const templateElement = document.querySelector(`[data-template-index="${index}"]`);
          if (templateElement) {
            templateElement.click();
          }
        }, i);
        
        // Wait for template to load
        await page.waitForTimeout(1000);
        
        // Get template info
        const templateInfo = await page.evaluate((index) => {
          const templateElement = document.querySelector(`[data-template-index="${index}"]`);
          if (templateElement) {
            return {
              id: templateElement.getAttribute('data-template-id'),
              name: templateElement.querySelector('[data-template-name]')?.textContent || `Template ${index + 1}`,
              tier: templateElement.querySelector('[data-template-tier]')?.textContent || 'unknown'
            };
          }
          return null;
        }, i);
        
        if (!templateInfo) {
          console.log(`⚠️  Could not get info for template ${i + 1}, skipping...`);
          continue;
        }
        
        console.log(`📝 Template: ${templateInfo.name} (${templateInfo.tier})`);
        
        // Wait for CV preview to load
        await page.waitForSelector('[data-testid="cv-preview"]', { timeout: 5000 });
        
        // Take screenshot of the CV preview
        const screenshotPath = path.join(OUTPUT_DIR, `${templateInfo.id}-preview.png`);
        
        // Find the CV preview element and take screenshot
        const cvPreviewElement = await page.$('[data-testid="cv-preview"]');
        if (cvPreviewElement) {
          await cvPreviewElement.screenshot({
            path: screenshotPath,
            ...SCREENSHOT_OPTIONS
          });
          
          console.log(`✅ Generated: ${screenshotPath}`);
          generatedImages.push({
            id: templateInfo.id,
            name: templateInfo.name,
            tier: templateInfo.tier,
            path: screenshotPath,
            filename: `${templateInfo.id}-preview.png`
          });
        } else {
          console.log(`❌ Could not find CV preview element for template ${templateInfo.name}`);
        }
        
        // Wait before processing next template
        if (i < templateCount - 1) {
          await page.waitForTimeout(DELAY_BETWEEN_TEMPLATES);
        }
        
      } catch (error) {
        console.error(`❌ Error processing template ${i + 1}:`, error.message);
      }
    }
    
    // Save generation summary
    const summaryPath = path.join(OUTPUT_DIR, 'generation-summary.json');
    const summary = {
      generatedAt: new Date().toISOString(),
      totalTemplates: templateCount,
      generatedImages: generatedImages.length,
      images: generatedImages
    };
    
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    console.log(`\n📋 Summary saved to: ${summaryPath}`);
    
    console.log(`\n🎉 Template image generation completed!`);
    console.log(`✅ Generated ${generatedImages.length}/${templateCount} images`);
    console.log(`📁 Images saved to: ${OUTPUT_DIR}`);
    
    // List generated images
    console.log('\n📸 Generated Images:');
    generatedImages.forEach((img, index) => {
      console.log(`${index + 1}. ${img.name} (${img.tier}) - ${img.filename}`);
    });
    
  } catch (error) {
    console.error('❌ Error during template image generation:', error);
  } finally {
    await browser.close();
  }
}

// Run the script
if (require.main === module) {
  generateTemplateImages().catch(console.error);
}

module.exports = { generateTemplateImages }; 