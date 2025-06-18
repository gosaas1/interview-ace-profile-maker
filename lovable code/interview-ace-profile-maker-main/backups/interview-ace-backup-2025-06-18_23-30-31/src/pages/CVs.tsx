import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { HomeNavigation } from '@/components/navigation/HomeNavigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileText, Plus, Upload, Edit, Trash2, ArrowRight } from 'lucide-react';
import CVUploadModal from '@/components/cv/CVUploadModal';
import { CVBuilder } from '@/components/cv/CVBuilder';

interface CV {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export const CVs = () => {
  const [cvs, setCVs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showBuilderModal, setShowBuilderModal] = useState(false);

  useEffect(() => {
    fetchCVs();
  }, []);

  const fetchCVs = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data, error } = await supabase
          .from('cvs')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCVs(data || []);
      }
    } catch (error) {
      console.error('Error fetching CVs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCV = async (cvId: string) => {
    try {
      const { error } = await supabase
        .from('cvs')
        .delete()
        .eq('id', cvId);

      if (error) throw error;
      setCVs(cvs.filter(cv => cv.id !== cvId));
    } catch (error) {
      console.error('Error deleting CV:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64">
        <HomeNavigation />
      </div>
      
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8 min-h-[80px]">
            <div className="flex flex-col justify-center">
              <h1 className="text-3xl font-bold text-gray-900">My CVs</h1>
              <p className="mt-2 text-gray-600">
                Create, manage, and update your professional CVs
              </p>
            </div>
            <div className="flex space-x-4 items-center">
              <Button 
                onClick={() => setShowBuilderModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white h-10"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New CV
              </Button>
              <Button 
                onClick={() => setShowUploadModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white h-10"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload CV
              </Button>
            </div>
          </div>

          {cvs.length === 0 ? (
            <Card className="p-8 text-center bg-gradient-to-br from-blue-50 to-indigo-50">
              <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-blue-900 mb-2">No CVs yet</h3>
              <p className="text-gray-600 mb-6">
                Create your first CV or upload an existing one to get started.
              </p>
              <div className="flex justify-center space-x-4">
                <Button 
                  onClick={() => setShowBuilderModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New CV
                </Button>
                <Button 
                  onClick={() => setShowUploadModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload CV
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cvs.map((cv) => (
                <Card key={cv.id} className="p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-indigo-50">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900">{cv.title}</h3>
                      <p className="text-sm text-gray-500">
                        Last updated: {new Date(cv.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-700 hover:bg-blue-100">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteCV(cv.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50">
                      View
                    </Button>
                    <Button variant="outline" className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50">
                      Download
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {showUploadModal && (
        <CVUploadModal 
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => {
            setShowUploadModal(false);
            fetchCVs();
          }}
        />
      )}

      {showBuilderModal && (
        <CVBuilder 
          onClose={() => setShowBuilderModal(false)}
          onSuccess={() => {
            setShowBuilderModal(false);
            fetchCVs();
          }}
        />
      )}
    </div>
  );
}; 