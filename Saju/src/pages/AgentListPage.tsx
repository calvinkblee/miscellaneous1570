import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, MoreVertical, Play, Edit, Eye } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Progress } from '@/components/ui';
import { ElementBadge } from '@/components/common/ElementBadge';
import { useAgentStore, sampleAgents } from '@/stores/agentStore';

const statusLabels = {
  draft: { label: '초안', color: 'text-muted-foreground' },
  testing: { label: '테스트 중', color: 'text-rainbow-orange' },
  deployed: { label: '배포됨', color: 'text-rainbow-green' },
  archived: { label: '보관됨', color: 'text-muted-foreground' },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function AgentListPage() {
  const navigate = useNavigate();
  const { agents, setAgents } = useAgentStore();

  useEffect(() => {
    // Load sample agents if empty
    if (agents.length === 0) {
      setAgents(sampleAgents);
    }
  }, [agents.length, setAgents]);

  const displayAgents = agents.length > 0 ? agents : sampleAgents;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-bold">
            <span className="text-rainbow">🔮 Agent 목록</span>
          </h1>
          <p className="text-muted-foreground">생성된 AI 동반자들을 관리하세요</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Button onClick={() => navigate('/agents/new')}>
            <Plus className="mr-2" size={18} />
            새 Agent 생성
          </Button>
        </motion.div>
      </div>

      <motion.div
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {displayAgents.map((agent) => {
          const status = statusLabels[agent.status];
          return (
            <motion.div key={agent.id} variants={itemVariants}>
              <Card
                variant="fortune"
                className="group cursor-pointer transition-all hover:border-rainbow-purple/50"
                onClick={() => navigate(`/agents/${agent.id}`)}
              >
                <CardHeader className="flex flex-row items-start justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rainbow-purple to-rainbow-blue text-2xl"
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                    >
                      🤖
                    </motion.div>
                    <div>
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                      <span className={`text-sm ${status.color}`}>● {status.label}</span>
                    </div>
                  </div>
                  <button
                    className="rounded-lg p-2 opacity-0 transition-opacity hover:bg-secondary group-hover:opacity-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical size={18} />
                  </button>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{agent.description}</p>

                  <div className="mb-4 flex flex-wrap gap-2">
                    <ElementBadge element={agent.element} size="sm" />
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs">{agent.llmModel}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">궁합도</span>
                      <span className="font-bold">{agent.compatibility.overall}%</span>
                    </div>
                    <Progress value={agent.compatibility.overall} variant="rainbow" size="sm" />
                  </div>

                  <div className="mt-4 flex justify-between text-xs text-muted-foreground">
                    <span>생성: {agent.createdAt.toLocaleDateString()}</span>
                    <span>수정: {agent.updatedAt.toLocaleDateString()}</span>
                  </div>

                  <div className="mt-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/agents/${agent.id}/edit`);
                      }}
                    >
                      <Edit size={14} className="mr-1" />
                      수정
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/agents/${agent.id}/test`);
                      }}
                    >
                      <Play size={14} className="mr-1" />
                      테스트
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Eye size={14} className="mr-1" />
                      보기
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}

        {/* Add New Agent Card */}
        <motion.div variants={itemVariants}>
          <Card
            variant="glass"
            className="flex h-full min-h-[300px] cursor-pointer items-center justify-center border-2 border-dashed border-muted-foreground/30 transition-all hover:border-rainbow-purple/50"
            onClick={() => navigate('/agents/new')}
          >
            <div className="text-center">
              <motion.div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-3xl"
                whileHover={{ scale: 1.1, rotate: 90 }}
              >
                <Plus size={32} className="text-muted-foreground" />
              </motion.div>
              <p className="font-medium">새로운 Agent 생성</p>
              <p className="text-sm text-muted-foreground">운명의 동반자를 탄생시키세요</p>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
