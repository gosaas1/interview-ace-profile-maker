// Original Pricing Cards JSX Structure - Backup
// This contains the complete card layout that was removed from PricingSection.tsx

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Star } from 'lucide-react';

// This is the original card structure that was removed
export const OriginalPricingCardsJSX = () => (
  <>
    {/* Explicit Two-Row Grid Layout for Perfect Card Positioning */}
    <div className="max-w-7xl mx-auto">
      {/* First Row: Free, Pay-As-You-Go, Starter/Student */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {plans.slice(0, 3).map((plan) => (
          <Card
            key={plan.name}
            className={`relative hover-lift rounded-2xl transition-all duration-300 border shadow-lg hover:shadow-xl bg-gradient-to-br ${plan.gradient} ${
              plan.popular
                ? 'ring-2 ring-green-400 shadow-green-200 border-green-300'
                : 'border-slate-200'
            } w-full max-w-sm min-h-[520px] flex flex-col pt-10`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center space-x-1 shadow-lg">
                  <Star className="h-3 w-3 fill-current" />
                  <span>Most Popular</span>
                </div>
              </div>
            )}
            
            <CardHeader className="text-center pb-6 pt-8 flex-shrink-0">
              <CardTitle className={`text-xl font-bold mb-1 ${plan.textColor || 'text-slate-900'}`}>
                {plan.name}
              </CardTitle>
              <div className="mb-4">
                <span className={`text-3xl font-bold ${plan.priceColor || 'text-slate-900'}`}>
                  {plan.price}
                </span>
                {plan.period && (
                  <span className={`text-sm ${plan.descColor || 'text-slate-600'}`}>
                    {plan.period}
                  </span>
                )}
              </div>
              <CardDescription className={`text-sm ${plan.descColor || 'text-slate-600'}`}>
                {plan.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-0 px-6 pb-8 flex flex-col flex-grow">
              <Button 
                onClick={() => handleSubscription(plan)}
                disabled={loadingPlan === plan.name}
                className={`w-full mb-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 ${plan.buttonStyle}`}
              >
                {loadingPlan === plan.name ? 'Processing...' : plan.buttonText}
              </Button>
              
              <ul className="space-y-3 flex-grow">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <Check className="h-4 w-4 text-green-600 bg-green-100 rounded-full p-0.5" />
                    </div>
                    <span className={`text-sm ${plan.featureColor || 'text-slate-700'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Second Row: Professional, Career Pro, Elite Executive */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.slice(3, 6).map((plan) => (
          <Card
            key={plan.name}
            className={`relative hover-lift rounded-2xl transition-all duration-300 border shadow-lg hover:shadow-xl bg-gradient-to-br ${plan.gradient} ${
              plan.popular
                ? 'ring-2 ring-green-400 shadow-green-200 border-green-300'
                : 'border-slate-200'
            } w-full max-w-sm min-h-[520px] flex flex-col pt-10`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center space-x-1 shadow-lg">
                  <Star className="h-3 w-3 fill-current" />
                  <span>Most Popular</span>
                </div>
              </div>
            )}
            
            <CardHeader className="text-center pb-6 pt-8 flex-shrink-0">
              <CardTitle className={`text-xl font-bold mb-1 ${plan.textColor || 'text-slate-900'}`}>
                {plan.name}
              </CardTitle>
              <div className="mb-4">
                <span className={`text-3xl font-bold ${plan.priceColor || 'text-slate-900'}`}>
                  {plan.price}
                </span>
                {plan.period && (
                  <span className={`text-sm ${plan.descColor || 'text-slate-600'}`}>
                    {plan.period}
                  </span>
                )}
              </div>
              <CardDescription className={`text-sm ${plan.descColor || 'text-slate-600'}`}>
                {plan.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-0 px-6 pb-8 flex flex-col flex-grow">
              <Button 
                onClick={() => handleSubscription(plan)}
                disabled={loadingPlan === plan.name}
                className={`w-full mb-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 ${plan.buttonStyle}`}
              >
                {loadingPlan === plan.name ? 'Processing...' : plan.buttonText}
              </Button>
              
              <ul className="space-y-3 flex-grow">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <Check className="h-4 w-4 text-green-600 bg-green-100 rounded-full p-0.5" />
                    </div>
                    <span className={`text-sm ${plan.featureColor || 'text-slate-700'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </>
);

// Key styling classes used in the cards:
export const cardStylingClasses = {
  container: "max-w-7xl mx-auto",
  gridRow: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
  card: "relative hover-lift rounded-2xl transition-all duration-300 border shadow-lg hover:shadow-xl bg-gradient-to-br",
  popularCard: "ring-2 ring-green-400 shadow-green-200 border-green-300",
  regularCard: "border-slate-200",
  cardSize: "w-full max-w-sm min-h-[520px] flex flex-col pt-10",
  popularBadge: "absolute -top-4 left-1/2 transform -translate-x-1/2 z-10",
  badgeContent: "bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center space-x-1 shadow-lg",
  header: "text-center pb-6 pt-8 flex-shrink-0",
  content: "pt-0 px-6 pb-8 flex flex-col flex-grow",
  button: "w-full mb-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300",
  featuresList: "space-y-3 flex-grow",
  featureItem: "flex items-start space-x-3",
  checkIcon: "h-4 w-4 text-green-600 bg-green-100 rounded-full p-0.5"
}; 