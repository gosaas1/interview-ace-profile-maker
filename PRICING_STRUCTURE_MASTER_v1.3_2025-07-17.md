# 💰 APPLYACE PRICING STRUCTURE MASTER DOCUMENT v1.3

## 📅 Document Metadata

* **Version**: 1.3
* **Created**: 2024-07-16
* **Last Updated**: 2025-07-17
* **Next Review**: 2025-08-01
* **Owner**: ApplyAce Finance Team

---

## 📋 Overview

This document serves as the single source of truth for ApplyAce's pricing, AI providers, parsing limits, cost control measures, affiliate commissions, VAT considerations, and add-on modules.

---

## 🎯 COMPLETE PRICING TIERS (CORRECTED STRUCTURE)

| Tier              | Price/mo | Discountable | AI Provider | Key Features |
| ----------------- | -------: | :----------- | ----------- | ------------ |
| Free              |    £0.00 | No           | Cohere      | 1 basic analysis, 1 CV build/upload |
| Pay-As-You-Go     |    £1.99 | No           | Cohere      | Per-analysis billing |
| Starter (Popular) |    £9.99 | Yes (10%)    | Claude      | 5 analyses, unlimited CVs, 25 applies |
| Professional      |   £14.99 | Yes (10%)    | Claude      | Unlimited analyses & applications |
| Career Pro        |   £29.99 | Yes (10%)    | Claude      | AI review, video practice |
| Elite Executive   |   £59.99 | Yes (10%)    | Claude      | 1-on-1 AI coaching, concierge support |

*No annual/6‑month term discounts are currently offered.*

---

## 🎬 VIDEO ASSISTANT ADD-ON MODULE

### Separate Module Pricing
- **Video Assistant Add-on**: £19.99/month (available to all paid tiers)
- **One-time Video Session**: £9.99 per session
- **Video Analysis Package**: £29.99 for 5 sessions

### Video Assistant Features
- **Real-time AI Coaching**: Live interview assistance
- **Video Analysis**: Performance scoring and feedback
- **Emotion Recognition**: Facial expression and tone analysis
- **Personalized Feedback**: AI-generated improvement suggestions
- **Practice Sessions**: Unlimited mock interviews

### Integration Options
- **Add-on to existing subscription**: +£19.99/month
- **Standalone module**: £29.99/month (includes basic CV features)
- **Enterprise package**: Custom pricing for teams

---

## 💸 DISCOUNTS & COMMISSIONS

### Standard Discounts
- **Standard Discount**: 10% off coupon on any paid tier (Starter & up)
- **Student Discount**: 15% off with valid student email (.edu/.ac.uk domains)

### Affiliate Commission Structure
- **Base Commission**: 20% of net revenue (after discount) - **ALL TIERS**
- **Simple Structure**: No tier bonuses, no volume bonuses, no retention bonuses
- **Consistent Payout**: 20% commission on every paid subscription

### VAT Considerations
- **VAT Threshold**: £85,000 annual revenue
- **VAT Rate**: 20% (applied when threshold is exceeded)
- **VAT Registration**: Required when threshold is reached
- **VAT Impact**: All prices increase by 20% after threshold

---

## 🧠 AI ARCHITECTURE & COST CONTROLS

### AI Providers
- **Parsing**: Cohere (est. $0.005 - $0.01 / use)
- **AI Review**: Claude (est. $0.003 - $0.008 / 1K tokens)
- **Video AI**: Claude + OpenAI (est. $0.02 - $0.05 / minute)
- **Storage**: Supabase, optional video CDN

### Parsing Logic Enforcement
- **Tier-based limits**: Free (1), Pay-As-You-Go (per use), Starter (5), Professional (unlimited), Career Pro (unlimited), Elite Executive (unlimited)
- **One-time parsing**: CV parsed once, cached for all subsequent operations
- **Cost control**: Parsing limits prevent runaway costs
- **Usage tracking**: All parsing operations logged per user

