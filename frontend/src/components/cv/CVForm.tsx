import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PersonalInfoForm from './forms/PersonalInfoForm';
import ExperienceForm from './forms/ExperienceForm';
import EducationForm from './forms/EducationForm';
import SkillsForm from './forms/SkillsForm';
import CertificationsForm from './forms/CertificationsForm';
import { CVData } from '@/lib/cv/types';
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
    onDataChange(
      normalizeCVData({
        ...cvData,
        personalInfo: {
          fullName: personalInfo.full_name,
          jobTitle: personalInfo.job_title,
          email: personalInfo.email,
          phone: personalInfo.phone,
          location: personalInfo.location,
          linkedIn: personalInfo.linkedin_url,
          website: personalInfo.portfolio_url,
          summary: personalInfo.summary,
        },
      })
    );
  };

  const updateExperience = (experience: Array<{
    company: string;
    role: string;
    duration: string;
    description: string;
  }>) => {
    onDataChange(normalizeCVData({ ...cvData, experience }));
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
    onDataChange(
      normalizeCVData({
        ...cvData,
        certifications: certifications
          .split('\n')
          .map((c: string) => c.trim())
          .filter(Boolean),
      })
    );
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
              full_name: cvData.personalInfo.fullName,
              email: cvData.personalInfo.email,
              phone: cvData.personalInfo.phone,
              location: cvData.personalInfo.location,
              linkedin_url: cvData.personalInfo.linkedIn,
              portfolio_url: cvData.personalInfo.website,
              summary: cvData.personalInfo.summary,
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
            data={(cvData.experiences || []).map(exp => ({
              company: exp.company,
              role: exp.position || '',
              duration: '', // Could be derived from startDate/endDate if needed
              description: exp.description
            }))}
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
            data={cvData.education.map(edu => ({
              institution: edu.institution,
              degree: edu.degree,
              year: edu.startDate || edu.endDate || '',
              gpa: edu.gpa || ''
            }))}
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
            data={Array.isArray(cvData.skills) ? cvData.skills : []}
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
            data={Array.isArray(cvData.certifications) ? cvData.certifications.join('\n') : ''}
            onChange={updateCertifications}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CVForm;
