import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Crown, Shield, Eye, Lock, Zap, Target, Globe, Award, CheckCircle, Star, ArrowRight, Play, Users, TrendingUp, Brain, Briefcase, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/auth';

// Landio-inspired cursor with mouse follower
const EliteCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorOutlineRef = useRef<HTMLDivElement>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [mouseTrail, setMouseTrail] = useState<Array<{ x: number; y: number; id: number }>>([]);

  useEffect(() => {
    let animationFrame: number | undefined;
    let trailId = 0;
    
    const updateCursor = (e: MouseEvent) => {
      const newPosition = { x: e.clientX, y: e.clientY };
      setCursorPosition(newPosition);
      
      // Add to mouse trail
      setMouseTrail(prev => {
        const newTrail = [...prev, { ...newPosition, id: trailId++ }];
        return newTrail.slice(-8); // Keep last 8 trail points
      });
      
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }
      if (cursorOutlineRef.current) {
        cursorOutlineRef.current.style.transform = `translate(${e.clientX - 16}px, ${e.clientY - 16}px)`;
      }
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    document.addEventListener('mousemove', updateCursor);
    
    // Add hover listeners to interactive elements
    const interactiveElements = document.querySelectorAll('button, a, [role="button"]');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      document.removeEventListener('mousemove', updateCursor);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <>
      {/* Custom cursor dot */}
      <div
        ref={cursorRef}
        className="elite-cursor-dot"
        style={{
          transform: isHovering ? 'scale(1.5)' : 'scale(1)',
        }}
      />
      
      {/* Cursor outline ring */}
      <div
        ref={cursorOutlineRef}
        className="elite-cursor-outline"
        style={{
          transform: isHovering ? 'scale(1.5)' : 'scale(1)',
        }}
      />
      
      {/* Mouse trail particles */}
      {mouseTrail.map((point, index) => (
        <div
          key={point.id}
          className="elite-mouse-trail"
          style={{
            left: point.x - 2,
            top: point.y - 2,
            opacity: (index + 1) / mouseTrail.length * 0.6,
            transform: `scale(${(index + 1) / mouseTrail.length})`,
          }}
        />
      ))}
    </>
  );
};

// Floating 3D elements with mouse tracking
const Floating3DElement = ({ 
  icon: Icon, 
  initialX, 
  initialY, 
  mousePosition 
}: { 
  icon: any; 
  initialX: number; 
  initialY: number; 
  mousePosition: { x: number; y: number } 
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (elementRef.current) {
      const element = elementRef.current;
      const rect = element.getBoundingClientRect();
      const elementCenterX = rect.left + rect.width / 2;
      const elementCenterY = rect.top + rect.height / 2;
      
      const deltaX = (mousePosition.x - elementCenterX) * 0.02;
      const deltaY = (mousePosition.y - elementCenterY) * 0.02;
      
      element.style.transform = `
        translate3d(${deltaX}px, ${deltaY}px, 0)
        rotateX(${deltaY * 0.5}deg)
        rotateY(${deltaX * 0.5}deg)
      `;
    }
  }, [mousePosition]);

  return (
    <div
      ref={elementRef}
      className="elite-floating-element"
      style={{
        position: 'absolute',
        left: `${initialX}%`,
        top: `${initialY}%`,
      }}
    >
      <Icon className="w-8 h-8 text-white/20" />
    </div>
  );
};

// Background orbs with mouse tracking
const BackgroundOrbs = ({ mousePosition }: { mousePosition: { x: number; y: number } }) => {
  return (
    <div className="elite-background-orbs">
      {/* Purple orb */}
      <div 
        className="elite-orb elite-orb-purple"
        style={{
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
        }}
      />
      
      {/* Blue orb */}
      <div 
        className="elite-orb elite-orb-blue"
        style={{
          transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * 0.015}px)`,
        }}
      />
      
      {/* Violet orb */}
      <div 
        className="elite-orb elite-orb-violet"
        style={{
          transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * -0.01}px)`,
        }}
      />
    </div>
  );
};

