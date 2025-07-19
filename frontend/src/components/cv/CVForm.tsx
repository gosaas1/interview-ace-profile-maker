import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PersonalInfoForm from './forms/PersonalInfoForm';
import ExperienceForm from './forms/ExperienceForm';
import EducationForm from './forms/EducationForm';
import SkillsForm from './forms/SkillsForm';
import CertificationsForm from './forms/CertificationsForm';
import { CVData } from '@/lib/supabase';
import { normalizeCVData } from '@/lib/cv/normalize';

interface CVFormProps {
  cvData: CVData;
  onDataChange: (data: CVData) => void;
}

const CVForm: React.FC<CVFormProps> = ({ cvData, onDataChange }) => {
  const updatePersonalInfo = (personalInfo: {
    full_name: string;
    job_title?: string;
    email: string;
    phone: string;
    location: string;
    linkedin_url?: string;
    portfolio_url?: string;
    summary: string;
  }) => {
    onDataChange(normalizeCVData({ ...cvData, personal_info: personalInfo }));
  };

  const updateExperience = (experience: Array<{
    company: string;
    role: string;
    duration: string;
    description: string;
  }>) => {
    onDataChange(normalizeCVData({ ...cvData, experiences: experience }));
  };

  const updateEducation = (education: Array<{
    institution: string;
    degree: string;
    year: string;
    gpa: string;
  }>) => {
    onDataChange(normalizeCVData({ ...cvData, education }));
  };

  const updateSkills = (skills: string[]) => {
    onDataChange(normalizeCVData({ ...cvData, skills: skills.join(', ') }));
  };

  const updateCertifications = (certifications: string) => {
    onDataChange(normalizeCVData({ ...cvData, certifications }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
            <span>Personal Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PersonalInfoForm
            data={{
              full_name: cvData.personal_info.full_name,
              job_title: cvData.personal_info.job_title,
              email: cvData.personal_info.email,
              phone: cvData.personal_info.phone,
              location: cvData.personal_info.location,
              linkedin_url: cvData.personal_info.linkedin_url,
              portfolio_url: cvData.personal_info.portfolio_url,
              summary: cvData.personal_info.summary
            }}
            onChange={updatePersonalInfo}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
            <span>Work Experience</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ExperienceForm
            data={cvData.experiences}
            onChange={updateExperience}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
            <span>Education</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EducationForm
            data={cvData.education}
            onChange={updateEducation}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
            <span>Skills</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SkillsForm
            data={cvData.skills ? cvData.skills.split(',').map(s => s.trim()).filter(s => s) : []}
            onChange={updateSkills}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
            <span>Certifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CertificationsForm
            data={cvData.certifications}
            onChange={updateCertifications}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CVForm;
