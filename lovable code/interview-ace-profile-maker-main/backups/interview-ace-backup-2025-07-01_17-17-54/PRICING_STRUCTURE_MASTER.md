# 💰 ApplyAce Pricing Structure Master Document

## 📋 Overview
This document serves as the single source of truth for ApplyAce's pricing structure, ensuring consistency across all components, documentation, and implementations.

---

## 🎯 Complete Pricing Tiers

### **1. Free Tier**
- **Price**: £0/month
- **Target Audience**: Casual browsers, first-time users
- **CV Analysis**: 1 basic analysis/month (Gemini AI)
- **CV Builder**: 1 CV build or upload
- **Features**: 
  - Basic ATS compatibility check
  - Simple CV score
  - Browse job suggestions
- **Interview Coach**: Limited to 3 practice questions
- **Support**: Community support only
- **AI Provider**: Gemini (free tier)
- **Monthly Limit**: 1 analysis

### **2. Pay-As-You-Go Tier**
- **Price**: £1.99 per analysis
- **Target Audience**: Infrequent job seekers, service testers
- **CV Analysis**: Detailed analysis per purchase (OpenAI)
- **Features**:
  - Full keyword optimization
  - Improvement suggestions
  - ATS optimization
  - Perfect for testing service
- **Billing**: Per-analysis (no monthly commitment)
- **AI Provider**: OpenAI
- **Ideal For**: Testing the service, occasional analysis needs

### **3. Starter/Student Tier** ⭐ *MOST POPULAR*
- **Price**: £9.99/month
- **Annual Options**: 
  - 6-month: £41.96 (30% off - £6.99/month effective)
  - 12-month: £59.94 (50% off - £4.99/month effective)
- **Target Audience**: Students, early career professionals, budget-conscious users
- **CV Analysis**: 5 detailed analyses/month (OpenAI)
- **CV Builder**: Unlimited CV creation and upload
- **Features**:
  - Industry insights
  - Keyword optimization
  - Basic job matching
- **Job Applications**: 25 applications/month
- **Interview Coach**: 10 practice sessions/month with AI feedback
- **AI Provider**: OpenAI
- **Monthly Limit**: 5 analyses

### **4. Professional Tier**
- **Price**: £14.99/month
- **Annual Options**: 
  - 6-month: £62.96 (30% off - £10.49/month effective)
  - 12-month: £89.94 (50% off - £7.49/month effective)
- **Target Audience**: Active job seekers, career changers
- **CV Analysis**: Unlimited detailed analyses (OpenAI/GPT-4)
- **CV Builder**: Unlimited with premium templates
- **Features**:
  - All Starter features plus advanced AI optimization
  - Advanced job matching
  - Performance analytics
- **Job Applications**: Unlimited with priority matching
- **Interview Coach**: Unlimited practice + detailed AI feedback
- **Support**: Priority email support
- **AI Provider**: OpenAI (GPT-4 available)
- **Monthly Limit**: Unlimited

### **5. Career Pro Tier**
- **Price**: £29.99/month
- **Annual Options**: 
  - 6-month: £125.96 (30% off - £20.99/month effective)
  - 12-month: £179.94 (50% off - £14.99/month effective)
- **Target Audience**: Senior professionals, executive-level candidates
- **Everything in Professional plus:**
- **Human Review**: Professional CV review by career experts
- **Advanced AI**: Premium AI models (Claude, GPT-4 Turbo)
- **Video Practice**: Video interview recording and analysis
- **Industry Insights**: Market trends, salary data, industry-specific advice
- **Premium Coaching**: Advanced career coaching (AI-driven)
- **Support**: Priority customer support
- **Early Access**: Beta features and new tools
- **AI Provider**: Claude (premium provider)
- **Monthly Limit**: Unlimited

### **6. Elite Executive Tier** 🆕 *PREMIUM*
- **Price**: £59.99/month
- **Annual Options**: 
  - 6-month: £251.96 (30% off - £41.99/month effective)
  - 12-month: £359.94 (50% off - £29.99/month effective)
- **Target Audience**: High-salary professionals (£75k+ roles), C-suite executives
- **Everything in Career Pro plus:**
- **AI-Backed 1-on-1 Coaching**: Personalized AI coaching sessions
- **Executive-Level Strategy**: C-suite and senior leadership career planning
- **Premium Dark Mode Experience**: Separate elite.applyace.com portal
- **White-Glove Service**: Concierge-level support
- **Custom Career Roadmaps**: Personalized leadership development
- **Industry Connections**: Premium networking opportunities
- **AI Provider**: Premium Claude + GPT-4 Turbo
- **Access**: Separate premium portal with executive experience

### **7. Enterprise Tier** (Future Implementation)
- **Price**: £99.99/month per team (5+ users)
- **Target Audience**: HR departments, recruitment agencies, career centers
- **Team Management**: Centralized user management
- **Advanced Analytics**: Team performance insights and reporting
- **Custom Content**: Industry-specific question banks and templates
- **White Labeling**: Custom branding options
- **Dedicated Support**: Account manager and priority support
- **Custom Integrations**: API access for HR systems

---

## 📊 Conversion Funnel Strategy

### **Step-by-Step Progression**
1. **Free → Pay-As-You-Go**: Low commitment test of premium features
2. **Pay-As-You-Go → Starter**: Cost savings for regular users (£9.99 vs £25+ per month)
3. **Starter → Professional**: Unlimited usage removes monthly limits
4. **Professional → Career Pro**: Human expertise and premium AI
5. **Career Pro → Enterprise**: Team features for organizations

