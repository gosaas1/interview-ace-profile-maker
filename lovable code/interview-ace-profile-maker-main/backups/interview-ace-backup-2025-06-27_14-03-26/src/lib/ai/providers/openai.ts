import { BaseAIProvider } from './base';
import { CVAnalysisRequest, CVAnalysisResponse, CVSuggestion } from '../types';
import { CV_ANALYSIS_PROMPTS, AI_PROVIDERS } from '../config';

export class OpenAIProvider extends BaseAIProvider {
  constructor(apiKey: string) {
    super('openai', {
      apiKey,
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4o-mini'
    });
  }

  async analyzeCV(request: CVAnalysisRequest): Promise<CVAnalysisResponse> {
    const startTime = Date.now();
    
    try {
      const prompt = this.buildPrompt(request);
      const response = await this.makeRequest(prompt, 1500);
      const parsedResponse = this.parseAIResponse(response);
      
      const processingTime = Date.now() - startTime;
      const inputTokens = this.calculateTokens(prompt);
      const outputTokens = this.calculateTokens(response);
      const cost = (inputTokens + outputTokens) * AI_PROVIDERS.openai.costPerToken;

      return {
        id: this.generateAnalysisId(),
        cvId: request.cvId,
        userId: request.userId,
        provider: 'openai',
        model: this.model,
        analysisType: request.analysisType,
        
        // Core scores
        overallScore: parsedResponse.overallScore || 75,
        atsCompatibility: parsedResponse.atsCompatibility || 70,
        readabilityScore: parsedResponse.readabilityScore || 80,
        
        // Detailed scores
        scores: {
          formatting: parsedResponse.scores?.formatting || 75,
          keywords: parsedResponse.scores?.keywords || 70,
          experience: parsedResponse.scores?.experience || 80,
          skills: parsedResponse.scores?.skills || 75,
          education: parsedResponse.scores?.education || 85,
          achievements: parsedResponse.scores?.achievements || 70
        },
        
        // Analysis results
        strengths: parsedResponse.strengths || [],
        weaknesses: parsedResponse.weaknesses || [],
        suggestions: this.formatSuggestions(parsedResponse.suggestions || []),
        
        // Keywords
        missingKeywords: parsedResponse.missingKeywords || [],
        presentKeywords: parsedResponse.presentKeywords || [],
        keywordDensity: parsedResponse.keywordDensity || 0.1,
        
        // Industry insights (for premium tiers)
        industryMatch: request.analysisType === 'premium' ? parsedResponse.industryMatch : undefined,
        salaryRange: request.analysisType === 'premium' ? parsedResponse.salaryRange : undefined,
        
        // Metadata
        analysisDate: new Date().toISOString(),
        processingTime,
        tokenUsage: {
          input: inputTokens,
          output: outputTokens,
          cost
        }
      };
    } catch (error) {
      throw this.handleError(error, 'CV Analysis');
    }
  }

  protected async makeRequest(prompt: string, maxTokens = 1500): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert CV/resume analyst. Provide detailed, actionable feedback in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        temperature: 0.3, // Lower temperature for more consistent analysis
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`OpenAI API Error: ${response.status} - ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  private buildPrompt(request: CVAnalysisRequest): string {
    const basePrompt = CV_ANALYSIS_PROMPTS[request.analysisType];
    
    return basePrompt
      .replace('{cvText}', request.cvText)
      .replace('{jobDescription}', request.jobDescription || 'No job description provided');
  }

  private formatSuggestions(suggestions: any[]): CVSuggestion[] {
    return suggestions.map((suggestion, index) => ({
      id: `suggestion_${index}_${Date.now()}`,
      category: suggestion.category || 'content',
      priority: suggestion.priority || 'medium',
      title: suggestion.title || 'Improvement Suggestion',
      description: suggestion.description || suggestion.text || '',
      example: suggestion.example,
      impact: suggestion.impact || 'This improvement will enhance your CV\'s effectiveness'
    }));
  }
} 