import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';
import { CVData } from '@/pages/CVBuilder';

interface ExperienceFormProps {
  data: CVData['experience'];
  onChange: (data: CVData['experience']) => void;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({ data, onChange }) => {
  const addExperience = () => {
    const newExperience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    onChange([...data, newExperience]);
  };

  const removeExperience = (id: string) => {
    onChange(data.filter(exp => exp.id !== id));
  };

  const updateExperience = (id: string, field: keyof CVData['experience'][0], value: any) => {
    onChange(data.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  return (
    <div className="space-y-4">
      {data.map((experience, index) => (
        <div key={experience.id} className="border rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Experience {index + 1}</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeExperience(experience.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`position-${experience.id}`}>Position *</Label>
              <Input
                id={`position-${experience.id}`}
                value={experience.position}
                onChange={(e) => updateExperience(experience.id, 'position', e.target.value)}
                placeholder="Software Engineer"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`company-${experience.id}`}>Company *</Label>
              <Input
                id={`company-${experience.id}`}
                value={experience.company}
                onChange={(e) => updateExperience(experience.id, 'company', e.target.value)}
                placeholder="Tech Corp"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`location-${experience.id}`}>Location</Label>
              <Input
                id={`location-${experience.id}`}
                value={experience.location}
                onChange={(e) => updateExperience(experience.id, 'location', e.target.value)}
                placeholder="San Francisco, CA"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`startDate-${experience.id}`}>Start Date *</Label>
              <Input
                id={`startDate-${experience.id}`}
                type="month"
                value={experience.startDate}
                onChange={(e) => updateExperience(experience.id, 'startDate', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`endDate-${experience.id}`}>End Date</Label>
              <Input
                id={`endDate-${experience.id}`}
                type="month"
                value={experience.endDate}
                onChange={(e) => updateExperience(experience.id, 'endDate', e.target.value)}
                disabled={experience.current}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`current-${experience.id}`}
                checked={experience.current}
                onCheckedChange={(checked) => updateExperience(experience.id, 'current', checked)}
              />
              <Label htmlFor={`current-${experience.id}`}>I currently work here</Label>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`description-${experience.id}`}>Description</Label>
            <Textarea
              id={`description-${experience.id}`}
              value={experience.description}
              onChange={(e) => updateExperience(experience.id, 'description', e.target.value)}
              placeholder="Describe your responsibilities and achievements..."
              className="min-h-[100px]"
            />
          </div>
        </div>
      ))}
      
      <Button
        type="button"
        variant="outline"
        onClick={addExperience}
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Experience
      </Button>
    </div>
  );
};

export default ExperienceForm;
