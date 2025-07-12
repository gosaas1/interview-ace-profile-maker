import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { CVData } from '@/pages/CVBuilder';

interface EducationFormProps {
  data: CVData['education'];
  onChange: (data: CVData['education']) => void;
}

const EducationForm: React.FC<EducationFormProps> = ({ data, onChange }) => {
  const addEducation = () => {
    const newEducation = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: ''
    };
    onChange([...data, newEducation]);
  };

  const removeEducation = (id: string) => {
    onChange(data.filter(edu => edu.id !== id));
  };

  const updateEducation = (id: string, field: keyof CVData['education'][0], value: string) => {
    onChange(data.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  return (
    <div className="space-y-4">
      {data.map((education, index) => (
        <div key={education.id} className="border rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Education {index + 1}</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeEducation(education.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`institution-${education.id}`}>Institution *</Label>
              <Input
                id={`institution-${education.id}`}
                value={education.institution}
                onChange={(e) => updateEducation(education.id, 'institution', e.target.value)}
                placeholder="University of Technology"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`degree-${education.id}`}>Degree *</Label>
              <Input
                id={`degree-${education.id}`}
                value={education.degree}
                onChange={(e) => updateEducation(education.id, 'degree', e.target.value)}
                placeholder="Bachelor of Science"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`field-${education.id}`}>Field of Study *</Label>
              <Input
                id={`field-${education.id}`}
                value={education.field}
                onChange={(e) => updateEducation(education.id, 'field', e.target.value)}
                placeholder="Computer Science"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`gpa-${education.id}`}>GPA</Label>
              <Input
                id={`gpa-${education.id}`}
                value={education.gpa}
                onChange={(e) => updateEducation(education.id, 'gpa', e.target.value)}
                placeholder="3.8"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`startDate-${education.id}`}>Start Date</Label>
              <Input
                id={`startDate-${education.id}`}
                type="month"
                value={education.startDate}
                onChange={(e) => updateEducation(education.id, 'startDate', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`endDate-${education.id}`}>End Date</Label>
              <Input
                id={`endDate-${education.id}`}
                type="month"
                value={education.endDate}
                onChange={(e) => updateEducation(education.id, 'endDate', e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}
      
      <Button
        type="button"
        variant="outline"
        onClick={addEducation}
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Education
      </Button>
    </div>
  );
};

export default EducationForm;
