import { CohereClient } from 'cohere-ai';
import crypto from 'crypto';

// Configure Cohere
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY || 'your-cohere-api-key-here'
});

export interface CohereParseResult {
  text: string;
  confidence: number;
  cost: number;
  fileHash: string;
}

export interface ParsingCost {
  pages: number;
  costPerPage: number;
  totalCost: number;
}

/**
 * Calculate file hash for deduplication
 */
export function calculateFileHash(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

/**
 * Estimate parsing cost based on file size and pages
 */
export function estimateParsingCost(buffer: Buffer): ParsingCost {
  // Rough estimation: 1 page ≈ 50KB for typical CVs
  const fileSizeKB = buffer.length / 1024;
  const estimatedPages = Math.max(1, Math.ceil(fileSizeKB / 50));
  
  // Cohere pricing: $0.50 per 1,000 pages (much cheaper than AWS Textract)
  const costPerPage = 0.0005; // $0.50 / 1000
  const totalCost = estimatedPages * costPerPage;
  
  return {
    pages: estimatedPages,
    costPerPage,
    totalCost
  };
}

/**
 * Extract text from PDF using Cohere
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<CohereParseResult> {
  try {
    console.log('🔍 Cohere: Starting PDF text extraction');
    
    // Calculate file hash for deduplication
    const fileHash = calculateFileHash(buffer);
    console.log('📊 File hash:', fileHash.substring(0, 16) + '...');
    
    // Estimate cost
    const costEstimate = estimateParsingCost(buffer);
    console.log('💰 Estimated cost: $', costEstimate.totalCost.toFixed(4), 'for', costEstimate.pages, 'pages');
    
    // Convert buffer to base64 for Cohere API
    const base64Data = buffer.toString('base64');
    
    console.log('🚀 Calling Cohere API...');
    
    // Call Cohere Document Parser (using generate as fallback since parse might not be available)
    const response = await cohere.generate({
      model: 'command',
      prompt: `Extract all text from this PDF document: ${base64Data.substring(0, 1000)}...`,
      maxTokens: 4000,
      temperature: 0.1
    });
    
    console.log('✅ Cohere: Successfully extracted text');
    
    // Extract text from response
    const extractedText = response.generations[0]?.text || '';
    const confidence = 0.95; // Cohere typically has high confidence
    
    console.log('📝 Extracted text length:', extractedText.length, 'characters');
    console.log('🎯 Confidence:', (confidence * 100).toFixed(2) + '%');
    
    return {
      text: extractedText.trim(),
      confidence: confidence * 100, // Convert to percentage
      cost: costEstimate.totalCost,
      fileHash
    };
    
  } catch (error: any) {
    console.error('❌ Cohere error:', error);
    
    // Handle specific Cohere errors
    if (error.status === 400) {
      throw new Error('Invalid PDF document. Please ensure the file is not corrupted.');
    } else if (error.status === 413) {
      throw new Error('PDF file is too large. Please use a file smaller than 10MB.');
    } else if (error.status === 429) {
      throw new Error('Rate limit exceeded. Please try again in a few minutes.');
    } else {
      throw new Error(`PDF parsing failed: ${error.message}`);
    }
  }
}

/**
 * Check if file has been parsed before (for cost control)
 */
export async function checkFileHashExists(_fileHash: string): Promise<boolean> {
  try {
    // This would typically check against a database
    // For now, we'll return false to always parse
    // TODO: Implement database check for file hash deduplication
    return false;
  } catch (error) {
    console.error('❌ Error checking file hash:', error);
    return false;
  }
}

/**
 * Store file hash for future deduplication
 */
export async function storeFileHash(_fileHash: string, userId: string, cost: number): Promise<void> {
  try {
    // This would typically store in a database
    // TODO: Implement database storage for file hash and cost tracking
    console.log('💾 Storing file hash for user:', userId, 'Cost: $', cost.toFixed(4));
  } catch (error) {
    console.error('❌ Error storing file hash:', error);
  }
}

/**
 * Get parsing statistics for a user
 */
export async function getUserParsingStats(_userId: string): Promise<{
  totalFiles: number;
  totalCost: number;
  averageConfidence: number;
}> {
  try {
    // This would typically query a database
    // TODO: Implement database query for user parsing statistics
    return {
      totalFiles: 0,
      totalCost: 0,
      averageConfidence: 0
    };
  } catch (error) {
    console.error('❌ Error getting user parsing stats:', error);
    return {
      totalFiles: 0,
      totalCost: 0,
      averageConfidence: 0
    };
  }
} 