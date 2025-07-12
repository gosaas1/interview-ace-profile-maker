import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Briefcase, Plus, X, ArrowLeft, ArrowRight, Building, Calendar } from 'lucide-react';
import { CVFormData } from '../CVBuilderModern';

interface ExperienceStepProps {
  formData: CVFormData;
  updateFormData: (updates: Partial<CVFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export const ExperienceStep: React.FC<ExperienceStepProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrev,
  isFirst
}) => {
  const handleExperienceChange = (index: number, field: string, value: string) => {
    const updatedExperiences = formData.experiences.map((exp, i) =>
      i === index ? { ...exp, [field]: value } : exp
    );
    updateFormData({ experiences: updatedExperiences });
  };

  const addExperience = () => {
    updateFormData({
      experiences: [
        ...formData.experiences,
        { company: '', role: '', duration: '', description: '' }
      ]
    });
  };

  const removeExperience = (index: number) => {
    if (formData.experiences.length > 1) {
      const updatedExperiences = formData.experiences.filter((_, i) => i !== index);
      updateFormData({ experiences: updatedExperiences });
    }
  };

  const isValid = formData.experiences.some(exp => 
    exp.company.trim() && exp.role.trim() && exp.duration.trim() && exp.description.trim()
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <div>
                <CardTitle>Work Experience</CardTitle>
                <p className="text-gray-600 text-sm">
                  Add your work history, starting with your most recent position.
                </p>
              </div>
            </div>
            <Button
              onClick={addExperience}
              variant="outline"
              size="sm"
              className="bg-white/50 hover:bg-white/80"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Experience
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <AnimatePresence>
            {formData.experiences.map((experience, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <Card className="bg-white/30 border-white/30 relative">
                  <CardContent className="p-4 space-y-4">
                    {/* Remove Button */}
                    {formData.experiences.length > 1 && (
                      <Button
                        onClick={() => removeExperience(index)}
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}

                    {/* Company and Role */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                          <Building className="w-4 h-4 mr-1" />
                          Company *
                        </label>
                        <Input
                          placeholder="Apple Inc."
                          value={experience.company}
                          onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                          className="bg-white/70 border-white/30 focus:bg-white transition-all duration-200"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                          <Briefcase className="w-4 h-4 mr-1" />
                          Role/Position *
                        </label>
                        <Input
                          placeholder="Senior Software Engineer"
                          value={experience.role}
                          onChange={(e) => handleExperienceChange(index, 'role', e.target.value)}
                          className="bg-white/70 border-white/30 focus:bg-white transition-all duration-200"
                          required
                        />
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Duration *
                      </label>
                      <Input
                        placeholder="Jan 2020 - Present"
                        value={experience.duration}
                        onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                        className="bg-white/70 border-white/30 focus:bg-white transition-all duration-200"
                        required
                      />
                      <p className="text-xs text-gray-500">
                        Examples: "Jan 2020 - Present", "Mar 2018 - Dec 2019", "2017 - 2019"
                      </p>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Job Description *
                      </label>
                      <Textarea
                        placeholder="Describe your responsibilities, achievements, and key contributions. Use action verbs and quantify your impact where possible..."
                        value={experience.description}
                        onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                        rows={4}
                        className="bg-white/70 border-white/30 focus:bg-white transition-all duration-200 resize-none"
                        required
                      />
                      <p className="text-xs text-gray-500">
                        Tip: Start with action verbs (Led, Developed, Managed) and include specific achievements with numbers when possible.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Navigation */}
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
          disabled={!isValid}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50"
        >
          Next: Education
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}; 