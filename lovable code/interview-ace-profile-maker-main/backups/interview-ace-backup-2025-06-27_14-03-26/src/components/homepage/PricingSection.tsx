import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Star, Sparkles, Crown, Zap } from 'lucide-react';

const PricingSection = () => {
  const plans = [
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
      icon: <Check className="w-4 h-4" />
    },
    {
      name: 'Pay-as-you-go',
      price: '£1.99',
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
      icon: <Zap className="w-4 h-4" />,
      annualDiscount: {
        sixMonth: null,
        twelveMonth: null
      }
    },
    {
      name: 'Starter',
      price: '£9.99',
      period: '/month',
      description: 'Most popular for students & early career',
      features: [
        '5 detailed CV analyses/month',
        'Unlimited CV builds & uploads',
        'Industry insights',
        '25 job applications/month',
        '10 interview practice sessions'
      ],
      buttonText: 'Start Starter Plan',
      popular: true,
      gradient: 'from-green-50 to-emerald-50',
      buttonStyle: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white',
      icon: <Star className="w-4 h-4" />,
      annualDiscount: {
        sixMonth: '£41.96 (30% off)',
        twelveMonth: '£59.94 (50% off)'
      }
    },
    {
      name: 'Professional',
      price: '£14.99',
      period: '/month',
      description: 'For active job seekers',
      features: [
        'Unlimited CV analyses (GPT-4)',
        'Unlimited CV builds with premium templates',
        'Advanced job matching',
        'Unlimited applications & interview coaching',
        'Performance analytics',
        'Priority support'
      ],
      buttonText: 'Go Professional',
      popular: false,
      gradient: 'from-blue-50 to-indigo-50',
      buttonStyle: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white',
      icon: <Crown className="w-4 h-4" />,
      annualDiscount: {
        sixMonth: '£62.96 (30% off)',
        twelveMonth: '£89.94 (50% off)'
      }
    },
    {
      name: 'Career Pro',
      price: '£29.99',
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
      icon: <Sparkles className="w-4 h-4" />,
      annualDiscount: {
        sixMonth: '£125.96 (30% off)',
        twelveMonth: '£179.94 (50% off)'
      }
    },
    {
      name: 'Elite Executive',
      price: '£59.99',
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
      icon: <Crown className="w-4 h-4 text-gold-400" />,
      annualDiscount: {
        sixMonth: '£251.96 (30% off)',
        twelveMonth: '£359.94 (50% off)'
      }
    }
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative hover-lift rounded-2xl transition-all duration-300 border shadow-lg hover:shadow-xl bg-gradient-to-br ${plan.gradient} ${
                plan.popular 
                  ? 'ring-2 ring-green-400 scale-105 shadow-green-200 border-green-300' 
                  : 'border-slate-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center space-x-1 shadow-lg">
                    <Star className="h-3 w-3 fill-current" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}
              
              <CardHeader className="text-center pb-4 pt-8">
                <div className="flex justify-center mb-3">
                  {plan.icon}
                </div>
                <CardTitle className="text-lg font-bold text-slate-900 mb-1">{plan.name}</CardTitle>
                <div className="mb-3">
                  <span className="text-2xl lg:text-3xl font-bold text-slate-900">
                    {plan.price}
                  </span>
                  {plan.period && <span className="text-slate-600 text-xs lg:text-sm">{plan.period}</span>}
                </div>
                
                {/* Annual Discount Badges */}
                {plan.annualDiscount?.twelveMonth && (
                  <div className="mb-2 space-y-1">
                    <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md">
                      12-month: {plan.annualDiscount.twelveMonth}
                    </div>
                    <div className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-md">
                      6-month: {plan.annualDiscount.sixMonth}
                    </div>
                  </div>
                )}
                
                <CardDescription className="text-slate-600 text-xs lg:text-sm">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0 px-4 lg:px-6 pb-6">
                <Button 
                  className={`w-full mb-4 py-2 lg:py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 text-xs lg:text-sm ${plan.buttonStyle}`}
                >
                  {plan.buttonText}
                </Button>
                
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 lg:h-4 lg:w-4 text-green-600 bg-green-100 rounded-full p-0.5" />
                      </div>
                      <span className="text-slate-700 text-xs lg:text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
