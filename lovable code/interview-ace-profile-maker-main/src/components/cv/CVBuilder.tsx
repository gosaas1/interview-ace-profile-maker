import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cvOperations, CVData } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface CVBuilderProps {
  onClose: () => void;
  onSuccess?: () => void;
  editingCV?: CVData; // Add support for editing existing CVs
}

export const CVBuilder: React.FC<CVBuilderProps> = ({ onClose, onSuccess, editingCV }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    experiences: [{ company: '', role: '', duration: '', description: '' }],
    education: [{ institution: '', degree: '', year: '', gpa: '' }],
    skills: '',
    certifications: ''
  });

  useEffect(() => {
    checkAuth();
    if (editingCV) {
      // Load existing CV data for editing
      setFormData({
        full_name: editingCV.full_name || '',
        email: editingCV.email || '',
        phone: editingCV.phone || '',
        location: editingCV.location || '',
        summary: editingCV.summary || '',
        experiences: editingCV.experiences || [{ company: '', role: '', duration: '', description: '' }],
        education: editingCV.education || [{ institution: '', degree: '', year: '', gpa: '' }],
        skills: editingCV.skills || '',
        certifications: editingCV.certifications || ''
      });
    }
  }, [editingCV]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsAuthenticated(!!user);
    if (!user) {
      toast.error('Please sign in to create a CV');
      navigate('/');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleExperienceChange = (index: number, field: string, value: string) => {
    const newExperiences = [...formData.experiences];
    newExperiences[index] = { ...newExperiences[index], [field]: value };
    setFormData(prev => ({ ...prev, experiences: newExperiences }));
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    const newEducation = [...formData.education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    setFormData(prev => ({ ...prev, education: newEducation }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experiences: [...prev.experiences, { company: '', role: '', duration: '', description: '' }]
    }));
  };

  const removeExperience = (index: number) => {
    if (formData.experiences.length > 1) {
      setFormData(prev => ({
        ...prev,
        experiences: prev.experiences.filter((_, i) => i !== index)
      }));
    }
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { institution: '', degree: '', year: '', gpa: '' }]
    }));
  };

  const removeEducation = (index: number) => {
    if (formData.education.length > 1) {
      setFormData(prev => ({
        ...prev,
        education: prev.education.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please sign in to create a CV');
      navigate('/');
      return;
    }

    setLoading(true);
    try {
      if (editingCV) {
        // Update existing CV
        await cvOperations.updateCV(editingCV.id, {
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          summary: formData.summary,
          experiences: formData.experiences,
          education: formData.education,
          skills: formData.skills,
          certifications: formData.certifications
        });
        toast.success('CV updated successfully!');
      } else {
        // Create new CV
        await cvOperations.createCV({
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          summary: formData.summary,
          experiences: formData.experiences,
          education: formData.education,
          skills: formData.skills,
          certifications: formData.certifications
        });
        toast.success('CV created successfully!');
      }
      
      handleSuccess();
    } catch (error: any) {
      console.error('Error saving CV:', error);
      toast.error(error.message || 'Failed to save CV. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    onClose();
    onSuccess?.();
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {editingCV ? 'Edit CV' : 'Create New CV'}
          </h1>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="full_name"
                placeholder="Full Name"
                value={formData.full_name}
                onChange={handleInputChange}
                required
              />
              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
              <Input
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Professional Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              name="summary"
              placeholder="Write a brief summary of your professional background..."
              value={formData.summary}
              onChange={handleInputChange}
              required
              rows={4}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Work Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.experiences.map((exp, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                    required
                  />
                  <Input
                    placeholder="Role"
                    value={exp.role}
                    onChange={(e) => handleExperienceChange(index, 'role', e.target.value)}
                    required
                  />
                </div>
                <Input
                  placeholder="Duration (e.g., Jan 2020 - Dec 2023)"
                  value={exp.duration}
                  onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                  required
                />
                <Textarea
                  placeholder="Description of your role and achievements"
                  value={exp.description}
                  onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                  required
                  rows={3}
                />
                {formData.experiences.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeExperience(index)}
                    className="absolute top-2 right-2"
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" onClick={addExperience} variant="outline">
              Add Experience
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Education</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.education.map((edu, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Institution"
                    value={edu.institution}
                    onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                    required
                  />
                  <Input
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Year"
                    value={edu.year}
                    onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                    required
                  />
                  <Input
                    placeholder="GPA (optional)"
                    value={edu.gpa}
                    onChange={(e) => handleEducationChange(index, 'gpa', e.target.value)}
                  />
                </div>
                {formData.education.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeEducation(index)}
                    className="absolute top-2 right-2"
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" onClick={addEducation} variant="outline">
              Add Education
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills & Certifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              name="skills"
              placeholder="List your skills (e.g., JavaScript, React, Project Management)"
              value={formData.skills}
              onChange={handleInputChange}
              required
              rows={3}
            />
            <Textarea
              name="certifications"
              placeholder="List your certifications and achievements"
              value={formData.certifications}
              onChange={handleInputChange}
              rows={3}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Saving...' : (editingCV ? 'Update CV' : 'Create CV')}
          </Button>
        </div>
      </form>
    </div>
  );
};
