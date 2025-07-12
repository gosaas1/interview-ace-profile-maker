import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { CVData } from '@/pages/CVBuilder';

interface CertificationsFormProps {
  data: CVData['certifications'];
  onChange: (data: CVData['certifications']) => void;
}

const CertificationsForm: React.FC<CertificationsFormProps> = ({ data, onChange }) => {
  const addCertification = () => {
    const newCertification = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: '',
      expiryDate: '',
      credentialId: ''
    };
    onChange([...data, newCertification]);
  };

  const removeCertification = (id: string) => {
    onChange(data.filter(cert => cert.id !== id));
  };

  const updateCertification = (id: string, field: keyof CVData['certifications'][0], value: string) => {
    onChange(data.map(cert => 
      cert.id === id ? { ...cert, [field]: value } : cert
    ));
  };

  return (
    <div className="space-y-4">
      {data.map((certification, index) => (
        <div key={certification.id} className="border rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Certification {index + 1}</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeCertification(certification.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`name-${certification.id}`}>Certification Name *</Label>
              <Input
                id={`name-${certification.id}`}
                value={certification.name}
                onChange={(e) => updateCertification(certification.id, 'name', e.target.value)}
                placeholder="AWS Certified Solutions Architect"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`issuer-${certification.id}`}>Issuing Organization *</Label>
              <Input
                id={`issuer-${certification.id}`}
                value={certification.issuer}
                onChange={(e) => updateCertification(certification.id, 'issuer', e.target.value)}
                placeholder="Amazon Web Services"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`date-${certification.id}`}>Issue Date</Label>
              <Input
                id={`date-${certification.id}`}
                type="month"
                value={certification.date}
                onChange={(e) => updateCertification(certification.id, 'date', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`expiryDate-${certification.id}`}>Expiry Date</Label>
              <Input
                id={`expiryDate-${certification.id}`}
                type="month"
                value={certification.expiryDate}
                onChange={(e) => updateCertification(certification.id, 'expiryDate', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`credentialId-${certification.id}`}>Credential ID</Label>
              <Input
                id={`credentialId-${certification.id}`}
                value={certification.credentialId}
                onChange={(e) => updateCertification(certification.id, 'credentialId', e.target.value)}
                placeholder="AWS-123456789"
              />
            </div>
          </div>
        </div>
      ))}
      
      <Button
        type="button"
        variant="outline"
        onClick={addCertification}
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Certification
      </Button>
    </div>
  );
};

export default CertificationsForm;
