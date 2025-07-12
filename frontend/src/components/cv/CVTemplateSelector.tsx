import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Star, Lock, Info, Grid, List, Filter, AlertCircle, Crown, Zap, ChevronLeft, ChevronRight, Eye, Palette } from 'lucide-react';
import { cvTemplates, getTemplatesByTier, templateCategories, type CVTemplate } from '@/data/cvTemplates';
import { CVTemplatePreview } from './CVTemplatePreview';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSwipeable } from 'react-swipeable';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CVTemplateSelectorProps {
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
  userTier?: string;
  showAllTemplates?: boolean; // For development/testing
}

const TEMPLATES_PER_PAGE = 6;

export const CVTemplateSelector: React.FC<CVTemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateSelect,
  userTier = 'free',
  showAllTemplates = true // Show all templates for development
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [previewTemplate, setPreviewTemplate] = useState<CVTemplate | null>(null);
  const [enlargePreview, setEnlargePreview] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'popular' | 'ats' | 'name'>('popular');
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter templates based on user tier and category
  let filteredTemplates = showAllTemplates 
    ? cvTemplates 
    : getTemplatesByTier(userTier);

  if (selectedCategory !== 'all') {
    filteredTemplates = filteredTemplates.filter(template => template.category === selectedCategory);
  }

  // Sort templates
  filteredTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      case 'ats':
        return (b.atsScore || 0) - (a.atsScore || 0);
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const currentTemplate = filteredTemplates[currentIndex];

  // Swipe handlers for mobile
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => nextTemplate(),
    onSwipedRight: () => previousTemplate(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  const nextTemplate = () => {
    if (currentIndex < filteredTemplates.length - 1) {
      setIsTransitioning(true);
      setCurrentIndex(prev => prev + 1);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  const previousTemplate = () => {
    if (currentIndex > 0) {
      setIsTransitioning(true);
      setCurrentIndex(prev => prev - 1);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory]);

  const handleTemplateSelect = (template: CVTemplate) => {
    // Check if user has access to this template
    if (!showAllTemplates) {
      const userTemplates = getTemplatesByTier(userTier);
      const hasAccess = userTemplates.some(t => t.id === template.id);
      
      if (!hasAccess) {
        // Show upgrade modal or message
        return;
      }
    }
    
    onTemplateSelect(template.id);
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'elite':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'career-pro':
        return <Zap className="w-4 h-4 text-purple-500" />;
      case 'professional':
        return <Star className="w-4 h-4 text-blue-500" />;
      case 'starter':
        return <Check className="w-4 h-4 text-green-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'elite':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 'career-pro':
        return 'bg-gradient-to-r from-purple-400 to-purple-600 text-white';
      case 'professional':
        return 'bg-gradient-to-r from-blue-400 to-blue-600 text-white';
      case 'starter':
        return 'bg-gradient-to-r from-green-400 to-green-600 text-white';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Your CV Template
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Select from our collection of {cvTemplates.length}+ professionally designed templates. 
          All templates are optimized for Applicant Tracking Systems (ATS) to ensure your CV gets noticed.
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <Badge variant="outline" className="flex items-center gap-1">
            <Check className="w-3 h-3" />
            ATS Optimized
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Palette className="w-3 h-3" />
            Industry Specific
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Star className="w-3 h-3" />
            Most Popular
          </Badge>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="flex-1">
          <TabsList className="grid grid-cols-6 lg:grid-cols-11 w-full">
            {templateCategories.map(category => (
              <TabsTrigger key={category.id} value={category.id} className="text-xs lg:text-sm">
                {category.name} ({category.count})
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Sort and View Controls */}
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="ats">ATS Score</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Template Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card 
                className={cn(
                  "group hover:shadow-lg transition-all duration-300 cursor-pointer relative overflow-hidden",
                  selectedTemplate === template.id && "ring-2 ring-blue-500 shadow-lg"
                )}
                onClick={() => handleTemplateSelect(template)}
              >
                {/* Template Preview */}
                <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-4">
                      <div className="text-4xl mb-2">📄</div>
                      <div className="text-sm font-medium text-gray-700">{template.name}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {template.colorScheme} • {template.layout}
                      </div>
                    </div>
                  </div>
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {template.isPopular && (
                      <Badge className="bg-red-500 text-white text-xs font-bold">
                        🔥 Popular
                      </Badge>
                    )}
                    {template.atsScore && (
                      <Badge className="bg-blue-100 text-blue-700 text-xs font-semibold">
                        ATS {template.atsScore}%
                      </Badge>
                    )}
                  </div>

                  {/* Tier Badge */}
                  <div className="absolute top-2 right-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge className={cn("text-xs", getTierColor(template.tier))}>
                            {getTierIcon(template.tier)}
                            {template.tier}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Available in {template.tier} tier</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  {/* Select Button */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <Button
                      variant={selectedTemplate === template.id ? "default" : "secondary"}
                      size="sm"
                      className={cn(
                        "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                        selectedTemplate === template.id && "opacity-100"
                      )}
                    >
                      {selectedTemplate === template.id ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Selected
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-2" />
                          Select
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Template Info */}
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2">{template.name}</CardTitle>
                  <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.features.slice(0, 3).map(feature => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {template.features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.features.length - 3} more
                      </Badge>
                    )}
                  </div>

                  {/* Industry Specific */}
                  {template.industrySpecific && template.industrySpecific.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Perfect for:</p>
                      <div className="flex flex-wrap gap-1">
                        {template.industrySpecific.map(industry => (
                          <Badge key={industry} variant="secondary" className="text-xs">
                            {industry}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Select Button */}
                  <Button
                    onClick={() => handleTemplateSelect(template)}
                    className={cn(
                      "w-full group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600",
                      selectedTemplate === template.id && "bg-gradient-to-r from-blue-600 to-purple-600"
                    )}
                    variant={template.isPopular ? "default" : "outline"}
                  >
                    {selectedTemplate === template.id ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Selected
                      </>
                    ) : template.isPopular ? (
                      'Use Most Popular'
                    ) : (
                      'Use This Template'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        // List View
        <div className="space-y-4">
          {filteredTemplates.map(template => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card 
                className={cn(
                  "group hover:shadow-md transition-all duration-300 cursor-pointer",
                  selectedTemplate === template.id && "ring-2 ring-blue-500"
                )}
                onClick={() => handleTemplateSelect(template)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    {/* Template Preview */}
                    <div className="w-24 h-32 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl mb-1">📄</div>
                        <div className="text-xs text-gray-600">{template.name}</div>
                      </div>
                    </div>

                    {/* Template Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{template.name}</h3>
                        {template.isPopular && (
                          <Badge className="bg-red-500 text-white text-xs">
                            🔥 Popular
                          </Badge>
                        )}
                        <Badge className={cn("text-xs", getTierColor(template.tier))}>
                          {getTierIcon(template.tier)}
                          {template.tier}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{template.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {template.features.slice(0, 4).map(feature => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>

                      {template.atsScore && (
                        <p className="text-sm text-gray-500">
                          ATS Score: <span className="font-semibold text-blue-600">{template.atsScore}%</span>
                        </p>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => handleTemplateSelect(template)}
                        variant={selectedTemplate === template.id ? "default" : "outline"}
                        size="sm"
                      >
                        {selectedTemplate === template.id ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Selected
                          </>
                        ) : (
                          'Select'
                        )}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewTemplate(template);
                          setEnlargePreview(true);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Template Count */}
      <div className="text-center mt-8 text-gray-500">
        Showing {filteredTemplates.length} of {cvTemplates.length} templates
        {selectedCategory !== 'all' && ` in ${selectedCategory} category`}
      </div>

      {/* Preview Modal */}
      <Dialog open={enlargePreview} onOpenChange={setEnlargePreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Template Preview: {previewTemplate?.name}</DialogTitle>
          </DialogHeader>
          {previewTemplate && (
            <div className="space-y-4">
              <CVTemplatePreview template={previewTemplate} />
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <h3 className="font-semibold">{previewTemplate.name}</h3>
                  <p className="text-sm text-gray-600">{previewTemplate.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {previewTemplate.features.map(feature => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button
                  onClick={() => {
                    handleTemplateSelect(previewTemplate);
                    setEnlargePreview(false);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  Use This Template
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}; 