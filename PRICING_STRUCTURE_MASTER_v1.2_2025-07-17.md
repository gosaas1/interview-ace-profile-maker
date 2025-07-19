# 💰 ApplyAce Pricing Structure Master Document v1.2

## 📅 Document Metadata

* **Version**: 1.2
* **Created**: 2024-07-16
* **Last Updated**: 2025-07-17
* **Next Review**: 2025-08-01
* **Owner**: ApplyAce Finance Team

---

## 📋 Overview

This document serves as the single source of truth for ApplyAce's pricing, AI providers, parsing limits, and cost control measures.

---

## 🎯 Complete Pricing Tiers (Original Structure)

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

## 💸 Discounts & Affiliate Commissions

* **Standard Discount**: 10% off coupon on any paid tier (Starter & up).
* **Affiliate Commission**: 20% of net revenue (after discount) paid to affiliate.

---

## 🧠 AI Architecture & Cost Controls

### AI Providers
- **Parsing**: Cohere (est. $0.005 - $0.01 / use)
- **AI Review**: Claude (est. $0.003 - $0.008 / 1K tokens)
- **Storage**: Supabase, optional video CDN

### Parsing Logic Enforcement
- **Tier-based limits**: Free (1), Pay-As-You-Go (per use), Starter (5), Professional (unlimited), Career Pro (unlimited), Elite Executive (unlimited)
- **One-time parsing**: CV parsed once, cached for all subsequent operations
- **Cost control**: Parsing limits prevent runaway costs
- **Usage tracking**: All parsing operations logged per user

### Revenue Model
- **Subscription tiers**: Monthly recurring revenue
- **Pay-As-You-Go**: Per-analysis billing
- **Add-ons**: Video module / live coaching (future)

---

## 📊 Per-User P&L Model (Monthly)

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

## 🔄 Implementation Notes

### Key Changes from Previous Version
- **AI Provider Updates**: Cohere for parsing, Claude for review
- **Parsing Limits**: Tier-based usage limits for cost control
- **Human Review Removed**: AI-first automation approach
- **Original Pricing Maintained**: 6-tier structure preserved

### Future Features
- **Video Assistance Module**: Real-time AI coaching
- **Live Assistant**: Real-time prompt + response tools
- **Advanced Analytics**: Usage tracking and optimization

---

## 📈 Growth Strategy

### Phase 1 (MVP)
- Upload CV
- Parse once (Cohere)
- Save as base

### Phase 2
- Mass apply functionality
- Tailored CVs (Claude)
- Interview coaching

### Phase 3
- Video AI Support (Live Assistant)
- Real-time prompt + response tools

---

## 🎯 Success Metrics

### Key Performance Indicators
- **Parsing Usage**: Track usage against tier limits
- **AI Cost Control**: Monitor Claude/Cohere costs per user
- **Conversion Rates**: Free to paid tier conversion
- **Revenue Growth**: Monthly recurring revenue growth

### Cost Optimization
- **Parsing Efficiency**: Minimize redundant parsing
- **AI Token Usage**: Optimize Claude prompts for cost efficiency
- **Infrastructure**: Scale Supabase usage efficiently 