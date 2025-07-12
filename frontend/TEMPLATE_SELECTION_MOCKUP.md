# 🎨 Template Selection Step - Visual Mockup

## **Overview**
This document describes the visual design and user experience for the "Choose a CV Template" step in the CV Builder flow.

---

## **🎯 Design Philosophy**

### **Clean & Professional**
- **Minimal clutter**: No overlapping elements or visual noise
- **Consistent spacing**: 24px (1.5rem) standard spacing throughout
- **Clear hierarchy**: Typography scale with proper contrast ratios
- **Modern aesthetics**: Subtle gradients, shadows, and smooth animations

### **User-Centric**
- **Clear selection state**: Visual feedback for chosen template
- **Accessible design**: High contrast, keyboard navigation, screen reader support
- **Mobile-first**: Responsive grid that stacks beautifully on all devices
- **Progressive disclosure**: Information revealed on hover/focus

---

## **🎨 Visual Design Specifications**

### **Color Palette**
```css
/* Primary Colors */
--primary-blue: #2563eb (Blue-600)
--primary-indigo: #4f46e5 (Indigo-600)
--primary-slate: #475569 (Slate-600)

/* Background Gradients */
--bg-gradient: linear-gradient(135deg, #f8fafc, #dbeafe, #e0e7ff)
--card-gradient: linear-gradient(135deg, #f1f5f9, #e2e8f0)

/* Tier Badge Colors */
--free: #dcfce7, #166534, #bbf7d0 (Green-100, Green-800, Green-200)
--starter: #dbeafe, #1e40af, #bfdbfe (Blue-100, Blue-800, Blue-200)
--pro: #f3e8ff, #7c3aed, #ddd6fe (Purple-100, Purple-800, Purple-200)
--elite: #fef3c7, #d97706, #fde68a (Amber-100, Amber-800, Amber-200)
```

### **Typography Scale**
```css
/* Headings */
--h1: 3rem (48px) - font-bold - gradient text
--h2: 1.5rem (24px) - font-semibold - slate-800
--h3: 1rem (16px) - font-semibold - slate-800

/* Body Text */
--body-large: 1.125rem (18px) - slate-600
--body: 1rem (16px) - slate-600
--body-small: 0.875rem (14px) - slate-600
--caption: 0.75rem (12px) - slate-500
```

### **Spacing System**
```css
/* Standard Spacing */
--space-xs: 0.5rem (8px)
--space-sm: 0.75rem (12px)
--space-md: 1rem (16px)
--space-lg: 1.5rem (24px)
--space-xl: 2rem (32px)
--space-2xl: 3rem (48px)
```

---

## **📱 Layout Structure**

