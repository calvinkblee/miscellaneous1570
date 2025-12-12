import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  FileUp,
  Globe,
  Brain,
  ListTree,
  FileOutput,
  Braces,
  Shield,
  Save,
  Play,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Textarea } from '@/components/ui';
import { ElementBadge } from '@/components/common/ElementBadge';
import { FiveElement, LLMModel, ModuleType } from '@/types/agent';
import { useAgentStore } from '@/stores/agentStore';

interface ModuleOption {
  type: ModuleType;
  name: string;
  icon: React.ReactNode;
  category: 'input' | 'ai' | 'output' | 'verification';
  element: FiveElement;
}

const moduleOptions: ModuleOption[] = [
  { type: 'input-text', name: '텍스트', icon: <FileText size={20} />, category: 'input', element: 'wood' },
  { type: 'input-file', name: '파일', icon: <FileUp size={20} />, category: 'input', element: 'wood' },
  { type: 'input-api', name: 'API', icon: <Globe size={20} />, category: 'input', element: 'wood' },
  { type: 'ai-analysis', name: '분석', icon: <Brain size={20} />, category: 'ai', element: 'fire' },
  { type: 'ai-summary', name: '요약', icon: <ListTree size={20} />, category: 'ai', element: 'fire' },
  { type: 'ai-classification', name: '분류', icon: <ListTree size={20} />, category: 'ai', element: 'fire' },
  { type: 'output-text', name: '텍스트', icon: <FileOutput size={20} />, category: 'output', element: 'metal' },
  { type: 'output-json', name: 'JSON', icon: <Braces size={20} />, category: 'output', element: 'metal' },
  { type: 'verification-veris', name: 'Veris', icon: <Shield size={20} />, category: 'verification', element: 'water' },
];

const llmModels: { value: LLMModel; label: string }[] = [
  { value: 'gpt-4o', label: 'GPT-4o (최신)' },
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini (경제적)' },
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
];

interface WorkflowNode {
  id: string;
  type: ModuleType;
  name: string;
  position: { x: number; y: number };
}

