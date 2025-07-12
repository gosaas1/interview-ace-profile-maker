import { OpenAIProvider } from './providers/openai';
import { GeminiProvider } from './providers/gemini';
import { BaseAIProvider } from './providers/base';
import { LocalCVAnalyzer } from './localAnalyzer';
import { 
  AIProvider, 
  CVAnalysisRequest, 
  CVAnalysisResponse, 
  AIError,
  UserAISettings 
} from './types';
import { getAIConfig, PRICING_AI_FEATURES } from './config';
import { supabase } from '../supabase';

export class AIService {
  private providers: Map<AIProvider, BaseAIProvider> = new Map();
  private fallbackOrder: AIProvider[] = ['openai', 'gemini', 'claude'];
  private localAnalyzer = new LocalCVAnalyzer();

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    const config = getAIConfig();

    // Initialize OpenAI if API key is available
    if (config.openai.apiKey) {
      this.providers.set('openai', new OpenAIProvider(config.openai.apiKey));
    }

    // Initialize Gemini if API key is available
    if (config.gemini.apiKey) {
      this.providers.set('gemini', new GeminiProvider(config.gemini.apiKey));
    }

    // TODO: Add Claude and Local providers when implemented
  }

  async analyzeCV(request: CVAnalysisRequest): Promise<CVAnalysisResponse> {
    // Get user's subscription tier and AI settings
    const userTier = await this.getUserTier(request.userId);
    const tierConfig = PRICING_AI_FEATURES[userTier];
    
    // Check usage limits
    await this.checkUsageLimits(request.userId, userTier);
    
    // Determine the best provider for this request
    const provider = this.selectProvider(tierConfig.provider, request.analysisType);
    
    try {
      const result = await this.executeAnalysis(provider, request);
      
      // Track usage
      await this.trackUsage(request.userId, result);
      
      // Store analysis result
      await this.storeAnalysis(result);
      
      return result;
    } catch (error) {
      console.error('AI Analysis failed:', error);
      
      // Try fallback providers
      return await this.tryFallbackProviders(request, provider);
    }
  }

  private selectProvider(preferredProvider: AIProvider, analysisType: string): AIProvider {
    // Check if preferred provider is available
    if (this.providers.has(preferredProvider)) {
      return preferredProvider;
    }

    // Find first available provider from fallback order
    for (const provider of this.fallbackOrder) {
      if (this.providers.has(provider)) {
        return provider;
      }
    }

    // If no real providers available, return 'local' for fallback analysis
    console.log('No AI providers configured, using fallback analysis');
    return 'local';
  }

  private async executeAnalysis(
    providerName: AIProvider, 
    request: CVAnalysisRequest
  ): Promise<CVAnalysisResponse> {
    const provider = this.providers.get(providerName);
    
    // If provider not available (like 'local' fallback), use real ATS analyzer
    if (!provider) {
      if (providerName === 'local') {
        console.log('Using industry-standard ATS analyzer');
        return this.localAnalyzer.analyzeCV(request);
      }
      throw new Error(`Provider ${providerName} not available`);
    }

    return await provider.analyzeCV(request);
  }

  private async tryFallbackProviders(
    request: CVAnalysisRequest, 
    failedProvider: AIProvider
  ): Promise<CVAnalysisResponse> {
    const remainingProviders = this.fallbackOrder.filter(p => 
      p !== failedProvider && this.providers.has(p)
    );

    for (const providerName of remainingProviders) {
      try {
        console.log(`Trying fallback provider: ${providerName}`);
        return await this.executeAnalysis(providerName, request);
      } catch (error) {
        console.warn(`Fallback provider ${providerName} also failed:`, error);
        continue;
      }
    }

    // If all providers fail, return a basic analysis
    return this.createFallbackAnalysis(request);
  }

  private createFallbackAnalysis(request: CVAnalysisRequest): CVAnalysisResponse {
    console.log('Creating fallback analysis for CV:', request.cvId);
    return {
      id: crypto.randomUUID(),
      cvId: request.cvId,
      userId: request.userId,
      provider: 'local', // Fallback provider
      model: 'fallback',
      analysisType: request.analysisType,
      
      overallScore: 70,
      atsCompatibility: 65,
      readabilityScore: 75,
      
      scores: {
        formatting: 70,
        keywords: 65,
        experience: 75,
        skills: 70,
        education: 80,
        achievements: 65
      },
      
      strengths: [
        'CV structure appears organized',
        'Contact information is present',
        'Professional experience is included'
      ],
      weaknesses: [
        'Unable to perform detailed AI analysis',
        'Consider upgrading for comprehensive feedback',
        'Manual review recommended'
      ],
      suggestions: [{
        id: 'fallback_suggestion',
        category: 'content',
        priority: 'medium',
        title: 'AI Analysis Unavailable',
        description: 'We encountered technical difficulties analyzing your CV. Please try again later or contact support.',
        impact: 'Manual review or retry may provide better insights'
      }],
      
      missingKeywords: [],
      presentKeywords: [],
      keywordDensity: 0,
      
      analysisDate: new Date().toISOString(),
      processingTime: 100,
      tokenUsage: {
        input: 0,
        output: 0,
        cost: 0
      }
    };
  }

  private async getUserTier(userId: string): Promise<keyof typeof PRICING_AI_FEATURES> {
    try {
      // For now, just return 'free' tier until profiles table is set up
      // TODO: Implement proper subscription tier lookup when user management is ready
      console.log('Using default free tier for user:', userId);
      return 'free';
    } catch (error) {
      console.warn('Could not fetch user tier, defaulting to free:', error);
      return 'free';
    }
  }

  private async checkUsageLimits(userId: string, tier: keyof typeof PRICING_AI_FEATURES) {
    try {
      const tierConfig = PRICING_AI_FEATURES[tier];
      
      if (tierConfig.monthlyLimit === -1) {
        return; // Unlimited
      }

      // TODO: Implement usage tracking when database is ready
      console.log(`Checking usage limits for tier: ${tier}, limit: ${tierConfig.monthlyLimit}`);
    } catch (error) {
      console.warn('Could not check usage limits:', error);
    }
  }

  private async trackUsage(userId: string, result: CVAnalysisResponse) {
    try {
      // TODO: Implement usage tracking when database is ready
      console.log(`Tracking usage for user: ${userId}, tokens: ${result.tokenUsage.input + result.tokenUsage.output}`);
    } catch (error) {
      console.warn('Could not track usage:', error);
    }
  }

  private async storeAnalysis(result: CVAnalysisResponse) {
    try {
      // TODO: Store analysis result in database when ready
      console.log(`Storing analysis result: ${result.id}`);
    } catch (error) {
      console.warn('Could not store analysis result:', error);
    }
  }

  getAvailableProviders(): AIProvider[] {
    return Array.from(this.providers.keys());
  }

  isProviderAvailable(provider: AIProvider): boolean {
    return this.providers.has(provider);
  }

  async testProvider(provider: AIProvider): Promise<boolean> {
    const providerInstance = this.providers.get(provider);
    if (!providerInstance) {
      return false;
    }

    try {
      await providerInstance.testConnection();
      return true;
    } catch (error) {
      console.warn(`Provider ${provider} test failed:`, error);
      return false;
    }
  }
}

// Export a singleton instance
export const aiService = new AIService(); 