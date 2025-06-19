import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, X, Check } from 'lucide-react';

interface CVUploadModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const CVUploadModal: React.FC<CVUploadModalProps> = ({ onClose, onSuccess }) => {
  const [uploadMethod, setUploadMethod] = useState<'file' | 'text' | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      console.log('File uploaded:', file.name);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // TODO: Implement CV analysis with AI
    console.log('Analyzing CV...');
    
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 3000);
  };

  const handleSave = () => {
    // TODO: Save CV to database
    console.log('Saving CV...');
    onClose();
  };

  const handleSuccess = () => {
    onClose();
    onSuccess?.();
  };

  if (analysisComplete) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              CV Analysis Complete
            </DialogTitle>
            <DialogDescription>
              We've analyzed your CV and identified areas for improvement
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Analysis Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">85%</div>
                    <div className="text-sm text-green-700">ATS Score</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">Good</div>
                    <div className="text-sm text-blue-700">Writing Style</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">3</div>
                    <div className="text-sm text-orange-700">Improvements</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Recommendations:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Add more quantifiable achievements with specific numbers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Include relevant keywords for better ATS optimization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Strengthen action verbs in experience descriptions</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onClose}>
                Review Later
              </Button>
              <Button onClick={handleSave}>
                Save CV
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Your CV</DialogTitle>
          <DialogDescription>
            Upload an existing CV or paste your CV content to get started
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {!uploadMethod && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setUploadMethod('file')}>
                <CardContent className="p-6 text-center">
                  <Upload className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-medium mb-2">Upload File</h3>
                  <p className="text-sm text-gray-600">Upload PDF, DOCX, or TXT file</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setUploadMethod('text')}>
                <CardContent className="p-6 text-center">
                  <FileText className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-medium mb-2">Paste Text</h3>
                  <p className="text-sm text-gray-600">Copy and paste your CV content</p>
                </CardContent>
              </Card>
            </div>
          )}
          
          {uploadMethod === 'file' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Button variant="ghost" size="sm" onClick={() => setUploadMethod(null)}>
                  ← Back
                </Button>
                <h3 className="font-medium">Upload CV File</h3>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">Choose a file to upload</p>
                  <p className="text-sm text-gray-600">Supports PDF, DOCX, and TXT files</p>
                </div>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="cv-upload"
                />
                <label htmlFor="cv-upload">
                  <Button className="mt-4" asChild>
                    <span>Browse Files</span>
                  </Button>
                </label>
              </div>
              
              {uploadedFile && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <p className="font-medium text-green-900">{uploadedFile.name}</p>
                      <p className="text-sm text-green-700">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setUploadedFile(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {uploadMethod === 'text' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Button variant="ghost" size="sm" onClick={() => setUploadMethod(null)}>
                  ← Back
                </Button>
                <h3 className="font-medium">Paste CV Content</h3>
              </div>
              
              <Textarea
                placeholder="Paste your CV content here..."
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                className="min-h-[300px]"
              />
            </div>
          )}
          
          {(uploadedFile || cvText) && (
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleAnalyze} disabled={isAnalyzing}>
                {isAnalyzing ? 'Analyzing...' : 'Analyze CV'}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CVUploadModal;
