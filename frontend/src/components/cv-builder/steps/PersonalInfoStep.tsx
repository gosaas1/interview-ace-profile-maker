import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, MapPin, Linkedin, Globe, ArrowRight } from 'lucide-react';
import { CVFormData } from '../CVBuilderModern';

interface PersonalInfoStepProps {
  formData: CVFormData;
  updateFormData: (updates: Partial<CVFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  formData,
  updateFormData,
  onNext,
  isFirst,
  isLast
}) => {
  const handleInputChange = (field: keyof CVFormData, value: string) => {
    updateFormData({ [field]: value });
  };

  const isValid = formData.full_name.trim() && formData.email.trim() && formData.summary.trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card className="bg-white/50 backdrop-blur-md border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5 text-blue-600" />
            <span>Personal Information</span>
          </CardTitle>
          <p className="text-gray-600">
            Tell us about yourself. This information will appear at the top of your CV.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Name and Job Title */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <User className="w-4 h-4 mr-1" />
                Full Name *
              </label>
              <Input
                placeholder="John Doe"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                className="bg-white/70 border-white/30 focus:bg-white transition-all duration-200"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Job Title
              </label>
              <Input
                placeholder="Senior Software Engineer"
                value={formData.job_title}
                onChange={(e) => handleInputChange('job_title', e.target.value)}
                className="bg-white/70 border-white/30 focus:bg-white transition-all duration-200"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                Email *
              </label>
              <Input
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-white/70 border-white/30 focus:bg-white transition-all duration-200"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Phone className="w-4 h-4 mr-1" />
                Phone
              </label>
              <Input
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="bg-white/70 border-white/30 focus:bg-white transition-all duration-200"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              Location
            </label>
            <Input
              placeholder="San Francisco, CA"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="bg-white/70 border-white/30 focus:bg-white transition-all duration-200"
            />
          </div>

          {/* Online Presence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Linkedin className="w-4 h-4 mr-1" />
                LinkedIn URL
              </label>
              <Input
                placeholder="https://linkedin.com/in/johndoe"
                value={formData.linkedin_url}
                onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                className="bg-white/70 border-white/30 focus:bg-white transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Globe className="w-4 h-4 mr-1" />
                Portfolio/Website
              </label>
              <Input
                placeholder="https://johndoe.dev"
                value={formData.portfolio_url}
                onChange={(e) => handleInputChange('portfolio_url', e.target.value)}
                className="bg-white/70 border-white/30 focus:bg-white transition-all duration-200"
              />
            </div>
          </div>

          {/* Professional Summary */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Professional Summary *
            </label>
            <Textarea
              placeholder="Write a brief summary of your professional background, key achievements, and career objectives..."
              value={formData.summary}
              onChange={(e) => handleInputChange('summary', e.target.value)}
              rows={4}
              className="bg-white/70 border-white/30 focus:bg-white transition-all duration-200 resize-none"
              required
            />
            <p className="text-xs text-gray-500">
              Tip: Keep it concise (2-3 sentences) and highlight your most relevant experience and goals.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <div>
          {/* Empty div to push Next button to the right */}
        </div>
        <Button
          onClick={onNext}
          disabled={!isValid}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50"
        >
          Next: Work Experience
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}; 