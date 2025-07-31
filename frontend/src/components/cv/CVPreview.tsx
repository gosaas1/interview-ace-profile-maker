import React from 'react';
import { BasicTemplate } from './templates/BasicTemplate';
import { MinimalCleanTemplate } from './templates/MinimalCleanTemplate';
import { ProfessionalSimpleTemplate } from './templates/ProfessionalSimpleTemplate';
import { ClassicElegantTemplate } from './templates/ClassicElegantTemplate';
import { ModernMinimalTemplate } from './templates/ModernMinimalTemplate';
import { HarvardClassicTemplate } from './templates/HarvardClassicTemplate';
import { ModernProfessionalTemplate } from './templates/ModernProfessionalTemplate';
import { ExecutiveModernTemplate } from './templates/ExecutiveModernTemplate';
import { FounderVisionaryTemplate } from './templates/FounderVisionaryTemplate';
import { CreativePortfolioTemplate } from './templates/CreativePortfolioTemplate';
import { BoardDirectorTemplate } from './templates/BoardDirectorTemplate';
import { ExecutiveUltimateTemplate } from './templates/ExecutiveUltimateTemplate';
import { CEOSignatureTemplate } from './templates/CEOSignatureTemplate';
import { PerfectBestTemplate } from './templates/PerfectBestTemplate';
import { getTemplateById } from '@/data/cvTemplates';
import { CreativeCleanTemplate } from './templates/CreativeCleanTemplate';
import { AestheticStyleTemplate } from './templates/AestheticStyleTemplate';
import { StunningCVTemplate } from './templates/StunningCVTemplate';
import { BestElegantTemplate } from './templates/BestElegantTemplate';
import { TechFocusedTemplate } from './templates/TechFocusedTemplate';
import { MinimalistTemplate } from './templates/MinimalistTemplate';
import { AchieverModernTemplate } from './templates/AchieverModernTemplate';
import { TechLeadTemplate } from "./templates/TechLeadTemplate";
import { ConsultantEliteTemplate } from "./templates/ConsultantEliteTemplate";
import { ResearchScientistTemplate } from "./templates/ResearchScientistTemplate";
import { HarvardEliteTemplate } from "./templates/HarvardEliteTemplate";
import { GlobalExecutiveTemplate } from "./templates/GlobalExecutiveTemplate";
import { normalizeCVData } from '@/lib/cv/normalize';
import { CVData } from '@/lib/cv/types';

interface CVPreviewProps {
  cvData: CVData;
  template: string;
}

export default function CVPreview({ cvData, template }: CVPreviewProps) {
  // UNIFIED LOGIC: Always normalize cvData before rendering
  const normalizedCV = normalizeCVData(cvData);
  const templateObj = getTemplateById(template);

  // Map template IDs to components
  const templateComponentMap: Record<string, React.FC<{ data: CVData }>> = {
    'basic-modern': BasicTemplate,
    'minimal-clean': MinimalCleanTemplate,
    'professional-simple': ProfessionalSimpleTemplate,
    'classic-elegant': ClassicElegantTemplate,
    'elegant-classic': ClassicElegantTemplate,
    'elegant classic': ClassicElegantTemplate,
    'modern-minimal': ModernMinimalTemplate,
    'harvard-classic': HarvardClassicTemplate,
    'modern-professional': ModernProfessionalTemplate,
    'executive-modern': ExecutiveModernTemplate,
    'founder-visionary': (props) => <FounderVisionaryTemplate {...props} templateName={templateObj?.name} />,
    'creative-portfolio': CreativePortfolioTemplate,
    'creative-clean': CreativeCleanTemplate,
    'board-director': BoardDirectorTemplate,
    'executive-ultimate': ExecutiveUltimateTemplate,
    'ceo-signature': CEOSignatureTemplate,
    'perfect-best': PerfectBestTemplate,
    'aesthetic-style': AestheticStyleTemplate,
    'stunning-cv': StunningCVTemplate,
    'best-elegant': BestElegantTemplate,
    'tech-focused': TechFocusedTemplate,
    'minimalist': MinimalistTemplate,
    'achiever-modern': AchieverModernTemplate,
    'tech-lead': TechLeadTemplate,
    'consultant-elite': ConsultantEliteTemplate,
    'research-scientist': ResearchScientistTemplate,
    'harvard-elite': HarvardEliteTemplate,
    'global-executive': GlobalExecutiveTemplate,
  };

  const renderTemplate = () => {
    if (!templateObj) {
      return <div className="text-red-600">Template not found.</div>;
    }
    // Prefer direct ID match
    if (templateComponentMap[templateObj.id]) {
      const Comp = templateComponentMap[templateObj.id];
      return <Comp data={normalizedCV} />;
    }
    // Fallback by layout
    switch (templateObj.layout) {
      case 'single-column':
      case 'minimal-borders':
        return <MinimalCleanTemplate data={normalizedCV} />;
      case 'center-title':
      case 'modern':
      case 'classic':
      case 'creative':
        return <BasicTemplate data={normalizedCV} />;
      case 'right-side':
      case 'two-column':
        return <ExecutiveModernTemplate data={normalizedCV} />;
      default:
        return <BasicTemplate data={normalizedCV} />;
    }
  };

  return (
    <div className="border rounded p-4 bg-white shadow">
      <h2 className="text-lg font-bold mb-2">Live Preview ({templateObj?.name || template})</h2>
      <div className="mb-4">{renderTemplate()}</div>
    </div>
  );
} 