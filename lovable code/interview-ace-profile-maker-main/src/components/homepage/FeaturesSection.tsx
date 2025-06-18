
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, Search, Briefcase } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      id: 'cv-builder',
      icon: FileText,
      title: 'CV Builder',
      description: 'Create ATS-optimized CVs from scratch or upload existing ones. Our AI learns your writing style and tailors your CV for each job application.',
      benefits: [
        'Upload existing CV or build from scratch',
        'AI-powered grammar correction',
        'ATS-compliant formatting',
        'Job-specific tailoring',
        'Organized folder system'
      ]
    },
    {
      id: 'interview-coach',
      icon: Users,
      title: 'Interview Coach',
      description: 'Practice with AI-generated interview questions based on your target job. Get instant feedback on your answers and improve your confidence.',
      benefits: [
        'Job-specific interview questions',
        'Real-time answer feedback',
        'Tone and clarity analysis',
        'Keyword optimization',
        'Progress tracking'
      ]
    },
    {
      id: 'job-matching',
      icon: Search,
      title: 'Job Matching',
      description: 'Paste job descriptions and get instant CV optimization suggestions. Our AI analyzes keywords and requirements to maximize your match score.',
      benefits: [
        'Instant job description analysis',
        'Keyword matching',
        'CV optimization suggestions',
        'Application tracking',
        'Success rate insights'
      ]
    },
    {
      id: 'employers',
      icon: Briefcase,
      title: 'For Employers',
      description: 'Post jobs, receive pre-screened applications, and find the perfect candidates with AI-powered matching and relevance scoring.',
      benefits: [
        'Job posting platform',
        'Pre-recorded interviews',
        'AI candidate matching',
        'Relevance scoring',
        'Streamlined hiring'
      ]
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Everything you need to land your dream job
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Our comprehensive suite of AI-powered tools helps job seekers and employers 
            connect more effectively than ever before.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Card key={feature.id} className="hover-lift rounded-xl border-slate-200 hover:border-blue-200 transition-all duration-300">
                <CardHeader className="pb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-slate-900">{feature.title}</CardTitle>
                  <CardDescription className="text-slate-600 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {feature.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
                        <span className="text-slate-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
