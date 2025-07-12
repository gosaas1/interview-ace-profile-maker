import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Award, ArrowLeft, ArrowRight } from 'lucide-react';
import { CVFormData } from '../CVBuilderModern';

interface CertificationsStepProps {
  formData: CVFormData;
  updateFormData: (updates: Partial<CVFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export const CertificationsStep: React.FC<CertificationsStepProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrev
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card className="bg-white/50 backdrop-blur-md border-white/20 shadow-xl">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-blue-600" />
            <div>
              <CardTitle>Certifications</CardTitle>
              <p className="text-gray-600 text-sm">
                List your certifications, licenses, and professional qualifications.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Certifications & Licenses
            </label>
            <Textarea
              placeholder="AWS Certified Solutions Architect, Google Cloud Professional Developer, Certified Scrum Master (CSM)"
              value={formData.certifications}
              onChange={(e) => updateFormData({ certifications: e.target.value })}
              rows={4}
              className="bg-white/70 border-white/30 focus:bg-white transition-all duration-200 resize-none"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          onClick={onPrev}
          variant="outline"
          className="bg-white/50 hover:bg-white/80"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button
          onClick={onNext}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          Next: References
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}; 