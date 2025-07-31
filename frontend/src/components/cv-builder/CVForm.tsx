import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PersonalInfoForm from './forms/PersonalInfoForm';
import ExperienceForm from './forms/ExperienceForm';
import EducationForm from './forms/EducationForm';
import SkillsForm from './forms/SkillsForm';
import CertificationsForm from './forms/CertificationsForm';
import { CVData } from '@/lib/cv/types';

interface CVFormProps {
  cvData: CVData;
  onDataChange: (data: CVData) => void;
}

const CVForm: React.FC<CVFormProps> = ({ cvData, onDataChange }) => {
  const updatePersonalInfo = (personalInfo: CVData['personalInfo']) => {
    onDataChange({ ...cvData, personalInfo });
  };

  const updateExperience = (experiences: CVData['experiences']) => {
    onDataChange({ ...cvData, experiences });
  };

  const updateEducation = (education: CVData['education']) => {
    onDataChange({ ...cvData, education });
  };

  const updateSkills = (skills: CVData['skills']) => {
    onDataChange({ ...cvData, skills });
  };

  const updateCertifications = (certifications: CVData['certifications']) => {
    onDataChange({ ...cvData, certifications });
  };

  return (
    <div className="flex flex-col h-full justify-center items-center p-4">
      <div className="w-full max-w-xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
              <span>Personal Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PersonalInfoForm
              data={cvData.personalInfo}
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
              data={cvData.skills}
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
      
      {/* Remove the small preview card from here */}
      {/* <div className="hidden lg:block">
        <CVPreview cvData={cvData} />
      </div> */}
    </div>
  );
};

export default CVForm; 