import { useState } from 'react';
import { HomeNavigation } from '@/components/navigation/HomeNavigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Briefcase, 
  Building2, 
  MapPin, 
  Clock, 
  DollarSign,
  Filter,
  Search,
  Star,
  ExternalLink
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  matchScore: number;
}

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'Tech Corp',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120k - $150k',
    description: 'We are looking for a Senior Software Engineer to join our team...',
    matchScore: 95
  },
  {
    id: '2',
    title: 'Frontend Developer',
    company: 'Web Solutions',
    location: 'Remote',
    type: 'Full-time',
    salary: '$90k - $110k',
    description: 'Join our team as a Frontend Developer and help build amazing web applications...',
    matchScore: 88
  },
  {
    id: '3',
    title: 'Full Stack Developer',
    company: 'StartupX',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$100k - $130k',
    description: 'Looking for a Full Stack Developer to work on exciting projects...',
    matchScore: 92
  }
];

export const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64">
        <HomeNavigation />
      </div>
      
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Job Matches</h1>
            <p className="mt-2 text-gray-600">
              Find your next opportunity based on your CV and preferences
            </p>
          </div>

          <div className="flex space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {mockJobs.map((job) => (
                <Card 
                  key={job.id}
                  className={`p-6 cursor-pointer transition-all ${
                    selectedJob?.id === job.id 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedJob(job)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                      <div className="flex items-center text-gray-600 mt-1">
                        <Building2 className="h-4 w-4 mr-2" />
                        {job.company}
                      </div>
                    </div>
                    <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full">
                      <Star className="h-4 w-4 mr-1" />
                      {job.matchScore}% Match
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {job.type}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      {job.salary}
                    </div>
                  </div>

                  <p className="text-gray-600 line-clamp-2">{job.description}</p>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              {selectedJob ? (
                <Card className="p-6 sticky top-8">
                  <h2 className="text-xl font-semibold mb-4">{selectedJob.title}</h2>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center text-gray-600">
                      <Building2 className="h-4 w-4 mr-2" />
                      {selectedJob.company}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {selectedJob.location}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {selectedJob.type}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      {selectedJob.salary}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Job Description</h3>
                    <p className="text-gray-600">{selectedJob.description}</p>
                  </div>

                  <div className="mt-6 space-y-3">
                    <Button className="w-full">
                      Apply Now
                    </Button>
                    <Button variant="outline" className="w-full">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on Company Website
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card className="p-6 text-center text-gray-500">
                  Select a job to view details
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}; 