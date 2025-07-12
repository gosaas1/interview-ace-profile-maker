import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check, Eye, Edit, Save, Brain, Download, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  tier: string;
  colorScheme: string;
  isPopular?: boolean;
  atsScore?: number;
}

interface UnifiedTemplateSelectionProps {
  onTemplateSelect: (templateId: string, action: 'edit' | 'save' | 'ai') => void;
  onBack: () => void;
  selectedTemplate?: string;
  mode: 'create' | 'upload';
  initialData?: any;
}

const templates: Template[] = [
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    category: 'Professional',
    description: 'Clean, professional design with subtle accents',
    tier: 'Free',
    colorScheme: 'Blue & Gray',
    isPopular: true,
    atsScore: 95
  },
  {
    id: 'classic-clean',
    name: 'Classic Clean',
    category: 'Professional',
    description: 'Traditional layout with modern typography',
    tier: 'Starter',
    colorScheme: 'Navy & White',
    atsScore: 92
  },
  {
    id: 'creative-colorful',
    name: 'Creative Colorful',
    category: 'Creative',
    description: 'Bold colors and creative layout for standout applications',
    tier: 'Pro',
    colorScheme: 'Multi-color',
    atsScore: 78
  },
  {
    id: 'executive-formal',
    name: 'Executive Formal',
    category: 'Executive',
    description: 'Premium design for senior-level positions',
    tier: 'Elite',
    colorScheme: 'Dark & Gold',
    atsScore: 88
  },
  {
    id: 'tech-modern',
    name: 'Tech Modern',
    category: 'Technology',
    description: 'Modern design perfect for tech professionals',
    tier: 'Pro',
    colorScheme: 'Blue & White',
    atsScore: 90
  },
  {
    id: 'finance-conservative',
    name: 'Finance Conservative',
    category: 'Finance',
    description: 'Conservative design for financial professionals',
    tier: 'Starter',
    colorScheme: 'Navy & Gray',
    atsScore: 94
  }
];

const getTierColor = (tier: string) => {
  switch (tier) {
    case 'Free': return 'bg-green-100 text-green-800 border-green-200';
    case 'Starter': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Pro': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Elite': return 'bg-amber-100 text-amber-800 border-amber-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export function UnifiedTemplateSelection({ 
  onTemplateSelect, 
  onBack, 
  selectedTemplate,
  mode,
  initialData
}: UnifiedTemplateSelectionProps) {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  const handleTemplateAction = (templateId: string, action: 'edit' | 'save' | 'ai') => {
    onTemplateSelect(templateId, action);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-800"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  {mode === 'create' ? 'Create Your CV' : 'Choose Template'}
                </h1>
                <p className="text-sm text-slate-600">
                  {mode === 'create' ? 'Start building your professional CV' : 'Select a template for your uploaded CV'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Star className="w-3 h-3 mr-1" />
                ATS Optimized
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Step Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Choose Your CV Template
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Select from our collection of professionally designed templates. Each template is optimized for Applicant Tracking Systems (ATS) to ensure your CV gets noticed.
          </p>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {templates.map((template) => (
            <Card
              key={template.id}
              className={cn(
                "relative cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 group",
                selectedTemplate === template.id 
                  ? "border-blue-500 shadow-xl scale-105" 
                  : "border-slate-200 hover:border-slate-300"
              )}
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
            >
              {/* Template Preview */}
              <div className="relative h-64 bg-gradient-to-br from-slate-100 to-slate-200 rounded-t-lg overflow-hidden">
                {/* Template Preview Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-slate-500">
                    <div className="w-20 h-24 bg-white rounded shadow-sm mx-auto mb-3 border border-slate-200 relative">
                      {/* Mock CV content */}
                      <div className="p-2">
                        <div className="h-2 bg-slate-300 rounded mb-1"></div>
                        <div className="h-1 bg-slate-200 rounded mb-1"></div>
                        <div className="h-1 bg-slate-200 rounded mb-1"></div>
                        <div className="h-1 bg-slate-200 rounded"></div>
                      </div>
                    </div>
                    <p className="text-xs font-medium">{template.name}</p>
                  </div>
                </div>
                
                {/* Badges */}
                <div className="absolute top-3 left-3 z-10">
                  <Badge className={cn("text-xs font-medium", getTierColor(template.tier))}>
                    {template.tier}
                  </Badge>
                </div>
                
                {template.isPopular && (
                  <div className="absolute top-3 right-3 z-10">
                    <Badge className="bg-red-500 text-white text-xs font-medium">
                      <Star className="w-3 h-3 mr-1" />
                      Popular
                    </Badge>
                  </div>
                )}
                
                {template.atsScore && (
                  <div className="absolute bottom-3 left-3 z-10">
                    <Badge className="bg-green-500 text-white text-xs font-medium">
                      ATS {template.atsScore}%
                    </Badge>
                  </div>
                )}
                
                {/* Selection Indicator */}
                {selectedTemplate === template.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {/* Template Info */}
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="font-bold text-lg text-slate-800 mb-2">
                    {template.name}
                  </h3>
                  <p className="text-sm text-slate-600 mb-3">
                    {template.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{template.colorScheme}</span>
                    <span>•</span>
                    <span>{template.category}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button
                    className={cn(
                      "w-full transition-all duration-200",
                      selectedTemplate === template.id
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    )}
                    onClick={() => handleTemplateAction(template.id, 'edit')}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    {selectedTemplate === template.id ? 'Selected' : 'Select Template'}
                  </Button>
                  
                  {selectedTemplate === template.id && (
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => handleTemplateAction(template.id, 'edit')}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => handleTemplateAction(template.id, 'save')}
                      >
                        <Save className="w-3 h-3 mr-1" />
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => handleTemplateAction(template.id, 'ai')}
                      >
                        <Brain className="w-3 h-3 mr-1" />
                        AI
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>

              {/* Hover Overlay */}
              {hoveredTemplate === template.id && (
                <div className="absolute inset-0 bg-black bg-opacity-5 rounded-lg transition-opacity duration-200" />
              )}
            </Card>
          ))}
        </div>

        {/* Help Section */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Live Preview</h3>
              <p className="text-sm text-slate-600">See your CV in real-time as you edit</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">ATS Optimized</h3>
              <p className="text-sm text-slate-600">All templates pass Applicant Tracking Systems</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Download className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Export Ready</h3>
              <p className="text-sm text-slate-600">Download as PDF or share directly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 