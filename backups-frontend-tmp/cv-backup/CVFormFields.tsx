import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, X, Globe, Linkedin, Briefcase, Languages, Users } from 'lucide-react';

interface CVFormData {
  full_name: string;
  job_title: string;
  email: string;
  phone: string;
  location: string;
  linkedin_url: string;
  portfolio_url: string;
  summary: string;
  experiences: Array<{
    company: string;
    role: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year: string;
    gpa: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string;
    url: string;
  }>;
  skills: string;
  languages: Array<{
    language: string;
    proficiency: string;
  }>;
  certifications: string;
  references: Array<{
    name: string;
    title: string;
    company: string;
    email: string;
    phone: string;
  }>;
}

interface CVFormFieldsProps {
  formData: CVFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onExperienceChange: (index: number, field: string, value: string) => void;
  onEducationChange: (index: number, field: string, value: string) => void;
  onProjectChange: (index: number, field: string, value: string) => void;
  onLanguageChange: (index: number, field: string, value: string) => void;
  onReferenceChange: (index: number, field: string, value: string) => void;
  onAddExperience: () => void;
  onRemoveExperience: (index: number) => void;
  onAddEducation: () => void;
  onRemoveEducation: (index: number) => void;
  onAddProject: () => void;
  onRemoveProject: (index: number) => void;
  onAddLanguage: () => void;
  onRemoveLanguage: (index: number) => void;
  onAddReference: () => void;
  onRemoveReference: (index: number) => void;
}