### **Desktop Layout (1200px+)**
```
┌─────────────────────────────────────────────────────────────┐
│ [Back]              Create Your CV              [Help ?]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              Choose a CV Template                          │
│        Select a template to start building...              │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Free]         [Starter]         [Pro]        [Elite]     │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐  │
│  │ [Badge] │    │ [Badge] │    │ [Badge] │    │ [Badge] │  │
│  │         │    │         │    │         │    │         │  │
│  │ [Preview│    │ [Preview│    │ [Preview│    │ [Preview│  │
│  │  Image] │    │  Image] │    │  Image] │    │  Image] │  │
│  │         │    │         │    │         │    │         │  │
│  │ Modern  │    │ Classic │    │Creative │    │Exec.    │  │
│  │ Minimal │    │ Clean   │    │Colorful │    │Formal   │  │
│  │         │    │         │    │         │    │         │  │
│  │ ● ATS   │    │ ● ATS   │    │ ○ Creative│   │ ● ATS   │  │
│  │ Blue &  │    │ Navy &  │    │ Multi-  │    │ Dark &  │  │
│  │ Gray    │    │ White   │    │ color   │    │ Gold    │  │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              [Continue with Template]                      │
│                                                             │
│        💡 Pro Tip: ATS-friendly templates are...           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### **Tablet Layout (768px - 1199px)**
```
┌─────────────────────────────────────────┐
│ [Back]      Create Your CV    [Help ?] │
├─────────────────────────────────────────┤
│                                         │
│        Choose a CV Template            │
│    Select a template to start...       │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  [Free]         [Starter]              │
│  ┌─────────┐    ┌─────────┐            │
│  │ [Badge] │    │ [Badge] │            │
│  │         │    │         │            │
│  │ [Preview│    │ [Preview│            │
│  │  Image] │    │  Image] │            │
│  │         │    │         │            │
│  │ Modern  │    │ Classic │            │
│  │ Minimal │    │ Clean   │            │
│  └─────────┘    └─────────┘            │
│                                         │
│  [Pro]          [Elite]                │
│  ┌─────────┐    ┌─────────┐            │
│  │ [Badge] │    │ [Badge] │            │
│  │         │    │         │            │
│  │ [Preview│    │ [Preview│            │
│  │  Image] │    │  Image] │            │
│  │         │    │         │            │
│  │Creative │    │Exec.    │            │
│  │Colorful │    │Formal   │            │
│  └─────────┘    └─────────┘            │
│                                         │
│        [Continue with Template]        │
│                                         │
│      💡 Pro Tip: ATS-friendly...       │
│                                         │
└─────────────────────────────────────────┘
```

### **Mobile Layout (320px - 767px)**
```
┌─────────────────────────┐
│ [Back] Create CV [?]    │
├─────────────────────────┤
│                         │
│   Choose a CV Template  │
│ Select a template to... │
│                         │
├─────────────────────────┤
│                         │
│ [Free]                  │
│ ┌─────────────────────┐ │
│ │ [Badge]             │ │
│ │                     │ │
│ │ [Preview Image]     │ │
│ │                     │ │
│ │ Modern Minimal      │ │
│ │ ● ATS Friendly      │ │
│ │ Blue & Gray         │ │
│ └─────────────────────┘ │
│                         │
│ [Starter]               │
│ ┌─────────────────────┐ │
│ │ [Badge]             │ │
│ │                     │ │
│ │ [Preview Image]     │ │
│ │                     │ │
│ │ Classic Clean       │ │
│ │ ● ATS Friendly      │ │
│ │ Navy & White        │ │
│ └─────────────────────┘ │
│                         │
│ [Pro]                   │
│ ┌─────────────────────┐ │
│ │ [Badge]             │ │
│ │                     │ │
│ │ [Preview Image]     │ │
│ │                     │ │
│ │ Creative Colorful   │ │
│ │ ○ Creative Design   │ │
│ │ Multi-color         │ │
│ └─────────────────────┘ │
│                         │
│ [Elite]                 │
│ ┌─────────────────────┐ │
│ │ [Badge]             │ │
│ │                     │ │
│ │ [Preview Image]     │ │
│ │                     │ │
│ │ Executive Formal    │ │
│ │ ● ATS Friendly      │ │
│ │ Dark & Gold         │ │
│ └─────────────────────┘ │
│                         │
│ [Continue with Template]│
│                         │
│ 💡 Pro Tip: ATS-friendly│
│ templates are...        │
│                         │
└─────────────────────────┘
```

---

## **🎭 Interactive States**

### **Default State**
- Cards have subtle border (`border-slate-200`)
- Tier badges are visible but not prominent
- Preview images show placeholder with template name
- Continue button is disabled and grayed out

### **Hover State**
- Cards scale up slightly (`scale-105`)
- Shadow increases (`shadow-lg`)
- Border color changes (`border-slate-300`)
- Subtle overlay appears (`bg-black bg-opacity-10`)

### **Selected State**
- Card border becomes blue (`border-blue-500`)
- Check icon appears in top-right corner
- Card maintains hover scale
- Continue button becomes active with gradient

### **Focus State (Accessibility)**
- Clear focus ring around cards
- Keyboard navigation support
- Screen reader announcements
- High contrast focus indicators

---

## **🎨 Component Details**

### **Template Card**
```tsx
<Card className="relative cursor-pointer transition-all duration-300">
  {/* Tier Badge */}
  <Badge className="absolute top-3 left-3 z-10">
    {template.tier}
  </Badge>
  
  {/* Preview Image */}
  <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200">
    {/* Placeholder content */}
  </div>
  
  {/* Template Info */}
  <CardContent className="p-4">
    <h3>{template.name}</h3>
    <p>{template.description}</p>
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span>ATS Friendly</span>
      </div>
      <div>{template.colorScheme}</div>
    </div>
  </CardContent>
</Card>
```

### **Continue Button**
```tsx
<Button
  size="lg"
  disabled={!selectedTemplate}
  className={cn(
    "px-8 py-3 text-lg font-medium",
    selectedTemplate 
      ? "bg-gradient-to-r from-blue-600 to-indigo-600" 
      : "bg-slate-300 text-slate-500"
  )}
>
  {selectedTemplate ? "Continue with Template" : "Select a Template to Continue"}
</Button>
```

---

## **🚀 Implementation Notes**

### **Performance Optimizations**
- Lazy loading for template preview images
- CSS transitions instead of JavaScript animations
- Optimized re-renders with React.memo
- Efficient state management

### **Accessibility Features**
- ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader announcements
- High contrast mode support
- Focus management

### **Responsive Considerations**
- Fluid typography scaling
- Flexible grid system
- Touch-friendly tap targets (44px minimum)
- Optimized spacing for mobile

---

## **🎯 Success Metrics**

### **User Experience Goals**
- **Selection time**: < 30 seconds to choose a template
- **Error rate**: < 5% of users need to go back and reselect
- **Completion rate**: > 90% of users proceed to next step
- **Satisfaction score**: > 4.5/5 on template selection

### **Technical Goals**
- **Load time**: < 2 seconds for template grid
- **Animation smoothness**: 60fps transitions
- **Accessibility score**: 100% WCAG 2.1 AA compliance
- **Mobile performance**: 90+ Lighthouse score

---

This visual mockup provides a comprehensive guide for implementing a clean, professional, and user-friendly template selection step that aligns with modern design standards and accessibility requirements. 