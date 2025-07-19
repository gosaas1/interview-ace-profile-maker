# 💰 ApplyAce Pricing Structure Master Document

## 📋 Overview

This document serves as the single source of truth for ApplyAce's pricing, discounts, affiliate commissions, and per‑user profit & loss (P&L) model.

---

## 🎯 Complete Pricing Tiers (Base Rates)

| Tier              | Price/mo | Discountable | Notes                                 |
| ----------------- | -------: | :----------- | :------------------------------------ |
| Free              |    £0.00 | No           | 1 basic analysis, 1 CV build/upload   |
| Pay-As-You-Go     |    £2.49 | No           | Per-analysis billing                  |
| Starter (Popular) |   £11.99 | Yes (10%)    | 5 analyses, unlimited CVs, 25 applies |
| Professional      |   £17.99 | Yes (10%)    | Unlimited analyses & applications     |
| Career Pro        |   £35.99 | Yes (10%)    | Human review, video practice          |
| Elite Executive   |   £69.99 | Yes (10%)    | 1-on-1 AI coaching, concierge support |

*No annual/6‑month term discounts are currently offered.*

---

## 💸 Discounts & Affiliate Commissions

* **Standard Discount**: 10% off coupon on any paid tier (Starter & up).
* **Affiliate Commission**: 20% of net revenue (after discount) paid to affiliate.

## 📊 Per-User P&L Model (Monthly)

Assumptions:

* **Parsing Cost**: £0.024/mo (AWS Textract at ~20 pages/user)
* **AI Analysis Cost**:

  * Starter: £0.008/mo (mini ChatGPT per 5 analyses)
  * Professional: £0.024/mo (GPT-4 average usage)
  * Career Pro: £0.050/mo (Claude text + video scoring)
  * Elite Executive: £0.080/mo (Claude premium + 1-on-1 coaching)
* **Infrastructure Cost** (backend + frontend hosting, storage): £0.020/mo per user
* **Total Monthly Cost** = Parsing Cost + AI Analysis Cost + Infrastructure Cost
* **Tax Rate**: 20% on net profit

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

---

## 🧠 AI Architecture Breakdown

| Function             | Provider      | Description                                   | Cost Range (per user/mo) |
| -------------------- | ------------- | --------------------------------------------- | ------------------------ |
| **Parsing**          | AWS Textract  | Extracts CV text from PDFs, DOCX, DOC files   | £0.02–£0.03              |
| **CV Generation**    | Cohere        | Rewrites CVs based on job description         | £0.09–£9.00              |
| **Cover Letter Gen** | Cohere        | Humanized, tailored cover letters             | Included in Cohere use   |
| **Interview Qs**     | Claude/OpenAI | AI-generated personalized interview questions | Bundled per tier usage   |

➡️ **Why Both AWS Textract + Cohere?**

* Textract ensures **accurate parsing** and structure.
* Cohere ensures **humanized, ATS-optimized output**.
* Combined, they power the **One-Click Apply** experience with the best accuracy + UX.

---

## 🔧 Implementation Notes

### Frontend Integration
- Pricing tiers must be displayed consistently across all pages
- Discount codes should be prominently featured
- Affiliate tracking links must be implemented
- Tier comparison table should highlight "Most Popular" (Starter)

### Backend Integration
- Stripe integration for payment processing
- Discount code validation system
- Affiliate commission tracking
- Usage-based billing for Pay-As-You-Go tier

### Database Schema
- User subscription tiers
- Discount code usage tracking
- Affiliate referral tracking
- Usage analytics for cost calculation

---

## 📈 Business Impact

### Revenue Projections
- **Starter Tier**: Primary revenue driver with 60% conversion rate
- **Professional Tier**: High-value users with 25% conversion rate
- **Career Pro**: Premium segment with 10% conversion rate
- **Elite Executive**: Enterprise segment with 5% conversion rate

### Profit Margins
- **Average Profit After Tax**: £19.51 per user/month
- **Break-even**: ~50 users for operational costs
- **Scalability**: Linear profit growth with user acquisition

---

*Last Updated: 2025-07-16*
*Version: 1.0*
*Document Type: Pricing Master* 