import { pipeline } from '@huggingface/transformers';

export async function compareTexts(text1: string, text2: string): Promise<number> {
  console.log('Initializing text comparison...');
  
  try {
    const extractor = await pipeline(
      'feature-extraction',
      'mixedbread-ai/mxbai-embed-xsmall-v1'
    );

    console.log('Computing embeddings for texts...');
    const embedding1 = await extractor(text1, {
      pooling: 'mean',
      normalize: true,
    });
    
    const embedding2 = await extractor(text2, {
      pooling: 'mean',
      normalize: true,
    });

    const similarity = calculateCosineSimilarity(
      embedding1.tolist()[0],
      embedding2.tolist()[0]
    );

    console.log('Comparison complete, similarity:', similarity);
    return similarity * 100;
  } catch (error) {
    console.error('Error comparing texts:', error);
    throw new Error('Failed to compare texts');
  }
}

function calculateCosineSimilarity(vec1: number[], vec2: number[]): number {
  const dotProduct = vec1.reduce((acc, val, i) => acc + val * vec2[i], 0);
  const norm1 = Math.sqrt(vec1.reduce((acc, val) => acc + val * val, 0));
  const norm2 = Math.sqrt(vec2.reduce((acc, val) => acc + val * val, 0));
  return dotProduct / (norm1 * norm2);
}