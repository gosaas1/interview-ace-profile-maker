import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Linkedin, CheckCircle, XCircle, AlertCircle, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export default function LinkedInOAuthTest() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [manualTest, setManualTest] = useState(false);

  const runDiagnostics = async () => {
    setTesting(true);
    const diagnostics = {
      timestamp: new Date().toISOString(),
      supabaseUrl: supabase.supabaseUrl,
      supabaseKey: supabase.supabaseKey ? 'Present' : 'Missing',
      currentUrl: window.location.origin,
      redirectUrl: `${window.location.origin}/auth/callback`,
      expectedCallback: `${supabase.supabaseUrl}/auth/v1/callback`,
      tests: {
        supabaseConnection: false,
        oauthUrlGeneration: false,
        providerConfiguration: false,
        redirectConfiguration: false,
      },
      errors: [] as string[],
      oauthUrl: '',
      linkedinConfig: {
        clientId: '788zhq2xugi6vm',
        clientSecret: 'WPL_AP1.G7ptuYeCirVKnM7O.l2OPUw==',
        redirectUri: `${supabase.supabaseUrl}/auth/v1/callback`,
      }
    };

    try {
      // Test 1: Supabase Connection
      const { data: session } = await supabase.auth.getSession();
      diagnostics.tests.supabaseConnection = true;
      
      // Test 2: OAuth URL Generation
      try {
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
          diagnostics.errors.push(`OAuth Error: ${error.message}`);
          diagnostics.tests.oauthUrlGeneration = false;
        } else if (data?.url) {
          diagnostics.oauthUrl = data.url;
          diagnostics.tests.oauthUrlGeneration = true;
          diagnostics.tests.providerConfiguration = true;
          
          // Check if URL contains expected parameters
          const url = new URL(data.url);
          const clientId = url.searchParams.get('client_id');
          const redirectUri = url.searchParams.get('redirect_uri');
          const provider = url.searchParams.get('provider') || url.pathname.includes('linkedin');
          
          if (clientId) {
            diagnostics.tests.redirectConfiguration = true;
          } else {
            diagnostics.errors.push('No client_id found in OAuth URL');
          }
          
          if (!redirectUri) {
            diagnostics.errors.push('No redirect_uri found in OAuth URL');
          }
        } else {
          diagnostics.errors.push('No OAuth URL generated');
        }
      } catch (oauthError: any) {
        diagnostics.errors.push(`OAuth Generation Error: ${oauthError.message}`);
        diagnostics.tests.oauthUrlGeneration = false;
      }

    } catch (error: any) {
      diagnostics.errors.push(`Connection Error: ${error.message}`);
      diagnostics.tests.supabaseConnection = false;
    }

    setResults(diagnostics);
    setTesting(false);
  };

  const testManualOAuth = async () => {
    setManualTest(true);
    try {
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
        toast.error(`OAuth Error: ${error.message}`);
        console.error('OAuth Error:', error);
      } else if (data?.url) {
        toast.success('Redirecting to LinkedIn...');
        window.location.href = data.url;
      } else {
        toast.error('No OAuth URL generated');
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
      console.error('Manual OAuth Error:', error);
    }
    setManualTest(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">LinkedIn OAuth Diagnostics</h1>
        <p className="text-gray-600">Comprehensive testing for LinkedIn OAuth integration</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Configuration Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Linkedin className="h-5 w-5" />
              LinkedIn Configuration
            </CardTitle>
            <CardDescription>
              Current LinkedIn OAuth settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Client ID:</span>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">788zhq2xugi6vm</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard('788zhq2xugi6vm')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Provider:</span>
                <Badge variant="outline">linkedin_oidc</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Redirect URL:</span>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded max-w-48 truncate">
                    {window.location.origin}/auth/callback
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(`${window.location.origin}/auth/callback`)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Supabase Callback:</span>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded max-w-48 truncate">
                    {supabase.supabaseUrl}/auth/v1/callback
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(`${supabase.supabaseUrl}/auth/v1/callback`)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Controls Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Test Controls
            </CardTitle>
            <CardDescription>
              Run diagnostics and test OAuth flow
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={runDiagnostics}
              disabled={testing}
              className="w-full"
            >
              {testing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Running Diagnostics...
                </>
              ) : (
                <>
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Run Full Diagnostics
                </>
              )}
            </Button>
            
            <Button
              onClick={testManualOAuth}
              disabled={manualTest}
              variant="outline"
              className="w-full"
            >
              {manualTest ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Redirecting...
                </>
              ) : (
                <>
                  <Linkedin className="mr-2 h-4 w-4" />
                  Test Live OAuth Flow
                </>
              )}
            </Button>

            <div className="text-xs text-gray-500 space-y-1">
              <p>• Full Diagnostics: Tests all configurations</p>
              <p>• Live OAuth: Attempts actual LinkedIn redirect</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Card */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Diagnostic Results
            </CardTitle>
            <CardDescription>
              Test results from {new Date(results.timestamp).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Test Results */}
            <div className="space-y-3">
              <h3 className="font-semibold">Test Results:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm">Supabase Connection</span>
                  {getStatusIcon(results.tests.supabaseConnection)}
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm">OAuth URL Generation</span>
                  {getStatusIcon(results.tests.oauthUrlGeneration)}
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm">Provider Configuration</span>
                  {getStatusIcon(results.tests.providerConfiguration)}
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm">Redirect Configuration</span>
                  {getStatusIcon(results.tests.redirectConfiguration)}
                </div>
              </div>
            </div>

            {/* OAuth URL */}
            {results.oauthUrl && (
              <div className="space-y-2">
                <h3 className="font-semibold">Generated OAuth URL:</h3>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-gray-100 p-2 rounded flex-1 break-all">
                    {results.oauthUrl}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(results.oauthUrl)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(results.oauthUrl, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}

            {/* Errors */}
            {results.errors.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-red-600">Errors Found:</h3>
                <div className="space-y-2">
                  {results.errors.map((error: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-red-700">{error}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Configuration Details */}
            <div className="space-y-2">
              <h3 className="font-semibold">Configuration Details:</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-xs overflow-x-auto">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 