### Revenue Model
- **Subscription tiers**: Monthly recurring revenue
- **Pay-As-You-Go**: Per-analysis billing
- **Add-ons**: Video module, premium templates, advanced analytics
- **Enterprise**: Custom pricing for large organizations

---

## 📊 UPDATED PER-USER P&L MODEL (Monthly)

### Cost Assumptions (Updated)
- **Parsing Cost**: £0.024/mo (Cohere at ~20 pages/user, only once per base CV upload)
- **AI Analysis Cost**:
  - Starter: £0.008/mo (Claude per 5 analyses)
  - Professional: £0.024/mo (Claude average usage)
  - Career Pro: £0.050/mo (Claude text + video scoring)
  - Elite Executive: £0.080/mo (Claude premium + 1-on-1 coaching)
- **Cohere Rewriting Cost**: £0.09–£0.20 per user/month (averaged across use)
- **Infrastructure Cost**: £0.020/mo per user (backend + frontend hosting, storage)
- **Video AI Cost** (add-on): £0.50–£2.00 per user/month (when used)
- **VAT Impact**: 20% on net profit (when threshold exceeded)
- **Affiliate Commission**: 20% across all tiers

### Detailed P&L Breakdown (Pre-VAT)

| Tier            | Base Price |    Discount | Net Price¹ | Affiliate (20%)² | Total Cost³ | Profit B4 Tax⁴ | VAT (20%)⁵ | Profit After Tax⁶ |
| --------------- | ---------: | ----------: | ---------: | ---------------: | ----------: | -------------: | ---------: | ----------------: |
| Starter         |      £9.99 | 10% → £1.00 |      £8.99 |            £1.80 |      £0.172 |          £7.02 |     £1.40 |             £5.62 |
| Professional    |     £14.99 | 10% → £1.50 |     £13.49 |            £2.70 |      £0.288 |         £10.51 |     £2.10 |             £8.41 |
| Career Pro      |     £29.99 | 10% → £3.00 |     £26.99 |            £5.40 |      £0.364 |         £21.23 |     £4.25 |            £16.98 |
| Elite Executive |     £59.99 | 10% → £6.00 |     £53.99 |           £10.80 |      £0.444 |         £42.75 |     £8.55 |            £34.20 |

¹ Net Price = Base Price – Discount
² Affiliate = Net Price × 0.20 (20% across all tiers)
³ Total Cost = Parsing + AI Analysis + Cohere + Infrastructure
⁴ Profit Before Tax = Net Price – Affiliate – Total Cost
⁵ VAT = Profit Before Tax × 0.20 (when threshold exceeded)
⁶ Profit After Tax = Profit Before Tax × (1 – 0.20)

### Student Discount Impact
- **Student Discount**: 15% off (instead of 10%)
- **Student Affiliate Commission**: Still 20% of net revenue
- **Example**: Starter tier student pays £8.49 instead of £8.99
- **Affiliate gets**: £1.70 instead of £1.80

### Video Add-on P&L
- **Video Add-on Price**: £19.99/month
- **Video AI Cost**: £2.00/month (average usage)
- **Infrastructure Cost**: £0.50/month (video storage/CDN)
- **Affiliate Commission**: £4.00 (20% of £19.99)
- **Net Profit**: £13.49/month per video add-on user

---

## 🎯 COST DRIVERS & OPTIMIZATION

### AI Provider Costs (Updated)
- **Cohere Parsing**: £0.005 - £0.01 per use (tier-limited)
- **Claude Review**: £0.003 - £0.008 per 1K tokens
- **Video AI**: £0.02 - £0.05 per minute of analysis
- **Cost Control**: Tier-based parsing limits prevent runaway costs
- **Usage Tracking**: All AI operations logged and monitored

### Infrastructure Costs (Updated)
- **Supabase Database**: £0.020/mo per user
- **File Storage**: Included in Supabase pricing
- **Video Storage**: £0.50/mo per video user
- **CDN**: £0.30/mo per user (global content delivery)
- **Hosting**: Vercel (frontend) + Railway (backend)

