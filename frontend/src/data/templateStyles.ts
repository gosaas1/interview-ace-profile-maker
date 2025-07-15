import { cvTemplates, type CVTemplate } from './cvTemplates';

// Color scheme mapping - Updated for ATS compliance and business professionalism
const colorMap: { [key: string]: { primary: string; secondary: string; accent: string } } = {
  blue: { primary: '#1e40af', secondary: '#dbeafe', accent: '#3b82f6' },
  emerald: { primary: '#047857', secondary: '#d1fae5', accent: '#10b981' },
  amber: { primary: '#b45309', secondary: '#fef3c7', accent: '#f59e0b' },
  slate: { primary: '#475569', secondary: '#f1f5f9', accent: '#64748b' }, // Replaced rose with slate
  purple: { primary: '#6d28d9', secondary: '#ede9fe', accent: '#8b5cf6' },
  gray: { primary: '#374151', secondary: '#f3f4f6', accent: '#6b7280' },
  minimal: { primary: '#6b7280', secondary: '#f9fafb', accent: '#9ca3af' },
  teal: { primary: '#0f766e', secondary: '#ccfbf1', accent: '#14b8a6' }, // New business-friendly color
  indigo: { primary: '#4338ca', secondary: '#e0e7ff', accent: '#6366f1' }, // New professional color
};

// Tailwind/CSS class mapping for header/accent/border - Updated for ATS compliance
const classMap: { [key: string]: { header: string; accent: string; border: string } } = {
  blue: { header: 'bg-blue-600', accent: 'text-blue-600', border: 'border-blue-200' },
  emerald: { header: 'bg-emerald-600', accent: 'text-emerald-600', border: 'border-emerald-200' },
  amber: { header: 'bg-amber-600', accent: 'text-amber-600', border: 'border-amber-200' },
  slate: { header: 'bg-slate-600', accent: 'text-slate-600', border: 'border-slate-200' }, // Replaced rose with slate
  purple: { header: 'bg-purple-600', accent: 'text-purple-600', border: 'border-purple-200' },
  gray: { header: 'bg-gray-700', accent: 'text-gray-700', border: 'border-gray-200' },
  minimal: { header: 'bg-gray-500', accent: 'text-gray-600', border: 'border-gray-300' },
  teal: { header: 'bg-teal-600', accent: 'text-teal-600', border: 'border-teal-200' }, // New business-friendly color
  indigo: { header: 'bg-indigo-600', accent: 'text-indigo-600', border: 'border-indigo-200' }, // New professional color
};

export interface TemplateStyle {
  header: string; // Tailwind or CSS class
  accent: string;
  border: string;
  fontFamily: string;
  colorStyles: {
    primary: string;
    secondary: string;
    accent: string;
  };
  layout: string;
}

export function getTemplateStyles(templateOrId: string | CVTemplate) {
  let template: CVTemplate;
  
  if (typeof templateOrId === 'string') {
    template = cvTemplates.find(t => t.id === templateOrId) || cvTemplates[0];
  } else {
    template = templateOrId;
  }
  
  const classes = classMap[template.colorScheme || 'blue'] || classMap.blue;

  // Get template-specific style properties
  const headerAlign = template.headerAlign || 'center';
  const sectionDivider = template.sectionDivider || 'solid';
  const listStyle = template.listStyle || 'bullet';
  const headingStyle = template.headingStyle || 'uppercase';
  const headerThickness = template.headerThickness || 'normal';

  // Font family mapping
  const fontFamilyMap: { [key: string]: string } = {
    'Inter': 'Inter, system-ui, sans-serif',
    'Open Sans': 'Open Sans, system-ui, sans-serif',
    'serif': 'Crimson Text, Georgia, serif',
    'sans': 'Inter, system-ui, sans-serif',
    'Lato': 'Lato, system-ui, sans-serif',
    'Poppins': 'Poppins, system-ui, sans-serif',
    'Roboto': 'Roboto, system-ui, sans-serif',
    'Montserrat': 'Montserrat, system-ui, sans-serif',
    'Nunito': 'Nunito, system-ui, sans-serif',
    'Raleway': 'Raleway, system-ui, sans-serif'
  };

  const fontFamily = fontFamilyMap[template.fontFamily || 'Inter'] || 'Inter, system-ui, sans-serif';

  // Header alignment styles
  const headerStyles = {
    center: { textAlign: 'center' as const },
    left: { textAlign: 'left' as const },
    right: { textAlign: 'right' as const }
  };

  // Section divider styles - Updated with new options
  const dividerStyles = {
    solid: { borderLeft: '3px solid #3b82f6', paddingLeft: '12px' },
    dashed: { borderLeft: '3px dashed #6b7280', paddingLeft: '12px' },
    horizontal: { borderBottom: '2px solid #e5e7eb', paddingBottom: '8px', marginBottom: '12px' },
    faint: { borderLeft: '1px solid #e5e7eb', paddingLeft: '8px' },
    none: { borderLeft: 'none', paddingLeft: '0px' }
  };

  // List style classes
  const listStyles = {
    bullet: 'list-disc list-inside',
    dash: 'list-none',
    minimal: 'list-none space-y-1'
  };

  // Heading text transform
  const headingStyles = {
    uppercase: { textTransform: 'uppercase' as const },
    titlecase: { textTransform: 'capitalize' as const },
    normal: { textTransform: 'none' as const }
  };

  // Header thickness styles
  const headerThicknessStyles = {
    thin: { padding: '8px 12px', fontSize: '14px' },
    normal: { padding: '12px 16px', fontSize: '16px' },
    thick: { padding: '16px 20px', fontSize: '18px' }
  };

  // Layout-specific styles
  const layoutStyles = {
    'single-column': { display: 'block', width: '100%' },
    'two-column': { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },
    'right-side': { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },
    'center-title': { display: 'block', width: '100%' },
    'minimal-borders': { display: 'block', width: '100%' },
    'modern': { display: 'block', width: '100%' },
    'classic': { display: 'block', width: '100%' },
    'creative': { display: 'block', width: '100%' }
  };

  return {
    ...classes,
    fontFamily: fontFamily,
    headerAlign: headerStyles[headerAlign],
    sectionDivider: dividerStyles[sectionDivider],
    listStyle: listStyles[listStyle],
    headingStyle: headingStyles[headingStyle],
    headerThickness: headerThicknessStyles[headerThickness],
    layout: layoutStyles[template.layout || 'single-column'],
    // Additional style properties for rendering
    headerAlignValue: headerAlign,
    sectionDividerValue: sectionDivider,
    listStyleValue: listStyle,
    headingStyleValue: headingStyle,
    headerThicknessValue: headerThickness,
    layoutValue: template.layout || 'single-column'
  };
} 