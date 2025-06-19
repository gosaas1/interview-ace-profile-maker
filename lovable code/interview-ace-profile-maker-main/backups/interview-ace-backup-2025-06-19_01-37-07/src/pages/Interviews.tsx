import { useState } from 'react';
import { HomeNavigation } from '@/components/navigation/HomeNavigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  MessageSquare, 
  Video, 
  Mic, 
  Clock, 
  Play,
  Settings,
  History
} from 'lucide-react';

interface InterviewType {
  id: string;
  title: string;
  description: string;
  duration: string;
  icon: React.ElementType;
}

const interviewTypes: InterviewType[] = [
  {
    id: 'general',
    title: 'General Interview',
    description: 'Practice common interview questions across various topics',
    duration: '30-45 min',
    icon: MessageSquare
  },
  {
    id: 'video',
    title: 'Video Interview',
    description: 'Practice video interviews with AI feedback on your presentation',
    duration: '20-30 min',
    icon: Video
  },
  {
    id: 'technical',
    title: 'Technical Interview',
    description: 'Practice coding and technical problem-solving questions',
    duration: '45-60 min',
    icon: Settings
  }
];

export const Interviews = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64">
        <HomeNavigation />
      </div>
      
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Interview Practice</h1>
            <p className="mt-2 text-gray-600">
              Choose an interview type to start practicing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {interviewTypes.map((type) => (
              <Card 
                key={type.id}
                className={`p-6 cursor-pointer transition-all ${
                  selectedType === type.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:shadow-lg'
                }`}
                onClick={() => setSelectedType(type.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{type.title}</h3>
                  <type.icon className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-gray-600 mb-4">{type.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-2" />
                  {type.duration}
                </div>
              </Card>
            ))}
          </div>

          {selectedType && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">
                    {interviewTypes.find(t => t.id === selectedType)?.title}
                  </h2>
                  <p className="text-gray-600">
                    Get ready for your practice interview
                  </p>
                </div>
                <Button size="lg">
                  <Play className="h-4 w-4 mr-2" />
                  Start Interview
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Preparation Tips</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Find a quiet environment</li>
                    <li>• Test your microphone and camera</li>
                    <li>• Have a glass of water ready</li>
                    <li>• Prepare your notes if needed</li>
                  </ul>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold mb-2">What to Expect</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• AI-powered interview simulation</li>
                    <li>• Real-time feedback on responses</li>
                    <li>• Performance analysis after completion</li>
                    <li>• Tips for improvement</li>
                  </ul>
                </Card>
              </div>
            </Card>
          )}

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Recent Practice Sessions</h2>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <History className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-gray-600">No practice sessions yet</p>
                    <p className="text-sm text-gray-500">Start your first interview practice to see your history</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}; 