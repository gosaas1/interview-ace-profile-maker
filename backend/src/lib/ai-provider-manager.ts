import { CohereClient } from 'cohere-ai';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

// AI Provider Configuration
export interface AIProviderConfig {
  name: string;
  apiKey: string;
  model: string;
  costPerToken: number;
  maxTokens: number;
  isAvailable: boolean;
}

export interface AIUsageStats {
  userId: string;
  tier: string;
  parsingCount: number;
  aiCallCount: number;
  totalCost: number;
  monthlyLimit: number;
  currentMonth: string;
}

export interface AITierConfig {
  tier: string;
  parsingProvider: 'aws-textract' | 'cohere';
  aiProvider: 'openai' | 'claude' | 'cohere';
  aiModel: string;
  parsingLimit: number;
  aiLimit: number;
  features: string[];
}

// Tier-based AI configuration
export const TIER_CONFIGS: Record<string, AITierConfig> = {
  free: {
    tier: 'free',
    parsingProvider: 'aws-textract',
    aiProvider: 'openai',
    aiModel: 'gpt-4o-mini',
    parsingLimit: 1,
    aiLimit: 1,
    features: ['Basic CV parsing', 'Simple AI analysis']
  },
  payAsYouGo: {
    tier: 'payAsYouGo',
    parsingProvider: 'aws-textract',
    aiProvider: 'openai',
    aiModel: 'gpt-4o-mini',
    parsingLimit: 3,
    aiLimit: 5,
    features: ['CV parsing', 'AI analysis', 'Basic suggestions']
  },
  starter: {
    tier: 'starter',
    parsingProvider: 'aws-textract',
    aiProvider: 'openai',
    aiModel: 'gpt-4o-mini',
    parsingLimit: 10,
    aiLimit: 20,
    features: ['CV parsing', 'AI analysis', 'Detailed suggestions', 'ATS optimization']
  },
  professional: {
    tier: 'professional',
    parsingProvider: 'aws-textract',
    aiProvider: 'openai',
    aiModel: 'gpt-4o',
    parsingLimit: -1, // Unlimited
    aiLimit: -1, // Unlimited
    features: ['Unlimited parsing', 'Premium AI', 'Advanced analysis', 'Priority support']
  },
  careerPro: {
    tier: 'careerPro',
    parsingProvider: 'cohere',
    aiProvider: 'claude',
    aiModel: 'claude-3-haiku-20240307',
    parsingLimit: -1, // Unlimited
    aiLimit: -1, // Unlimited
    features: ['Cohere parsing', 'Claude analysis', 'Executive insights', 'Interview prep']
  },
  eliteExecutive: {
    tier: 'eliteExecutive',
    parsingProvider: 'cohere',
    aiProvider: 'claude',
    aiModel: 'claude-3-sonnet-20240229',
    parsingLimit: -1, // Unlimited
    aiLimit: -1, // Unlimited
    features: ['Premium parsing', 'Sonnet analysis', 'Double verification', 'Interview questions']
  }
};

export class AIProviderManager {
  private cohere: CohereClient;
  private openai: OpenAI;
  private claude: Anthropic;
  private usageStats: Map<string, AIUsageStats> = new Map();

