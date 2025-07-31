import { CVData } from './types';
import { normalizeCVData } from './normalize';

interface PrintOptions {
  cvData: CVData;
  template: string;
  userTier?: string;
  mode: 'print' | 'download';
}

/**
 * Unified print/download function that uses the same normalized cvData as preview
 * This ensures consistency across all CV outputs
 */
export async function printCV({ cvData, template, userTier = 'free', mode }: PrintOptions) {
  // UNIFIED LOGIC: Always normalize cvData before rendering
  const normalizedCV = normalizeCVData(cvData);
  
  // Defensive check for skills to prevent [object Object] rendering
  const renderSkills = (skills: any) => {
    if (!skills) return '';
    if (Array.isArray(skills)) {
      return skills.map((skill: any) => {
        if (typeof skill === 'string') return skill;
        if (skill && typeof skill === 'object' && skill.name) return skill.name;
        return String(skill);
      }).join(', ');
    }
    if (typeof skills === 'string') return skills;
    return String(skills);
  };
  
  // Create a personal info block that matches the preview
  const personalInfoBlock = `
    <div class="text-center mb-6 pb-4 border-b border-gray-200">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">${normalizedCV.personalInfo.fullName || ''}</h1>
      <div class="text-sm text-gray-600 space-y-1">
        ${normalizedCV.personalInfo.email ? `<p>${normalizedCV.personalInfo.email}</p>` : ''}
        ${normalizedCV.personalInfo.phone ? `<p>${normalizedCV.personalInfo.phone}</p>` : ''}
        ${normalizedCV.personalInfo.location ? `<p>${normalizedCV.personalInfo.location}</p>` : ''}
        ${normalizedCV.personalInfo.linkedin || normalizedCV.personalInfo.website ? 
          `<p>${normalizedCV.personalInfo.linkedin ? `<a href="${normalizedCV.personalInfo.linkedin}" target="_blank" class="text-blue-600 hover:underline">LinkedIn</a>` : ''} 
           ${normalizedCV.personalInfo.linkedin && normalizedCV.personalInfo.website ? ' | ' : ''} 
           ${normalizedCV.personalInfo.website ? `<a href="${normalizedCV.personalInfo.website}" target="_blank" class="text-blue-600 hover:underline">Website</a>` : ''}</p>` : ''}
      </div>
      ${normalizedCV.personalInfo.summary ? `<p class="mt-3 text-gray-700 leading-relaxed">${normalizedCV.personalInfo.summary}</p>` : ''}
    </div>
  `;

  // Create the main CV content (this would be the template-specific content)
  const cvContent = `
    <div class="cv-content">
      ${normalizedCV.experiences.length > 0 ? `
        <div class="mb-6">
          <h2 class="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">Professional Experience</h2>
          ${normalizedCV.experiences.map(exp => `
            <div class="mb-4">
              <div class="flex justify-between items-start mb-1">
                <h3 class="font-semibold text-gray-900">${exp.position || exp.role || ''}</h3>
                <span class="text-sm text-gray-600">${exp.startDate || ''} - ${exp.endDate || ''}</span>
              </div>
              <p class="text-gray-700 font-medium mb-1">${exp.company || ''}${exp.location ? `, ${exp.location}` : ''}</p>
              <p class="text-gray-600 text-sm leading-relaxed">${exp.description || ''}</p>
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      ${normalizedCV.education.length > 0 ? `
        <div class="mb-6">
          <h2 class="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">Education</h2>
          ${normalizedCV.education.map(edu => `
            <div class="mb-3">
              <div class="flex justify-between items-start mb-1">
                <h3 class="font-semibold text-gray-900">${edu.degree || ''}</h3>
                <span class="text-sm text-gray-600">${edu.startDate || ''} - ${edu.endDate || ''}</span>
              </div>
              <p class="text-gray-700 font-medium mb-1">${edu.institution || ''}${edu.field ? `, ${edu.field}` : ''}</p>
              ${edu.gpa ? `<p class="text-gray-600 text-sm">GPA: ${edu.gpa}</p>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      ${normalizedCV.skills.length > 0 ? `
        <div class="mb-6">
          <h2 class="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">Skills</h2>
          <p class="text-gray-700">${renderSkills(normalizedCV.skills)}</p>
        </div>
      ` : ''}
      
      ${normalizedCV.certifications.length > 0 ? `
        <div class="mb-6">
          <h2 class="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">Certifications</h2>
          ${normalizedCV.certifications.map(cert => `
            <div class="mb-2">
              <p class="font-medium text-gray-900">${cert.name || ''}</p>
              <p class="text-sm text-gray-600">${cert.issuer || ''}${cert.date ? ` - ${cert.date}` : ''}</p>
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      ${normalizedCV.projects.length > 0 ? `
        <div class="mb-6">
          <h2 class="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">Projects</h2>
          ${normalizedCV.projects.map(project => `
            <div class="mb-3">
              <div class="flex justify-between items-start mb-1">
                <h3 class="font-semibold text-gray-900">${project.name || ''}</h3>
                <span class="text-sm text-gray-600">${project.date || ''}</span>
              </div>
              <p class="text-gray-700 mb-1">${project.description || ''}</p>
              ${project.technologies ? `<p class="text-sm text-gray-600">Technologies: ${Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies}</p>` : ''}
              ${project.link ? `<p class="text-sm text-blue-600"><a href="${project.link}" target="_blank">View Project</a></p>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      ${normalizedCV.languages.length > 0 ? `
        <div class="mb-6">
          <h2 class="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">Languages</h2>
          ${normalizedCV.languages.map(lang => `
            <div class="mb-2">
              <p class="font-medium text-gray-900">${lang.language || ''}</p>
              <p class="text-sm text-gray-600">${lang.proficiency || ''}${lang.certification_name ? ` - ${lang.certification_name}` : ''}</p>
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      ${normalizedCV.references.length > 0 ? `
        <div class="mb-6">
          <h2 class="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">References</h2>
          ${normalizedCV.references.map(ref => `
            <div class="mb-3">
              <p class="font-medium text-gray-900">${ref.name || ''}</p>
              <p class="text-sm text-gray-700">${ref.title || ''}${ref.company ? `, ${ref.company}` : ''}</p>
              ${ref.email ? `<p class="text-sm text-gray-600">${ref.email}</p>` : ''}
              ${ref.phone ? `<p class="text-sm text-gray-600">${ref.phone}</p>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;

  // Create watermark for free tier
  const watermark = userTier === 'free' ? `
    <div class="watermark" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 48px; color: rgba(0,0,0,0.1); pointer-events: none; z-index: 1000;">
      ApplyAce Free
    </div>
  ` : '';

  // Create the complete HTML document
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${normalizedCV.personalInfo.fullName || 'CV'} - ${template}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        @media print {
          body { margin: 0; }
          .cv-container { max-width: none; }
          .watermark { display: block !important; }
        }
        .cv-container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .watermark { display: none; }
      </style>
    </head>
    <body>
      <div class="cv-container bg-white text-gray-900 font-sans">
        ${personalInfoBlock}
        ${cvContent}
        ${watermark}
      </div>
    </body>
    </html>
  `;

  if (mode === 'print') {
    // Open print window
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 100);
    }
  } else if (mode === 'download') {
    // Create download link
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${normalizedCV.personalInfo.fullName || 'CV'}-${template}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
} 