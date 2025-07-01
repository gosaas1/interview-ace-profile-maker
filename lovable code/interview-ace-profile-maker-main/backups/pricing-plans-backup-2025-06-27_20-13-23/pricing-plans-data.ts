// Backup of Pricing Plans Data - Extracted from PricingSection.tsx
// This file contains all plan details for easy recreation of pricing cards

import { SubscriptionTier } from '@/lib/stripe';

export const pricingPlans = [
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

// Backup of the handleSubscription function logic
export const subscriptionHandlerLogic = `
// This function handles all subscription logic including:
// - User authentication check
// - Free plan navigation
// - Mock mode vs real Stripe integration
// - Pay-as-you-go vs subscription handling
// - Error handling and loading states
// - Navigation after successful payment
`;

// Backup of the component structure
export const componentStructure = `
// PricingSection component structure:
// - Section wrapper with gradient background
// - Header with title and description
// - Two-row grid layout (3 cards per row)
// - Card components with:
//   - Popular badge (absolute positioned)
//   - Header with title, price, description
//   - Content with button and features list
//   - Responsive design (1 col mobile, 2 col tablet, 3 col desktop)
`; 