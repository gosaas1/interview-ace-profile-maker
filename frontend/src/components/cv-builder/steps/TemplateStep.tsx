import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { CVTemplate, cvTemplates } from '@/data/cvTemplates';
import { CVTemplatePreview } from '@/components/cv/CVTemplatePreview';
import { cn } from '@/lib/utils';

interface TemplateStepProps {
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
  onNext: () => void;
  onPrev: () => void;
  userTier: 'free' | 'starter' | 'professional' | 'careerPro' | 'eliteExecutive';
  isFirst?: boolean;
}

const TEMPLATES_PER_PAGE = 4;

export const TemplateStep: React.FC<TemplateStepProps> = ({
  selectedTemplate,
  onTemplateSelect,
  onNext,
  onPrev,
  userTier,
  isFirst = false
}) => {
  // Filter templates by user tier
  const availableTemplates = cvTemplates.filter(t => {
    const tiers = ['free', 'starter', 'professional', 'careerPro', 'eliteExecutive'];
    return tiers.indexOf(t.tier) <= tiers.indexOf(userTier);
  });
  const [page, setPage] = useState(0);
  const [showSample, setShowSample] = useState(true);
  const maxPage = Math.ceil(availableTemplates.length / TEMPLATES_PER_PAGE) - 1;

  const pagedTemplates = availableTemplates.slice(
    page * TEMPLATES_PER_PAGE,
    (page + 1) * TEMPLATES_PER_PAGE
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card className="bg-white/50 backdrop-blur-md border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle>Choose Your CV Template</CardTitle>
          <p className="text-gray-600 text-sm">
            Select a template to see a live preview. Only templates available for your tier are shown.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} variant="outline" aria-label="Previous templates">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1 flex justify-center gap-4">
              {pagedTemplates.map(template => (
                <div key={template.id} className="relative group w-56">
                  <button
                    className={cn(
                      'absolute top-2 right-2 z-10 px-2 py-1 rounded text-xs font-semibold',
                      selectedTemplate === template.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700',
                      'focus:outline-none focus:ring-2 focus:ring-blue-500'
                    )}
                    onClick={() => onTemplateSelect(template.id)}
                    aria-label={`Select ${template.name}`}
                  >
                    {selectedTemplate === template.id ? 'Selected' : 'Select'}
                  </button>
                  <div className={cn(
                    'rounded-lg border-2 transition-all duration-300',
                    selectedTemplate === template.id ? 'border-blue-500 shadow-lg' : 'border-white/30 hover:border-blue-300'
                  )}
                    tabIndex={0}
                    role="button"
                    aria-pressed={selectedTemplate === template.id}
                    onClick={() => onTemplateSelect(template.id)}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onTemplateSelect(template.id); }}
                  >
                    <CVTemplatePreview template={template} exampleCV={showSample ? undefined : null} />
                  </div>
                  <div className="mt-2 text-center">
                    <span className="font-semibold text-gray-900">{template.name}</span>
                    <p className="text-xs text-gray-600">{template.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={() => setPage(p => Math.min(maxPage, p + 1))} disabled={page === maxPage} variant="outline" aria-label="Next templates">
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              id="show-sample"
              checked={showSample}
              onChange={e => setShowSample(e.target.checked)}
              className="form-checkbox"
            />
            <label htmlFor="show-sample" className="text-sm text-gray-700 cursor-pointer">Show Example Data</label>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-between">
        {!isFirst && (
          <Button onClick={onPrev} variant="outline" className="bg-white/50 hover:bg-white/80">
            <ArrowLeft className="w-4 h-4 mr-2" /> Previous
          </Button>
        )}
        <div className={isFirst ? "w-full flex justify-end" : ""}>
          <Button onClick={onNext} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            {isFirst ? 'Start Building CV' : 'Next: Fill Details'} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}; 