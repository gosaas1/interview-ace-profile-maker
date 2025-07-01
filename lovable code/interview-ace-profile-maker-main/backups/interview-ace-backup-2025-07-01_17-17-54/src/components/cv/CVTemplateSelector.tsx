import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Star, Lock, Info, Grid, List, Filter, AlertCircle, Crown, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { cvTemplates, getTemplatesByTier, templateCategories, type CVTemplate } from '@/data/cvTemplates';
import { CVTemplatePreview } from './CVTemplatePreview';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSwipeable } from 'react-swipeable';
import { AnimatePresence, motion } from 'framer-motion';

interface CVTemplateSelectorProps {
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
  userTier?: string;
}

// Example full CV data for preview
const exampleCV = {
  full_name: 'John Doe',
  job_title: 'Software Engineer',
  email: 'john.doe@email.com',
  phone: '(555) 123-4567',
  location: 'London, UK',
  summary: 'Experienced software engineer with 5+ years developing web applications, leading teams, and delivering high-quality products. Passionate about clean code and modern UI/UX.',
  experience: [
    {
      title: 'Senior Developer',
      company: 'Tech Corp',
      start_date: '2020',
      end_date: 'Present',
      description: 'Led a team of 6 engineers to build scalable SaaS products. Improved performance by 30%.'
    },
    {
      title: 'Developer',
      company: 'Startup Inc',
      start_date: '2018',
      end_date: '2020',
      description: 'Built core features for a fast-growing startup. Automated deployment and testing.'
    }
  ],
  education: [
    {
      degree: 'BSc Computer Science',
      institution: 'University of Technology',
      year: '2018'
    }
  ],
  skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'TypeScript', 'UI/UX'],
};

