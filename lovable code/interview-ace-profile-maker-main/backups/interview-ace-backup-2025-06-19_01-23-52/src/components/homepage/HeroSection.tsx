import { Button } from '@/components/ui/button';
import { FileText, Target, Shield, Award } from 'lucide-react';

interface HeroSectionProps {
  onGetStartedClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onGetStartedClick }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                Land your dream job.
                <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  AI-powered. Human-made.
                </span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                Transform your career with AI-driven CV optimization, interview coaching, and job matching. 
                Get noticed by employers and land your perfect role.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={onGetStartedClick}
                className="h-12 px-8 bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Start Free – Build My CV Now
              </Button>
            </div>

            <div className="flex items-center space-x-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">98%</div>
                <div className="text-sm text-slate-600">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">50K+</div>
                <div className="text-sm text-slate-600">CVs Created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">4.9★</div>
                <div className="text-sm text-slate-600">User Rating</div>
              </div>
            </div>
          </div>
          
          {/* Right side - Hero image */}
          <div className="relative">
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="aspect-[4/3] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto flex items-center justify-center">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-slate-900">CV Optimized Successfully!</h3>
                    <p className="text-sm text-slate-600">Your CV is now 95% ATS compatible</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-100">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">ATS-Optimized</h3>
            <p className="text-slate-600">95% success rate with Applicant Tracking Systems</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-100">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mb-4">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Job-Specific</h3>
            <p className="text-slate-600">Tailored content for each position you apply to</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-100">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">AI Detection Bypass</h3>
            <p className="text-slate-600">Humanized content that maintains authenticity</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-100">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center mb-4">
              <Award className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Interview Success</h3>
            <p className="text-slate-600">3x more interview callbacks with our platform</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
