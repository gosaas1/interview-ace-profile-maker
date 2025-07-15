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
  { id: 'creative-designer', name: 'Creative Designer', tier: 'career-pro' },
  { id: 'tech-lead', name: 'Tech Lead', tier: 'career-pro' },
  { id: 'consultant-elite', name: 'Consultant Elite', tier: 'career-pro' },
  { id: 'research-scientist', name: 'Research Scientist', tier: 'career-pro' },
  
  // ELITE TIER
  { id: 'harvard-elite', name: 'Harvard Elite', tier: 'elite' },
  { id: 'executive-ultimate', name: 'Executive Ultimate', tier: 'elite' },
  { id: 'board-director', name: 'Board Director', tier: 'elite' },
  { id: 'founder-visionary', name: 'Founder Visionary', tier: 'elite' },
  { id: 'global-executive', name: 'Global Executive', tier: 'elite' },
  { id: 'ceo-signature', name: 'CEO Signature', tier: 'elite' }
];

async function generateTemplatePreviews() {
  console.log('🎨 Starting template preview generation...');
  console.log(`📋 Total templates to process: ${templates.length}`);
  
  // Create output directory
  const outputDir = 'frontend/public/templates';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`📁 Created output directory: ${outputDir}`);
  }
  
  const browser = await puppeteer.launch({
    headless: false, // Set to true for production
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
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < templates.length; i++) {
      const template = templates[i];
      console.log(`\n🔄 Processing ${i + 1}/${templates.length}: ${template.name} (${template.id})`);
      
      try {
        // Find and click the template card
        const templateCard = await page.$(`[data-template-id="${template.id}"]`);
        if (!templateCard) {
          console.log(`❌ Template card not found for ${template.id}`);
          errorCount++;
          continue;
        }
        
        // Click the template
        await templateCard.click();
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Wait for CV preview to load
        const preview = await page.$('[data-testid="cv-preview"]');
        if (!preview) {
          console.log(`❌ CV preview not found for ${template.id}`);
          errorCount++;
          continue;
        }
        
        // Take screenshot of just the CV preview
        const filename = `${template.id}-preview.png`;
        const filepath = path.join(outputDir, filename);
        
        await preview.screenshot({
          path: filepath,
          type: 'png'
        });
        
        console.log(`✅ Generated: ${filename}`);
        successCount++;
        
        // Small delay between templates
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.log(`❌ Error processing ${template.id}:`, error.message);
        errorCount++;
      }
    }
    
    console.log(`\n🎉 Generation complete!`);
    console.log(`✅ Successfully generated: ${successCount} previews`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📁 Output directory: ${outputDir}`);
    
    // Create a summary file
    const summary = {
      totalTemplates: templates.length,
      successCount,
      errorCount,
      generatedFiles: templates.map(t => `${t.id}-preview.png`),
      timestamp: new Date().toISOString()
    };
    
    fs.writeFileSync(
      path.join(outputDir, 'generation-summary.json'), 
      JSON.stringify(summary, null, 2)
    );
    
    console.log(`📄 Summary saved to: ${path.join(outputDir, 'generation-summary.json')}`);
    
  } catch (error) {
    console.error('❌ Fatal error during generation:', error);
  } finally {
    await browser.close();
  }
}

generateTemplatePreviews().catch(console.error); 