export const CVTemplateSelector: React.FC<CVTemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateSelect,
  userTier = 'free'
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [previewTemplate, setPreviewTemplate] = useState<CVTemplate | null>(null);
  const [enlargePreview, setEnlargePreview] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);

  // Show ALL templates for testing/development
  const filteredTemplates = selectedCategory === 'all' 
    ? cvTemplates 
    : cvTemplates.filter(template => template.category === selectedCategory);

  const currentTemplate = filteredTemplates[currentIndex];

  // Template categories
  const templateCategoriesList = [
    { id: 'all', name: 'All Templates' },
    { id: 'professional', name: 'Professional' },
    { id: 'creative', name: 'Creative' },
    { id: 'modern', name: 'Modern' },
    { id: 'classic', name: 'Classic' },
    { id: 'minimalist', name: 'Minimalist' },
    { id: 'executive', name: 'Executive' },
    { id: 'basic', name: 'Basic' },
    { id: 'business', name: 'Business' },
    { id: 'tech', name: 'Tech' },
    { id: 'academic', name: 'Academic' },
    { id: 'healthcare', name: 'Healthcare' }
  ];

  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          navigateToPrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          navigateToNext();
          break;
        case 'Home':
          event.preventDefault();
          setCurrentIndex(0);
          break;
        case 'End':
          event.preventDefault();
          setCurrentIndex(filteredTemplates.length - 1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [filteredTemplates.length]);

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => navigateToNext(),
    onSwipedRight: () => navigateToPrevious(),
    trackMouse: true
  });

  const navigateToNext = () => {
    if (isTransitioning || filteredTemplates.length <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => prev < filteredTemplates.length - 1 ? prev + 1 : 0);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const navigateToPrevious = () => {
    if (isTransitioning || filteredTemplates.length <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => prev > 0 ? prev - 1 : filteredTemplates.length - 1);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleTemplateSelect = (template: CVTemplate) => {
    onTemplateSelect(template.id);
    setPreviewTemplate(template);
  };

  const isTemplateAccessible = (template: CVTemplate) => {
    // All templates are accessible for testing
    return true;
  };

  const isHigherTier = (template: CVTemplate) => {
    const tierOrder = ['free', 'starter', 'professional', 'career-pro', 'elite'];
    const userTierIndex = tierOrder.indexOf(userTier);
    const templateTierIndex = tierOrder.indexOf(template.tier);
    return templateTierIndex > userTierIndex;
  };

  // Get optimal preview dimensions based on template layout type
  const getPreviewDimensions = (template: CVTemplate) => {
    switch (template.layout) {
      case 'two-column':
        return {
          width: '280px',
          height: '320px',
          scale: 'scale-95',
          containerClass: 'w-[280px] h-[320px]'
        };
      case 'creative':
        return {
          width: '260px',
          height: '340px',
          scale: 'scale-90',
          containerClass: 'w-[260px] h-[340px]'
        };
      case 'modern':
        return {
          width: '250px',
          height: '330px',
          scale: 'scale-95',
          containerClass: 'w-[250px] h-[330px]'
        };
      case 'classic':
        return {
          width: '240px',
          height: '320px',
          scale: 'scale-90',
          containerClass: 'w-[240px] h-[320px]'
        };
      case 'single-column':
      default:
        return {
          width: '240px',
          height: '320px',
          scale: 'scale-90',
          containerClass: 'w-[240px] h-[320px]'
        };
    }
  };

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'free': return 'bg-green-100 text-green-800 border-green-200';
      case 'starter': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'professional': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'career-pro': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'elite': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-500';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTierDisplayName = (tier: string) => {
    switch (tier) {
      case 'free': return 'Free';
      case 'starter': return 'Starter';
      case 'professional': return 'Professional';
      case 'career-pro': return 'Career Pro';
      case 'elite': return 'Elite';
      default: return tier;
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'free': return null;
      case 'starter': return <Zap className="h-3 w-3" />;
      case 'professional': return <Star className="h-3 w-3" />;
      case 'career-pro': return <Crown className="h-3 w-3" />;
      case 'elite': return <Crown className="h-3 w-3" />;
      default: return null;
    }
  };

  // Get layout icon
  const getLayoutIcon = (layout: string) => {
    switch (layout) {
      case 'single-column':
        return <div className="w-8 h-12 bg-blue-400 rounded-sm shadow-sm" />;
      case 'two-column':
        return (
          <div className="flex gap-1">
            <div className="w-3 h-12 bg-purple-400 rounded-sm shadow-sm" />
            <div className="w-3 h-12 bg-purple-400 rounded-sm shadow-sm" />
          </div>
        );
      case 'modern':
        return <div className="w-10 h-10 bg-emerald-400 rounded-lg shadow-sm" />;
      case 'classic':
        return <div className="w-8 h-12 bg-amber-400 rounded-none shadow-sm" />;
      case 'creative':
        return <div className="w-8 h-8 bg-rose-400 rounded-full shadow-sm" />;
      default:
        return <div className="w-8 h-12 bg-gray-400 rounded-sm shadow-sm" />;
    }
  };

  // Get layout display name
  const getLayoutDisplayName = (layout: string) => {
    switch (layout) {
      case 'single-column': return 'Single Column';
      case 'two-column': return 'Two Column';
      case 'modern': return 'Modern';
      case 'classic': return 'Classic';
      case 'creative': return 'Creative';
      default: return layout;
    }
  };

  // Don't render if no templates
  if (filteredTemplates.length === 0) {
    return (
      <div className="space-y-6">
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            No templates found for this category.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Get preview dimensions for current template
  const previewDimensions = currentTemplate ? getPreviewDimensions(currentTemplate) : getPreviewDimensions({ layout: 'single-column' } as CVTemplate);

  return (
    <TooltipProvider>
      <div className="space-y-6" ref={containerRef} tabIndex={0} role="region" aria-label="Template selector">
        {/* Development Notes Alert */}
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Development Mode:</strong> All templates are currently unlocked for testing. 
            Higher tier templates show lock indicators but remain accessible.
          </AlertDescription>
        </Alert>

        {/* Template Selection Area */}
        <div className="space-y-4">
          {/* Header with controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold">Choose Template</h3>
              <p className="text-sm text-muted-foreground">
                {filteredTemplates.length} templates available • {currentTemplate ? getLayoutDisplayName(currentTemplate.layout) : ''} layout
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {templateCategoriesList.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Template Card with Swipe Support */}
          <div className="flex flex-col items-center justify-center gap-4">
            <div 
              {...swipeHandlers}
              className="w-full flex justify-center relative"
              role="group"
              aria-label={`Template ${currentIndex + 1} of ${filteredTemplates.length}`}
            >
              {/* Navigation Arrows - Desktop, attached to card */}
              <Button
                variant="outline"
                size="sm"
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 pointer-events-auto shadow-lg bg-white/90 backdrop-blur-sm hover:bg-white"
                onClick={navigateToPrevious}
                disabled={filteredTemplates.length <= 1 || isTransitioning}
                aria-label="Previous template"
                style={{ marginLeft: '-20px' }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 pointer-events-auto shadow-lg bg-white/90 backdrop-blur-sm hover:bg-white"
                onClick={navigateToNext}
                disabled={filteredTemplates.length <= 1 || isTransitioning}
                aria-label="Next template"
                style={{ marginRight: '-20px' }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              {/* Template Card */}
              <AnimatePresence mode="wait">
                {currentTemplate && (
                  <motion.div
                    key={currentTemplate.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="w-full max-w-[500px] mx-auto"
                  >
                    <Card
                      className={`relative w-full cursor-pointer transition-all duration-200 hover:shadow-md border-2 mx-auto ${
                        selectedTemplate === currentTemplate.id
                          ? 'border-blue-500 ring-2 ring-blue-400 shadow-lg'
                          : 'border-transparent'
                      } ${isHigherTier(currentTemplate) ? 'ring-1 ring-orange-200' : ''}`}
                      style={{ minHeight: '480px' }}
                      onClick={() => handleTemplateSelect(currentTemplate)}
                      aria-selected={selectedTemplate === currentTemplate.id}
                      role="option"
                      tabIndex={0}
                    >
                      <CardContent className="p-4 flex flex-col justify-between h-full">
                        {/* Template Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-base">{currentTemplate.name}</h4>
                            {isHigherTier(currentTemplate) && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <Lock className="h-4 w-4 text-orange-500" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Higher tier template - {getTierDisplayName(currentTemplate.tier)}</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                          <Badge className={`text-xs ${getTierBadgeColor(currentTemplate.tier)}`}>
                            {getTierIcon(currentTemplate.tier)}
                            {getTierDisplayName(currentTemplate.tier)}
                          </Badge>
                        </div>

                        {/* Layout Badge */}
                        <div className="mb-3">
                          <Badge variant="outline" className="text-xs">
                            {getLayoutIcon(currentTemplate.layout)}
                            <span className="ml-1">{getLayoutDisplayName(currentTemplate.layout)}</span>
                          </Badge>
                        </div>

                        {/* Template Description */}
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {currentTemplate.description}
                        </p>

                        {/* Dynamic Template Preview with Layout-Specific Sizing */}
                        <div className="flex-1 mb-4 flex items-center justify-center">
                          <div
                            className={`flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${previewDimensions.containerClass}`}
                            onClick={e => {
                              e.stopPropagation();
                              setEnlargePreview(true);
                            }}
                            role="button"
                            tabIndex={0}
                            aria-label="Enlarge template preview"
                          >
                            <div className={`${previewDimensions.scale} transform-gpu transition-transform duration-200 hover:scale-105`}>
                              <CVTemplatePreview template={currentTemplate} exampleCV={exampleCV} className="w-full h-full" />
                            </div>
                          </div>
                        </div>

                        {/* Template Features */}
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {currentTemplate.features.slice(0, 2).map((feature, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {currentTemplate.features.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{currentTemplate.features.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="mt-auto">
                          {selectedTemplate === currentTemplate.id ? (
                            <Button variant="default" className="w-full" disabled>
                              <Check className="h-4 w-4 mr-2" />
                              Selected
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              className="w-full"
                              onClick={() => handleTemplateSelect(currentTemplate)}
                            >
                              Select Template
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation Controls - Mobile & Desktop */}
            <div className="flex items-center gap-4">
              {/* Mobile Navigation - Touch-friendly */}
              <div className="md:hidden flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={navigateToPrevious}
                  disabled={filteredTemplates.length <= 1 || isTransitioning}
                  aria-label="Previous template"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                {/* Progress Indicator */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {currentIndex + 1} of {filteredTemplates.length}
                  </span>
                  <div className="flex gap-1">
                    {filteredTemplates.length > 10 ? (
                      // For many templates, show current position indicator
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {Math.floor((currentIndex / filteredTemplates.length) * 100)}%
                      </span>
                    ) : (
                      // For fewer templates, show dots
                      filteredTemplates.slice(0, Math.min(10, filteredTemplates.length)).map((_, idx) => (
                        <div
                          key={idx}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            idx === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
                          }`}
                          role="button"
                          tabIndex={0}
                          onClick={() => setCurrentIndex(idx)}
                          aria-label={`Go to template ${idx + 1}`}
                        />
                      ))
                    )}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={navigateToNext}
                  disabled={filteredTemplates.length <= 1 || isTransitioning}
                  aria-label="Next template"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Desktop Progress Indicator */}
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {currentIndex + 1} of {filteredTemplates.length}
                </span>
                <div className="flex gap-1">
                  {filteredTemplates.length > 10 ? (
                    <>
                      {/* For many templates, show pagination controls */}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setCurrentIndex(0)}
                        disabled={currentIndex === 0}
                      >
                        First
                      </Button>
                      <div className="flex items-center gap-1 mx-2">
                        {[...Array(Math.min(5, filteredTemplates.length))].map((_, idx) => {
                          // Create a sliding window of page numbers
                          let pageNum;
                          if (filteredTemplates.length <= 5) {
                            pageNum = idx;
                          } else if (currentIndex < 3) {
                            pageNum = idx;
                          } else if (currentIndex > filteredTemplates.length - 4) {
                            pageNum = filteredTemplates.length - 5 + idx;
                          } else {
                            pageNum = currentIndex - 2 + idx;
                          }
                          
                          return (
                            <Button
                              key={idx}
                              variant={currentIndex === pageNum ? "default" : "outline"}
                              size="sm"
                              className="w-8 h-8 p-0"
                              onClick={() => setCurrentIndex(pageNum)}
                            >
                              {pageNum + 1}
                            </Button>
                          );
                        })}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setCurrentIndex(filteredTemplates.length - 1)}
                        disabled={currentIndex === filteredTemplates.length - 1}
                      >
                        Last
                      </Button>
                    </>
                  ) : (
                    // For fewer templates, show dots
                    filteredTemplates.map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${
                          idx === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                        role="button"
                        tabIndex={0}
                        onClick={() => setCurrentIndex(idx)}
                        aria-label={`Go to template ${idx + 1}`}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Swipe Instructions - Mobile */}
            <div className="md:hidden text-center">
              <p className="text-xs text-muted-foreground">
                💡 Swipe left or right to browse templates
              </p>
            </div>

            {/* Keyboard Instructions - Desktop */}
            <div className="hidden md:block text-center">
              <p className="text-xs text-muted-foreground">
                💡 Use arrow keys or click the arrows to navigate
              </p>
            </div>
          </div>
        </div>

        {/* Template Preview Modal */}
        <Dialog open={enlargePreview} onOpenChange={setEnlargePreview}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Template Preview: {currentTemplate?.name}</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center p-4">
              <div className="w-[400px] h-[560px] border border-gray-200 rounded-md shadow-md">
                {currentTemplate && (
                  <CVTemplatePreview template={currentTemplate} exampleCV={exampleCV} />
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}; 