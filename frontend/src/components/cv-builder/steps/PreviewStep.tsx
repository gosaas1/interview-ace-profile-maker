import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, ArrowLeft, Save, Download, CheckCircle } from 'lucide-react';
import { CVFormData } from '../CVBuilderModern';
import { CVData } from '@/lib/supabase';

interface PreviewStepProps {
  formData: CVFormData;
  updateFormData: (updates: Partial<CVFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
  cvData: CVData;
  templateId: string;
  onSave: () => void;
  loading: boolean;
}

export const PreviewStep: React.FC<PreviewStepProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrev,
  cvData,
  templateId,
  onSave,
  loading
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
            <Eye className="w-5 h-5 text-blue-600" />
            <div>
              <CardTitle>Preview & Finalize</CardTitle>
              <p className="text-gray-600 text-sm">
                Review your CV and make any final adjustments before saving.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* CV Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-200/50">
              <h4 className="font-medium text-blue-900 mb-1">Template</h4>
              <p className="text-sm text-blue-700">{templateId}</p>
            </div>
            <div className="bg-green-50/50 p-4 rounded-lg border border-green-200/50">
              <h4 className="font-medium text-green-900 mb-1">Sections</h4>
              <p className="text-sm text-green-700">
                {formData.experiences.length} Experience{formData.experiences.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="bg-purple-50/50 p-4 rounded-lg border border-purple-200/50">
              <h4 className="font-medium text-purple-900 mb-1">Completeness</h4>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-purple-700 mr-1" />
                <p className="text-sm text-purple-700">Ready to save</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={onSave}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save CV'}
            </Button>
            <Button
              variant="outline"
              className="bg-white/50 hover:bg-white/80"
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>

          {/* Tips */}
          <div className="bg-yellow-50/50 p-4 rounded-lg border border-yellow-200/50">
            <h4 className="font-medium text-yellow-900 mb-2">💡 Pro Tips:</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Review all sections for typos and formatting</li>
              <li>• Ensure your contact information is accurate</li>
              <li>• Tailor your CV for each job application</li>
              <li>• Keep it concise - aim for 1-2 pages</li>
            </ul>
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
          onClick={onSave}
          disabled={loading}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : 'Complete & Save'}
        </Button>
      </div>
    </motion.div>
  );
}; 