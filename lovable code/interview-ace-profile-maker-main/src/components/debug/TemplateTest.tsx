import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cvTemplates, templateCategories, type CVTemplate } from '@/data/cvTemplates';
import { CVTemplatePreview } from '@/components/cv/CVTemplatePreview';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grid, List, Filter, Check, Star, Lock } from 'lucide-react';

export const TemplateTest: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter templates by category
  const filteredTemplates = selectedCategory === 'all' 
    ? cvTemplates 
    : cvTemplates.filter(template => template.category === selectedCategory);

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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Template Test - All 30 Templates</h1>
        <p className="text-muted-foreground">
          Testing all {cvTemplates.length} templates from the top 30 CV templates for 2025
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{cvTemplates.length}</div>
            <div className="text-sm text-muted-foreground">Total Templates</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {cvTemplates.filter(t => t.tier === 'free').length}
            </div>
            <div className="text-sm text-muted-foreground">Free Templates</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {cvTemplates.filter(t => t.tier === 'starter').length}
            </div>
            <div className="text-sm text-muted-foreground">Starter Templates</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {cvTemplates.filter(t => t.tier === 'professional').length}
            </div>
            <div className="text-sm text-muted-foreground">Professional Templates</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {cvTemplates.filter(t => ['career-pro', 'elite'].includes(t.tier)).length}
            </div>
            <div className="text-sm text-muted-foreground">Premium Templates</div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Template Browser</h2>
          <p className="text-sm text-muted-foreground">
            {filteredTemplates.length} templates in {selectedCategory === 'all' ? 'all categories' : selectedCategory}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {templateCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Template Grid/List */}
        <div className="flex-1">
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" 
            : "space-y-3"
          }>
            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-gray-300"
                onClick={() => setSelectedTemplate(template)}
              >
                <CardContent className={`p-4 ${viewMode === 'list' ? 'flex items-center gap-4' : ''}`}>
                  {viewMode === 'list' ? (
                    <>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-base">{template.name}</h4>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getTierBadgeColor(template.tier)}`}
                          >
                            {getTierDisplayName(template.tier)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {template.features.slice(0, 2).map((feature, i) => (
                            <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {feature}
                            </span>
                          ))}
                          {template.features.length > 2 && (
                            <span className="text-xs text-muted-foreground">
                              +{template.features.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Button size="sm" variant="outline">
                          Preview
                        </Button>
                        {template.isPopular && (
                          <Badge variant="secondary" className="text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-base">{template.name}</h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getTierBadgeColor(template.tier)}`}
                        >
                          {getTierDisplayName(template.tier)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{template.description}</p>
                      <div className="space-y-1 mb-3">
                        {template.features.slice(0, 3).map((feature, i) => (
                          <div key={i} className="flex items-center gap-1 text-xs text-green-700">
                            <Check className="h-3 w-3" />
                            <span>{feature}</span>
                          </div>
                        ))}
                        {template.features.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            +{template.features.length - 3} more features
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <Button size="sm" variant="outline" className="flex-1">
                          Preview
                        </Button>
                        {template.isPopular && (
                          <Badge variant="secondary" className="text-xs ml-2">
                            <Star className="h-3 w-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                <Filter className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No templates found</p>
                <p className="text-sm">Try selecting a different category.</p>
              </div>
            </div>
          )}
        </div>

        {/* Preview Panel */}
        <div className="lg:w-80">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Template Preview</CardTitle>
              <CardDescription>See how the selected template looks</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedTemplate ? (
                <CVTemplatePreview template={selectedTemplate} className="w-full h-[400px]" />
              ) : (
                <div className="flex items-center justify-center w-full h-[400px] text-muted-foreground border rounded-lg bg-gray-50">
                  <div className="text-center">
                    <Grid className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="font-medium">Select a template to preview</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 