export const CVFormFields: React.FC<CVFormFieldsProps> = ({
  formData,
  onInputChange,
  onExperienceChange,
  onEducationChange,
  onProjectChange,
  onLanguageChange,
  onReferenceChange,
  onAddExperience,
  onRemoveExperience,
  onAddEducation,
  onRemoveEducation,
  onAddProject,
  onRemoveProject,
  onAddLanguage,
  onRemoveLanguage,
  onAddReference,
  onRemoveReference,
}) => {
  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <Input
                name="full_name"
                value={formData.full_name}
                onChange={onInputChange}
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title
              </label>
              <Input
                name="job_title"
                value={formData.job_title}
                onChange={onInputChange}
                placeholder="Software Engineer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={onInputChange}
                placeholder="john.doe@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={onInputChange}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <Input
                name="location"
                value={formData.location}
                onChange={onInputChange}
                placeholder="New York, NY"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Linkedin className="h-4 w-4 mr-1" />
                LinkedIn URL
              </label>
              <Input
                name="linkedin_url"
                value={formData.linkedin_url}
                onChange={onInputChange}
                placeholder="https://linkedin.com/in/johndoe"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Globe className="h-4 w-4 mr-1" />
              Portfolio/Website URL
            </label>
            <Input
              name="portfolio_url"
              value={formData.portfolio_url}
              onChange={onInputChange}
              placeholder="https://johndoe.com"
            />
          </div>
        </CardContent>
      </Card>

      {/* Professional Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            name="summary"
            value={formData.summary}
            onChange={onInputChange}
            placeholder="Write a compelling summary of your professional experience and goals..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Work Experience */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Briefcase className="h-5 w-5 mr-2" />
              Work Experience
            </span>
            <Button type="button" variant="outline" onClick={onAddExperience}>
              <Plus className="h-4 w-4 mr-1" />
              Add Experience
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.experiences.map((experience, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Experience {index + 1}</h4>
                {formData.experiences.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveExperience(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  placeholder="Company Name"
                  value={experience.company}
                  onChange={(e) => onExperienceChange(index, 'company', e.target.value)}
                />
                <Input
                  placeholder="Job Title"
                  value={experience.role}
                  onChange={(e) => onExperienceChange(index, 'role', e.target.value)}
                />
                <Input
                  placeholder="Duration (e.g., Jan 2020 - Present)"
                  value={experience.duration}
                  onChange={(e) => onExperienceChange(index, 'duration', e.target.value)}
                />
              </div>
              <Textarea
                placeholder="Describe your role, responsibilities, and achievements..."
                value={experience.description}
                onChange={(e) => onExperienceChange(index, 'description', e.target.value)}
                rows={3}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Education
            <Button type="button" variant="outline" onClick={onAddEducation}>
              <Plus className="h-4 w-4 mr-1" />
              Add Education
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.education.map((edu, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Education {index + 1}</h4>
                {formData.education.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveEducation(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  placeholder="Institution Name"
                  value={edu.institution}
                  onChange={(e) => onEducationChange(index, 'institution', e.target.value)}
                />
                <Input
                  placeholder="Degree/Course"
                  value={edu.degree}
                  onChange={(e) => onEducationChange(index, 'degree', e.target.value)}
                />
                <Input
                  placeholder="Year (e.g., 2020)"
                  value={edu.year}
                  onChange={(e) => onEducationChange(index, 'year', e.target.value)}
                />
                <Input
                  placeholder="GPA (optional)"
                  value={edu.gpa}
                  onChange={(e) => onEducationChange(index, 'gpa', e.target.value)}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Projects */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Projects
            <Button type="button" variant="outline" onClick={onAddProject}>
              <Plus className="h-4 w-4 mr-1" />
              Add Project
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.projects.map((project, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Project {index + 1}</h4>
                {formData.projects.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveProject(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  placeholder="Project Name"
                  value={project.name}
                  onChange={(e) => onProjectChange(index, 'name', e.target.value)}
                />
                <Input
                  placeholder="Project URL (optional)"
                  value={project.url}
                  onChange={(e) => onProjectChange(index, 'url', e.target.value)}
                />
              </div>
              <Input
                placeholder="Technologies Used"
                value={project.technologies}
                onChange={(e) => onProjectChange(index, 'technologies', e.target.value)}
              />
              <Textarea
                placeholder="Project description and achievements..."
                value={project.description}
                onChange={(e) => onProjectChange(index, 'description', e.target.value)}
                rows={3}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            name="skills"
            value={formData.skills}
            onChange={onInputChange}
            placeholder="List your technical and soft skills, separated by commas..."
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Languages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Languages className="h-5 w-5 mr-2" />
              Languages
            </span>
            <Button type="button" variant="outline" onClick={onAddLanguage}>
              <Plus className="h-4 w-4 mr-1" />
              Add Language
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.languages.map((language, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-medium">Language {index + 1}</h4>
                {formData.languages.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveLanguage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  placeholder="Language"
                  value={language.language}
                  onChange={(e) => onLanguageChange(index, 'language', e.target.value)}
                />
                <Select
                  value={language.proficiency}
                  onValueChange={(value) => onLanguageChange(index, 'proficiency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Proficiency Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Native">Native</SelectItem>
                    <SelectItem value="Fluent">Fluent</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Basic">Basic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card>
        <CardHeader>
          <CardTitle>Certifications</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            name="certifications"
            value={formData.certifications}
            onChange={onInputChange}
            placeholder="List your certifications, separated by commas..."
            rows={3}
          />
        </CardContent>
      </Card>

      {/* References */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            References
            <Button type="button" variant="outline" onClick={onAddReference}>
              <Plus className="h-4 w-4 mr-1" />
              Add Reference
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.references.map((reference, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Reference {index + 1}</h4>
                {formData.references.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveReference(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  placeholder="Reference Name"
                  value={reference.name}
                  onChange={(e) => onReferenceChange(index, 'name', e.target.value)}
                />
                <Input
                  placeholder="Job Title"
                  value={reference.title}
                  onChange={(e) => onReferenceChange(index, 'title', e.target.value)}
                />
                <Input
                  placeholder="Company"
                  value={reference.company}
                  onChange={(e) => onReferenceChange(index, 'company', e.target.value)}
                />
                <Input
                  placeholder="Email"
                  value={reference.email}
                  onChange={(e) => onReferenceChange(index, 'email', e.target.value)}
                />
                <Input
                  placeholder="Phone"
                  value={reference.phone}
                  onChange={(e) => onReferenceChange(index, 'phone', e.target.value)}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}; 