import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';

interface Education {
  institution: string;
  degree: string;
  year: string;
  gpa: string;
}

interface EducationFormProps {
  data: Education[];
  onChange: (data: Education[]) => void;
}

const EducationForm: React.FC<EducationFormProps> = ({ data, onChange }) => {
  const addEducation = () => {
    onChange([...data, {
      institution: '',
      degree: '',
      year: '',
      gpa: ''
    }]);
  };

  const removeEducation = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const updatedEducation = data.map((edu, i) => 
      i === index ? { ...edu, [field]: value } : edu
    );
    onChange(updatedEducation);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Education</h3>
        <Button onClick={addEducation} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Education
        </Button>
      </div>
      
      {data.map((education, index) => (
        <Card key={index} className="p-4">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-medium">Education {index + 1}</h4>
            {data.length > 1 && (
              <Button variant="ghost" size="sm" onClick={() => removeEducation(index)}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div className="space-y-2">
              <Label htmlFor={`institution-${index}`}>Institution Name</Label>
              <Input
                id={`institution-${index}`}
                placeholder="University Name"
                value={education.institution}
                onChange={(e) => updateEducation(index, 'institution', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`degree-${index}`}>Degree</Label>
              <Input
                id={`degree-${index}`}
                placeholder="e.g., Bachelor of Science"
                value={education.degree}
                onChange={(e) => updateEducation(index, 'degree', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`year-${index}`}>Year</Label>
              <Input
                id={`year-${index}`}
                placeholder="e.g., 2020"
                value={education.year}
                onChange={(e) => updateEducation(index, 'year', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`gpa-${index}`}>GPA (optional)</Label>
              <Input
                id={`gpa-${index}`}
                placeholder="e.g., 3.8"
                value={education.gpa}
                onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
              />
            </div>
          </div>
        </Card>
      ))}
      
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No education added yet.</p>
          <p className="text-sm">Click "Add Education" to get started.</p>
        </div>
      )}
    </div>
  );
};

export default EducationForm;
