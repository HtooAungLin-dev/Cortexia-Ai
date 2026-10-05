import { ChatMessage, MemoryCheckpoint } from '../types/agent';

class CheckpointManager {
  private checkpoints: MemoryCheckpoint[] = [];
  private activeSummary: string = 'Session initialized. Agent standby with RAG & Qdrant vector store connected.';

  constructor() {
    this.initDefaultCheckpoints();
  }

  private initDefaultCheckpoints() {
    this.checkpoints = [
      {
        id: 'chk_init_001',
        turnNumber: 0,
        timestamp: '10:00:00 AM',
        userPrompt: 'System Initialization',
        summary: 'Agent initialized. Qdrant vector collection "knowledge_pdf_docs" loaded with 17 chunks.',
        totalTokens: 520,
        stateSnapshot: {
          messageCount: 0,
          activeCollection: 'knowledge_pdf_docs',
          pendingHitlCount: 0,
          ragChunksRetrieved: 0,
        },
      },
    ];
  }

  public getCheckpoints(): MemoryCheckpoint[] {
    return [...this.checkpoints];
  }

  public getActiveSummary(): string {
    return this.activeSummary;
  }

  public setActiveSummary(summary: string) {
    this.activeSummary = summary;
  }

  public createCheckpoint(
    userPrompt: string,
    assistantSummary: string,
    messageCount: number,
    retrievedChunksCount: number,
    pendingHitlCount: number = 0
  ): MemoryCheckpoint {
    const turnNumber = this.checkpoints.length;
    const newCheckpoint: MemoryCheckpoint = {
      id: `chk_${Date.now().toString(36)}_${turnNumber}`,
      turnNumber,
      timestamp: new Date().toLocaleTimeString(),
      userPrompt: userPrompt.length > 60 ? userPrompt.slice(0, 57) + '...' : userPrompt,
      summary: assistantSummary,
      totalTokens: messageCount * 140 + retrievedChunksCount * 150 + 200,
      stateSnapshot: {
        messageCount,
        activeCollection: 'knowledge_pdf_docs',
        pendingHitlCount,
        ragChunksRetrieved: retrievedChunksCount,
      },
    };

    this.checkpoints.unshift(newCheckpoint);
    return newCheckpoint;
  }

  public summarizeMiddleware(messages: ChatMessage[], threshold: number = 6): {
    needsSummarization: boolean;
    compressedSummary?: string;
  } {
    if (messages.length < threshold) {
      return { needsSummarization: false };
    }

    // Older messages to compress
    const olderMessages = messages.slice(0, messages.length - 2);
    const userTopics = olderMessages
      .filter((m) => m.role === 'user')
      .map((m) => m.content.slice(0, 40))
      .join(' | ');

    const compressed = `[Summarized Context of ${olderMessages.length} prior turns]: Dialogue focused on: ${userTopics}. Verified Qdrant vector retrieval pipelines, evaluated HuggingFace miniLM embeddings, and reviewed safety checkpoints.`;

    this.activeSummary = compressed;
    return {
      needsSummarization: true,
      compressedSummary: compressed,
    };
  }
}

export const checkpointManager = new CheckpointManager();