### Operational Costs (Updated)
- **Development Team**: Salaries and benefits
- **Marketing**: Content marketing and affiliate commissions (20%)
- **Legal & Compliance**: GDPR, data protection, VAT compliance
- **Customer Support**: AI-powered support system
- **VAT Compliance**: Accountant fees and compliance costs

---

## 📈 REVENUE PROJECTIONS (Updated)

### Conservative Growth Estimates
- **Year 1**: £150,000 - £300,000 (pre-VAT threshold)
- **Year 2**: £400,000 - £800,000 (VAT applies)
- **Year 3**: £1.2M - £2.4M
- **Year 5**: £30M - £120M

### Growth Drivers
- **Product-Led Growth**: Quality-driven word-of-mouth recommendations
- **Affiliate Network**: 20% commission-based sales team
- **Student Market**: 15% discount for student acquisition
- **Video Add-on**: £19.99/month additional revenue per user
- **Zero Marketing Spend**: Eliminated through AI automation
- **Scalable Model**: Linear profit growth with user acquisition

### User Acquisition Targets (Updated)
- **Month 1**: 100 users (80% free, 20% paid)
- **Month 6**: 1,000 users (60% free, 40% paid)
- **Year 1**: 8,000 users (40% free, 60% paid)
- **Year 2**: 40,000 users (30% free, 70% paid)
- **Student Users**: 25% of paid users (estimated)
- **Video Add-on Adoption**: 25% of paid users

---

## 💡 PROFITABILITY ANALYSIS (Updated)

### Key Metrics
- **Average Profit After Tax**: £16.30 per user/month (base tiers)
- **Video Add-on Profit**: £13.49 per user/month
- **Combined Profit**: £29.79 per user/month (with video)
- **Break-even Point**: ~40 users for operational costs
- **Profit Margin**: 65-75% after all costs and VAT

### Tier Performance (Updated)
- **Starter Tier**: £5.62 profit/month (56% margin)
- **Professional Tier**: £8.41 profit/month (56% margin)
- **Career Pro Tier**: £16.98 profit/month (57% margin)
- **Elite Executive Tier**: £34.20 profit/month (57% margin)
- **Video Add-on**: £13.49 profit/month (67% margin)

### Student Discount Impact
- **Student Starter**: £4.78 profit/month (vs £5.62 regular)
- **Student Professional**: £7.15 profit/month (vs £8.41 regular)
- **Student Career Pro**: £14.43 profit/month (vs £16.98 regular)
- **Student Elite Executive**: £29.07 profit/month (vs £34.20 regular)

### Cost Optimization Strategies
- **Parsing Limits**: Tier-based usage prevents cost overruns
- **AI Efficiency**: Optimized prompts reduce token usage
- **Video Compression**: Efficient video storage and processing
- **Infrastructure Scaling**: Pay-as-you-grow hosting model
- **Automation**: AI-powered support reduces human costs

---

## 🚀 FUNDING & INVESTMENT (Updated)

### Initial Investment Requirements
- **Development**: £50,000 - £100,000 (6 months)
- **Infrastructure**: £10,000 - £20,000 (setup + 1 year)
- **Legal & Compliance**: £5,000 - £10,000 (including VAT prep)
- **Marketing**: £10,000 - £20,000 (content + affiliate)
- **Video Module**: £15,000 - £25,000 (additional development)
- **Total**: £90,000 - £175,000

### Revenue Milestones (Updated)
- **Month 6**: Break-even (operational costs covered)
- **Year 1**: £150K - £300K revenue (pre-VAT)
- **Year 2**: £400K - £800K revenue (VAT applies)
- **Year 3**: £1.2M - £2.4M revenue

### Investment Returns (Updated)
- **Year 1 ROI**: 86% - 233% (conservative estimates)
- **Year 2 ROI**: 229% - 457%
- **Year 3 ROI**: 686% - 1,371%

---

## 📊 FINANCIAL RISKS & MITIGATION (Updated)

