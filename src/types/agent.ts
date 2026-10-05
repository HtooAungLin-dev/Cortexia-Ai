export interface RAGDocument {
  id: string;
  title: string;
  filename: string;
  fileSize: string;
  pageCount: number;
  uploadDate: string;
  chunksCount: number;
  status: 'indexed' | 'indexing' | 'error';
  tags: string[];
  summary: string;
  fullText?: string;
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  documentTitle: string;
  page: number;
  chunkIndex: number;
  text: string;
  tokenCount: number;
  vector?: number[];
  score?: number;
  metadata?: {
    section?: string;
    keywords?: string[];
  };
}

export interface QdrantCollection {
  name: string;
  pointsCount: number;
  vectorSize: number;
  distance: 'Cosine' | 'Dot' | 'Euclidean';
  status: 'green' | 'yellow';
  indexedPayloads: string[];
  lastIndexed: string;
}

export interface HITLAction {
  id: string;
  type: 'send_email' | 'delete_vector_point' | 'external_api_call';
  title: string;
  recipient?: string;
  subject?: string;
  body?: string;
  urgency?: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
  reviewedAt?: string;
  operatorNotes?: string;
}

export interface MemoryCheckpoint {
  id: string;
  turnNumber: number;
  timestamp: string;
  userPrompt: string;
  summary: string;
  totalTokens: number;
  stateSnapshot: {
    messageCount: number;
    activeCollection: string;
    pendingHitlCount: number;
    ragChunksRetrieved: number;
  };
}

export interface StructuredPydanticOutput {
  schema: string;
  confidenceScore: number;
  timestamp: string;
  validated: boolean;
  attributes: Record<string, any>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  agentReasoning?: string[];
  retrievedChunks?: {
    id: string;
    text: string;
    score: number;
    metadata: any;
  }[];
  hitlAction?: HITLAction;
  structuredOutput?: StructuredPydanticOutput;
  toolsUsed?: string[];
  tokens?: number;
  latencyMs?: number;
}

export interface AgentConfig {
  model: string;
  temperature: number;
  topK: number;
  chunkSize: number;
  chunkOverlap: number;
  embeddingModel: string;
  distanceMetric: 'Cosine' | 'Dot' | 'Euclidean';
  hitlEnabled: boolean;
  autoSummarize: boolean;
  summarizationThreshold: number;
  activeCollection: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  checkpoints?: MemoryCheckpoint[];
  conversationSummary?: string;
  pinned?: boolean;
}

export type ActiveView = 'chat' | 'pipeline' | 'qdrant' | 'hitl' | 'checkpoints' | 'library' | 'history';
