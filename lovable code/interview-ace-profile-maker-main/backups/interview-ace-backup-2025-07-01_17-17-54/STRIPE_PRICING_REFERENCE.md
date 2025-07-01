# 💳 Stripe Pricing Quick Reference

## 🎯 **EXACT PRICES TO CREATE IN STRIPE**

### **Product 1: Pay-as-you-go Analysis**
- **Price**: £1.99
- **Type**: One-time payment
- **Currency**: GBP

### **Product 2: Starter Plan**
- **Monthly**: £9.99/month
- **6-month**: £41.96 every 6 months (30% discount)
- **Annual**: £59.94/year (50% discount)

### **Product 3: Professional Plan**
- **Monthly**: £14.99/month
- **6-month**: £62.96 every 6 months (30% discount)
- **Annual**: £89.94/year (50% discount)

### **Product 4: Career Pro Plan**
- **Monthly**: £29.99/month
- **6-month**: £125.96 every 6 months (30% discount)
- **Annual**: £179.94/year (50% discount)

### **Product 5: Elite Executive Plan**
- **Monthly**: £59.99/month
- **6-month**: £251.96 every 6 months (30% discount)
- **Annual**: £359.94/year (50% discount)

---

## 📊 **PRICING CALCULATION BREAKDOWN**

### Discount Calculations:
- **6-month discount**: 30% off (pay for ~4.2 months, get 6)
- **Annual discount**: 50% off (pay for 6 months, get 12)

### Examples:
```
Starter Plan:
- Monthly: £9.99 × 12 = £119.88/year
- 6-month: £41.96 × 2 = £83.92/year (30% off)
- Annual: £59.94/year (50% off)

Professional Plan:
- Monthly: £14.99 × 12 = £179.88/year
- 6-month: £62.96 × 2 = £125.92/year (30% off)
- Annual: £89.94/year (50% off)
```

---

## 🔧 **STRIPE DASHBOARD SETTINGS**

### For Each Subscription Product:
- **Billing period**: Monthly/6-month/Annual
- **Currency**: GBP
- **Tax behavior**: Exclusive (let Stripe handle VAT)
- **Usage type**: Licensed (not metered)

### For Pay-as-you-go:
- **Type**: One-time payment
- **Amount**: £1.99
- **Currency**: GBP

---

## ✅ **CHECKLIST: 13 PRICES TO CREATE**

### Pay-as-you-go:
- [ ] £1.99 one-time

### Starter Plan:
- [ ] £9.99/month
- [ ] £41.96/6-month
- [ ] £59.94/year

### Professional Plan:
- [ ] £14.99/month
- [ ] £62.96/6-month
- [ ] £89.94/year

### Career Pro Plan:
- [ ] £29.99/month
- [ ] £125.96/6-month
- [ ] £179.94/year

### Elite Executive Plan:
- [ ] £59.99/month
- [ ] £251.96/6-month
- [ ] £359.94/year

**Total: 13 prices across 5 products** ✅ 