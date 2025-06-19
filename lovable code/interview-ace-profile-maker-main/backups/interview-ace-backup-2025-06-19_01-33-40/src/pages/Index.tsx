import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/homepage/Navigation';
import HeroSection from '@/components/homepage/HeroSection';
import FeaturesSection from '@/components/homepage/FeaturesSection';
import TestimonialsSection from '@/components/homepage/TestimonialsSection';
import PricingSection from '@/components/homepage/PricingSection';
import Footer from '@/components/homepage/Footer';

export default function HomePage() {
  const navigate = useNavigate();
  const handleAuthClick = () => navigate('/auth');

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