### **Key Psychological Triggers**
- **Free Tier**: Removes barrier to entry, builds trust
- **Pay-As-You-Go**: Perfect for hesitant users, "try before you buy"
- **Starter**: Clear value proposition, popular choice anchor
- **Professional**: Removes usage anxiety with unlimited features
- **Career Pro**: Premium positioning with human touch

---

## 🛠️ Technical Implementation

### **AI Provider Mapping**
```typescript
PRICING_AI_FEATURES = {
  free: {
    provider: 'gemini',
    analysisType: 'basic',
    monthlyLimit: 1,
    features: ['Basic CV score', 'ATS compatibility check']
  },
  payAsYouGo: {
    provider: 'openai',
    analysisType: 'detailed',
    monthlyLimit: 0, // Per-analysis billing
    features: ['Detailed analysis', 'Improvement suggestions', 'Keyword optimization']
  },
  starter: {
    provider: 'openai',
    analysisType: 'detailed',
    monthlyLimit: 5,
    features: ['All detailed features', 'Industry insights', 'Basic job matching']
  },
  professional: {
    provider: 'openai', // GPT-4 available
    analysisType: 'premium',
    monthlyLimit: -1, // Unlimited
    features: ['All features', 'Premium AI models', 'Advanced job matching', 'Priority support']
  },
  careerPro: {
    provider: 'claude', // Premium provider
    analysisType: 'premium',
    monthlyLimit: -1, // Unlimited
    features: ['Executive-level analysis', 'Human review', 'Premium AI models', '1-on-1 coaching', 'Priority support']
  }
}
```

### **Component Consistency Checklist**
- [x] `src/components/homepage/PricingSection.tsx` - Updated to 5 tiers
- [x] `src/components/cv/CVAnalysis.tsx` - Consistent pricing in CTAs
- [x] `src/lib/ai/config.ts` - AI provider mapping updated
- [x] `PRODUCT_REQUIREMENTS_DOCUMENT.md` - Complete pricing structure
- [x] `AI_SYSTEM_SUMMARY.md` - Pricing tier integration
- [x] `AI_SETUP_GUIDE.md` - Pricing structure alignment

---

## 💡 Revenue Projections

### **Key Metrics**
- **Average Revenue Per User (ARPU)**: £18.50/month
- **Conversion Rates**: 
  - Free→Paid: 8%
  - Starter→Professional: 25%
  - Professional→Career Pro: 15%
- **Customer Lifetime Value**: £180-£450 depending on tier
- **Churn Reduction**: Multiple tier options reduce downgrades

### **Cost Structure**
- **100 basic analyses**: ~$0.50/month
- **100 detailed analyses**: ~$2-5/month
- **Profit margin**: 80%+ on paid tiers

---

## 🎨 UI/UX Guidelines

### **Visual Hierarchy**
1. **Starter** - Most Popular (Green accent, scale-up, star badge)
2. **Professional** - Secondary focus (Blue accent)
3. **Career Pro** - Premium positioning (Purple/Pink gradient)
4. **Pay-As-You-Go** - Alternative option (Blue/Cyan)
5. **Free** - Entry point (Gray/Slate)

### **Messaging Strategy**
- **Free**: "Perfect for getting started"
- **Pay-As-You-Go**: "No commitment, pay when you need it"
- **Starter**: "Most popular for students & early career"
- **Professional**: "For active job seekers who want unlimited access"
- **Career Pro**: "Everything you need for career advancement"

---

## 📝 Content Guidelines

### **Feature Descriptions**
- Use action-oriented language: "Unlimited CV analyses" vs "CV analysis feature"
- Emphasize outcomes: "Land your dream job" vs "Use our tools"
- Quantify benefits: "5 detailed analyses" vs "Multiple analyses"
- Progressive disclosure: Each tier builds on the previous

### **Call-to-Action Buttons**
- **Free**: "Start Free"
- **Pay-As-You-Go**: "Buy Analysis"
- **Starter**: "Start Starter Plan"
- **Professional**: "Go Professional"
- **Career Pro**: "Unlock Career Pro"

---

## 🔄 Update Protocol

### **When Making Pricing Changes**
1. Update this master document first
2. Update `PRODUCT_REQUIREMENTS_DOCUMENT.md`
3. Update `src/lib/ai/config.ts`
4. Update `src/components/homepage/PricingSection.tsx`
5. Update `src/components/cv/CVAnalysis.tsx` CTAs
6. Update all supporting documentation
7. Test all pricing displays in application
8. Update memory with new pricing structure

### **Files to Keep in Sync**
- `PRICING_STRUCTURE_MASTER.md` (this file)
- `PRODUCT_REQUIREMENTS_DOCUMENT.md`
- `AI_SYSTEM_SUMMARY.md`
- `AI_SETUP_GUIDE.md`
- `src/lib/ai/config.ts`
- `src/components/homepage/PricingSection.tsx`
- `src/components/cv/CVAnalysis.tsx`

---

## ✅ Current Status

### **Completed Synchronization**
- [x] All documentation updated to 5-tier structure
- [x] AI configuration aligned with pricing
- [x] Frontend components display consistent pricing
- [x] Memory updated with complete structure
- [x] PRD reflects final pricing strategy
- [x] Conversion funnel logic implemented

### **Next Steps**
- [ ] Test all pricing displays in application
- [ ] Verify AI provider switching works correctly
- [ ] Implement usage tracking for tier limits
- [ ] Add billing integration for pay-as-you-go
- [ ] Create admin panel for tier management

---

*Last Updated: $(date)  
Version: 1.0  
Status: Production Ready* 