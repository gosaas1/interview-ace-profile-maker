import React, { useState } from 'react';
import { LocalCVAnalyzer } from '../../lib/ai/localAnalyzer';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

export function KeywordTest() {
  const [testText, setTestText] = useState(`
John Smith Software Engineer

Experience:
Senior Software Engineer at Tech Company (2020-2024)
- Developed applications using JavaScript React Node.js
- Led team using Agile methodology  
- Used Python for data analysis machine learning projects
- Communication leadership problem solving project management

Skills:
Programming JavaScript Python Java SQL
Frameworks React Angular Django
Databases MySQL MongoDB
Cloud AWS Docker
Soft Skills Leadership Communication Problem Solving

Education:
Bachelor Computer Science University Technology
  `);
  
  const [results, setResults] = useState<any>(null);
  const analyzer = new LocalCVAnalyzer();

  const runTest = () => {
    console.log('Running keyword test...');
    console.log('Test text to analyze:', testText);
    
    // Simple direct test
    const text = testText.toLowerCase();
    const simpleKeywords = ['javascript', 'python', 'react', 'communication', 'leadership'];
    const foundSimple = simpleKeywords.filter(keyword => text.includes(keyword));
    console.log('Simple test - should find:', simpleKeywords);
    console.log('Simple test - actually found:', foundSimple);
    
    const result = analyzer.analyzeCV({
      cvId: 'test-cv',
      userId: 'test-user',
      cvText: testText,
      analysisType: 'detailed',
      jobDescription: undefined
    });
    
    console.log('Full analysis result:', result);
    setResults(result);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Keyword Analysis Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Test CV Text:</label>
            <Textarea
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              rows={15}
              className="w-full"
            />
          </div>
          <Button onClick={runTest}>Run Keyword Analysis Test</Button>
        </CardContent>
      </Card>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-green-600">Present Keywords ({results.presentKeywords.length}):</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {results.presentKeywords.map((keyword: string, index: number) => (
                  <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-red-600">Missing Keywords ({results.missingKeywords.length}):</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {results.missingKeywords.slice(0, 20).map((keyword: string, index: number) => (
                  <span key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold">Scores:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(results.scores, null, 2)}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold">Overall Score: {results.overallScore}</h3>
              <h3 className="font-semibold">ATS Compatibility: {results.atsCompatibility}</h3>
              <h3 className="font-semibold">Keyword Density: {results.keywordDensity}%</h3>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 