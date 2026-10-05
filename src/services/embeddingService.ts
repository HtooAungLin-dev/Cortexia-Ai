/**
 * Hugging Face sentence-transformers/all-MiniLM-L6-v2 embedding model simulation
 * Generates 384-dimensional normalized dense vectors with semantic affinity.
 */

export const EMBEDDING_DIMENSION = 384;

// Simple deterministic hash to seed pseudo-random numbers
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Common AI semantic topics mapped to dimensional sub-spaces
const SEMANTIC_CLUSTERS: Record<string, number[]> = {
  agent: [0, 15, 32, 45, 120, 150, 210, 300],
  rag: [1, 16, 33, 46, 121, 151, 211, 301],
  qdrant: [2, 17, 34, 47, 122, 152, 212, 302],
  vector: [2, 17, 34, 47, 122, 152, 212, 302],
  embedding: [3, 18, 35, 48, 123, 153, 213, 303],
  email: [4, 19, 36, 49, 124, 154, 214, 304],
  hitl: [5, 20, 37, 50, 125, 155, 215, 305],
  human: [5, 20, 37, 50, 125, 155, 215, 305],
  checkpoint: [6, 21, 38, 51, 126, 156, 216, 306],
  memory: [6, 21, 38, 51, 126, 156, 216, 306],
  pydantic: [7, 22, 39, 52, 127, 157, 217, 307],
  schema: [7, 22, 39, 52, 127, 157, 217, 307],
  pdf: [8, 23, 40, 53, 128, 158, 218, 308],
  chunk: [8, 23, 40, 53, 128, 158, 218, 308],
  summarize: [9, 24, 41, 54, 129, 159, 219, 309],
  middleware: [9, 24, 41, 54, 129, 159, 219, 309],
  tool: [10, 25, 42, 55, 130, 160, 220, 310],
  streamlit: [11, 26, 43, 56, 131, 161, 221, 311],
  safety: [12, 27, 44, 57, 132, 162, 222, 312],
  architecture: [13, 28, 45, 58, 133, 163, 223, 313],
};

export function generateDenseEmbedding(text: string): number[] {
  const vector = new Array(EMBEDDING_DIMENSION).fill(0);
  const normalizedText = text.toLowerCase();
  const words = normalizedText.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);

  // Base background noise from overall string hash
  const baseSeed = simpleHash(text);
  for (let i = 0; i < EMBEDDING_DIMENSION; i++) {
    const pseudoRandom = Math.sin(baseSeed + i * 13.37) * 43758.5453;
    vector[i] = (pseudoRandom - Math.floor(pseudoRandom)) * 0.1 - 0.05;
  }

  // Inject semantic signals from keywords
  for (const word of words) {
    // Check direct match or substring
    for (const [key, indices] of Object.entries(SEMANTIC_CLUSTERS)) {
      if (word.includes(key) || key.includes(word)) {
        for (const idx of indices) {
          vector[idx] += 0.45;
        }
      }
    }

    // Token character hash injection
    const wordHash = simpleHash(word);
    const targetIdx = wordHash % EMBEDDING_DIMENSION;
    vector[targetIdx] += 0.25;
    const neighborIdx = (targetIdx + 7) % EMBEDDING_DIMENSION;
    vector[neighborIdx] += 0.15;
  }

  // L2 Normalize vector to unit length (length = 1.0)
  let norm = 0;
  for (let i = 0; i < EMBEDDING_DIMENSION; i++) {
    norm += vector[i] * vector[i];
  }
  norm = Math.sqrt(norm) || 1;

  for (let i = 0; i < EMBEDDING_DIMENSION; i++) {
    vector[i] = Number((vector[i] / norm).toFixed(6));
  }

  return vector;
}

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;
  return Math.max(0, Math.min(1, dotProduct / denominator));
}
