import { create } from 'zustand';
import type { Agent } from '@/types/agent';

interface AgentState {
  agents: Agent[];
  currentAgent: Agent | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setAgents: (agents: Agent[]) => void;
  addAgent: (agent: Agent) => void;
  updateAgent: (id: string, updates: Partial<Agent>) => void;
  deleteAgent: (id: string) => void;
  setCurrentAgent: (agent: Agent | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAgentStore = create<AgentState>((set) => ({
  agents: [],
  currentAgent: null,
  isLoading: false,
  error: null,

  setAgents: (agents) => set({ agents }),
  addAgent: (agent) => set((state) => ({ agents: [...state.agents, agent] })),
  updateAgent: (id, updates) =>
    set((state) => ({
      agents: state.agents.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    })),
  deleteAgent: (id) =>
    set((state) => ({
      agents: state.agents.filter((a) => a.id !== id),
    })),
  setCurrentAgent: (agent) => set({ currentAgent: agent }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

// Sample agents for demo
export const sampleAgents: Agent[] = [
  {
    id: '1',
    name: '고객상담 AI 도우미',
    description: '고객 문의를 자동으로 분석하고 응답하는 Agent',
    status: 'deployed',
    llmModel: 'gpt-4o',
    modules: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-12-10'),
    compatibility: {
      overall: 92,
      accuracy: 95,
      relevance: 90,
      completeness: 88,
      safety: 96,
      compliance: 91,
    },
    element: 'fire',
  },
  {
    id: '2',
    name: '재무분석 Agent',
    description: '재무 데이터를 분석하고 리포트를 생성하는 Agent',
    status: 'testing',
    llmModel: 'gpt-4o-mini',
    modules: [],
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-12-08'),
    compatibility: {
      overall: 78,
      accuracy: 82,
      relevance: 75,
      completeness: 80,
      safety: 85,
      compliance: 68,
    },
    element: 'water',
  },
  {
    id: '3',
    name: '문서작성 Agent',
    description: '다양한 형식의 문서를 자동으로 작성하는 Agent',
    status: 'deployed',
    llmModel: 'gpt-4o',
    modules: [],
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-12-12'),
    compatibility: {
      overall: 88,
      accuracy: 90,
      relevance: 85,
      completeness: 92,
      safety: 88,
      compliance: 85,
    },
    element: 'wood',
  },
];
