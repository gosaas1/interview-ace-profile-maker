# 🚀 APPLYACE - PRODUCT REQUIREMENTS DOCUMENT (PRD) v4.2

## 📅 Document Metadata

* **Version**: 4.2
* **Created**: 2024-07-16
* **Last Updated**: 2025-07-17
* **Next Review**: 2025-08-01
* **Owner**: ApplyAce Product & Finance Team

---

## 📋 Executive Summary

ApplyAce is an AI-powered career platform that revolutionizes job applications through intelligent CV analysis, automated application processes, and comprehensive interview preparation. Our platform addresses the critical pain points in the job search process by providing personalized, data-driven solutions that increase interview success rates.

### Key Value Propositions
- **75% Interview Success Rate**: AI-optimized CVs and applications
- **One-Click Apply**: Automated job application with tailored CVs and cover letters
- **Interview Coach**: AI-powered interview preparation with video analysis
- **Employer Portal**: Streamlined hiring process for companies

---

## 🎯 Target Market

### Primary Users
- **Job Seekers**: Recent graduates to senior professionals
- **Career Changers**: Professionals transitioning to new industries
- **International Candidates**: UK work visa holders and EU professionals

### Secondary Users
- **HR Professionals**: Recruiters and hiring managers
- **Small to Medium Businesses**: Companies seeking efficient hiring solutions

---

## 💼 Business Model & Pricing Structure

### 🎯 Complete Pricing Tiers (Original Structure)

| Tier              | Price/mo | Discountable | AI Provider | Key Features |
| ----------------- | -------: | :----------- | ----------- | ------------ |
| Free              |    £0.00 | No           | Cohere      | 1 basic analysis, 1 CV build/upload |
| Pay-As-You-Go     |    £2.49 | No           | Cohere      | Per-analysis billing |
| Starter (Popular) |   £11.99 | Yes (10%)    | Claude      | 5 analyses, unlimited CVs, 25 applies |
| Professional      |   £17.99 | Yes (10%)    | Claude      | Unlimited analyses & applications |
| Career Pro        |   £35.99 | Yes (10%)    | Claude      | AI review, video practice |
| Elite Executive   |   £69.99 | Yes (10%)    | Claude      | 1-on-1 AI coaching, concierge support |

*No annual/6‑month term discounts are currently offered.*

---

### 💸 Discounts & Affiliate Commissions

* **Standard Discount**: 10% off coupon on any paid tier (Starter & up).
* **Affiliate Commission**: 20% of net revenue (after discount) paid to affiliate.

---

### 🧠 AI Architecture & Cost Controls

#### AI Providers
- **Parsing**: Cohere (est. $0.005 - $0.01 / use)
- **AI Review**: Claude (est. $0.003 - $0.008 / 1K tokens)
- **Storage**: Supabase, optional video CDN

#### Parsing Logic Enforcement
- **Tier-based limits**: Free (1), Pay-As-You-Go (per use), Starter (5), Professional (unlimited), Career Pro (unlimited), Elite Executive (unlimited)
- **One-time parsing**: CV parsed once, cached for all subsequent operations
- **Cost control**: Parsing limits prevent runaway costs
- **Usage tracking**: All parsing operations logged per user

#### Revenue Model
- **Subscription tiers**: Monthly recurring revenue
- **Pay-As-You-Go**: Per-analysis billing
- **Add-ons**: Video module / live coaching (future)

---

### 📊 Per-User P&L Model (Monthly)

Assumptions:
- **Parsing Cost**: £0.024/mo (Cohere at ~20 pages/user, only once per base CV upload)
- **AI Analysis Cost**:
  - Starter: £0.008/mo (Claude per 5 analyses)
  - Professional: £0.024/mo (Claude average usage)
  - Career Pro: £0.050/mo (Claude text + video scoring)
  - Elite Executive: £0.080/mo (Claude premium + 1-on-1 coaching)
- **Cohere Rewriting Cost**:
  - All tiers (Starter+): Estimated £0.09–£0.20 per user/month (averaged across use)
