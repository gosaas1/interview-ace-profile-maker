import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Linkedin, CheckCircle, XCircle, AlertCircle, Copy, ExternalLink, RefreshCw, Bug } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';

export default function LinkedInMainAuthTest() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { signInWithProvider } = useAuth();

  const runMainAuthTest = async () => {
    setTesting(true);
    const testResults = {
      timestamp: new Date().toISOString(),
      testType: 'Main Auth Page LinkedIn Test',
      steps: [] as any[],
      success: false,
      error: null,
    };

    try {
      // Step 1: Test Supabase connection
      testResults.steps.push({
        step: 1,
        name: 'Supabase Connection',
        status: 'testing',
        details: 'Testing connection to Supabase...'
      });

      const { data: { session } } = await supabase.auth.getSession();
      testResults.steps[0].status = 'success';
      testResults.steps[0].details = `Connected. Current session: ${session ? 'Active' : 'None'}`;

      // Step 2: Test LinkedIn OAuth URL generation
      testResults.steps.push({
        step: 2,
        name: 'LinkedIn OAuth URL Generation',
        status: 'testing',
        details: 'Generating LinkedIn OAuth URL...'
      });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        testResults.steps[1].status = 'error';
        testResults.steps[1].details = `Error: ${error.message}`;
        testResults.error = error.message;
      } else {
        testResults.steps[1].status = 'success';
        testResults.steps[1].details = `URL generated: ${data.url}`;
        testResults.steps[1].url = data.url;
      }

      // Step 3: Test using the auth context method
      testResults.steps.push({
        step: 3,
        name: 'Auth Context Method Test',
        status: 'testing',
        details: 'Testing signInWithProvider from auth context...'
      });

      try {
        const authResult = await signInWithProvider('linkedin_oidc' as any);
        testResults.steps[2].status = 'success';
        testResults.steps[2].details = `Auth context method successful: ${authResult.url}`;
        testResults.steps[2].url = authResult.url;
      } catch (authError: any) {
        testResults.steps[2].status = 'error';
        testResults.steps[2].details = `Auth context error: ${authError.message}`;
      }

      // Step 4: Check LinkedIn configuration
      testResults.steps.push({
        step: 4,
        name: 'LinkedIn Configuration Check',
        status: 'testing',
        details: 'Checking LinkedIn OAuth configuration...'
      });

      // Check if the URL contains the expected parameters
      if (data?.url) {
        const url = new URL(data.url);
        const hasClientId = url.searchParams.has('client_id');
        const hasRedirectUri = url.searchParams.has('redirect_uri');
        const hasScope = url.searchParams.has('scope');
        const provider = url.pathname.includes('linkedin');

        testResults.steps[3].status = hasClientId && hasRedirectUri && provider ? 'success' : 'warning';
        testResults.steps[3].details = `
          Provider: ${provider ? '✅ LinkedIn' : '❌ Not LinkedIn'}
          Client ID: ${hasClientId ? '✅ Present' : '❌ Missing'}
          Redirect URI: ${hasRedirectUri ? '✅ Present' : '❌ Missing'}
          Scope: ${hasScope ? '✅ Present' : '⚠️ Missing (optional)'}
        `;
      } else {
        testResults.steps[3].status = 'error';
        testResults.steps[3].details = 'No URL generated to check configuration';
      }

      testResults.success = !testResults.error;

    } catch (error: any) {
      testResults.error = error.message;
      testResults.success = false;
    } finally {
      setTesting(false);
      setResults(testResults);
    }
  };

  const testDirectNavigation = () => {
    // Test direct navigation to LinkedIn OAuth
    const testUrl = `${supabase.supabaseUrl}/auth/v1/authorize?provider=linkedin_oidc&redirect_to=${encodeURIComponent(window.location.origin + '/auth/callback')}`;
    window.open(testUrl, '_blank');
    toast.info('Opened LinkedIn OAuth in new tab for testing');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-6 w-6 text-blue-600" />
            LinkedIn Main Auth Test
          </CardTitle>
          <CardDescription>
            Debug LinkedIn OAuth issues from the main authentication page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button
              onClick={runMainAuthTest}
              disabled={testing}
              className="flex items-center gap-2"
            >
              {testing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Linkedin className="h-4 w-4" />
              )}
              {testing ? 'Testing...' : 'Run Main Auth Test'}
            </Button>
            
            <Button
              variant="outline"
              onClick={testDirectNavigation}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Test Direct LinkedIn URL
            </Button>
          </div>

          {results && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={results.success ? "default" : "destructive"}>
                  {results.success ? 'PASSED' : 'FAILED'}
                </Badge>
                <span className="text-sm text-slate-600">
                  {results.timestamp}
                </span>
              </div>

              {results.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-medium">Error:</p>
                  <p className="text-red-700">{results.error}</p>
                </div>
              )}

              <div className="space-y-3">
                {results.steps.map((step: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">Step {step.step}: {step.name}</span>
                      {step.status === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {step.status === 'error' && <XCircle className="h-4 w-4 text-red-600" />}
                      {step.status === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-600" />}
                      {step.status === 'testing' && <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />}
                    </div>
                    <pre className="text-sm bg-slate-50 p-2 rounded whitespace-pre-wrap">
                      {step.details}
                    </pre>
                    {step.url && (
                      <div className="mt-2 flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(step.url)}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy URL
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(step.url, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Test URL
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expected vs Actual Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-green-600">✅ Expected Flow:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-slate-600 ml-4">
                <li>User clicks LinkedIn button on /auth page</li>
                <li>signInWithProvider('linkedin_oidc') is called</li>
                <li>Supabase generates OAuth URL with client_id</li>
                <li>User is redirected to LinkedIn</li>
                <li>LinkedIn redirects back with authorization code</li>
                <li>AuthCallback exchanges code for session</li>
                <li>User is redirected to dashboard</li>
              </ol>
            </div>
            
            <div>
              <h4 className="font-medium text-red-600">❌ Current Issue:</h4>
              <p className="text-sm text-slate-600 ml-4">
                Users are getting 400 Bad Request errors when clicking LinkedIn button from main auth page.
                This test will help identify where the flow is breaking.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 