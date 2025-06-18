
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Star, Sparkles } from 'lucide-react';

const PricingSection = () => {
  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      description: 'Perfect for getting started with CV building',
      features: [
        'Build 1 CV from scratch or upload 1 CV',
        '1 job-specific tailoring',
        '1 interview simulation',
        'Basic feedback',
        'Email support'
      ],
      buttonText: 'Start Free',
      popular: false,
      gradient: 'from-slate-50 to-white',
      buttonStyle: 'bg-slate-800 hover:bg-slate-900 text-white'
    },
    {
      name: 'Pro',
      price: '£14.99',
      period: '/month',
      description: 'For active job seekers who want unlimited access',
      features: [
        'Unlimited CV builds & uploads',
        'Unlimited job-specific tailoring',
        'AI feedback on CV + interviews',
        'Access to interview coaching',
        'Employer job match suggestions',
        'Priority support'
      ],
      buttonText: 'Start Pro Trial',
      popular: true,
      gradient: 'from-blue-50 to-indigo-50',
      buttonStyle: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
    },
    {
      name: 'Premium',
      price: '£29.99',
      period: '/month',
      description: 'Everything you need for professional career advancement',
      features: [
        'All Pro features',
        'Personal human review of CV',
        'AI-enhanced mock interviews',
        'Save interview progress in folders',
        'Direct apply integrations',
        'Early access to new features',
        '1-on-1 career coaching session'
      ],
      buttonText: 'Go Premium',
      popular: false,
      gradient: 'from-purple-50 to-pink-50',
      buttonStyle: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
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

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative hover-lift rounded-2xl transition-all duration-300 border shadow-lg hover:shadow-xl bg-gradient-to-br ${plan.gradient} ${
                plan.popular 
                  ? 'ring-2 ring-blue-400 scale-105 shadow-blue-200' 
                  : 'border-slate-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center space-x-1 shadow-lg">
                    <Star className="h-3 w-3 fill-current" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}
              
              <CardHeader className="text-center pb-6 pt-8">
                <CardTitle className="text-xl font-bold text-slate-900 mb-1">{plan.name}</CardTitle>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-slate-900">
                    {plan.price}
                  </span>
                  {plan.period && <span className="text-slate-600 text-sm">{plan.period}</span>}
                </div>
                <CardDescription className="text-slate-600 text-sm">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0 px-6 pb-8">
                <Button 
                  className={`w-full mb-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 ${plan.buttonStyle}`}
                >
                  {plan.buttonText}
                </Button>
                
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <Check className="h-4 w-4 text-green-600 bg-green-100 rounded-full p-0.5" />
                      </div>
                      <span className="text-slate-700 text-sm">{feature}</span>
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
