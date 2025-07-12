import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, ArrowLeft, ArrowRight } from 'lucide-react';
import { CVFormData } from '../CVBuilderModern';

interface ReferencesStepProps {
  formData: CVFormData;
  updateFormData: (updates: Partial<CVFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export const ReferencesStep: React.FC<ReferencesStepProps> = ({
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
            <Users className="w-5 h-5 text-blue-600" />
            <div>
              <CardTitle>References</CardTitle>
              <p className="text-gray-600 text-sm">
                Add professional references who can vouch for your work.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            References section - Coming soon
          </p>
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
          Next: Choose Template
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}; 