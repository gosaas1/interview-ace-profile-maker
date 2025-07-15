const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Template data from cvTemplates.ts
const templates = [
  // FREE TIER
  { id: 'basic-modern', name: 'Basic Modern', tier: 'free' },
  { id: 'minimal-clean', name: 'Minimal Clean', tier: 'free' },
  { id: 'professional-simple', name: 'Professional Simple', tier: 'free' },
  { id: 'classic-elegant', name: 'Classic Elegant', tier: 'free' },
  { id: 'modern-minimal', name: 'Modern Minimal', tier: 'free' },
  
  // STARTER TIER
  { id: 'harvard-classic', name: 'Harvard Classic', tier: 'starter' },
  { id: 'modern-professional', name: 'Modern Professional', tier: 'starter' },
  { id: 'creative-clean', name: 'Creative Clean', tier: 'starter' },
  { id: 'attractive-cv', name: 'Attractive CV', tier: 'starter' },
  { id: 'business-resume', name: 'Business Resume', tier: 'starter' },
  { id: 'minimalist-formal', name: 'Minimalist Formal', tier: 'starter' },
  { id: 'simple-creative', name: 'Simple Creative', tier: 'starter' },
  { id: 'perfect-clean-cv', name: 'Perfect Clean CV', tier: 'starter' },
  { id: 'modern-cv', name: 'Modern CV', tier: 'starter' },
  { id: 'creative-professional', name: 'Creative Professional', tier: 'starter' },
  
  // PROFESSIONAL TIER
  { id: 'executive-modern', name: 'Executive Modern', tier: 'professional' },
  { id: 'creative-portfolio', name: 'Creative Portfolio', tier: 'professional' },
  { id: 'minimalist', name: 'Minimalist', tier: 'professional' },
  { id: 'aesthetic-style', name: 'Aesthetic Style', tier: 'professional' },
  { id: 'stunning-cv', name: 'Stunning CV', tier: 'professional' },
  { id: 'best-elegant', name: 'Best Elegant', tier: 'professional' },
  { id: 'perfect-best', name: 'Perfect Best', tier: 'professional' },
  { id: 'tech-focused', name: 'Tech Focused', tier: 'professional' },
  { id: 'healthcare-professional', name: 'Healthcare Professional', tier: 'professional' },
  { id: 'academic-research', name: 'Academic Research', tier: 'professional' },
  
  // CAREER PRO TIER
  { id: 'executive-premium', name: 'Executive Premium', tier: 'career-pro' },
  { id: 'creative-executive', name: 'Creative Executive', tier: 'career-pro' },
  { id: 'modern-executive', name: 'Modern Executive', tier: 'career-pro' },
  { id: 'professional-executive', name: 'Professional Executive', tier: 'career-pro' },
  { id: 'elite-executive', name: 'Elite Executive', tier: 'career-pro' },
  
  // ELITE TIER
  { id: 'harvard-elite', name: 'Harvard Elite', tier: 'elite' },
  { id: 'executive-ultimate', name: 'Executive Ultimate', tier: 'elite' },
  { id: 'ceo-signature', name: 'CEO Signature', tier: 'elite' },
  { id: 'board-director', name: 'Board Director', tier: 'elite' },
  { id: 'global-executive', name: 'Global Executive', tier: 'elite' },
  { id: 'premium-elite', name: 'Premium Elite', tier: 'elite' }
];

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateTemplatePreviews() {
  console.log('🚀 Starting template preview generation...');
  
  // Create output directory
  const outputDir = path.join(__dirname, '../frontend/public/templates');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log('📁 Created templates directory');
  }
  
  const browser = await puppeteer.launch({
    headless: false, // Set to true for production
    defaultViewport: { width: 1200, height: 800 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
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
    await delay(3000);
    
    // Check if we need to wait for template selector
    await page.waitForSelector('[data-testid="template-selector"]', { timeout: 10000 })
      .catch(() => console.log('⚠️ Template selector not found, continuing...'));
    
    for (let i = 0; i < templates.length; i++) {
      const template = templates[i];
      console.log(`\n📸 Generating preview for: ${template.name} (${template.tier})`);
      
      try {
        // Wait for template cards to be visible
        await page.waitForSelector('[data-testid="template-card"]', { timeout: 10000 });
        
        // Find and click the template card
        const templateSelector = `[data-testid="template-card"][data-template-id="${template.id}"]`;
        await page.waitForSelector(templateSelector, { timeout: 10000 });
        
        // Click the template
        await page.click(templateSelector);
        console.log(`  ✅ Clicked template: ${template.id}`);
        
        // Wait for preview to load
        await delay(2000);
        
        // Wait for preview area to be visible
        await page.waitForSelector('[data-testid="cv-preview"]', { timeout: 10000 });
        
        // Additional wait for preview to fully render
        await delay(1000);
        
        // Capture screenshot of the preview area
        const previewElement = await page.$('[data-testid="cv-preview"]');
        if (previewElement) {
          const screenshotPath = path.join(outputDir, `${template.id}-preview.png`);
          await previewElement.screenshot({
            path: screenshotPath,
            type: 'png',
            quality: 90
          });
          console.log(`  📸 Screenshot saved: ${screenshotPath}`);
        } else {
          console.log(`  ❌ Preview element not found for ${template.id}`);
        }
        
        // Wait before next template
        await delay(1000);
        
      } catch (error) {
        console.log(`  ❌ Error processing ${template.id}: ${error.message}`);
        continue;
      }
    }
    
    console.log('\n✅ Template preview generation completed!');
    console.log(`📁 Images saved to: ${outputDir}`);
    
  } catch (error) {
    console.error('❌ Error during preview generation:', error);
  } finally {
    await browser.close();
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
🎨 CV Template Preview Generator

Usage:
  node generate-template-previews.js [options]

Options:
  --help, -h     Show this help message
  --headless     Run in headless mode (no browser window)
  --port <port>  Specify frontend port (default: 3000)

Example:
  node generate-template-previews.js --headless --port 3000
  `);
  process.exit(0);
}

// Run the script
generateTemplatePreviews().catch(console.error); 