- **Infrastructure Cost** (backend + frontend hosting, storage): £0.020/mo per user
- **Total Monthly Cost** = Parsing Cost + AI Analysis Cost + Cohere + Infrastructure Cost
- **Tax Rate**: 20% on net profit

| Tier            | Base Price |    Discount | Net Price¹ | Affiliate (20%)² | Total Cost³ | Profit B4 Tax⁴ | Tax (20%) | Profit After Tax⁵ |
| --------------- | ---------: | ----------: | ---------: | ---------------: | ----------: | -------------: | --------: | ----------------: |
| Starter         |     £11.99 | 10% → £1.20 |     £10.79 |            £2.16 |      £0.172 |          £8.45 |     £1.69 |             £6.76 |
| Professional    |     £17.99 | 10% → £1.80 |     £16.19 |            £3.24 |      £0.288 |         £12.66 |     £2.53 |            £10.13 |
| Career Pro      |     £35.99 | 10% → £3.60 |     £32.39 |            £6.48 |      £0.364 |         £25.55 |     £5.11 |            £20.44 |
| Elite Executive |     £69.99 | 10% → £7.00 |     £62.99 |           £12.60 |      £0.444 |         £49.95 |     £9.99 |            £39.96 |

¹ Net Price = Base Price – Discount
² Affiliate = Net Price × 0.20
³ Total Cost = Parsing + AI Analysis + Cohere + Infrastructure
⁴ Profit Before Tax = Net Price – Affiliate – Total Cost
⁵ Profit After Tax = Profit B4 Tax × (1 – 0.20)

---

### Revenue Projections

#### Conservative Estimates
- **Year 1**: £200,000 - £400,000
- **Year 2**: £600,000 - £1.2M
- **Year 3**: £1.8M - £3.6M
- **Year 5**: £43.5M - £174M

#### Growth Drivers
- **Product-Led Growth**: Quality-driven word-of-mouth recommendations
- **Content Marketing**: Career advice and industry insights
- **Social Media**: LinkedIn and professional networks

---

## 🏗️ Technical Architecture

### Frontend Stack
- **Framework**: React with TypeScript
- **UI Library**: Shadcn UI + Radix UI
- **Styling**: Tailwind CSS
- **State Management**: React hooks + Context API
- **Build Tool**: Vite

### Backend Stack
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with OAuth
- **File Storage**: Supabase Storage
- **AI Integration**: Cohere (parsing), Claude (review)

### Infrastructure
- **Hosting**: Vercel (Frontend) + Railway (Backend)
- **Database**: Supabase Cloud
- **CDN**: Cloudflare
- **Monitoring**: Sentry + LogRocket

---

## 🔧 Core Features

### 1. CV Builder & Analysis
- **Template Library**: 15+ professional templates
- **AI Analysis**: ATS optimization, keyword matching (Claude)
- **Real-time Preview**: Live editing with instant feedback
- **Export Options**: PDF, DOCX, TXT formats
- **Parsing**: Cohere-based CV text extraction

### 2. One-Click Apply
- **Job Description Parsing**: Extract requirements and keywords
- **CV Tailoring**: AI-generated summaries and modifications (Claude)
- **Cover Letter Generation**: Personalized introductions
- **Application Tracking**: Status monitoring and follow-ups

### 3. Interview Coach
- **Question Generation**: AI-powered interview questions (Claude)
- **Video Recording**: Practice sessions with analysis
- **Performance Scoring**: Detailed feedback and improvements
- **Mock Interviews**: Industry-specific scenarios

### 4. Employer Portal (EasyHire)
- **Job Posting**: Create and manage job listings
- **Applicant Matching**: AI-powered candidate screening
- **Video Interviews**: Integrated video calling
- **Analytics Dashboard**: Hiring metrics and insights

### 5. Analytics & Insights
- **Application Tracking**: Success rates and patterns
- **Performance Metrics**: Interview scores and improvements
- **Market Analysis**: Industry trends and salary data
- **Personal Dashboard**: Individual progress tracking

---

## 🔐 Security & Compliance

