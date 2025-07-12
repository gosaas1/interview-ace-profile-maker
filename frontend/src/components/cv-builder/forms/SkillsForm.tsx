import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { CVData } from '@/pages/CVBuilder';

interface SkillsFormProps {
  data: CVData['skills'];
  onChange: (data: CVData['skills']) => void;
}

const SkillsForm: React.FC<SkillsFormProps> = ({ data, onChange }) => {
  const [newSkill, setNewSkill] = React.useState('');

  const addSkill = () => {
    if (newSkill.trim() && !data.includes(newSkill.trim())) {
      onChange([...data, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onChange(data.filter(skill => skill !== skillToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const suggestedSkills = [
    'JavaScript', 'React', 'Python', 'Java', 'Node.js', 'SQL', 'HTML/CSS',
    'Project Management', 'Data Analysis', 'Marketing', 'Design', 'Communication',
    'Leadership', 'Problem Solving', 'Time Management', 'Team Collaboration'
  ];

  const availableSkills = suggestedSkills.filter(skill => !data.includes(skill));

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="newSkill">Add Skills</Label>
        <div className="flex space-x-2">
          <Input
            id="newSkill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., JavaScript, React, Project Management"
            className="flex-1"
          />
          <Button type="button" onClick={addSkill}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {data.length > 0 && (
        <div className="space-y-2">
          <Label>Your Skills</Label>
          <div className="flex flex-wrap gap-2">
            {data.map((skill, index) => (
              <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                <span>{skill}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSkill(skill)}
                  className="h-auto p-0 ml-1 hover:bg-transparent"
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsForm;
