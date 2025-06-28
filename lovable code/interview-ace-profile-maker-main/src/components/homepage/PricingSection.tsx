import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Star, Sparkles, Crown, Zap } from 'lucide-react';
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

  // Handle payment button clicks
  const handlePurchase = async (planName: string, billingPeriod: 'monthly' | 'sixMonth' | 'annual' = 'monthly') => {
    // Check if user is logged in
    if (!user) {
      toast.error('Please sign in to continue');
      navigate('/auth');
      return;
    }

    setLoadingPlan(`${planName}-${billingPeriod}`);

    try {
      if (planName === 'Free') {
        // Free plan - just redirect to dashboard
        navigate('/dashboard');
        return;
      }

      if (planName === 'Pay-as-you-go') {
        // One-time payment using the pay-as-you-go Price ID
        if (MOCK_MODE) {
          await mockCreateOneTimePayment(user.id);
        } else {
          const session = await createCheckoutSession(STRIPE_PRICES.payAsYouGo.priceId, user.id);
          if (session && session.url) {
            window.location.href = session.url;
          } else {
            throw new Error('Failed to create payment session');
          }
        }
      } else {
        // Subscription plans
        let planKey: keyof typeof STRIPE_PRICES;
        let tier: SubscriptionTier;
        
        switch (planName) {
          case 'Starter':
            planKey = 'starter';
            tier = 'starter';
            break;
          case 'Professional':
            planKey = 'professional';
            tier = 'professional';
            break;
          case 'Career Pro':
            planKey = 'careerPro';
            tier = 'career_pro';
            break;
          case 'Elite Executive':
            planKey = 'eliteExecutive';
            tier = 'elite_executive';
            break;
          default:
            throw new Error(`Unknown plan: ${planName}`);
        }
        
        const planPrices = STRIPE_PRICES[planKey];
        if (!planPrices || typeof planPrices === 'object' && !('monthly' in planPrices)) {
          throw new Error(`Price configuration not found for ${planName}`);
        }
        
        const priceId = (planPrices as any)[billingPeriod];
        
        if (!priceId) {
          throw new Error(`Price ID not found for ${planName} - ${billingPeriod}`);
        }

        if (MOCK_MODE) {
          await mockCreateCheckoutSession(
            priceId,
            user.id,
            tier,
            billingPeriod
          );
        } else {
          const session = await createCheckoutSession(priceId, user.id);
          if (session && session.url) {
            window.location.href = session.url;
          } else {
            throw new Error('Failed to create payment session');
          }
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      
      // More specific error messages
      let errorMessage = 'Payment failed. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('session')) {
          errorMessage = 'Unable to create payment session. Please try again.';
        } else if (error.message.includes('400')) {
          errorMessage = 'Invalid payment request. Please refresh and try again.';
        } else if (error.message.includes('500')) {
          errorMessage = 'Server error. Please try again in a few minutes.';
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setLoadingPlan(null);
    }
  };

  const handlePlanClick = async (plan: any) => {
    if (plan.name === 'Elite Executive') {
      // Navigate to premium landing page for Elite Executive
      navigate('/elite-executive');
      return;
    }

    if (!user) {
      toast.error('Please sign in to continue');
      navigate('/auth');
      return;
    }

    setLoadingPlan(plan.name);

    try {
      const planKey = plan.name.toLowerCase().replace(' ', '') as keyof typeof STRIPE_PRICES;
      const planPrices = STRIPE_PRICES[planKey];
      
      if (!planPrices) {
        throw new Error(`No pricing configuration found for ${plan.name}`);
      }

      // Handle different pricing structures
      let priceId: string;
      if ('priceId' in planPrices) {
        // Pay-as-you-go structure
        priceId = planPrices.priceId;
      } else if ('monthly' in planPrices) {
        // Subscription structure
        priceId = planPrices.monthly;
      } else {
        throw new Error(`Invalid pricing structure for ${plan.name}`);
      }

      if (MOCK_MODE) {
        await mockCreateCheckoutSession(
          priceId,
          user.id,
          plan.name.toLowerCase().replace(' ', '_'),
          'monthly'
        );
      } else {
        const session = await createCheckoutSession(priceId, user.id);
        if (session && session.url) {
          window.location.href = session.url;
        } else {
          throw new Error('Failed to create payment session');
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  };

  // First row - Basic plans (Free, Pay-as-you-go, Starter)
  const basicPlans = [
    {
      name: 'Free',
      price: '£0',
      period: '/month',
      description: 'Perfect for getting started',
      features: [
        '1 basic CV analysis/month',
        '1 CV build or upload',
        'Basic ATS compatibility check',
        'Simple CV score',
        'Community support'
      ],
      buttonText: 'Start Free',
      popular: false,
      gradient: 'from-slate-50 to-white',
      buttonStyle: 'bg-slate-600 hover:bg-slate-700 text-white',
      icon: <Check className="w-6 h-6" />
    },
    {
      name: 'Pay-as-you-go',
      price: '£2.49',
      period: '/analysis',
      description: 'No commitment, pay when you need it',
      features: [
        'Detailed CV analysis per purchase',
        'Full keyword optimization',
        'Improvement suggestions',
        'ATS optimization',
        'Perfect for testing our service'
      ],
      buttonText: 'Buy Analysis',
      popular: false,
      gradient: 'from-blue-50 to-cyan-50',
      buttonStyle: 'bg-blue-600 hover:bg-blue-700 text-white',
      icon: <Zap className="w-6 h-6" />,
      annualDiscount: {
        sixMonth: null,
        twelveMonth: null
      }
    },
    {
      name: 'Starter',
      price: '£11.99',
      period: '/month',
      description: 'Great for students & early career',
      features: [
        '5 detailed CV analyses/month',
        'Unlimited CV builds & uploads',
        'Industry insights',
        '25 job applications/month',
        '10 interview practice sessions'
      ],
      buttonText: 'Start Starter Plan',
      popular: false,
      gradient: 'from-green-50 to-emerald-50',
      buttonStyle: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white',
      icon: <Star className="w-6 h-6" />,
      annualDiscount: {
        sixMonth: '£41.96 (30% off)',
        twelveMonth: '£59.94 (50% off)'
      }
    }
  ];

  // Second row - Premium plans (Professional, Career Pro, Elite Executive)
  const premiumPlans = [
    {
      name: 'Professional',
      price: '£17.99',
      period: '/month',
      description: 'Most popular for active job seekers',
      features: [
        'Unlimited CV analyses (GPT-4)',
        'Unlimited CV builds with premium templates',
        'Advanced job matching',
        'Unlimited applications & interview coaching',
        'Performance analytics',
        'Priority support'
      ],
      buttonText: 'Go Professional',
      popular: true,
      gradient: 'from-blue-50 to-indigo-50',
      buttonStyle: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white',
      icon: <Crown className="w-6 h-6" />,
      annualDiscount: {
        sixMonth: '£62.96 (30% off)',
        twelveMonth: '£89.94 (50% off)'
      }
    },
    {
      name: 'Career Pro',
      price: '£35.99',
      period: '/month',
      description: 'Premium features for career advancement',
      features: [
        'All Professional features',
        'Human CV review by experts',
        'Premium AI models (Claude)',
        'Video interview practice',
        'Industry insights & salary data',
        'Priority support',
        'Early access to new features'
      ],
      buttonText: 'Unlock Career Pro',
      popular: false,
      gradient: 'from-purple-50 to-pink-50',
      buttonStyle: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white',
      icon: <Sparkles className="w-6 h-6" />,
      annualDiscount: {
        sixMonth: '£125.96 (30% off)',
        twelveMonth: '£179.94 (50% off)'
      }
    },
    {
      name: 'Elite Executive',
      price: '£69.99',
      period: '/month',
      description: 'AI-backed coaching for executives',
      features: [
        'All Career Pro features',
        'AI-backed 1-on-1 coaching sessions',
        'Executive-level career strategy',
        'Premium dark mode experience',
        'White-glove concierge support',
        'Custom career roadmaps',
        'Industry networking connections'
      ],
      buttonText: 'Access Elite Portal',
      popular: false,
      gradient: 'from-slate-900 to-slate-700',
      buttonStyle: 'bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white',
      icon: <Crown className="w-6 h-6 text-gold-400" />,
      annualDiscount: {
        sixMonth: '£244.96 (30% off)',
        twelveMonth: '£349.94 (50% off)'
      }
    }
  ];

  const renderPlanCard = (plan: any) => (
    <Card 
      key={plan.name} 
      className={`relative hover-lift rounded-2xl transition-all duration-300 border shadow-lg hover:shadow-xl bg-gradient-to-br ${plan.gradient} ${
        plan.popular 
          ? 'ring-2 ring-green-400 scale-105 shadow-green-200 border-green-300 transform' 
          : 'border-slate-200 hover:scale-102'
      } h-full flex flex-col`}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1 shadow-lg">
            <Star className="h-3 w-3 fill-current" />
            <span>Most Popular</span>
          </div>
        </div>
      )}
      
      <CardHeader className="text-center pb-6 pt-10 flex-shrink-0">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-white/50 rounded-full">
            {plan.icon}
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-slate-900 mb-3">{plan.name}</CardTitle>
        <div className="mb-4">
          <span className="text-4xl font-bold text-slate-900">
            {plan.price}
          </span>
          {plan.period && <span className="text-slate-600 text-lg">{plan.period}</span>}
        </div>
        
        {/* Annual Discount Badges */}
        {plan.annualDiscount?.twelveMonth && (
          <div className="mb-4 space-y-2">
            <div className="text-sm bg-blue-100 text-blue-700 px-3 py-2 rounded-lg cursor-pointer hover:bg-blue-200 transition-colors"
                 onClick={() => handlePurchase(plan.name, 'annual')}>
              12-month: {plan.annualDiscount.twelveMonth}
            </div>
            <div className="text-sm bg-purple-100 text-purple-700 px-3 py-2 rounded-lg cursor-pointer hover:bg-purple-200 transition-colors"
                 onClick={() => handlePurchase(plan.name, 'sixMonth')}>
              6-month: {plan.annualDiscount.sixMonth}
            </div>
          </div>
        )}
        
        <CardDescription className="text-slate-600 text-base leading-relaxed">
          {plan.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0 px-6 pb-8 flex-grow flex flex-col">
        <Button 
          className={`w-full mb-6 py-4 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 text-base ${plan.buttonStyle}`}
          onClick={() => handlePlanClick(plan)}
          disabled={loadingPlan === plan.name}
        >
          {loadingPlan === plan.name ? 'Processing...' : plan.buttonText}
        </Button>
        
        <ul className="space-y-3 flex-grow">
          {plan.features.map((feature: string, index: number) => (
            <li key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                <Check className="h-5 w-5 text-green-600 bg-green-100 rounded-full p-1" />
              </div>
              <span className="text-slate-700 text-base leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );

  return (
    <section id="pricing" className="py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Simple, transparent pricing</span>
          </div>
          <h2 className="text-5xl font-bold text-slate-900 mb-6">
            Choose your plan
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Start free and upgrade as you grow. All plans include our core AI-powered features 
            to help you land your dream job.
          </p>
        </div>

        {/* First Row - Basic Plans */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-slate-800 mb-2">Getting Started</h3>
            <p className="text-slate-600">Perfect for beginners and those testing our platform</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {basicPlans.map(renderPlanCard)}
          </div>
        </div>

        {/* Second Row - Premium Plans */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-slate-800 mb-2">Professional & Executive</h3>
            <p className="text-slate-600">Advanced features for serious job seekers and executives</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {premiumPlans.map(renderPlanCard)}
          </div>
        </div>
        
        {/* Additional Trust Section */}
        <div className="mt-20 text-center">
          <div className="flex flex-wrap justify-center items-center gap-8 text-slate-500">
            <div className="flex items-center space-x-2">
              <Check className="h-5 w-5 text-green-600" />
              <span>30-day money-back guarantee</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-5 w-5 text-green-600" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-5 w-5 text-green-600" />
              <span>Secure payments</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