### Data Protection
- **GDPR Compliance**: Full data protection compliance
- **Encryption**: End-to-end encryption for sensitive data
- **Access Control**: Role-based permissions
- **Audit Logging**: Complete activity tracking

### Privacy Features
- **Data Minimization**: Collect only necessary information
- **User Consent**: Clear consent management
- **Data Portability**: Export user data on request
- **Right to Deletion**: Complete data removal

---

## 📱 User Experience

### Design Principles
- **Mobile-First**: Responsive design for all devices
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Sub-3-second load times
- **Intuitive Navigation**: Clear user flows

### User Journey
1. **Onboarding**: Guided setup and profile creation
2. **CV Creation**: Template selection and content building
3. **Job Search**: Browse and apply to opportunities
4. **Interview Prep**: Practice and improve skills
5. **Success Tracking**: Monitor progress and outcomes

---

## 🚀 Go-to-Market Strategy

### Launch Phases
1. **Beta Testing**: Limited user group for feedback
2. **Soft Launch**: Gradual rollout with early adopters
3. **Full Launch**: Public availability with marketing
4. **Scale**: Expansion to new markets and features

### Marketing Channels
- **Product-Led Growth**: Quality-driven recommendations
- **Content Marketing**: Career advice and industry insights
- **Social Media**: LinkedIn and professional networks

---

## 📊 Success Metrics

### Key Performance Indicators
- **User Acquisition**: Monthly active users and growth rate
- **Retention**: Monthly recurring revenue and churn rate
- **Conversion**: Free to paid user conversion rate
- **Revenue**: Average revenue per user (ARPU)
- **Customer Satisfaction**: Net Promoter Score (NPS)

### Business Impact
- **Average Profit After Tax**: £19.51 per user/month
- **Break-even**: ~50 users for operational costs
- **Scalability**: Linear profit growth with user acquisition

---

## 🔄 Implementation Roadmap

### Phase 1: Core Platform (Q1 2025)
- [x] User authentication and profiles
- [x] CV builder with templates
- [x] Basic AI analysis
- [x] File upload and parsing (Cohere)
- [ ] Payment integration (Stripe)
- [ ] Basic analytics
- [ ] Parsing limit enforcement

### Phase 2: Advanced Features (Q2 2025)
- [ ] One-Click Apply functionality
- [ ] Cover letter generation (Claude)
- [ ] Interview coach (Claude)
- [ ] Advanced AI analysis
- [ ] Mobile app development
- [ ] Usage tracking and limits

### Phase 3: Scale & Optimize (Q3 2025)
- [ ] Employer portal
- [ ] Advanced analytics
- [ ] Performance optimization
- [ ] International expansion
- [ ] Enterprise features
- [ ] Video module preparation

### Phase 4: Market Leadership (Q4 2025)
- [ ] AI-powered insights
- [ ] Advanced automation
- [ ] Strategic partnerships
- [ ] Market expansion
- [ ] Video AI module launch
- [ ] IPO preparation

---

## 📋 Risk Assessment

### Technical Risks
- **AI Model Performance**: Dependency on Cohere and Claude services
- **Scalability**: Database and infrastructure limitations
- **Security**: Data breaches and privacy concerns
- **Cost Control**: AI usage costs and parsing limits

### Business Risks
- **Market Competition**: Established players and new entrants
- **Regulatory Changes**: Data protection and employment laws
- **AI Provider Changes**: Dependency on Cohere and Claude pricing

---

## 🔄 Key Changes from v4.1

### Major Updates
- **AI Provider Changes**: Cohere for parsing, Claude for review
- **Parsing Limits**: Tier-based usage limits for cost control
- **Human Review Removed**: AI-first automation approach
- **Video Module**: Future feature for Executive tier
- **Original Pricing Maintained**: 6-tier structure preserved

### Technical Updates
- **Cohere Integration**: Replaces AWS Textract for parsing
- **Claude Integration**: Primary AI for review and analysis
- **Usage Tracking**: Comprehensive parsing and AI usage monitoring
- **Cost Optimization**: Tier-based limits prevent runaway costs

---

*Last Updated: 2025-07-17*
*Version: 4.2*
*Document Type: Product Requirements* 