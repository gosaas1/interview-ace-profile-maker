import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cvTemplates, CVTemplate } from '@/data/cvTemplates';
import CVPreview from '@/components/cv-builder/CVPreview';
import { CVData } from '@/pages/CVBuilder';

interface CVTemplateSelectorProps {
  onSelectTemplate: (template: CVTemplate) => void;
}

const CVTemplateSelector: React.FC<CVTemplateSelectorProps> = ({ onSelectTemplate }) => {
  // Get unique categories from the template data
  const categories = Array.from(new Set(cvTemplates.map(t => t.category)));
  const [activeTab, setActiveTab] = React.useState(categories[0]);
  const [activeTemplate, setActiveTemplate] = React.useState(cvTemplates[0]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1">
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your CV Template
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select from our collection of 20+ most popular, professionally designed templates. All templates are optimized for Applicant Tracking Systems (ATS) to ensure your CV gets noticed.
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <Badge variant="outline">ATS Optimized</Badge>
              <Badge variant="outline">Industry Specific</Badge>
              <Badge variant="outline">Most Popular</Badge>
            </div>
          </div>

          {/* Tabs for categories */}
          <div className="flex justify-center gap-2 mt-8 mb-4">
            {categories.map(category => (
              <button
                key={category}
                className={`px-4 py-2 rounded-t-lg font-semibold text-base focus:outline-none ${activeTab === category ? 'bg-white border-b-2 border-blue-600 text-blue-700' : 'bg-gray-100 text-gray-500'}`}
                onClick={() => setActiveTab(category)}
              >
                {category} ({cvTemplates.filter(t => t.category === category).length})
              </button>
            ))}
          </div>

          {/* Template cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cvTemplates
              .filter(template => template.category === activeTab)
              .map(template => (
                <Card
                  key={template.id}
                  className={`group hover:shadow-lg transition-shadow cursor-pointer relative ${activeTemplate.id === template.id ? 'ring-2 ring-blue-500' : ''}`}
                  onMouseEnter={() => setActiveTemplate(template)}
                  onClick={() => onSelectTemplate(template)}
                >
                  <CardHeader className="p-0">
                    <div className="relative">
                      {/* Template Preview Placeholder */}
                      <div className="aspect-[3/4] w-full bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200 rounded-t-lg flex items-center justify-center">
                        <div className="text-center p-4">
                          <div className="text-4xl mb-2">📄</div>
                          <div className="text-sm font-medium text-gray-700">{template.name}</div>
                          <div className="text-xs text-gray-500 mt-1">{template.colorScheme} • {template.fontFamily}</div>
                        </div>
                      </div>
                      {template.isPopular && (
                        <Badge className="absolute top-2 left-2 bg-red-500 text-white font-bold">
                          🔥 Most Popular
                        </Badge>
                      )}
                      {template.atsScore && (
                        <Badge className="absolute top-2 right-2 bg-blue-100 text-blue-700 font-semibold">
                          ATS {template.atsScore}%
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-lg mb-2">{template.name}</CardTitle>
                    <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {template.badges.map(badge => (
                        <Badge key={badge} variant="outline">{badge}</Badge>
                      ))}
                    </div>
                    <Button
                      onClick={() => onSelectTemplate(template)}
                      className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600"
                      variant={template.isPopular ? "default" : "outline"}
                    >
                      {template.isPopular ? 'Use Most Popular' : 'Use This Template'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVTemplateSelector;
