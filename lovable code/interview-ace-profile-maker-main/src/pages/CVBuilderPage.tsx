import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CVBuilder } from '@/components/cv/CVBuilder';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const CVBuilderPage = () => {
  const navigate = useNavigate();
  const [isBuilderOpen, setIsBuilderOpen] = useState(true);

  const handleClose = () => {
    setIsBuilderOpen(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-6 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        
        <CVBuilder onClose={handleClose} />
      </div>
    </div>
  );
};

export default CVBuilderPage; 