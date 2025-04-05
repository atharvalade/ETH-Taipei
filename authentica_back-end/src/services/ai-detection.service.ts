import { getFromIPFS } from './ipfs.service';

/**
 * AI Detection Provider 1: Perplexity-based detection
 * Uses perplexity (prediction difficulty) to detect AI-generated text
 */
export const detectAIByPerplexity = async (text: string): Promise<{
  isHumanWritten: boolean;
  confidenceScore: number;
}> => {
  // This is a simplified implementation
  // In a real-world scenario, you would use a language model to calculate perplexity
  
  try {
    // Simplified perplexity measurement (in real implementation, use a proper language model)
    const sentenceLength = text.split('.').length;
    const wordCount = text.split(' ').length;
    const avgWordLength = text.length / wordCount;
    const longWordCount = text.split(' ').filter(w => w.length > 6).length;
    
    // Factors that might indicate AI generation:
    // 1. Very consistent sentence length
    // 2. Unusual average word length (too short or too long)
    // 3. Too perfect or unusual vocabulary distribution
    
    // Mock calculation (replace with actual ML in production)
    let aiScore = 0;
    
    // Check sentence length distribution (very uniform sentences are suspicious)
    const sentenceLengthVariance = Math.random() * 0.5; // Mock calculation
    aiScore += (1 - sentenceLengthVariance) * 0.3;
    
    // Check word length and diversity
    if (avgWordLength > 5.5 || avgWordLength < 3.5) {
      aiScore += 0.3;
    }
    
    // Check proportion of long words
    const longWordRatio = longWordCount / wordCount;
    if (longWordRatio > 0.4) {
      aiScore += 0.2;
    }
    
    // Introduce some variance for demonstration purposes
    aiScore += (Math.random() * 0.2) - 0.1;
    aiScore = Math.max(0, Math.min(1, aiScore));
    
    // Convert to human-written score
    const humanScore = 1 - aiScore;
    
    return {
      isHumanWritten: humanScore > 0.5,
      confidenceScore: humanScore
    };
  } catch (error) {
    console.error('Error in perplexity-based AI detection:', error);
    
    // Default to uncertain result
    return {
      isHumanWritten: Math.random() > 0.5,
      confidenceScore: 0.5
    };
  }
};

/**
 * AI Detection Provider 2: Pattern-based detection
 * Looks for patterns commonly found in AI-generated text
 */
export const detectAIByPatterns = async (text: string): Promise<{
  isHumanWritten: boolean;
  confidenceScore: number;
}> => {
  try {
    // Patterns that might indicate AI generation
    const patterns = [
      /as an AI language model/i,
      /I don't have personal/i,
      /I don't have the ability to/i,
      /I cannot provide/i,
      /I apologize, but I cannot/i
    ];
    
    // Count pattern matches
    let patternMatches = 0;
    patterns.forEach(pattern => {
      if (pattern.test(text)) {
        patternMatches++;
      }
    });
    
    // Check for extremely formulaic structures
    const hasFormulaic = /firstly[\s\S]*secondly[\s\S]*finally/i.test(text);
    const hasConsistentParagraphs = text.split('\n\n').every(p => p.length > 100 && p.length < 300);
    
    // Combine factors
    let aiScore = 0;
    
    // Direct pattern matches
    aiScore += patternMatches * 0.15;
    
    // Formulaic writing
    if (hasFormulaic) aiScore += 0.2;
    if (hasConsistentParagraphs) aiScore += 0.15;
    
    // Check for repetition
    const words = text.toLowerCase().split(/\s+/);
    const wordSet = new Set(words);
    const repetitionRatio = wordSet.size / words.length;
    if (repetitionRatio > 0.8) {
      aiScore -= 0.2; // Less repetition, more likely human
    }
    
    // Add some randomness for demo purposes
    aiScore += (Math.random() * 0.3) - 0.15;
    aiScore = Math.max(0, Math.min(1, aiScore));
    
    // Convert to human-written score
    const humanScore = 1 - aiScore;
    
    return {
      isHumanWritten: humanScore > 0.5,
      confidenceScore: humanScore
    };
  } catch (error) {
    console.error('Error in pattern-based AI detection:', error);
    
    // Default to uncertain result
    return {
      isHumanWritten: Math.random() > 0.5,
      confidenceScore: 0.5
    };
  }
};

/**
 * AI Detection Provider 3: Statistical analysis
 * Uses statistical methods to detect AI-generated content
 */
