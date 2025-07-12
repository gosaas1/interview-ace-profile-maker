import { useNavigate, useParams } from 'react-router-dom';
import { CVBuilderModern } from '@/components/cv-builder/CVBuilderModern';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cvOperations, CVData } from '@/lib/supabase';
import { toast } from 'sonner';

const CVBuilderPage = () => {
  const navigate = useNavigate();
  const { cvId } = useParams<{ cvId: string }>();
  const { user } = useAuth();
  const [editingCV, setEditingCV] = useState<CVData | undefined>();
  const [loading, setLoading] = useState(false);

  // Load CV for editing if cvId is provided
  useEffect(() => {
    if (cvId && user) {
      setLoading(true);
      cvOperations.getCV(cvId).then(({ data, error }) => {
        if (error) {
          toast.error('Failed to load CV');
          navigate('/cvs');
        } else {
          setEditingCV(data);
        }
        setLoading(false);
      });
    }
  }, [cvId, user, navigate]);

  const handleClose = () => {
    navigate('/cvs');
  };

  const handleSuccess = () => {
    toast.success(editingCV ? 'CV updated successfully!' : 'CV created successfully!');
    navigate('/cvs');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white/50 backdrop-blur-md rounded-xl p-8 border border-white/20 shadow-xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-6">Please sign in to create or edit CVs.</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate('/auth')} className="bg-gradient-to-r from-blue-500 to-purple-600">
              Sign In
            </Button>
            <Button onClick={() => navigate('/')} variant="outline">
              Go Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white/50 backdrop-blur-md rounded-xl p-8 border border-white/20 shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading CV...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* CV Builder */}
      <CVBuilderModern
        onClose={handleClose}
        onSuccess={handleSuccess}
        editingCV={editingCV}
        isModal={false}
      />
    </div>
  );
};

export default CVBuilderPage; 