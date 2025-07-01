import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { HomeNavigation } from '@/components/navigation/HomeNavigation';
import { CVBuilderRefactored } from '@/components/cv/CVBuilderRefactored';
import { CVData } from '@/lib/supabase';
import { cvOperations } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export const CVBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cvId } = useParams<{ cvId: string }>();
  const [editingCV, setEditingCV] = useState<CVData | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  // Handle editing CV from state or URL parameter
  useEffect(() => {
    const stateEditingCV = location.state?.editingCV as CVData | undefined;
    
    if (stateEditingCV) {
      setEditingCV(stateEditingCV);
    } else if (cvId) {
      // Load CV from database if cvId is provided
      loadCVFromId(cvId);
    }
  }, [cvId, location.state]);

  const loadCVFromId = async (id: string) => {
    setLoading(true);
    try {
      const cv = await cvOperations.getCV(id);
      setEditingCV(cv);
    } catch (error: any) {
      console.error('Failed to load CV:', error);
      toast.error('Failed to load CV: ' + error.message);
      navigate('/cvs');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate('/cvs');
  };

  const handleSuccess = () => {
    navigate('/cvs');
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="w-64">
          <HomeNavigation />
        </div>
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64">
        <HomeNavigation />
      </div>
      
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto py-8 px-6">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={handleClose}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to CVs
              </button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              {editingCV ? 'Edit CV' : 'Create New CV'}
            </h1>
            <p className="text-gray-600 mt-2">
              {editingCV ? 'Update your CV information below.' : 'Fill in your information to create a professional CV.'}
            </p>
          </div>
          
          <CVBuilderRefactored 
            onClose={handleClose}
            onSuccess={handleSuccess}
            editingCV={editingCV}
          />
        </div>
      </main>
    </div>
  );
};

export default CVBuilderPage; 