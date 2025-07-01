import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileText, Target, Shield, Award, Upload, PlusCircle, ArrowRight, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import CVUploadModal from '@/components/cv/CVUploadModal';
import { useAuth } from '@/lib/auth';
import { motion } from 'framer-motion';
import { AnimatedCounter } from '@/components/ui/counter';
import { Card3D, FloatingCard } from '@/components/ui/3d-card';

interface HeroSectionProps {
  onGetStartedClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onGetStartedClick }) => {
  const [showCVOptions, setShowCVOptions] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      setShowCVOptions(true);
    } else {
      onGetStartedClick();
    }
  };

  const handleUploadSuccess = () => {
    setShowUploadModal(false);
    setShowCVOptions(false);
    navigate('/dashboard');
  };

  const handleBuildFromScratch = () => {
    setShowCVOptions(false);
    navigate('/cv-builder');
  };

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <div className="space-y-8">
              <div className="space-y-6">
                {/* Pain Point Hook */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2 text-red-700 mb-2">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-semibold">The UK Job Market Reality</span>
                  </div>
                  <p className="text-red-600 text-sm">
                    <strong>75% of applications get interviews, but 90% fail the interview.</strong> 
                    Most platforms stop at "application sent" - we help you actually get hired.
                  </p>
                </div>

                <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                  Stop getting interviews.
                  <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Start getting HIRED.
                  </span>
                </h1>
                
                <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                  The UK's only platform that doesn't just get you interviews - it gets you hired. 
                  Complete CV optimization, intelligent job applications, and AI-powered interview coaching.
                </p>

                {/* UK Market Focus */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-blue-700 mb-2">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold">Built for the UK Market</span>
                  </div>
                  <p className="text-blue-600 text-sm">
                    UK-specific CV formats, interview styles, and job market insights. 
                    Not another generic US platform.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleGetStarted}
                  className="h-12 px-8 bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isAuthenticated ? 'Create My CV Now' : 'Start Free – Build My CV Now'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Button
                  variant="outline"
                  className="h-12 px-8 border-slate-300 text-slate-700 hover:bg-slate-50"
                  onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  See Pricing
                </Button>
              </div>

              {/* Realistic Stats - Startup Honesty */}
              <motion.div 
                className="flex items-center space-x-8 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-2xl font-bold text-slate-900">
                    <AnimatedCounter value={40} suffix="%" />
                  </div>
                  <div className="text-sm text-slate-600">Target Interview Success</div>
                  <div className="text-xs text-slate-500">(vs. industry 10%)</div>
                </motion.div>
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-2xl font-bold text-slate-900">
                    £14.99
                  </div>
                  <div className="text-sm text-slate-600">Starting Price</div>
                  <div className="text-xs text-slate-500">(50% cheaper than competitors)</div>
                </motion.div>
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-2xl font-bold text-slate-900">
                    <Clock className="h-6 w-6 mx-auto text-blue-600" />
                  </div>
                  <div className="text-sm text-slate-600">30-Day Guarantee</div>
                  <div className="text-xs text-slate-500">Get hired or money back</div>
                </motion.div>
              </motion.div>
            </div>
            
            {/* Right side - Value Proposition */}
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
                      <h3 className="font-semibold text-slate-900">Complete Hiring Pipeline</h3>
                      <p className="text-sm text-slate-600">CV → Apply → Interview → Hired</p>
                      <div className="text-xs text-slate-500">No other platform offers this</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
            </div>
          </div>

          {/* Feature cards - Pain Point Focused */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <FloatingCard delay={0.1} className="group">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-100 card-3d">
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4 glow-blue"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <FileText className="h-6 w-6 text-white" />
                </motion.div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">UK-Optimized CVs</h3>
                <p className="text-slate-600">
                  A4 format, British English, UK industry keywords. Not generic US templates.
                </p>
              </div>
            </FloatingCard>
            
            <FloatingCard delay={0.2} className="group">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-100 card-3d">
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mb-4 glow-green"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Target className="h-6 w-6 text-white" />
                </motion.div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Smart Applications</h3>
                <p className="text-slate-600">Quality over quantity. UK job boards, intelligent matching.</p>
              </div>
            </FloatingCard>
            
            <FloatingCard delay={0.3} className="group">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-100 card-3d">
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 glow-purple"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Shield className="h-6 w-6 text-white" />
                </motion.div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Interview Success</h3>
                <p className="text-slate-600">10,000+ UK interview questions. AI coaching to actually get hired.</p>
              </div>
            </FloatingCard>
            
            <FloatingCard delay={0.4} className="group">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-100 card-3d">
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center mb-4 glow-pink"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Award className="h-6 w-6 text-white" />
                </motion.div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Success Guarantee</h3>
                <p className="text-slate-600">30-day money-back guarantee. Get hired or your money back.</p>
              </div>
            </FloatingCard>
          </motion.div>
        </div>
      </section>

      {/* CV Options Dialog */}
      <Dialog open={showCVOptions} onOpenChange={setShowCVOptions}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Your CV</DialogTitle>
            <DialogDescription>
              Choose how you'd like to get started with your CV
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button
              onClick={() => setShowUploadModal(true)}
              className="h-12 justify-start"
              variant="outline"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Existing CV
            </Button>
            <Button
              onClick={handleBuildFromScratch}
              className="h-12 justify-start"
              variant="outline"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Build from Scratch
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* CV Upload Modal */}
      {showUploadModal && (
        <CVUploadModal
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleUploadSuccess}
        />
      )}
    </>
  );
};

export default HeroSection;
