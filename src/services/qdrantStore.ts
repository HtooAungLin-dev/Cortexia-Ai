import { DocumentChunk, QdrantCollection } from '../types/agent';
import { cosineSimilarity, generateDenseEmbedding } from './embeddingService';
import { INITIAL_CHUNKS } from '../data/defaultDocuments';

export interface QdrantSearchResult {
  id: string;
  score: number;
  payload: {
    documentId: string;
    documentTitle: string;
    page: number;
    chunkIndex: number;
    text: string;
    metadata?: any;
  };
  vectorPreview: number[];
}

class QdrantVectorEngine {
  private collections: Map<string, QdrantCollection> = new Map();
  private points: Map<string, DocumentChunk[]> = new Map();

  constructor() {
    this.initDefaultCollections();
  }

  private initDefaultCollections() {
    // Primary collection for PDF RAG
    const primaryName = 'knowledge_pdf_docs';
    this.collections.set(primaryName, {
      name: primaryName,
      pointsCount: INITIAL_CHUNKS.length,
      vectorSize: 384,
      distance: 'Cosine',
      status: 'green',
      indexedPayloads: ['documentId', 'documentTitle', 'page', 'keywords'],
      lastIndexed: 'Just now',
    });

    this.points.set(primaryName, [...INITIAL_CHUNKS]);

    // Secondary collections to illustrate real enterprise Qdrant setup
    this.collections.set('agent_checkpoints_vectors', {
      name: 'agent_checkpoints_vectors',
      pointsCount: 12,
      vectorSize: 384,
      distance: 'Cosine',
      status: 'green',
      indexedPayloads: ['stateId', 'turnNumber', 'tokens'],
      lastIndexed: '15 mins ago',
    });

    this.collections.set('enterprise_hitl_audit', {
      name: 'enterprise_hitl_audit',
      pointsCount: 8,
      vectorSize: 384,
      distance: 'Cosine',
      status: 'green',
      indexedPayloads: ['actionType', 'status', 'reviewedAt'],
      lastIndexed: '1 hour ago',
    });
  }

  public getCollections(): QdrantCollection[] {
    return Array.from(this.collections.values());
  }

  public getPoints(collectionName: string = 'knowledge_pdf_docs'): DocumentChunk[] {
    return this.points.get(collectionName) || [];
  }

  public search(
    query: string,
    collectionName: string = 'knowledge_pdf_docs',
    topK: number = 4,
    minScoreThreshold: number = 0.40
  ): QdrantSearchResult[] {
    const chunkList = this.points.get(collectionName) || [];
    if (chunkList.length === 0) return [];

    const queryVector = generateDenseEmbedding(query);

    const scored = chunkList.map((chunk) => {
      const vector = chunk.vector || generateDenseEmbedding(chunk.text);
      const score = cosineSimilarity(queryVector, vector);
      return {
        id: chunk.id,
        score,
        payload: {
          documentId: chunk.documentId,
          documentTitle: chunk.documentTitle,
          page: chunk.page,
          chunkIndex: chunk.chunkIndex,
          text: chunk.text,
          metadata: chunk.metadata,
        },
        vectorPreview: vector.slice(0, 8),
      };
    });

    // Sort descending by similarity score
    scored.sort((a, b) => b.score - a.score);

    return scored
      .filter((item) => item.score >= minScoreThreshold)
      .slice(0, topK);
  }

  public upsertPoints(collectionName: string, chunks: DocumentChunk[]) {
    const existing = this.points.get(collectionName) || [];
    const merged = [...existing, ...chunks];
    this.points.set(collectionName, merged);

    const collection = this.collections.get(collectionName);
    if (collection) {
      collection.pointsCount = merged.length;
      collection.lastIndexed = 'Just now';
    }
  }

  public deleteDocumentPoints(documentId: string, collectionName: string = 'knowledge_pdf_docs') {
    const existing = this.points.get(collectionName) || [];
    const filtered = existing.filter((c) => c.documentId !== documentId);
    this.points.set(collectionName, filtered);

    const collection = this.collections.get(collectionName);
    if (collection) {
      collection.pointsCount = filtered.length;
    }
  }
}

export const qdrantStore = new QdrantVectorEngine();
