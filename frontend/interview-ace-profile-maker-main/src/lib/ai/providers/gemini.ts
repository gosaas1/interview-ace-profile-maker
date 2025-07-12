import { BaseAIProvider } from './base';
import { CVAnalysisRequest, CVAnalysisResponse, CVSuggestion } from '../types';
import { CV_ANALYSIS_PROMPTS, AI_PROVIDERS } from '../config';

export class GeminiProvider extends BaseAIProvider {
  constructor(apiKey: string) {
    super('gemini', {
      apiKey,
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
      model: 'gemini-1.5-flash'
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
      const cost = (inputTokens + outputTokens) * AI_PROVIDERS.gemini.costPerToken;

      return {
        id: this.generateAnalysisId(),
        cvId: request.cvId,
        userId: request.userId,
        provider: 'gemini',
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
        
        // Basic tier - no premium features
        industryMatch: undefined,
        salaryRange: undefined,
        
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
      throw new Error('Gemini API key not configured');
    }

    const response = await fetch(
      `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${prompt}\n\nPlease respond with valid JSON only.`
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: maxTokens,
            topP: 0.8,
            topK: 40
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`Gemini API Error: ${response.status} - ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!content) {
      throw new Error('No content received from Gemini API');
    }

    return content;
  }

  private buildPrompt(request: CVAnalysisRequest): string {
    // For free tier, use basic analysis regardless of request type
    const analysisType = request.analysisType === 'premium' ? 'detailed' : request.analysisType;
    const basePrompt = CV_ANALYSIS_PROMPTS[analysisType];
    
    return basePrompt
      .replace('{cvText}', request.cvText)
      .replace('{jobDescription}', request.jobDescription || 'No job description provided');
  }

  private formatSuggestions(suggestions: any[]): CVSuggestion[] {
    if (!Array.isArray(suggestions)) {
      return [];
    }

    return suggestions.slice(0, 3).map((suggestion, index) => ({
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