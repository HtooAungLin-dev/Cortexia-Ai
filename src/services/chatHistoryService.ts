import { ChatSession, ChatMessage } from '../types/agent';

const STORAGE_KEY = 'zyricon_chat_sessions_v1';
const ACTIVE_SESSION_KEY = 'zyricon_active_session_id';

const INITIAL_SESSIONS: ChatSession[] = [
  {
    id: 'session_rag_demo',
    title: 'RAG Chunk Overlap & PDF Ingestion',
    createdAt: 'Yesterday, 4:20 PM',
    updatedAt: 'Yesterday, 4:22 PM',
    pinned: true,
    conversationSummary: 'Evaluated optimal chunk size (500 tokens) with 10% sliding overlap (50 tokens) on technical PDF docs.',
    messages: [
      {
        id: 'msg_hist_1',
        role: 'user',
        content: 'What is the recommended chunk size and overlap percentage for technical PDF documents in our knowledge base?',
        timestamp: '4:20 PM',
      },
      {
        id: 'msg_hist_2',
        role: 'assistant',
        content: `### RAG Document Splitting Specification

According to the **Enterprise RAG & Qdrant Vector Search Handbook**:

1. **Optimal Chunk Size**: Technical PDF documents achieve peak retrieval fidelity with chunks between **400 and 600 tokens** (approximately 1,600 to 2,400 characters).
2. **Sliding Overlap**: A **10% sliding overlap (50 tokens)** must be maintained across contiguous chunk boundaries. This guarantees that sentences crossing chunk borders are not truncated mid-predicate.
3. **Splitting Hierarchy**: Using \`RecursiveCharacterTextSplitter\` with separators \`["\\n\\n", "\\n", ". ", " "] \` preserves paragraph integrity and markdown table headers.`,
        timestamp: '4:22 PM',
        agentReasoning: [
          'Scanned Qdrant collection for chunking parameters.',
          'Retrieved Section 1.1 of Enterprise RAG Handbook.',
          'Synthesized token and overlap recommendations.',
        ],
        retrievedChunks: [
          {
            id: 'chunk_rag_1',
            text: 'A high-performance RAG pipeline begins with document ingestion: PDF loader extracts raw unstructured text, preserves tabular hierarchies, and passes raw streams to a recursive character text splitter. Optimal chunk sizes for technical PDF documents range between 400 and 600 tokens with a 10% sliding overlap (50 tokens)...',
            score: 0.942,
            metadata: { documentTitle: 'Enterprise RAG & Qdrant Vector Search Handbook', page: 2 },
          },
        ],
        latencyMs: 18,
      },
    ],
  },
  {
    id: 'session_hitl_demo',
    title: 'HITL Email Dispatch Safeguard',
    createdAt: 'Today, 10:15 AM',
    updatedAt: 'Today, 10:16 AM',
    pinned: false,
    conversationSummary: 'Demonstrated Human-in-the-Loop review for outbound email action before execution.',
    messages: [
      {
        id: 'msg_hist_3',
        role: 'user',
        content: 'Please send an email to alex@acme.com with our RAG pipeline benchmark results.',
        timestamp: '10:15 AM',
      },
      {
        id: 'msg_hist_4',
        role: 'assistant',
        content: 'I have prepared the email draft. In accordance with enterprise safety guidelines, outbound emails require Human-in-the-Loop approval before dispatch.',
        timestamp: '10:15 AM',
        hitlAction: {
          id: 'hitl_hist_01',
          type: 'send_email',
          title: 'Dispatch Outbound Email',
          recipient: 'alex@acme.com',
          subject: 'Important Project & RAG Pipeline Update',
          body: 'Hello Team,\n\nFollowing our latest evaluation of the Agentic RAG pipeline and Qdrant vector database, the semantic search benchmarks indicate 94.2% retrieval accuracy with sub-25ms latency.\n\nAll checkpoint states and memory summarization middleware have been verified.\n\nBest regards,\nAutonomous Engineering Agent',
          status: 'approved',
          reviewedAt: '10:16 AM',
          operatorNotes: 'Approved by Operator',
          timestamp: '10:15 AM',
        },
        latencyMs: 12,
      },
      {
        id: 'msg_hist_5',
        role: 'assistant',
        content: '✅ **Action Confirmed & Dispatched**\n\nThe email to `alex@acme.com` was securely dispatched to the mail transfer agent. State checkpoint recorded.',
        timestamp: '10:16 AM',
      },
    ],
  },
  {
    id: 'session_qdrant_demo',
    title: 'Qdrant HNSW Vector Search',
    createdAt: 'Oct 3, 2:30 PM',
    updatedAt: 'Oct 3, 2:32 PM',
    pinned: false,
    conversationSummary: 'Analyzed HNSW approximate nearest neighbor search and Cosine metric formula in Qdrant.',
    messages: [
      {
        id: 'msg_hist_6',
        role: 'user',
        content: 'How does Qdrant use HNSW graphs and Cosine similarity for vector retrieval?',
        timestamp: '2:30 PM',
      },
      {
        id: 'msg_hist_7',
        role: 'assistant',
        content: `### Qdrant Vector Search Architecture

Qdrant utilizes **Hierarchical Navigable Small World (HNSW)** graphs to perform fast approximate nearest neighbor (ANN) lookups with logarithmic time complexity O(log N).

- **Cosine Proximity**: Computes normalized dot product between query embedding vector and stored chunk vectors: \`cos(θ) = (A · B) / (||A|| ||B||)\`.
- **Payload Indexing**: Allows pairing dense vector similarity with boolean metadata filters (e.g. \`document_id\`, \`security_clearance\`).
- **Embedding Alignment**: Uses 384-dimensional unit vectors produced by \`sentence-transformers/all-MiniLM-L6-v2\`.`,
        timestamp: '2:32 PM',
        latencyMs: 22,
      },
    ],
  },
];

