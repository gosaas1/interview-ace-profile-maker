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
import { motion } from 'framer-motion';
import { FloatingCard } from '@/components/ui/3d-card';
import { AnimatedCounter } from '@/components/ui/counter';

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
            <motion.div 
              className="lg:col-span-2 space-y-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, staggerChildren: 0.1 }}
            >
              {mockJobs.map((job, index) => (
                <FloatingCard key={job.id} delay={index * 0.1}>
                  <Card 
                    className={`p-6 cursor-pointer card-3d ${
                      selectedJob?.id === job.id 
                        ? 'ring-2 ring-blue-500 bg-blue-50 glow-blue' 
                        : 'glow-green'
                    }`}
                    onClick={() => setSelectedJob(job)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <div className="flex items-center text-gray-600 mt-1">
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                          >
                            <Building2 className="h-4 w-4 mr-2" />
                          </motion.div>
                          {job.company}
                        </div>
                      </div>
                      <motion.div 
                        className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Star className="h-4 w-4 mr-1" />
                        </motion.div>
                        <AnimatedCounter value={job.matchScore} suffix="%" /> Match
                      </motion.div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <motion.div 
                        className="flex items-center text-gray-600"
                        whileHover={{ scale: 1.02 }}
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        {job.location}
                      </motion.div>
                      <motion.div 
                        className="flex items-center text-gray-600"
                        whileHover={{ scale: 1.02 }}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        {job.type}
                      </motion.div>
                      <motion.div 
                        className="flex items-center text-gray-600"
                        whileHover={{ scale: 1.02 }}
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        {job.salary}
                      </motion.div>
                    </div>

                    <p className="text-gray-600 line-clamp-2">{job.description}</p>
                  </Card>
                </FloatingCard>
              ))}
            </motion.div>

            <motion.div 
              className="lg:col-span-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {selectedJob ? (
                <motion.div
                  key={selectedJob.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-6 sticky top-8 card-3d glow-purple">
                    <motion.h2 
                      className="text-xl font-semibold mb-4"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {selectedJob.title}
                    </motion.h2>
                    <motion.div 
                      className="space-y-4 mb-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2, staggerChildren: 0.1 }}
                    >
                      <motion.div 
                        className="flex items-center text-gray-600"
                        whileHover={{ scale: 1.02, x: 5 }}
                      >
                        <Building2 className="h-4 w-4 mr-2" />
                        {selectedJob.company}
                      </motion.div>
                      <motion.div 
                        className="flex items-center text-gray-600"
                        whileHover={{ scale: 1.02, x: 5 }}
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        {selectedJob.location}
                      </motion.div>
                      <motion.div 
                        className="flex items-center text-gray-600"
                        whileHover={{ scale: 1.02, x: 5 }}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        {selectedJob.type}
                      </motion.div>
                      <motion.div 
                        className="flex items-center text-gray-600"
                        whileHover={{ scale: 1.02, x: 5 }}
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        {selectedJob.salary}
                      </motion.div>
                    </motion.div>

                    <motion.div 
                      className="space-y-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 className="font-semibold">Job Description</h3>
                      <p className="text-gray-600">{selectedJob.description}</p>
                    </motion.div>

                    <motion.div 
                      className="mt-6 space-y-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button className="w-full">
                          Apply Now
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button variant="outline" className="w-full">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View on Company Website
                        </Button>
                      </motion.div>
                    </motion.div>
                  </Card>
                </motion.div>
              ) : (
                <Card className="p-6 text-center text-gray-500 card-3d">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    Select a job to view details
                  </motion.div>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}; 