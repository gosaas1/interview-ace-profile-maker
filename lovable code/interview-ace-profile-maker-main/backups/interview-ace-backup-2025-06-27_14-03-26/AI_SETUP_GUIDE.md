# 🤖 AI CV Analysis System Setup Guide

## Overview
ApplyAce now includes a powerful multi-provider AI system for CV analysis with automatic fallbacks and cost optimization.

## 🔧 Environment Setup

### 1. Create `.env.local` file in your project root:

```bash
# AI Provider API Keys
VITE_OPENAI_API_KEY=sk-your-openai-api-key
VITE_GEMINI_API_KEY=your-gemini-api-key
VITE_CLAUDE_API_KEY=your-claude-api-key
VITE_OLLAMA_URL=http://localhost:11434
```

### 2. Get API Keys

#### OpenAI (Primary Provider - $5 Free Credit)
1. Go to https://platform.openai.com/api-keys
2. Create account or sign in
3. Click "Create new secret key"
4. Copy the key starting with `sk-`
5. Add to `.env.local` as `VITE_OPENAI_API_KEY`

#### Google Gemini (Free Tier Provider - 15 req/min free)
1. Go to https://aistudio.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the generated key
5. Add to `.env.local` as `VITE_GEMINI_API_KEY`

#### Anthropic Claude (Premium Provider - Optional)
1. Go to https://console.anthropic.com/
2. Create account and add payment method
3. Go to API Keys section
4. Create new key
5. Add to `.env.local` as `VITE_CLAUDE_API_KEY`

## 🗄️ Database Setup

Run the AI tables SQL script in your Supabase SQL editor:

```sql
-- Copy and paste the contents of database-ai-tables.sql
-- This creates tables for ai_analyses, ai_usage, and user_ai_settings
```

## 🚀 Provider Strategy

### Cost-Effective Approach:
1. **Free Tier**: Google Gemini (15 requests/minute free)
2. **Pay-as-you-go**: OpenAI GPT-3.5 (~$0.001/1K tokens)
3. **Premium**: Claude Haiku for executive analysis
4. **Future**: Local Ollama for complete privacy

### Automatic Fallbacks:
- Primary provider fails → Try OpenAI
- OpenAI fails → Try Gemini
- All fail → Basic fallback analysis

## 🎯 Pricing Integration

### **Complete Pricing Structure**
- **Free (£0)**: 1 basic analysis/month (Gemini free tier)
- **Pay-as-you-go (£4.99)**: Per-analysis pricing (OpenAI)
- **Starter/Student (£9.99)**: 5 detailed analyses/month (OpenAI)
- **Professional (£14.99)**: Unlimited premium analysis (OpenAI/GPT-4)
- **Career Pro (£29.99)**: Claude AI with human review and coaching

## 🧪 Testing the System

### 1. Quick Test (No API Keys Required)
```typescript
import { aiService } from './src/lib/ai/service';

// Test fallback system
const result = await aiService.analyzeCV({
  cvText: 'John Doe\nSoftware Engineer\nExperience: 5 years',
  analysisType: 'basic',
  userId: 'test-user',
  cvId: 'test-cv'
});

console.log('Fallback analysis:', result);
```

### 2. Provider Testing
```typescript
// Test specific providers
const providers = aiService.getAvailableProviders();
console.log('Available providers:', providers);

// Test provider connectivity
for (const provider of providers) {
  const isWorking = await aiService.testProvider(provider);
  console.log(`${provider}: ${isWorking ? '✅ Working' : '❌ Failed'}`);
}
```

## 📊 Usage Monitoring

The system automatically tracks:
- Token usage per user
- Cost per analysis
- Provider performance
- Monthly usage limits
- Error rates and fallbacks

## 🔒 Security & Privacy

- API keys stored in environment variables only
- No sensitive data logged
- User data encrypted in Supabase
- Row-level security policies
- Optional local processing (Ollama)

## 🎨 UI Components

### CVAnalysis Component Features:
- ✅ Beautiful gradient UI with progress indicators
- ✅ Real-time analysis progress
- ✅ Detailed score breakdowns
- ✅ Interactive tabs for different insights
- ✅ Suggestion cards with priorities
- ✅ Responsive design
- ✅ Error handling with retry options

### Integration Points:
- CV Builder page
- Dashboard analytics
- CV preview modals
- Batch analysis for multiple CVs

## 🚀 Next Steps

1. **Get API Keys**: Start with free Gemini key
2. **Run Database Script**: Set up AI tables
3. **Test Integration**: Try the CVAnalysis component
4. **Monitor Usage**: Check Supabase analytics
5. **Scale Up**: Add OpenAI for better quality

## 💡 Cost Estimates

### Monthly Costs (Estimated):
- **100 basic analyses**: ~$0.50 (Gemini free tier)
- **100 detailed analyses**: ~$2-5 (OpenAI GPT-3.5)
- **100 premium analyses**: ~$10-15 (Claude Haiku)

### Revenue vs Costs:
- Free tier: Break-even with ads/upgrades
- Paid tiers: 80%+ profit margin
- Enterprise: Custom pricing

## 🔧 Troubleshooting

### Common Issues:
1. **No providers available**: Check API keys in `.env.local`
2. **Rate limit errors**: Implement exponential backoff
3. **High costs**: Monitor token usage, optimize prompts
4. **Database errors**: Check RLS policies and table structure

### Debug Tools:
```typescript
// Check provider status
console.log('Providers:', aiService.getAvailableProviders());

// Test connectivity
await aiService.testProvider('openai');

// Monitor usage
const usage = await supabase
  .from('ai_usage')
  .select('*')
  .eq('user_id', userId)
  .order('timestamp', { ascending: false });
```

## 🎯 Success Metrics

Track these KPIs:
- Analysis completion rate
- User satisfaction scores
- Cost per analysis
- Provider uptime
- Feature adoption by tier
- Upgrade conversion rates

---

**Ready to revolutionize CV analysis with AI! 🚀** 