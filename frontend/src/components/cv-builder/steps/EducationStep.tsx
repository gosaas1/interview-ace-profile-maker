import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GraduationCap, Plus, X, ArrowLeft, ArrowRight, School, Calendar } from 'lucide-react';
import { CVFormData } from '../CVBuilderModern';

interface EducationStepProps {
  formData: CVFormData;
  updateFormData: (updates: Partial<CVFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export const EducationStep: React.FC<EducationStepProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrev
}) => {
  const handleEducationChange = (index: number, field: string, value: string) => {
    const updatedEducation = formData.education.map((edu, i) =>
      i === index ? { ...edu, [field]: value } : edu
    );
    updateFormData({ education: updatedEducation });
  };

  const addEducation = () => {
    updateFormData({
      education: [
        ...formData.education,
        { institution: '', degree: '', year: '', gpa: '' }
      ]
    });
  };

  const removeEducation = (index: number) => {
    if (formData.education.length > 1) {
      const updatedEducation = formData.education.filter((_, i) => i !== index);
      updateFormData({ education: updatedEducation });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card className="bg-white/50 backdrop-blur-md border-white/20 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <div>
                <CardTitle>Education</CardTitle>
                <p className="text-gray-600 text-sm">
                  Add your educational background, starting with the most recent.
                </p>
              </div>
            </div>
            <Button
              onClick={addEducation}
              variant="outline"
              size="sm"
              className="bg-white/50 hover:bg-white/80"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Education
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {formData.education.map((education, index) => (
            <Card key={index} className="bg-white/30 border-white/30 relative">
              <CardContent className="p-4 space-y-4">
                {formData.education.length > 1 && (
                  <Button
                    onClick={() => removeEducation(index)}
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <School className="w-4 h-4 mr-1" />
                      Institution
                    </label>
                    <Input
                      placeholder="University of California, Berkeley"
                      value={education.institution}
                      onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                      className="bg-white/70 border-white/30 focus:bg-white transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Degree
                    </label>
                    <Input
                      placeholder="Bachelor of Science in Computer Science"
                      value={education.degree}
                      onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                      className="bg-white/70 border-white/30 focus:bg-white transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Year
                    </label>
                    <Input
                      placeholder="2018"
                      value={education.year}
                      onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                      className="bg-white/70 border-white/30 focus:bg-white transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      GPA (Optional)
                    </label>
                    <Input
                      placeholder="3.8"
                      value={education.gpa}
                      onChange={(e) => handleEducationChange(index, 'gpa', e.target.value)}
                      className="bg-white/70 border-white/30 focus:bg-white transition-all duration-200"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
          Next: Skills
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}; 