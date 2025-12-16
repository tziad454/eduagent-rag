export interface DocumentChunk {
  id: string;
  title: string;
  content: string;
  source: string;
}

export interface RetrievedChunk extends DocumentChunk {
  score: number; // Relevance score (0-1)
}

export interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: number;
  retrievedContext?: RetrievedChunk[]; // If agent, what chunks did it use?
  thinkingTime?: number;
}

export type ViewMode = 'chat' | 'knowledge';

export interface RAGStats {
  totalDocuments: number;
  lastQueryTime: number;
  averageConfidence: number;
}