### Revenue Risks
- **VAT Threshold**: Plan for 20% price increase at £85K revenue
- **Market Competition**: Differentiation through AI quality
- **Economic Downturn**: Recession-resistant job market
- **Technology Changes**: Flexible AI provider architecture
- **Regulatory Changes**: Proactive compliance management

### Cost Risks
- **AI Provider Price Increases**: Multi-provider strategy
- **Video Processing Costs**: Efficient compression and storage
- **Infrastructure Scaling**: Cloud-native architecture
- **Development Delays**: Agile methodology and MVP approach
- **Customer Acquisition**: Product-led growth strategy

### Mitigation Strategies
- **Diversified AI Providers**: Backup options for Cohere and Claude
- **Cost Monitoring**: Real-time usage tracking and alerts
- **Scalable Architecture**: Cloud-native, pay-as-you-grow model
- **Customer Retention**: High-quality product and support
- **VAT Planning**: Accountant consultation and compliance preparation

---

## 🎯 KEY PERFORMANCE INDICATORS (Updated)

### Financial KPIs
- **Monthly Recurring Revenue (MRR)**: Target growth rate
- **Average Revenue Per User (ARPU)**: £12-18/month (base + video)
- **Customer Acquisition Cost (CAC)**: <£50
- **Customer Lifetime Value (CLV)**: >£300 (with video add-on)
- **Churn Rate**: <5% monthly

### Operational KPIs
- **User Growth Rate**: 20% month-over-month
- **Conversion Rate**: 15% free to paid
- **Student Conversion**: 20% of students convert to paid
- **Video Add-on Adoption**: 25% of paid users
- **Support Response Time**: <2 hours
- **System Uptime**: >99.9%

### Product KPIs
- **Application Success Rate**: >75% interview conversion
- **User Satisfaction**: >4.5/5 NPS
- **Feature Adoption**: >80% core features
- **Video Session Completion**: >90%
- **Time to Value**: <5 minutes

---

## 📅 FINANCIAL TIMELINE (Updated)

### Q1 2025 (Launch Phase)
- **Revenue Target**: £8K - £15K
- **User Target**: 500 - 1,000 users
- **Focus**: Product-market fit and user acquisition
- **Video Module**: Development phase

### Q2 2025 (Growth Phase)
- **Revenue Target**: £40K - £80K
- **User Target**: 2,000 - 5,000 users
- **Focus**: Feature development and video module launch
- **VAT Preparation**: Accountant consultation

### Q3 2025 (Scale Phase)
- **Revenue Target**: £120K - £240K
- **User Target**: 10,000 - 20,000 users
- **Focus**: Market expansion and VAT compliance
- **Video Adoption**: 25% target

### Q4 2025 (Optimization Phase)
- **Revenue Target**: £320K - £640K
- **User Target**: 25,000 - 50,000 users
- **Focus**: Profitability and market leadership
- **VAT Implementation**: Full compliance

---

## 🔄 KEY CHANGES FROM v1.2

### Major Updates
- **Corrected Pricing**: £59.99 for Elite Executive (not £69.99)
- **Video Assistant**: Separate add-on module (£19.99/month)
- **Affiliate Commission**: 20% across all tiers (simplified)
- **Student Discount**: 15% off for students (new addition)
- **VAT Considerations**: 20% tax when £85K threshold exceeded
- **Updated Cost Calculations**: Including video AI and VAT
- **Enhanced P&L Model**: More accurate profit projections

### Financial Impact
- **Higher Revenue Potential**: Video add-on increases ARPU
- **Better Profit Margins**: Optimized pricing structure
- **Student Market**: 15% discount for student acquisition
- **Scalable Model**: Tier-based limits prevent cost overruns
- **VAT Planning**: Proactive compliance preparation
- **Simple Affiliate Structure**: 20% commission across all tiers

---

*Last Updated: 2025-07-17*
*Version: 1.3*
*Document Type: Pricing Structure Master* 