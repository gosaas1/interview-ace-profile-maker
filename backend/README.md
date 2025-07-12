# 🚀 Applyace - Comprehensive Career Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![Mobile First](https://img.shields.io/badge/Mobile-First-green.svg)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

> **The complete AI-powered career platform** - CV optimization, job applications, and interview coaching in one seamless experience.

---

## 📋 **Overview**

Applyace revolutionizes career development through three integrated modules:

### 🎯 **Core Modules**

| Module | Purpose | Key Features |
|--------|---------|--------------|
| **CV Builder & Optimizer** | Professional CV creation | AI analysis, ATS optimization, templates |
| **Job Application Engine** | One-button applications | Smart matching, bulk apply, tracking |
| **Interview Coach** ⭐ | AI interview preparation | Mock interviews, feedback, analytics |

---

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ and npm
- Git
- Modern browser with WebRTC support

### **Installation**

```bash
# Clone the repository
git clone https://github.com/gosaas1/applyace.git
cd applyace

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

### **Environment Variables**
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_key (optional)
```

---

## 🏗️ **Architecture**

### **Technology Stack**
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **State Management**: Zustand
- **Mobile**: Progressive Web App (PWA)

### **Project Structure**
```
src/
├── components/           # Reusable UI components
│   ├── cv/              # CV Builder module components
│   ├── jobs/            # Job Application module components
│   ├── interview/       # Interview Coach module components
│   ├── auth/            # Authentication components
│   └── ui/              # Base UI components
├── pages/               # Route components
├── lib/                 # Utilities and configurations
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
└── assets/              # Static assets
```

---

## 📱 **Mobile-First Design**

### **Responsive Breakpoints**
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px - 1439px
- **Large Desktop**: 1440px+

### **PWA Features**
- ✅ Installable on mobile devices
- ✅ Offline-first architecture
- ✅ Push notifications
- ✅ Background sync

---

## 🎤 **Interview Coach Module**

### **Features**
- **AI Mock Interviews**: Industry-specific questions with real-time feedback
- **Question Bank**: 10,000+ categorized interview questions
- **Performance Analytics**: Confidence scoring and improvement tracking
- **Video Practice**: Optional video recording for self-review
- **Mobile Optimized**: Practice on the go with voice-only mode

### **Technical Implementation**
- Speech-to-text using Web Speech API
- AI feedback via OpenAI/Claude integration
- WebRTC for video recording
- Real-time performance analytics

---

## 🛠️ **Development**

### **Available Scripts**

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript compiler |
| `npm run test` | Run test suite |

### **Development Guidelines**

#### **Code Style**
- Use TypeScript for all new code
- Follow Airbnb style guide
- Use Prettier for formatting
- Implement responsive design mobile-first

#### **Component Structure**
```typescript
// Example component structure
import { useState } from 'react';
import { motion } from 'framer-motion';

interface ComponentProps {
  // Props definition
}

export const Component: React.FC<ComponentProps> = ({ prop }) => {
  // Component logic
  return (
    <motion.div
      className="mobile-first-classes md:desktop-classes"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Component content */}
    </motion.div>
  );
};
```

#### **State Management**
```typescript
// Using Zustand for state management
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  user: User | null;
  currentModule: 'cv' | 'jobs' | 'interview';
  setUser: (user: User) => void;
  setCurrentModule: (module: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      currentModule: 'cv',
      setUser: (user) => set({ user }),
      setCurrentModule: (module) => set({ currentModule: module }),
    }),
    { name: 'applyace-storage' }
  )
);
```

---

## 🔧 **Configuration**

### **Supabase Setup**
1. Create a new Supabase project
2. Run database migrations from `database-setup.sql`
3. Set up authentication providers
4. Configure storage buckets 