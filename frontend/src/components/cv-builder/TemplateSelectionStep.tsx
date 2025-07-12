import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, HelpCircle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Template {
  id: string;
  name: string;
  tier: 'Free' | 'Starter' | 'Pro' | 'Elite';
  description: string;
  atsFriendly: boolean;
  colorScheme: string;
  previewUrl: string;
}

const templates: Template[] = [
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    tier: 'Free',
    description: 'Clean, professional design with subtle accents',
    atsFriendly: true,
    colorScheme: 'Blue & Gray',
    previewUrl: '/templates/modern-minimal-preview.png'
  },
  {
    id: 'classic-clean',
    name: 'Classic Clean',
    tier: 'Starter',
    description: 'Traditional layout with modern typography',
    atsFriendly: true,
    colorScheme: 'Navy & White',
    previewUrl: '/templates/classic-clean-preview.png'
  },
  {
    id: 'creative-colorful',
    name: 'Creative Colorful',
    tier: 'Pro',
    description: 'Bold colors and creative layout for standout applications',
    atsFriendly: false,
    colorScheme: 'Multi-color',
    previewUrl: '/templates/creative-colorful-preview.png'
  },
  {
    id: 'executive-formal',
    name: 'Executive Formal',
    tier: 'Elite',
    description: 'Premium design for senior-level positions',
    atsFriendly: true,
    colorScheme: 'Dark & Gold',
    previewUrl: '/templates/executive-formal-preview.png'
  }
];

interface TemplateSelectionStepProps {
  onTemplateSelect: (templateId: string) => void;
  onBack: () => void;
  selectedTemplate?: string;
}

const getTierColor = (tier: string) => {
  switch (tier) {
    case 'Free': return 'bg-green-100 text-green-800 border-green-200';
    case 'Starter': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Pro': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Elite': return 'bg-amber-100 text-amber-800 border-amber-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export function TemplateSelectionStep({ 
  onTemplateSelect, 
  onBack, 
  selectedTemplate 
}: TemplateSelectionStepProps) {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Create Your CV
            </h1>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-600 hover:text-slate-800"
          >
            <HelpCircle className="w-4 h-4" />
          </Button>
        </div>

        {/* Step Title */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-slate-800 mb-2">
            Choose a CV Template
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Select a template to start building your CV. Each template is designed for different industries and experience levels.
          </p>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {templates.map((template) => (
            <Card
              key={template.id}
              className={cn(
                "relative cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2",
                selectedTemplate === template.id 
                  ? "border-blue-500 shadow-lg scale-105" 
                  : "border-slate-200 hover:border-slate-300"
              )}
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
              onClick={() => onTemplateSelect(template.id)}
            >
              {/* Tier Badge */}
              <div className="absolute top-3 left-3 z-10">
                <Badge className={cn("text-xs font-medium", getTierColor(template.tier))}>
                  {template.tier}
                </Badge>
              </div>

              {/* Preview Image */}
              <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 rounded-t-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-slate-500">
                    <div className="w-16 h-20 bg-white rounded shadow-sm mx-auto mb-2 border border-slate-200"></div>
                    <p className="text-xs">Template Preview</p>
                  </div>
                </div>
                
                {/* Selection Indicator */}
                {selectedTemplate === template.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {/* Template Info */}
              <CardContent className="p-4">
                <h3 className="font-semibold text-slate-800 mb-1">
                  {template.name}
                </h3>
                <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                  {template.description}
                </p>
                
                {/* Template Details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      template.atsFriendly ? "bg-green-500" : "bg-orange-500"
                    )} />
                    <span className="text-xs text-slate-600">
                      {template.atsFriendly ? "ATS Friendly" : "Creative Design"}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    {template.colorScheme}
                  </div>
                </div>
              </CardContent>

              {/* Hover Overlay */}
              {hoveredTemplate === template.id && (
                <div className="absolute inset-0 bg-black bg-opacity-10 rounded-lg transition-opacity duration-200" />
              )}
            </Card>
          ))}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <Button
            size="lg"
            disabled={!selectedTemplate}
            className={cn(
              "px-8 py-3 text-lg font-medium transition-all duration-300",
              selectedTemplate 
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl" 
                : "bg-slate-300 text-slate-500 cursor-not-allowed"
            )}
            onClick={() => selectedTemplate && onTemplateSelect(selectedTemplate)}
          >
            {selectedTemplate ? "Continue with Template" : "Select a Template to Continue"}
          </Button>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>
            💡 <strong>Pro Tip:</strong> ATS-friendly templates are optimized for Applicant Tracking Systems and are recommended for most applications.
          </p>
        </div>
      </div>
    </div>
  );
} 