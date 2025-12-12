// Agent 관련 타입 정의

export interface Agent {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'testing' | 'deployed' | 'archived';
  llmModel: LLMModel;
  modules: AgentModule[];
  createdAt: Date;
  updatedAt: Date;
  compatibility: CompatibilityScore;
  element: FiveElement;
}

export type LLMModel = 'gpt-4o' | 'gpt-4o-mini' | 'gpt-4-turbo' | 'gpt-3.5-turbo';

export interface AgentModule {
  id: string;
  type: ModuleType;
  name: string;
  config: Record<string, unknown>;
  position: { x: number; y: number };
  connections: string[];
}

export type ModuleType =
  | 'input-text'
  | 'input-file'
  | 'input-api'
  | 'ai-analysis'
  | 'ai-summary'
  | 'ai-classification'
  | 'output-text'
  | 'output-json'
  | 'verification-veris';

export type FiveElement = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

export interface CompatibilityScore {
  overall: number;
  accuracy: number;
  relevance: number;
  completeness: number;
  safety: number;
  compliance: number;
}

export interface VerisResult {
  score: number;
  grade: 'excellent' | 'good' | 'fair' | 'poor';
  details: VerisDetail[];
  recommendations: string[];
  passedTests: number;
  totalTests: number;
}

export interface VerisDetail {
  category: keyof Omit<CompatibilityScore, 'overall'>;
  score: number;
  description: string;
  issues: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  industry: Industry;
  icon: string;
  modules: AgentModule[];
}

export type Industry =
  | 'finance'
  | 'telecom'
  | 'education'
  | 'public'
  | 'healthcare'
  | 'retail'
  | 'manufacturing';