export const detectAIByStatistics = async (text: string): Promise<{
  isHumanWritten: boolean;
  confidenceScore: number;
}> => {
  try {
    // Calculate various text statistics
    const wordCount = text.split(/\s+/).length;
    const charCount = text.length;
    const sentenceCount = text.split(/[.!?]+\s/).length;
    
    // Calculate averages
    const avgWordLength = charCount / wordCount;
    const avgSentenceLength = wordCount / sentenceCount;
    
    // Calculate variance in sentence length
    const sentences = text.split(/[.!?]+\s/);
    const sentenceLengths = sentences.map(s => s.split(/\s+/).length);
    const avgLength = sentenceLengths.reduce((sum, len) => sum + len, 0) / sentenceLengths.length;
    
    // Calculate variance
    const variance = sentenceLengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / sentenceLengths.length;
    const stdDev = Math.sqrt(variance);
    
    // Human text often has more variance in sentence structure
    let aiScore = 0;
    
    // If standard deviation is too low, likely AI-generated (too consistent)
    if (stdDev < 2) {
      aiScore += 0.3;
    }
    
    // Check average word length (AI tends to use more precise, longer words)
    if (avgWordLength > 5.8) {
      aiScore += 0.2;
    }
    
    // Check for extremely consistent sentence length
    if (avgSentenceLength > 20 && stdDev < 3) {
      aiScore += 0.2;
    }
    
    // Add randomness for demo
    aiScore += (Math.random() * 0.3) - 0.15;
    aiScore = Math.max(0, Math.min(1, aiScore));
    
    // Convert to human-written score
    const humanScore = 1 - aiScore;
    
    return {
      isHumanWritten: humanScore > 0.5,
      confidenceScore: humanScore
    };
  } catch (error) {
    console.error('Error in statistical AI detection:', error);
    
    // Default to uncertain result
    return {
      isHumanWritten: Math.random() > 0.5,
      confidenceScore: 0.5
    };
  }
};

/**
 * AI Detection Provider 4: Burstiness analysis
 * Human writing tends to be "burstier" - more variation in complexity and patterns
 */
export const detectAIByBurstiness = async (text: string): Promise<{
  isHumanWritten: boolean;
  confidenceScore: number;
}> => {
  try {
    // Extract paragraphs
    const paragraphs = text.split(/\n\n+/);
    
    // Calculate paragraph length variance
    const paragraphLengths = paragraphs.map(p => p.length);
    const avgParaLength = paragraphLengths.reduce((sum, len) => sum + len, 0) / paragraphLengths.length;
    const paraVariance = paragraphLengths.reduce((sum, len) => sum + Math.pow(len - avgParaLength, 2), 0) / paragraphLengths.length;
    const paraStdDev = Math.sqrt(paraVariance);
    
    // Calculate sentence complexity variance
    const sentences = text.split(/[.!?]+\s/);
    const sentenceComplexity = sentences.map(s => {
      const words = s.split(/\s+/);
      const longWords = words.filter(w => w.length > 6).length;
      return longWords / words.length;
    });
    
    // Calculate complexity variance
    const avgComplexity = sentenceComplexity.reduce((sum, c) => sum + c, 0) / sentenceComplexity.length;
    const complexityVariance = sentenceComplexity.reduce((sum, c) => sum + Math.pow(c - avgComplexity, 2), 0) / sentenceComplexity.length;
    
    // Human writing tends to be "burstier" with more variance
    let aiScore = 0;
    
    // Check paragraph length variance - low variance might indicate AI
    if (paraStdDev < 50) {
      aiScore += 0.25;
    }
    
    // Check complexity variance - low complexity variance might indicate AI
    if (complexityVariance < 0.05) {
      aiScore += 0.25;
    }
    
    // Check for extremely consistently structured paragraphs
    const consistentStarts = paragraphs.filter(p => 
      p.startsWith("The") || p.startsWith("This") || p.startsWith("In")
    ).length;
    
    if (consistentStarts > paragraphs.length * 0.5) {
      aiScore += 0.2;
    }
    
    // Add randomness for demo
    aiScore += (Math.random() * 0.3) - 0.15;
    aiScore = Math.max(0, Math.min(1, aiScore));
    
    // Convert to human-written score
    const humanScore = 1 - aiScore;
    
    return {
      isHumanWritten: humanScore > 0.5,
      confidenceScore: humanScore
    };
  } catch (error) {
    console.error('Error in burstiness AI detection:', error);
    
    // Default to uncertain result
    return {
      isHumanWritten: Math.random() > 0.5,
      confidenceScore: 0.5
    };
  }
};

/**
 * Get verification from any provider by ID
 */
export const getVerificationFromProvider = async (
  providerId: string,
  ipfsHash: string,
  hashKey: string
): Promise<{
  isHumanWritten: boolean;
  confidenceScore: number;
}> => {
  try {
    // Retrieve content from IPFS
    const contentObj = await getFromIPFS(ipfsHash);
    if (!contentObj) {
      throw new Error('Failed to retrieve content from IPFS');
    }
    
    // Parse the content
    const parsedContent = JSON.parse(contentObj);
    if (parsedContent.key !== hashKey) {
      throw new Error('Invalid hash key');
    }
    
    const content = parsedContent.content;
    
    // Select detection method based on provider ID
    switch (providerId) {
      case 'provider1':
        return await detectAIByPerplexity(content);
      case 'provider2':
        return await detectAIByPatterns(content);
      case 'provider3':
        return await detectAIByStatistics(content);
      case 'provider4':
        return await detectAIByBurstiness(content);
      default:
        // Default to perplexity-based detection
        return await detectAIByPerplexity(content);
    }
  } catch (error) {
    console.error('Error in provider verification:', error);
    throw new Error('Failed to verify content with provider');
  }
}; 