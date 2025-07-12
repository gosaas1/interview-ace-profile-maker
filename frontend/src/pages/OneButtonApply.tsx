import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OneButtonApply from '@/components/cv/OneButtonApply';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, FileText, Zap, Globe } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface ApplicationResult {
  jobId: string;
  tailoredCV: any;
  coverLetter: string;
  matchScore: number;
  appliedSuccessfully: boolean;
}

const OneButtonApplyPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userCV, setUserCV] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [applicationHistory, setApplicationHistory] = useState<ApplicationResult[]>([]);

  useEffect(() => {
    if (user) {
      loadUserCV();
    }
  }, [user]);

  const loadUserCV = async () => {
    try {
      setIsLoading(true);
      
      // Get the user's most recent CV
      const { data: cvs, error } = await supabase
        .from('cvs')
        .select('*')
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error loading CV:', error);
        toast.error('Failed to load your CV');
        return;
      }

      if (cvs && cvs.length > 0) {
        setUserCV(cvs[0]);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load your CV');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplicationComplete = async (result: ApplicationResult) => {
    // Add to application history
    setApplicationHistory(prev => [result, ...prev]);

    // Optionally save to database
    try {
      const { error } = await supabase
        .from('job_applications')
        .insert({
          user_id: user?.id,
          job_id: result.jobId,
          cv_data: result.tailoredCV,
          cover_letter: result.coverLetter,
          match_score: result.matchScore,
          status: result.appliedSuccessfully ? 'submitted' : 'failed',
          applied_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving application:', error);
      }
    } catch (error) {
      console.error('Error saving application:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your CV...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">One Button Apply</h1>
                <p className="text-sm text-gray-500">AI-powered job application automation</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/cvs')}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Manage CVs
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Feature Overview */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                How One Button Apply Works
              </CardTitle>
              <CardDescription>
                Automate your entire job application process with AI-powered optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-sm">Paste Job URL</h3>
                  <p className="text-xs text-gray-500 mt-1">Any supported job board</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-green-600 font-bold text-sm">AI</span>
                  </div>
                  <h3 className="font-medium text-sm">Analyze Job</h3>
                  <p className="text-xs text-gray-500 mt-1">Extract requirements</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="font-medium text-sm">Tailor CV</h3>
                  <p className="text-xs text-gray-500 mt-1">Match job requirements</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-orange-600 font-bold text-sm">✉</span>
                  </div>
                  <h3 className="font-medium text-sm">Cover Letter</h3>
                  <p className="text-xs text-gray-500 mt-1">Generate personalized</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-red-600 font-bold text-sm">🚀</span>
                  </div>
                  <h3 className="font-medium text-sm">Apply</h3>
                  <p className="text-xs text-gray-500 mt-1">Submit automatically</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CV Status */}
        {!userCV && (
          <div className="mb-8">
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                You need to create or upload a CV first to use the One Button Apply feature.{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto font-medium"
                  onClick={() => navigate('/cv-builder')}
                >
                  Create CV now
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {userCV && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Active CV</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{userCV.full_name || 'Unnamed CV'}</h3>
                    <p className="text-sm text-gray-600">{userCV.job_title || 'No job title'}</p>
                    <p className="text-xs text-gray-500">
                      Last updated: {new Date(userCV.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/cv-builder')}
                  >
                    Edit CV
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* One Button Apply Component */}
        <OneButtonApply
          userCV={userCV}
          onApplicationComplete={handleApplicationComplete}
        />

        {/* Application History */}
        {applicationHistory.length > 0 && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>
                  Your recent job applications using One Button Apply
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applicationHistory.slice(0, 5).map((app, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">Job Application #{app.jobId}</h4>
                        <p className="text-sm text-gray-600">
                          Match Score: {app.matchScore}% • 
                          Status: {app.appliedSuccessfully ? 'Submitted' : 'Failed'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View CV
                        </Button>
                        <Button variant="outline" size="sm">
                          View Cover Letter
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default OneButtonApplyPage; 