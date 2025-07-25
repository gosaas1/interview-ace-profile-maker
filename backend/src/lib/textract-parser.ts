import { TextractClient, DetectDocumentTextCommand, Block } from '@aws-sdk/client-textract';

// Configure AWS Textract client
const textractClient = new TextractClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

export interface TextractParseResult {
  text: string;
  confidence: number;
  cost: number;
  fileHash: string;
}

/**
 * Extract text from PDF using AWS Textract
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<TextractParseResult> {
  try {
    console.log('🔍 AWS Textract: Starting PDF text extraction');
    
    // Calculate file hash for deduplication
    const crypto = await import('crypto');
    const fileHash = crypto.createHash('sha256').update(buffer).digest('hex');
    console.log('📊 File hash:', fileHash.substring(0, 16) + '...');
    
    // Estimate cost (AWS Textract: $1.50 per 1,000 pages)
    const fileSizeKB = buffer.length / 1024;
    const estimatedPages = Math.max(1, Math.ceil(fileSizeKB / 50));
    const costPerPage = 0.0015; // $1.50 / 1000
    const totalCost = estimatedPages * costPerPage;
    console.log('💰 Estimated cost: $', totalCost.toFixed(4), 'for', estimatedPages, 'pages');
    
    console.log('🚀 Calling AWS Textract API...');
    
    // Call AWS Textract
    const command = new DetectDocumentTextCommand({
      Document: {
        Bytes: buffer
      }
    });
    
    const response = await textractClient.send(command);
    
    if (!response.Blocks) {
      throw new Error('No text blocks found in document');
    }
    
    // Extract text from blocks
    const textBlocks = response.Blocks
      .filter((block: Block) => block.BlockType === 'LINE')
      .map((block: Block) => block.Text)
      .filter((text: string | undefined) => text && text.trim().length > 0);
    
    const extractedText = textBlocks.join('\n');
    
    // Calculate average confidence
    const confidenceBlocks = response.Blocks
      .filter((block: Block) => block.BlockType === 'LINE' && block.Confidence !== undefined)
      .map((block: Block) => block.Confidence || 0);
    
    const averageConfidence = confidenceBlocks.length > 0 
      ? confidenceBlocks.reduce((sum: number, conf: number) => sum + conf, 0) / confidenceBlocks.length
      : 95.0; // Default confidence if not available
    
    console.log('✅ AWS Textract: Successfully extracted text');
    console.log('📝 Extracted text length:', extractedText.length);
    console.log('🎯 Confidence:', averageConfidence.toFixed(2) + '%');
    
    return {
      text: extractedText,
      confidence: averageConfidence,
      cost: totalCost,
      fileHash
    };
    
  } catch (error: any) {
    console.error('❌ AWS Textract error:', error);
    throw new Error(`AWS Textract failed: ${error.message}`);
  }
}

/**
 * Check if AWS credentials are configured
 */
export function isTextractAvailable(): boolean {
  return !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);
} 