  constructor() {
    // Initialize Cohere
    this.cohere = new CohereClient({
      token: process.env.COHERE_API_KEY || ''
    });

    // Initialize OpenAI
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || ''
    });

    // Initialize Claude
    this.claude = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || ''
    });
  }

  /**
   * Get tier configuration for a user
   */
  getTierConfig(tier: string): AITierConfig {
    return TIER_CONFIGS[tier] || TIER_CONFIGS.free;
  }

  /**
   * Check if user can perform parsing operation
   */
  async canParse(userId: string, tier: string): Promise<{ allowed: boolean; reason?: string }> {
    const config = this.getTierConfig(tier);
    const stats = await this.getUserStats(userId, tier);

    if (config.parsingLimit === -1) {
      return { allowed: true };
    }

    if (stats.parsingCount >= config.parsingLimit) {
      return { 
        allowed: false, 
        reason: `Parsing limit reached (${stats.parsingCount}/${config.parsingLimit}). Upgrade your plan for more parsing.` 
      };
    }

    return { allowed: true };
  }

  /**
   * Check if user can perform AI operation
   */
  async canUseAI(userId: string, tier: string): Promise<{ allowed: boolean; reason?: string }> {
    const config = this.getTierConfig(tier);
    const stats = await this.getUserStats(userId, tier);

    if (config.aiLimit === -1) {
      return { allowed: true };
    }

    if (stats.aiCallCount >= config.aiLimit) {
      return { 
        allowed: false, 
        reason: `AI usage limit reached (${stats.aiCallCount}/${config.aiLimit}). Upgrade your plan for more AI features.` 
      };
    }

    return { allowed: true };
  }

  /**
   * Get AI provider for tier
   */
  getAIProvider(tier: string): 'openai' | 'claude' | 'cohere' {
    const config = this.getTierConfig(tier);
    return config.aiProvider;
  }

  /**
   * Get parsing provider for tier
   */
  getParsingProvider(tier: string): 'aws-textract' | 'cohere' {
    const config = this.getTierConfig(tier);
    return config.parsingProvider;
  }

  /**
   * Analyze CV with appropriate AI provider
   */
  async analyzeCV(cvText: string, tier: string, jobDescription?: string): Promise<{
    analysis: any;
    provider: string;
    cost: number;
  }> {
    const provider = this.getAIProvider(tier);
    const config = this.getTierConfig(tier);

    const prompt = this.buildAnalysisPrompt(cvText, jobDescription, tier);

    try {
      let analysis: any;
      let cost = 0;

      switch (provider) {
        case 'openai':
          analysis = await this.analyzeWithOpenAI(prompt, config.aiModel);
          cost = this.calculateOpenAICost(prompt, analysis);
          break;
        case 'claude':
          analysis = await this.analyzeWithClaude(prompt, config.aiModel);
          cost = this.calculateClaudeCost(prompt, analysis);
          break;
        case 'cohere':
          analysis = await this.analyzeWithCohere(prompt);
          cost = this.calculateCohereCost(prompt, analysis);
          break;
        default:
          throw new Error(`Unsupported AI provider: ${provider}`);
      }

      return { analysis, provider, cost };
    } catch (error) {
      console.error(`AI analysis failed with ${provider}:`, error);
      throw error;
    }
  }

  /**
   * Generate cover letter with appropriate AI provider
   */
  async generateCoverLetter(cvText: string, jobDescription: string, tier: string): Promise<{
    coverLetter: string;
    provider: string;
    cost: number;
  }> {
    const provider = this.getAIProvider(tier);
    const config = this.getTierConfig(tier);

    const prompt = this.buildCoverLetterPrompt(cvText, jobDescription, tier);

    try {
      let coverLetter: string;
      let cost = 0;

      switch (provider) {
        case 'openai':
          const openaiResult = await this.openai.chat.completions.create({
            model: config.aiModel,
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 1000,
            temperature: 0.7
          });
          coverLetter = openaiResult.choices[0]?.message?.content || '';
          cost = this.calculateOpenAICost(prompt, coverLetter);
          break;
        case 'claude':
          const claudeResult = await this.claude.messages.create({
            model: config.aiModel,
            max_tokens: 1000,
            messages: [{ role: 'user', content: prompt }]
          });
          const claudeContent = claudeResult.content[0];
          coverLetter = claudeContent?.type === 'text' ? claudeContent.text : '';
          cost = this.calculateClaudeCost(prompt, coverLetter);
          break;
        default:
          throw new Error(`Unsupported AI provider for cover letter: ${provider}`);
      }

      return { coverLetter, provider, cost };
    } catch (error) {
      console.error(`Cover letter generation failed with ${provider}:`, error);
      throw error;
    }
  }

  /**
   * Track usage for a user
   */
  async trackUsage(userId: string, tier: string, operation: 'parsing' | 'ai', cost: number = 0): Promise<void> {
    const stats = await this.getUserStats(userId, tier);
    
    if (operation === 'parsing') {
      stats.parsingCount++;
    } else if (operation === 'ai') {
      stats.aiCallCount++;
    }
    
    stats.totalCost += cost;
    
    // TODO: Save to database
    console.log(`📊 Usage tracked for user ${userId}: ${operation} operation, cost: $${cost.toFixed(4)}`);
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId: string, tier: string): Promise<AIUsageStats> {
    const key = `${userId}-${tier}`;
    
    if (!this.usageStats.has(key)) {
      this.usageStats.set(key, {
        userId,
        tier,
        parsingCount: 0,
        aiCallCount: 0,
        totalCost: 0,
        monthlyLimit: this.getTierConfig(tier).parsingLimit,
        currentMonth: new Date().toISOString().slice(0, 7) // YYYY-MM
      });
    }
    
    return this.usageStats.get(key)!;
  }

  // Private helper methods
  private async analyzeWithOpenAI(prompt: string, model: string): Promise<any> {
    const response = await this.openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      temperature: 0.3
    });
    
    const content = response.choices[0]?.message?.content || '';
    return JSON.parse(content);
  }

  private async analyzeWithClaude(prompt: string, model: string): Promise<any> {
    const response = await this.claude.messages.create({
      model,
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    });
    
    const content = response.content[0];
    const text = content?.type === 'text' ? content.text : '';
    return JSON.parse(text);
  }

  private async analyzeWithCohere(prompt: string): Promise<any> {
    const response = await this.cohere.generate({
      model: 'command',
      prompt,
      maxTokens: 2000,
      temperature: 0.3
    });
    
    const content = response.generations[0]?.text || '';
    return JSON.parse(content);
  }

  private buildAnalysisPrompt(cvText: string, jobDescription?: string, _tier?: string): string {
    const basePrompt = `Analyze this CV and provide a comprehensive assessment. Return a JSON response with:
- overallScore (0-100)
- atsCompatibility (0-100)
- readabilityScore (0-100)
- strengths (array of 3-5 key strengths)
- weaknesses (array of 3-5 areas for improvement)
- suggestions (array of specific improvement suggestions)
- missingKeywords (array of relevant keywords not found)
- industryMatch (0-100, if job description provided)

CV Content: ${cvText}`;

    if (jobDescription) {
      return basePrompt + `\n\nJob Description: ${jobDescription}`;
    }

    return basePrompt;
  }

  private buildCoverLetterPrompt(cvText: string, jobDescription: string, _tier: string): string {
    return `Write a professional cover letter based on this CV and job description. 
The cover letter should be:
- 250-350 words
- Professional and engaging
- Highlight relevant experience from the CV
- Address key requirements from the job description
- End with a strong call to action

CV Summary: ${cvText.substring(0, 1000)}...
Job Description: ${jobDescription}

Write the cover letter:`;
  }

  private calculateOpenAICost(prompt: string, response: string): number {
    // OpenAI pricing: $0.15 per 1M input tokens, $0.60 per 1M output tokens
    const inputTokens = prompt.length / 4; // Rough estimation
    const outputTokens = response.length / 4;
    return (inputTokens * 0.00000015) + (outputTokens * 0.0000006);
  }

  private calculateClaudeCost(prompt: string, response: string): number {
    // Claude pricing: $0.25 per 1M input tokens, $1.25 per 1M output tokens
    const inputTokens = prompt.length / 4;
    const outputTokens = response.length / 4;
    return (inputTokens * 0.00000025) + (outputTokens * 0.00000125);
  }

  private calculateCohereCost(prompt: string, response: string): number {
    // Cohere pricing: $0.15 per 1M tokens
    const totalTokens = (prompt.length + response.length) / 4;
    return totalTokens * 0.00000015;
  }
}

// Export singleton instance
export const aiProviderManager = new AIProviderManager(); 