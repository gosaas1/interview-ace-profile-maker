import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Star, Crown, Zap, Lock, Eye, Sparkles } from 'lucide-react';
import { cvTemplates, type CVTemplate, getTemplatesByTier } from '@/data/cvTemplates';
import { TemplatePreview } from './TemplatePreview';
import { cn } from '@/lib/utils';

interface SimpleTemplateSelectorProps {
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
  onPreview?: (template: CVTemplate) => void;
  userTier?: string;
}

const TIER_CONFIG = {
  'free': {
    name: 'Free Templates',
    icon: <Star className="w-4 h-4 text-green-500" />,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    description: 'Professional templates for everyone'
  },
  'starter': {
    name: 'Starter Templates',
    icon: <Zap className="w-4 h-4 text-blue-500" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    description: 'Enhanced designs for better results'
  },
  'professional': {
    name: 'Professional Templates',
    icon: <Crown className="w-4 h-4 text-purple-500" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    description: 'Premium templates for serious professionals'
  },
  'career-pro': {
    name: 'Career Pro Templates',
    icon: <Sparkles className="w-4 h-4 text-amber-500" />,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    description: 'Executive-level designs for career advancement'
  },
  'elite': {
    name: 'Elite Templates',
    icon: <Crown className="w-4 h-4 text-indigo-500" />,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    description: 'Luxury templates for top-tier professionals'
  }
};

export const SimpleTemplateSelector: React.FC<SimpleTemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateSelect,
  onPreview,
  userTier = 'free'
}) => {
  const [activeTab, setActiveTab] = useState(userTier);
  const [previewTemplate, setPreviewTemplate] = useState<CVTemplate | null>(null);

  // Get templates for each tier
  const tierTemplates = {
    'free': getTemplatesByTier('free'),
    'starter': getTemplatesByTier('starter'),
    'professional': getTemplatesByTier('professional'),
    'career-pro': getTemplatesByTier('career-pro'),
    'elite': getTemplatesByTier('elite')
  };

  const renderTemplateCard = (template: CVTemplate, tier: string) => {
    const isSelected = selectedTemplate === template.id;
    const hasAccess = tier === 'free' || tier === userTier || userTier === 'elite';
    const tierConfig = TIER_CONFIG[tier as keyof typeof TIER_CONFIG];

    return (
      <Card 
        key={template.id}
        className={cn(
          "cursor-pointer transition-all duration-300 hover:shadow-lg group",
          isSelected 
            ? "ring-2 ring-blue-500 shadow-xl scale-105" 
            : "hover:border-gray-300 hover:scale-102",
          !hasAccess && "opacity-60"
        )}
        onClick={() => hasAccess && onTemplateSelect(template.id)}
      >
        <CardContent className="p-4">
          {/* Template Preview */}
          <div className="relative mb-4">
            <div className={cn(
              "aspect-[3/4] rounded-lg border-2 transition-all duration-300 overflow-hidden",
              isSelected 
                ? "border-blue-500 shadow-lg" 
                : "border-gray-200 hover:border-gray-300"
            )}>
              {/* Real Template Preview */}
              <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 relative">
                {/* Template Layout Preview */}
                <div className="absolute inset-0 p-3">
                  <TemplatePreview template={template} className="w-full h-full" />
                </div>
                
                {/* Template Name Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <div className="text-white text-xs font-medium">{template.name}</div>
                </div>
              </div>
              
              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {template.isPopular && (
                  <Badge className="bg-red-500 text-white text-xs px-2 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Popular
                  </Badge>
                )}
                {template.atsScore && (
                  <Badge className="bg-blue-100 text-blue-700 text-xs px-2 py-1">
                    ATS {template.atsScore}%
                  </Badge>
                )}
              </div>
              
              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}

              {/* Lock Icon for Premium Templates */}
              {!hasAccess && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-lg">
                  <div className="bg-white rounded-full p-2 shadow-lg">
                    <Lock className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Template Info */}
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">{template.name}</h4>
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{template.description}</p>
            </div>
            
            {/* Features */}
            <div className="flex flex-wrap gap-1">
              {template.features.slice(0, 2).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                  {feature}
                </Badge>
              ))}
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              {hasAccess ? (
                <Button
                  size="sm"
                  variant={isSelected ? "default" : "outline"}
                  className="flex-1 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTemplateSelect(template.id);
                  }}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3 h-3 mr-1" />
                      Selected
                    </>
                  ) : (
                    'Select'
                  )}
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs"
                  disabled
                >
                  <Lock className="w-3 h-3 mr-1" />
                  Upgrade
                </Button>
              )}
              
              {onPreview && hasAccess && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreview(template);
                  }}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Choose Your Template</h3>
        <p className="text-sm text-gray-600">Select a professional template that matches your career goals</p>
      </div>
      
      {/* Tier Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {Object.entries(TIER_CONFIG).map(([tier, config]) => (
            <TabsTrigger 
              key={tier} 
              value={tier}
              className={cn(
                "flex items-center gap-2 text-xs",
                tier === userTier && "bg-blue-100 text-blue-700"
              )}
            >
              {config.icon}
              <span className="hidden sm:inline">{config.name.split(' ')[0]}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {/* Template Content for each tier */}
        {Object.entries(tierTemplates).map(([tier, templates]) => (
          <TabsContent key={tier} value={tier} className="space-y-4">
            {/* Tier Header */}
            <div className={cn(
              "p-4 rounded-lg border",
              TIER_CONFIG[tier as keyof typeof TIER_CONFIG].bgColor,
              TIER_CONFIG[tier as keyof typeof TIER_CONFIG].borderColor
            )}>
              <div className="flex items-center gap-3">
                {TIER_CONFIG[tier as keyof typeof TIER_CONFIG].icon}
                <div>
                  <h4 className={cn(
                    "font-semibold",
                    TIER_CONFIG[tier as keyof typeof TIER_CONFIG].color
                  )}>
                    {TIER_CONFIG[tier as keyof typeof TIER_CONFIG].name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {TIER_CONFIG[tier as keyof typeof TIER_CONFIG].description}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map(template => renderTemplateCard(template, tier))}
            </div>
            
            {/* Empty State */}
            {templates.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Lock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No templates available for this tier</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
      
      {/* Footer Info */}
      <div className="text-center text-xs text-gray-500 border-t pt-4">
        <p>Selected: <strong>{cvTemplates.find(t => t.id === selectedTemplate)?.name}</strong></p>
        <p className="mt-1">All templates are ATS-optimized and professionally designed</p>
      </div>
    </div>
  );
}; 