import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Star, Check, Eye } from 'lucide-react';
import { cvTemplates, CVTemplate } from '@/data/cvTemplates';

interface CVTemplateSelectorProps {
  onTemplateSelect: (template: CVTemplate) => void;
  selectedTemplate?: CVTemplate;
}

const CVTemplateSelector: React.FC<CVTemplateSelectorProps> = ({
  onTemplateSelect,
  selectedTemplate
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [previewTemplate, setPreviewTemplate] = useState<CVTemplate | null>(null);
  const templatesPerPage = 6;

  // Show ALL templates, no tier filtering
  const availableTemplates = cvTemplates;
  const totalPages = Math.ceil(availableTemplates.length / templatesPerPage);
  const currentTemplates = availableTemplates.slice(
    currentPage * templatesPerPage,
    (currentPage + 1) * templatesPerPage
  );

  const handleTemplateClick = (template: CVTemplate) => {
    setPreviewTemplate(template);
  };

  const handleSelectTemplate = (template: CVTemplate) => {
    onTemplateSelect(template);
    setPreviewTemplate(null);
  };

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your CV Template</h2>
        <p className="text-gray-600">Select from {cvTemplates.length} professional templates designed for your industry</p>
      </div>

      {/* Template Grid with Live Previews */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cvTemplates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedTemplate?.id === template.id
                ? 'ring-2 ring-blue-500 bg-blue-50'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => handleTemplateClick(template)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {template.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600 mt-1">
                    {template.description}
                  </CardDescription>
                </div>
                {template.isPopular && (
                  <Star className="h-5 w-5 text-amber-500 fill-current" />
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Template Preview Placeholder */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 border rounded-lg p-4 mb-3 h-48 flex items-center justify-center relative">
                <div className="absolute top-2 left-2 z-10">
                  <Badge variant="secondary" className="text-xs">
                    {template.layout} layout
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">📄</div>
                  <div className="text-sm font-medium text-gray-700">{template.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{template.colorScheme} • {template.fontFamily}</div>
                </div>
              </div>
              
              {/* Features */}
              {template.features && template.features.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {template.features.slice(0, 2).map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {template.features.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{template.features.length - 2} more
                    </Badge>
                  )}
                </div>
              )}

              {/* Action Button */}
              <Button
                className="w-full"
                variant={selectedTemplate?.id === template.id ? "default" : "outline"}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectTemplate(template);
                }}
              >
                {selectedTemplate?.id === template.id ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Selected
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Use This Template
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Large Live Preview */}
      <div className="space-y-4 mt-12">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">Template Preview</h3>
          {previewTemplate && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSelectTemplate(previewTemplate)}
            >
              Use This Template
            </Button>
          )}
        </div>
        <div className="bg-gray-100 rounded-lg p-6 min-h-[800px] overflow-auto">
          {previewTemplate ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{previewTemplate.name}</h3>
                <p className="text-gray-600 mb-4">{previewTemplate.description}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline">{previewTemplate.colorScheme}</Badge>
                  <Badge variant="outline">{previewTemplate.fontFamily}</Badge>
                  <Badge variant="outline">{previewTemplate.layout}</Badge>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4"></div>
                <p>Click on a template to see details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CVTemplateSelector;