const EliteExecutive: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'semi-annual' | 'annual'>('monthly');

  // Mouse tracking for 3D effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Intersection Observer for fade-in animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('elite-fade-in-visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const elements = document.querySelectorAll('.elite-fade-in');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handlePayment = async (billingCycle: 'monthly' | 'semi-annual' | 'annual') => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setIsLoading(true);
    try {
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_mock');
      if (!stripe) throw new Error('Stripe failed to load');

      const priceIds = {
        monthly: 'price_elite_monthly',
        'semi-annual': 'price_elite_semi_annual',
        annual: 'price_elite_annual'
      };

      const response = await fetch('http://localhost:8080/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: priceIds[billingCycle],
          userId: user.id,
          userEmail: user.email,
          successUrl: `${window.location.origin}/payment-success`,
          cancelUrl: `${window.location.origin}/elite-executive`,
        }),
      });

      const { sessionId } = await response.json();
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const pricing = {
    monthly: { price: '£71.99', originalPrice: '£99.99', savings: '' },
    'semi-annual': { price: '£50.39', originalPrice: '£71.99', savings: '30% OFF' },
    annual: { price: '£35.99', originalPrice: '£71.99', savings: '50% OFF' }
  };

  return (
    <div className="elite-executive-page">
      <EliteCursor />
      <BackgroundOrbs mousePosition={mousePosition} />
      
      {/* Floating 3D elements */}
      <Floating3DElement icon={Crown} initialX={15} initialY={20} mousePosition={mousePosition} />
      <Floating3DElement icon={Shield} initialX={85} initialY={25} mousePosition={mousePosition} />
      <Floating3DElement icon={Target} initialX={10} initialY={60} mousePosition={mousePosition} />
      <Floating3DElement icon={Sparkles} initialX={90} initialY={70} mousePosition={mousePosition} />

      {/* Hero Section */}
      <section className="elite-hero">
        <div className="elite-container">
          <div className="elite-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="elite-crown-badge">
              <Crown className="w-6 h-6" />
              <span>Elite Executive</span>
            </div>
          </div>
          
          <h1 className="elite-hero-title elite-fade-in" style={{ animationDelay: '0.2s' }}>
            Discreet Executive
            <br />
            <span className="elite-gradient-text">Job Search Mastery</span>
          </h1>
          
          <p className="elite-hero-subtitle elite-fade-in" style={{ animationDelay: '0.3s' }}>
            For C-suite executives who need absolute discretion, zero visibility risk,
            <br />
            and AI-powered access to the hidden executive job market.
          </p>
          
          <div className="elite-hero-pricing elite-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="elite-pricing-toggle">
              <button
                className={`elite-toggle-btn ${selectedPlan === 'monthly' ? 'active' : ''}`}
                onClick={() => setSelectedPlan('monthly')}
              >
                Monthly
              </button>
              <button
                className={`elite-toggle-btn ${selectedPlan === 'semi-annual' ? 'active' : ''}`}
                onClick={() => setSelectedPlan('semi-annual')}
              >
                6 Months
                <span className="elite-savings-badge">30% OFF</span>
              </button>
              <button
                className={`elite-toggle-btn ${selectedPlan === 'annual' ? 'active' : ''}`}
                onClick={() => setSelectedPlan('annual')}
              >
                Annual
                <span className="elite-savings-badge">50% OFF</span>
              </button>
            </div>
            
            <div className="elite-price-display">
              <span className="elite-price">{pricing[selectedPlan].price}</span>
              <span className="elite-price-period">/month</span>
              {pricing[selectedPlan].savings && (
                <span className="elite-original-price">{pricing[selectedPlan].originalPrice}</span>
              )}
            </div>
            
            <button
              className="elite-cta-button"
              onClick={() => handlePayment(selectedPlan)}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Start Elite Journey'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="elite-section">
        <div className="elite-container">
          <h2 className="elite-section-title elite-fade-in">
            The Executive Dilemma
          </h2>
          
          <div className="elite-pain-points">
            <div className="elite-pain-point elite-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="elite-pain-icon">
                <Eye className="w-8 h-8" />
              </div>
              <h3>Visibility Risk</h3>
              <p>Your current company, board members, or industry contacts cannot know you're exploring opportunities.</p>
            </div>
            
            <div className="elite-pain-point elite-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="elite-pain-icon">
                <Lock className="w-8 h-8" />
              </div>
              <h3>Hidden Market Access</h3>
              <p>80% of C-suite roles are never posted publicly. You need insider access to opportunities before they're announced.</p>
            </div>
            
            <div className="elite-pain-point elite-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="elite-pain-icon">
                <Brain className="w-8 h-8" />
              </div>
              <h3>Strategic Positioning</h3>
              <p>Your executive narrative must be crafted with surgical precision to command 7-figure compensation packages.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Cascade Section */}
      <section className="elite-section">
        <div className="elite-container">
          <h2 className="elite-section-title elite-fade-in">
            Elite Executive Arsenal
          </h2>
          
          <div className="elite-features-cascade">
            <div className="elite-feature-card elite-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="elite-feature-icon">
                <Shield className="w-12 h-12" />
              </div>
              <div className="elite-feature-content">
                <h3>Zero Visibility Risk</h3>
                <p>Military-grade encryption, NDAs with all parties, and completely offline profile optimization. Your search remains invisible.</p>
                <ul>
                  <li>No LinkedIn tracking or profile changes</li>
                  <li>Encrypted communication channels</li>
                  <li>Anonymous market research</li>
                </ul>
              </div>
            </div>
            
            <div className="elite-feature-card elite-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="elite-feature-icon">
                <Target className="w-12 h-12" />
              </div>
              <div className="elite-feature-content">
                <h3>Hidden Market Intelligence</h3>
                <p>AI monitors 500+ executive search firms, private equity networks, and board connections for opportunities before they go public.</p>
                <ul>
                  <li>Pre-announcement opportunity alerts</li>
                  <li>Executive search firm relationships</li>
                  <li>Board network intelligence</li>
                </ul>
              </div>
            </div>
            
            <div className="elite-feature-card elite-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="elite-feature-icon">
                <Crown className="w-12 h-12" />
              </div>
              <div className="elite-feature-content">
                <h3>C-Suite Narrative Mastery</h3>
                <p>AI analyzes 10,000+ successful C-suite transitions to craft your executive narrative for maximum impact and compensation.</p>
                <ul>
                  <li>7-figure compensation positioning</li>
                  <li>Board-ready executive summary</li>
                  <li>Strategic leadership storytelling</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Stats Section */}
      <section className="elite-section elite-stats-3d">
        <div className="elite-container">
          <div className="elite-stats-grid">
            <div className="elite-stat-card elite-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="elite-stat-number">500+</div>
              <div className="elite-stat-label">Elite Executives Placed</div>
            </div>
            
            <div className="elite-stat-card elite-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="elite-stat-number">£2.5M</div>
              <div className="elite-stat-label">Average Compensation Increase</div>
            </div>
            
            <div className="elite-stat-card elite-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="elite-stat-number">100%</div>
              <div className="elite-stat-label">Confidentiality Maintained</div>
            </div>
            
            <div className="elite-stat-card elite-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="elite-stat-number">45 Days</div>
              <div className="elite-stat-label">Average Time to Offer</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Cascade */}
      <section className="elite-section">
        <div className="elite-container">
          <h2 className="elite-section-title elite-fade-in">
            Executive Success Stories
          </h2>
          
          <div className="elite-testimonials-cascade">
            <div className="elite-testimonial-card elite-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="elite-testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current text-yellow-400" />
                ))}
              </div>
              <p>"ApplyAce secured my transition from FTSE 100 CEO to Private Equity Partner with complete discretion. The process was invisible to my board and the compensation increase was extraordinary."</p>
              <div className="elite-testimonial-author">
                <strong>Sarah M.</strong>
                <span>Former FTSE 100 CEO → PE Partner</span>
              </div>
            </div>
            
            <div className="elite-testimonial-card elite-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="elite-testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current text-yellow-400" />
                ))}
              </div>
              <p>"The AI identified a Chairman role that wasn't even on the market yet. Three weeks later, I had the position with a £1.8M package. Absolute game-changer for executive search."</p>
              <div className="elite-testimonial-author">
                <strong>James R.</strong>
                <span>Chairman, Tech Unicorn</span>
              </div>
            </div>
            
            <div className="elite-testimonial-card elite-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="elite-testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current text-yellow-400" />
                ))}
              </div>
              <p>"Complete confidentiality during my transition from Global MD to CEO. The executive narrative positioning was so precise, I received three competing offers within 30 days."</p>
              <div className="elite-testimonial-author">
                <strong>Michael K.</strong>
                <span>CEO, Global Manufacturing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="elite-final-cta">
        <div className="elite-container">
          <div className="elite-fade-in">
            <h2 className="elite-final-title">
              Ready to Access the Hidden Executive Market?
            </h2>
            
            <p className="elite-final-subtitle">
              Join the elite network of executives who secure their next C-suite role
              <br />
              with complete discretion and maximum compensation.
            </p>
            
            <div className="elite-guarantees">
              <div className="elite-guarantee">
                <CheckCircle className="w-6 h-6" />
                <span>100% Confidentiality Guarantee</span>
              </div>
              <div className="elite-guarantee">
                <CheckCircle className="w-6 h-6" />
                <span>Military-Grade Encryption</span>
              </div>
              <div className="elite-guarantee">
                <CheckCircle className="w-6 h-6" />
                <span>Board-Level NDAs</span>
              </div>
            </div>
            
            <button
              className="elite-final-cta-button"
              onClick={() => handlePayment(selectedPlan)}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Secure Your Elite Access'}
              <Crown className="w-6 h-6 ml-3" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EliteExecutive; 