import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { Skill } from '@/lib/cv/types';

interface SkillsFormProps {
  data: Skill[];
  onChange: (data: Skill[]) => void;
}

const SkillsForm: React.FC<SkillsFormProps> = ({ data, onChange }) => {
  const [newSkill, setNewSkill] = useState('');

  // Ensure data is always an array
  const skillsArray = Array.isArray(data) ? data : [];

  const addSkill = () => {
    if (newSkill.trim() && !skillsArray.some(skill => skill.name === newSkill.trim())) {
      const newSkillObj: Skill = {
        id: `skill-${Date.now()}-${Math.random()}`,
        name: newSkill.trim()
      };
      onChange([...skillsArray, newSkillObj]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: Skill) => {
    onChange(skillsArray.filter(skill => skill.id !== skillToRemove.id));
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

  const availableSkills = suggestedSkills.filter(skill => !skillsArray.some(existingSkill => existingSkill.name === skill));

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="newSkill">Add Skill</Label>
            <Input
              id="newSkill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a skill and press Enter"
            />
          </div>
          <Button
            onClick={addSkill}
            className="mt-6"
            disabled={!newSkill.trim()}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {availableSkills.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm text-gray-600">Suggested Skills:</Label>
            <div className="flex flex-wrap gap-2">
              {availableSkills.slice(0, 10).map(skill => (
                <Badge
                  key={skill}
                  variant="outline"
                  className="cursor-pointer hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => {
                    const newSkillObj: Skill = {
                      id: `skill-${Date.now()}-${Math.random()}`,
                      name: skill
                    };
                    onChange([...skillsArray, newSkillObj]);
                  }}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {skillsArray.length > 0 && (
        <div className="space-y-2">
          <Label>Your Skills ({skillsArray.length})</Label>
          <div className="flex flex-wrap gap-2">
            {skillsArray.map(skill => (
              <Badge
                key={skill.id}
                className="bg-blue-100 text-blue-800 hover:bg-blue-200"
              >
                {skill.name}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-auto p-0 hover:bg-transparent"
                  onClick={() => removeSkill(skill)}
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