import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { testConnection, cvOperations, storageOperations } from '@/lib/supabase';
import { Database, FileText, Upload, Linkedin, TestTube } from 'lucide-react';
import LinkedInTest from './LinkedInTest';

export default function BackendTest() {
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const runTest = async (testName: string, testFunction: () => Promise<any>) => {
    setLoading(prev => ({ ...prev, [testName]: true }));
    try {
      const result = await testFunction();
      setResults(prev => ({ ...prev, [testName]: { success: true, data: result } }));
    } catch (error: any) {
      setResults(prev => ({ ...prev, [testName]: { success: false, error: error.message } }));
    } finally {
      setLoading(prev => ({ ...prev, [testName]: false }));
    }
  };

  const testDatabase = () => runTest('database', testConnection);
  
  const testCVOperations = () => runTest('cvs', async () => {
    return await cvOperations.getAllCVs();
  });

  const testStorageOperations = () => runTest('storage', async () => {
    return await storageOperations.listBuckets();
  });

  const renderTestResult = (testName: string) => {
    const result = results[testName];
    const isLoading = loading[testName];

    if (isLoading) {
      return <div className="text-yellow-600">Testing...</div>;
    }

    if (!result) {
      return <div className="text-gray-400">Not tested</div>;
    }

    if (result.success) {
      return (
        <div className="text-green-600">
          ✅ Success
          <details className="mt-2 text-sm">
            <summary className="cursor-pointer">View Details</summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </details>
        </div>
      );
    } else {
      return (
        <div className="text-red-600">
          ❌ Error: {result.error}
        </div>
      );
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <TestTube className="h-8 w-8 text-blue-600" />
          Backend & Authentication Testing
        </h1>
        <p className="text-gray-600">Test various backend services and authentication providers</p>
      </div>

      <Tabs defaultValue="backend" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="backend">Backend Services</TabsTrigger>
          <TabsTrigger value="auth">Authentication</TabsTrigger>
        </TabsList>

        <TabsContent value="backend" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {/* Database Test */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Connection
                </CardTitle>
                <CardDescription>Test Supabase database connectivity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={testDatabase}
                  disabled={loading.database}
                  className="w-full"
                >
                  Test Database
                </Button>
                {renderTestResult('database')}
              </CardContent>
            </Card>

            {/* CV Operations Test */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  CV Operations
                </CardTitle>
                <CardDescription>Test CV database operations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={testCVOperations}
                  disabled={loading.cvs}
                  className="w-full"
                >
                  Test CV Operations
                </Button>
                {renderTestResult('cvs')}
              </CardContent>
            </Card>

            {/* Storage Test */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Storage Operations
                </CardTitle>
                <CardDescription>Test file storage operations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={testStorageOperations}
                  disabled={loading.storage}
                  className="w-full"
                >
                  Test Storage
                </Button>
                {renderTestResult('storage')}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="auth" className="space-y-6">
          <LinkedInTest />
        </TabsContent>
      </Tabs>
    </div>
  );
} 