export function AgentBuilderPage() {
  const navigate = useNavigate();
  const addAgent = useAgentStore((state) => state.addAgent);

  const [agentName, setAgentName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedModel, setSelectedModel] = useState<LLMModel>('gpt-4o-mini');
  const [prompt, setPrompt] = useState('');
  const [workflowNodes, setWorkflowNodes] = useState<WorkflowNode[]>([
    { id: '1', type: 'input-text', name: '시작', position: { x: 100, y: 150 } },
    { id: '2', type: 'ai-analysis', name: '분석', position: { x: 300, y: 150 } },
    { id: '3', type: 'output-text', name: '응답', position: { x: 500, y: 150 } },
  ]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddNode = useCallback((module: ModuleOption) => {
    const newNode: WorkflowNode = {
      id: Date.now().toString(),
      type: module.type,
      name: module.name,
      position: { x: 300, y: 250 },
    };
    setWorkflowNodes((prev) => [...prev, newNode]);
    setSelectedNode(newNode.id);
  }, []);

  const handleSave = async () => {
    if (!agentName.trim()) {
      alert('Agent 이름을 입력해주세요.');
      return;
    }

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newAgent = {
      id: Date.now().toString(),
      name: agentName,
      description,
      status: 'draft' as const,
      llmModel: selectedModel,
      modules: workflowNodes.map((node) => ({
        id: node.id,
        type: node.type,
        name: node.name,
        config: {},
        position: node.position,
        connections: [],
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
      compatibility: {
        overall: 0,
        accuracy: 0,
        relevance: 0,
        completeness: 0,
        safety: 0,
        compliance: 0,
      },
      element: 'fire' as FiveElement,
    };

    addAgent(newAgent);
    setIsSaving(false);
    navigate('/agents/list');
  };

  const getCategoryModules = (category: string) =>
    moduleOptions.filter((m) => m.category === category);

  return (
    <motion.div
      className="grid h-[calc(100vh-8rem)] grid-cols-[280px_1fr_320px] gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Module Library */}
      <Card variant="fortune" className="overflow-hidden">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center gap-2 text-lg">
            <span>📦</span>
            모듈 라이브러리
          </CardTitle>
        </CardHeader>
        <CardContent className="h-full overflow-y-auto p-4">
          <div className="space-y-6">
            {['input', 'ai', 'output', 'verification'].map((category) => (
              <div key={category}>
                <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  {category === 'input' && '🎯 입력'}
                  {category === 'ai' && '🔮 AI'}
                  {category === 'output' && '📤 출력'}
                  {category === 'verification' && '⚖️ 검증'}
                </h4>
                <div className="space-y-1">
                  {getCategoryModules(category).map((module) => (
                    <motion.button
                      key={module.type}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-secondary"
                      whileHover={{ x: 4 }}
                      onClick={() => handleAddNode(module)}
                    >
                      <div className="text-muted-foreground">{module.icon}</div>
                      <span className="text-sm">{module.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Canvas */}
      <Card variant="fortune" className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border">
          <CardTitle className="flex items-center gap-2 text-lg">
            <span>🌈</span>
            운명의 캔버스
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              <Play size={16} className="mr-1" />
              미리보기
            </Button>
            <Button size="sm" isLoading={isSaving} onClick={handleSave}>
              <Save size={16} className="mr-1" />
              저장
            </Button>
          </div>
        </CardHeader>
        <CardContent className="relative h-full overflow-hidden bg-[radial-gradient(circle_at_50%_50%,rgba(124,77,255,0.1),transparent_50%)] p-0">
          {/* Grid Background */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'linear-gradient(rgba(124,77,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(124,77,255,0.3) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* Workflow Nodes */}
          <div className="relative h-full p-8">
            {/* Connections */}
            <svg className="pointer-events-none absolute inset-0 h-full w-full">
              <defs>
                <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7C4DFF" />
                  <stop offset="50%" stopColor="#00E5FF" />
                  <stop offset="100%" stopColor="#00E676" />
                </linearGradient>
              </defs>
              {workflowNodes.slice(0, -1).map((node, i) => {
                const nextNode = workflowNodes[i + 1];
                if (!nextNode) return null;
                return (
                  <motion.line
                    key={`${node.id}-${nextNode.id}`}
                    x1={node.position.x + 60}
                    y1={node.position.y + 30}
                    x2={nextNode.position.x}
                    y2={nextNode.position.y + 30}
                    stroke="url(#connectionGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.2 }}
                  />
                );
              })}
            </svg>

            {/* Nodes */}
            <AnimatePresence>
              {workflowNodes.map((node, index) => {
                const module = moduleOptions.find((m) => m.type === node.type);
                return (
                  <motion.div
                    key={node.id}
                    className={`absolute cursor-pointer rounded-xl border-2 bg-card p-4 transition-all ${
                      selectedNode === node.id
                        ? 'border-rainbow-purple shadow-lg shadow-rainbow-purple/30'
                        : 'border-border hover:border-rainbow-purple/50'
                    }`}
                    style={{ left: node.position.x, top: node.position.y }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                    onClick={() => setSelectedNode(node.id)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-rainbow-purple to-rainbow-blue text-white">
                        {module?.icon || <Sparkles size={20} />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{node.name}</p>
                        {module && <ElementBadge element={module.element} size="sm" showIcon={false} />}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Properties Panel */}
      <Card variant="fortune" className="overflow-hidden">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center gap-2 text-lg">
            <span>⚙️</span>
            Agent 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="h-full space-y-4 overflow-y-auto p-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Agent 이름</label>
            <Input
              placeholder="예: 고객상담 AI 도우미"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">설명</label>
            <Textarea
              placeholder="Agent의 역할과 기능을 설명해주세요"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">LLM 선택</label>
            <select
              className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm focus:border-rainbow-purple focus:outline-none focus:ring-2 focus:ring-rainbow-purple/20"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as LLMModel)}
            >
              {llmModels.map((model) => (
                <option key={model.value} value={model.value}>
                  {model.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">오행 속성</label>
            <div className="flex flex-wrap gap-2">
              <ElementBadge element="wood" />
              <ElementBadge element="fire" />
              <ElementBadge element="earth" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">시스템 프롬프트</label>
            <Textarea
              placeholder="Agent의 행동을 정의하는 프롬프트를 입력하세요"
              className="min-h-[200px]"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <Button className="w-full" onClick={handleSave} isLoading={isSaving}>
            <Sparkles className="mr-2" size={18} />
            Agent 탄생시키기
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
