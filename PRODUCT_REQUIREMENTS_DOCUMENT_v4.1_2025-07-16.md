# 🚀 APPLYACE - PRODUCT REQUIREMENTS DOCUMENT (PRD) v4.1

## 📋 Executive Summary

ApplyAce is an AI-powered career platform that revolutionizes job applications through intelligent CV analysis, automated application processes, and comprehensive interview preparation. Our platform addresses the critical pain points in the job search process by providing personalized, data-driven solutions that increase interview success rates.

### Key Value Propositions
- **75% Interview Success Rate**: AI-optimized CVs and applications
- **One-Click Apply**: Automated job application with tailored CVs and cover letters
- **Interview Coach**: AI-powered interview preparation with video analysis
- **Employer Portal**: Streamlined hiring process for companies

## 🎯 Target Market

### Primary Users
- **Job Seekers**: Recent graduates to senior professionals
- **Career Changers**: Professionals transitioning to new industries
- **International Candidates**: UK work visa holders and EU professionals

### Secondary Users
- **HR Professionals**: Recruiters and hiring managers
- **Small to Medium Businesses**: Companies seeking efficient hiring solutions

## 💼 Business Model

### Pricing Strategy

#### Core Tiers (Updated v4.1)

| Tier              | Price/mo | Discountable | Notes                                 |
| ----------------- | -------: | :----------- | :------------------------------------ |
| Free              |    £0.00 | No           | 1 basic analysis, 1 CV build/upload   |
| Pay-As-You-Go     |    £2.49 | No           | Per-analysis billing                  |
| Starter (Popular) |   £11.99 | Yes (10%)    | 5 analyses, unlimited CVs, 25 applies |
| Professional      |   £17.99 | Yes (10%)    | Unlimited analyses & applications     |
| Career Pro        |   £35.99 | Yes (10%)    | Human review, video practice          |
| Elite Executive   |   £69.99 | Yes (10%)    | 1-on-1 AI coaching, concierge support |

*No annual/6‑month term discounts are currently offered.*

### Discounts & Affiliate Commissions
- **Standard Discount**: 10% off coupon on any paid tier (Starter & up)
- **Affiliate Commission**: 20% of net revenue (after discount) paid to affiliate

### Per-User P&L Model (Monthly)

Assumptions:
- **Parsing Cost**: £0.024/mo (AWS Textract at ~20 pages/user)
- **AI Analysis Cost**:
  - Starter: £0.008/mo (mini ChatGPT per 5 analyses)
  - Professional: £0.024/mo (GPT-4 average usage)
  - Career Pro: £0.050/mo (Claude text + video scoring)
  - Elite Executive: £0.080/mo (Claude premium + 1-on-1 coaching)
- **Infrastructure Cost** (backend + frontend hosting, storage): £0.020/mo per user
- **Total Monthly Cost** = Parsing Cost + AI Analysis Cost + Infrastructure Cost
- **Tax Rate**: 20% on net profit

| Tier            | Base Price |    Discount | Net Price¹ | Affiliate (20%)² | Total Cost³ | Profit B4 Tax⁴ | Tax (20%) | Profit After Tax⁵ |
| --------------- | ---------: | ----------: | ---------: | ---------------: | ----------: | -------------: | --------: | ----------------: |
| Starter         |     £11.99 | 10% → £1.20 |     £10.79 |            £2.16 |      £0.052 |          £8.58 |     £1.72 |             £6.86 |
| Professional    |     £17.99 | 10% → £1.80 |     £16.19 |            £3.24 |      £0.068 |         £12.92 |     £2.58 |            £10.33 |
| Career Pro      |     £35.99 | 10% → £3.60 |     £32.39 |            £6.48 |      £0.094 |         £25.80 |     £5.16 |            £20.64 |
| Elite Executive |     £69.99 | 10% → £7.00 |     £62.99 |           £12.60 |      £0.124 |         £50.27 |    £10.05 |            £40.22 |

¹ Net Price = Base Price – Discount
² Affiliate = Net Price × 0.20
³ Total Cost = Parsing + AI Analysis + Infrastructure
⁴ Profit Before Tax = Net Price – Affiliate – Total Cost
⁵ Profit After Tax = Profit B4 Tax × (1 – 0.20)

### AI Architecture Breakdown

