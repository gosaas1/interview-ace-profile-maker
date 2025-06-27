import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { useEffect } from 'react';
import Navigation from '@/components/homepage/Navigation';
import HeroSection from '@/components/homepage/HeroSection';
import FeaturesSection from '@/components/homepage/FeaturesSection';
import TestimonialsSection from '@/components/homepage/TestimonialsSection';
import PricingSection from '@/components/homepage/PricingSection';
import Footer from '@/components/homepage/Footer';

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  
  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);
  
  const handleAuthClick = () => navigate('/auth');
  
  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-slate-600 font-medium">Loading ApplyAce...</p>
        </div>
      </div>
    );
  }
  
  // Don't render if authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Navigation onAuthClick={handleAuthClick} />
      <main className="flex-1">
        <HeroSection onGetStartedClick={handleAuthClick} />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
