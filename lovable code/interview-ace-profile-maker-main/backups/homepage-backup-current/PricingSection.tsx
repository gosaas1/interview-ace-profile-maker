import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Star, Sparkles, Crown, Zap, Shield, X, CreditCard } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { createCheckoutSession, STRIPE_PRICES, SubscriptionTier, getStripe } from '@/lib/stripe';
import { MOCK_MODE, mockCreateCheckoutSession, mockCreateOneTimePayment } from '@/lib/mockStripe';
import { toast } from 'sonner';

const PricingSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const plans = [
    {
      name: 'Free',
      price: '£0',
      period: '/month',
      description: 'Perfect for getting started with CV analysis',
      features: [
        '1 basic CV analysis',
        'Core feedback insights',
        'Basic formatting tips',
        'Community support'
      ],
      buttonText: 'Get Started Free',
      popular: false,
      gradient: 'from-slate-50 to-white',
      buttonStyle: 'bg-slate-800 hover:bg-slate-900 text-white',
      tier: 'free' as SubscriptionTier,
      isPayAsYouGo: false
    },
    {
      name: 'Pay-As-You-Go',
      price: '£2.49',
      period: '/analysis',
      description: 'No commitment, pay only when you need analysis',
      features: [
        'Per-analysis pricing',
        'Full AI-powered analysis',
        'Detailed improvement suggestions',
        'No monthly commitment'
      ],
      buttonText: 'Pay Per Analysis',
      popular: false,
      gradient: 'from-green-50 to-emerald-50',
      buttonStyle: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white',
      tier: 'free' as SubscriptionTier,
      isPayAsYouGo: true
    },
    {
      name: 'Starter/Student',
      price: '£11.99',
      period: '/month',
      description: 'Perfect for students and early career professionals',
      features: [
        '5 detailed CV analyses per month',
        'AI-powered improvement suggestions',
        'ATS compatibility checking',
        'Email support'
      ],
      buttonText: 'Start Student Plan',
      popular: false,
      gradient: 'from-blue-50 to-indigo-50',
      buttonStyle: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white',
      tier: 'starter' as SubscriptionTier
    },
    {
      name: 'Professional',
      price: '£17.99',
      period: '/month',
      description: 'Most popular choice for active job seekers',
      features: [
        'Unlimited detailed CV analyses',
        'Advanced AI insights & suggestions',
        'Industry-specific optimization',
        'Priority support',
        'Export in multiple formats'
      ],
      buttonText: 'Go Professional',
      popular: true,
      gradient: 'from-blue-50 to-indigo-50',
      buttonStyle: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white',
      tier: 'professional' as SubscriptionTier
    },
    {
      name: 'Career Pro',
      price: '£35.99',
      period: '/month',
      description: 'Everything plus human review and premium coaching',
      features: [
        'Everything in Professional',
        'Human expert review',
        'Premium career coaching resources',
        'Interview preparation materials',
        'LinkedIn profile optimization',
        'Job search strategy guidance'
      ],
      buttonText: 'Upgrade to Career Pro',
      popular: false,
      gradient: 'from-purple-50 to-pink-50',
      buttonStyle: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white',
      tier: 'career_pro' as SubscriptionTier
    },
    {
      name: 'Elite Executive',
      price: '£69.99',
      period: '/month',
      description: 'Premium service with AI-backed 1-on-1 coaching',
      features: [
        'Everything in Career Pro',
        'AI-backed 1-on-1 coaching sessions',
        'Executive-level CV optimization',
        'Personal branding consultation',
        'Salary negotiation guidance',
        'VIP support & priority handling'
      ],
      buttonText: 'Go Elite Executive',
      popular: false,
      gradient: 'from-slate-900 to-purple-900',
      buttonStyle: 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold',
      tier: 'elite_executive' as SubscriptionTier,
      textColor: 'text-white',
      priceColor: 'text-yellow-400',
      descColor: 'text-slate-300',
      featureColor: 'text-slate-200'
    }
  ];

  const handleSubscription = async (plan: typeof plans[0]) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Special handling for Elite Executive plan - navigate to the page directly
    if (plan.tier === 'elite_executive') {
      navigate('/elite-executive');
      return;
    }

    if (plan.tier === 'free' && !plan.isPayAsYouGo) {
      navigate('/dashboard');
      return;
    }

    setLoadingPlan(plan.name);
    try {
      if (MOCK_MODE) {
        if (plan.isPayAsYouGo) {
          await mockCreateOneTimePayment(user.id);
          toast.success('Payment successful! Redirecting to analysis...');
          navigate('/cv-analysis');
        } else {
          await mockCreateCheckoutSession(
            plan.tier === 'career_pro' ? 'careerPro' : plan.tier,
            user.id,
            plan.tier,
            'monthly'
          );
          toast.success('Subscription activated! Redirecting to dashboard...');
          navigate('/dashboard');
        }
      } else {
        if (plan.isPayAsYouGo) {
          // Handle pay-as-you-go
          const payAsYouGoConfig = STRIPE_PRICES.payAsYouGo;
          const sessionUrl = await createCheckoutSession(payAsYouGoConfig.priceId, user.id);
          window.location.href = sessionUrl;
        } else {
          // Handle subscription plans
          const stripeTier = plan.tier === 'career_pro' ? 'careerPro' : plan.tier;
          const priceConfig = STRIPE_PRICES[stripeTier as keyof typeof STRIPE_PRICES];
          
          if (!priceConfig || typeof priceConfig !== 'object' || !('monthly' in priceConfig)) {
            throw new Error(`No price configuration found for tier: ${plan.tier}`);
          }

          const sessionUrl = await createCheckoutSession(priceConfig.monthly, user.id);
          window.location.href = sessionUrl;
        }
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to process subscription. Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Simple, transparent pricing</span>
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Choose your plan
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Start free and upgrade as you grow. All plans include our core AI-powered features 
            to help you land your dream job.
          </p>
        </div>

        {/* 
          SENIOR FRONTEND DEVELOPER SOLUTION:
          
          RESEARCH-BASED APPROACH: Using proven CSS Grid techniques from:
          - MDN Layout Cookbook for equal height cards
          - CSS-Tricks flexbox/absolute positioning patterns
          - Real-world pricing card implementations
          
          KEY PRINCIPLES:
          1. CSS Grid with equal heights using grid-template-rows: 1fr
          2. Badge positioned absolutely with proper containment
          3. Card structure uses flexbox internally for content distribution
          4. No complex calculations or nested grids that can break
          5. Consistent font styling matching application patterns
        */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
            {plans.map((plan, index) => (
              <div 
                key={plan.name} 
                className="relative group"
              >
                {/* Most Popular Badge - Absolutely Positioned Outside Card Flow */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center">
                      <Star className="w-4 h-4 mr-1.5" />
                      Most Popular
                    </div>
                  </div>
                )}
                
                {/* Card Container - Uses Flexbox for Internal Layout */}
                <Card className={`
                  h-full flex flex-col relative
                  rounded-2xl transition-all duration-300
                  border-2 shadow-lg hover:shadow-xl
                  bg-gradient-to-br ${plan.gradient}
                  ${plan.popular 
                    ? 'border-green-400 shadow-green-100 hover:glow-blue' 
                    : 'border-slate-200 hover:border-blue-300 hover:glow-blue'
                  }
                  group-hover:scale-[1.02] transform-gpu
                `}>
                  
                  {/* Header Section - Fixed Height with Consistent Typography */}
                  <CardHeader className="text-center pt-8 pb-6 flex-shrink-0">
                    <CardTitle className={`text-2xl font-bold mb-4 ${plan.textColor || 'text-slate-900'}`}>
                      {plan.name}
                    </CardTitle>
                    
                    <div className="mb-3">
                      <span className={`text-4xl font-bold ${plan.priceColor || 'text-slate-900'}`}>
                        {plan.price}
                      </span>
                      <span className={`text-base font-medium ${plan.descColor || 'text-slate-600'} ml-1`}>
                        {plan.period}
                      </span>
                    </div>
                    
                    <CardDescription className={`text-base leading-relaxed ${plan.descColor || 'text-slate-600'}`}>
                      {plan.description}
                    </CardDescription>
                  </CardHeader>

                  {/* Features Section - Grows to Fill Available Space */}
                  <CardContent className="flex-grow px-8 pb-6">
                    <ul className="space-y-4">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <Check className={`h-5 w-5 mr-3 mt-0.5 flex-shrink-0 ${
                            plan.popular ? 'text-green-600' : 'text-blue-600'
                          }`} />
                          <span className={`text-sm leading-relaxed ${plan.featureColor || 'text-slate-700'}`}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  {/* Button Section - Fixed at Bottom */}
                  <CardContent className="px-8 pb-8 flex-shrink-0">
                    <Button
                      onClick={() => handleSubscription(plan)}
                      disabled={loadingPlan === plan.name}
                      className={`
                        w-full py-3 px-6 rounded-xl font-semibold text-base
                        transition-all duration-200 transform
                        hover:scale-105 active:scale-95
                        ${plan.buttonStyle}
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                      `}
                    >
                      {loadingPlan === plan.name ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        plan.buttonText
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Information - Consistent Typography */}
        <div className="text-center mt-12 text-sm text-slate-600">
          <p className="mb-2">All plans include our core AI-powered CV analysis features. Upgrade or downgrade anytime.</p>
          <div className="flex justify-center items-center space-x-6 mt-4">
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-2 text-green-600" />
              <span>30-day money-back guarantee</span>
            </div>
            <div className="flex items-center">
              <X className="h-4 w-4 mr-2 text-blue-600" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center">
              <CreditCard className="h-4 w-4 mr-2 text-purple-600" />
              <span>Secure payment processing</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