| Function             | Provider      | Description                                   | Cost Range (per user/mo) |
| -------------------- | ------------- | --------------------------------------------- | ------------------------ |
| **Parsing**          | AWS Textract  | Extracts CV text from PDFs, DOCX, DOC files   | £0.02–£0.03              |
| **CV Generation**    | Cohere        | Rewrites CVs based on job description         | £0.09–£9.00              |
| **Cover Letter Gen** | Cohere        | Humanized, tailored cover letters             | Included in Cohere use   |
| **Interview Qs**     | Claude/OpenAI | AI-generated personalized interview questions | Bundled per tier usage   |

➡️ **Why Both AWS Textract + Cohere?**
- Textract ensures **accurate parsing** and structure
- Cohere ensures **humanized, ATS-optimized output**
- Combined, they power the **One-Click Apply** experience with the best accuracy + UX

### Revenue Projections

#### Conservative Estimates
- **Year 1**: £200,000 - £400,000
- **Year 2**: £600,000 - £1.2M
- **Year 3**: £1.8M - £3.6M
- **Year 5**: £43.5M - £174M

#### Growth Drivers
- **Product-Led Growth**: Quality-driven word-of-mouth recommendations
- **Affiliate Network**: Commission-based sales team targeting LinkedIn job seekers
- **Zero Marketing Spend**: Eliminated through AI automation and affiliate model

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
- **AI Integration**: OpenAI GPT-4, Claude, Cohere

### Infrastructure
- **Hosting**: Vercel (Frontend) + Railway (Backend)
- **Database**: Supabase Cloud
- **CDN**: Cloudflare
- **Monitoring**: Sentry + LogRocket

## 🔧 Core Features

### 1. CV Builder & Analysis
- **Template Library**: 15+ professional templates
- **AI Analysis**: ATS optimization, keyword matching
- **Real-time Preview**: Live editing with instant feedback
- **Export Options**: PDF, DOCX, TXT formats

### 2. One-Click Apply
- **Job Description Parsing**: Extract requirements and keywords
- **CV Tailoring**: AI-generated summaries and modifications
- **Cover Letter Generation**: Personalized introductions
- **Application Tracking**: Status monitoring and follow-ups

### 3. Interview Coach
- **Question Generation**: AI-powered interview questions
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

## 🚀 Go-to-Market Strategy

### Launch Phases
1. **Beta Testing**: Limited user group for feedback
2. **Soft Launch**: Gradual rollout with early adopters
3. **Full Launch**: Public availability with marketing
4. **Scale**: Expansion to new markets and features

### Marketing Channels
- **Product-Led Growth**: Quality-driven recommendations
- **Affiliate Network**: Commission-based sales
- **Content Marketing**: Career advice and industry insights
- **Social Media**: LinkedIn and professional networks

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

## 🔄 Implementation Roadmap

### Phase 1: Core Platform (Q1 2025)
- [x] User authentication and profiles
- [x] CV builder with templates
- [x] Basic AI analysis
- [x] File upload and parsing
- [ ] Payment integration
- [ ] Basic analytics

### Phase 2: Advanced Features (Q2 2025)
- [ ] One-Click Apply functionality
- [ ] Cover letter generation
- [ ] Interview coach
- [ ] Advanced AI analysis
- [ ] Mobile app development

### Phase 3: Scale & Optimize (Q3 2025)
- [ ] Employer portal
- [ ] Advanced analytics
- [ ] Performance optimization
- [ ] International expansion
- [ ] Enterprise features

### Phase 4: Market Leadership (Q4 2025)
- [ ] AI-powered insights
- [ ] Advanced automation
- [ ] Strategic partnerships
- [ ] Market expansion
- [ ] IPO preparation

## 📋 Risk Assessment

### Technical Risks
- **AI Model Performance**: Dependency on third-party AI services
- **Scalability**: Database and infrastructure limitations
- **Security**: Data breaches and privacy concerns

### Business Risks
- **Market Competition**: Established players and new entrants
- **Regulatory Changes**: Data protection and employment laws
- **Economic Factors**: Recession impact on job market

### Mitigation Strategies
- **Redundancy**: Multiple AI providers and backup systems
- **Compliance**: Regular audits and legal reviews
- **Diversification**: Multiple revenue streams and markets

---

*Last Updated: 2025-07-16*
*Version: 4.1*
*Document Type: Product Requirements*
*Status: Active Development* 