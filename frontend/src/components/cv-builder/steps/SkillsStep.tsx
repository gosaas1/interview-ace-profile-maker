import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Code, ArrowLeft, ArrowRight } from 'lucide-react';
import { CVFormData } from '../CVBuilderModern';

interface SkillsStepProps {
  formData: CVFormData;
  updateFormData: (updates: Partial<CVFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export const SkillsStep: React.FC<SkillsStepProps> = ({
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
            <Code className="w-5 h-5 text-blue-600" />
            <div>
              <CardTitle>Skills</CardTitle>
              <p className="text-gray-600 text-sm">
                List your technical skills, soft skills, and competencies.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Skills & Competencies
            </label>
            <Textarea
              placeholder="JavaScript, TypeScript, React, Node.js, Python, AWS, Docker, PostgreSQL, MongoDB, Git, Agile, Scrum, Team Leadership, Code Review, System Design"
              value={formData.skills}
              onChange={(e) => updateFormData({ skills: e.target.value })}
              rows={6}
              className="bg-white/70 border-white/30 focus:bg-white transition-all duration-200 resize-none"
            />
            <p className="text-xs text-gray-500">
              Tip: Separate skills with commas. Include both technical and soft skills relevant to your target role.
            </p>
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
          Next: Projects
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}; 