class ChatHistoryService {
  private sessions: ChatSession[] = [];
  private activeSessionId: string | null = null;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.sessions = JSON.parse(stored);
      } else {
        this.sessions = INITIAL_SESSIONS;
        this.saveToStorage();
      }

      const activeId = localStorage.getItem(ACTIVE_SESSION_KEY);
      if (activeId && this.sessions.some((s) => s.id === activeId)) {
        this.activeSessionId = activeId;
      } else if (this.sessions.length > 0) {
        this.activeSessionId = this.sessions[0].id;
      }
    } catch (e) {
      console.warn('Error reading chat history from localStorage:', e);
      this.sessions = INITIAL_SESSIONS;
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.sessions));
      if (this.activeSessionId) {
        localStorage.setItem(ACTIVE_SESSION_KEY, this.activeSessionId);
      }
    } catch (e) {
      console.warn('Error saving chat history to localStorage:', e);
    }
  }

  public getSessions(): ChatSession[] {
    return [...this.sessions];
  }

  public getActiveSession(): ChatSession | null {
    if (!this.activeSessionId) return null;
    return this.sessions.find((s) => s.id === this.activeSessionId) || null;
  }

  public setActiveSession(id: string) {
    this.activeSessionId = id;
    this.saveToStorage();
  }

  public createNewSession(initialTitle?: string): ChatSession {
    const id = `session_${Date.now()}`;
    const newSession: ChatSession = {
      id,
      title: initialTitle || 'New Conversation',
      createdAt: 'Just now',
      updatedAt: 'Just now',
      messages: [],
      checkpoints: [],
      conversationSummary: 'Session initialized.',
      pinned: false,
    };

    this.sessions.unshift(newSession);
    this.activeSessionId = id;
    this.saveToStorage();
    return newSession;
  }

  public updateSession(id: string, updates: Partial<ChatSession>) {
    const idx = this.sessions.findIndex((s) => s.id === id);
    if (idx !== -1) {
      this.sessions[idx] = {
        ...this.sessions[idx],
        ...updates,
        updatedAt: 'Just now',
      };
      this.saveToStorage();
    }
  }

  public deleteSession(id: string) {
    this.sessions = this.sessions.filter((s) => s.id !== id);
    if (this.activeSessionId === id) {
      this.activeSessionId = this.sessions[0]?.id || null;
    }
    this.saveToStorage();
  }

  public togglePin(id: string) {
    const session = this.sessions.find((s) => s.id === id);
    if (session) {
      session.pinned = !session.pinned;
      this.saveToStorage();
    }
  }

  public clearAllHistory() {
    this.sessions = [];
    this.activeSessionId = null;
    this.saveToStorage();
  }
}

export const chatHistoryService = new ChatHistoryService();
