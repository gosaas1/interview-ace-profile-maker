import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HomeNavigation } from '@/components/navigation/HomeNavigation';
import { CVBuilder } from '@/components/cv/CVBuilder';
import { CVData } from '@/lib/supabase';

export const CVBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editingCV = location.state?.editingCV as CVData | undefined;

  const handleClose = () => {
    navigate('/cvs');
  };

  const handleSuccess = () => {
    navigate('/cvs');
  };

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
          
          <CVBuilder 
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