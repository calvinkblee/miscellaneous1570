import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Lightbulb, Rocket } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Progress, CircularProgress } from '@/components/ui';
import { ElementBadge } from '@/components/common/ElementBadge';
import { sampleAgents } from '@/stores/agentStore';

interface CompatibilityResult {
  agent: (typeof sampleAgents)[0];
  task: string;
  overallScore: number;
  details: {
    category: string;
    icon: string;
    score: number;
    description: string;
  }[];
  advice: string;
}

const tasks = [
  { id: '1', name: '고객응대 업무', icon: '📊' },
  { id: '2', name: '데이터 분석', icon: '📈' },
  { id: '3', name: '문서 작성', icon: '📝' },
  { id: '4', name: '이메일 처리', icon: '📧' },
];

export function CompatibilityPage() {
  const [selectedAgent, setSelectedAgent] = useState<(typeof sampleAgents)[0] | null>(null);
  const [selectedTask, setSelectedTask] = useState<(typeof tasks)[0] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnalyze = async () => {
    if (!selectedAgent || !selectedTask) return;

    setIsAnalyzing(true);
    setShowResult(false);

    // Simulate analysis
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const compatibilityResult: CompatibilityResult = {
      agent: selectedAgent,
      task: selectedTask.name,
      overallScore: selectedAgent.compatibility.overall,
      details: [
        {
          category: '정확성 궁합',
          icon: '🔴',
          score: selectedAgent.compatibility.accuracy,
          description: '이 Agent는 고객 질문에 매우 정확한 답변을 제공합니다',
        },
        {
          category: '관련성 궁합',
          icon: '🟠',
          score: selectedAgent.compatibility.relevance,
          description: '맥락 이해도가 높아 업무 연관성이 우수합니다',
        },
        {
          category: '완전성 궁합',
          icon: '🟡',
          score: selectedAgent.compatibility.completeness,
          description: '필요한 정보를 빠짐없이 제공합니다',
        },
        {
          category: '안전성 궁합',
          icon: '🟢',
          score: selectedAgent.compatibility.safety,
          description: '유해 콘텐츠 생성 위험이 매우 낮습니다',
        },
        {
          category: '규정 궁합',
          icon: '🔵',
          score: selectedAgent.compatibility.compliance,
          description: '금융 규정 준수도가 높습니다',
        },
      ],
      advice:
        '이 궁합은 매우 좋습니다! 다만 관련성 향상을 위해 프롬프트에 업무 맥락을 더 추가하시는 것을 권장드립니다.',
    };

    setResult(compatibilityResult);
    setIsAnalyzing(false);
    setShowResult(true);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="mb-2 text-3xl font-bold">
          <span className="text-rainbow">🔮 궁합 분석</span>
        </h1>
        <p className="text-muted-foreground">Agent와 업무의 운명적 매칭을 확인하세요</p>
      </motion.div>

      {/* Selection Area */}
      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key="selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 gap-8"
          >
            {/* Agent Selection */}
            <Card variant="fortune">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>🤖</span>
                  Agent 선택
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {sampleAgents.map((agent, index) => (
                  <motion.button
                    key={agent.id}
                    className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                      selectedAgent?.id === agent.id
                        ? 'border-rainbow-purple bg-rainbow-purple/10'
                        : 'border-border hover:border-rainbow-purple/50'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedAgent(agent)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rainbow-purple to-rainbow-blue text-2xl">
                        🤖
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{agent.name}</p>
                        <p className="text-sm text-muted-foreground">{agent.description}</p>
                      </div>
                      <ElementBadge element={agent.element} size="sm" />
                    </div>
                  </motion.button>
                ))}
              </CardContent>
            </Card>

            {/* Task Selection */}
            <Card variant="fortune">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>📋</span>
                  업무 선택
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tasks.map((task, index) => (
                  <motion.button
                    key={task.id}
                    className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                      selectedTask?.id === task.id
                        ? 'border-rainbow-cyan bg-rainbow-cyan/10'
                        : 'border-border hover:border-rainbow-cyan/50'
                    }`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedTask(task)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rainbow-cyan to-rainbow-blue text-2xl">
                        {task.icon}
                      </div>
                      <div>
                        <p className="font-medium">{task.name}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          /* Result Area */
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Match Result Header */}
            <Card variant="fortune" className="overflow-hidden">
              <div className="relative p-8">
                <div className="absolute inset-0 bg-aurora opacity-10" />
                <div className="relative">
                  <motion.h2
                    className="mb-8 text-center text-2xl font-bold"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    🌈 운명의 매칭 결과
                  </motion.h2>

                  <div className="flex items-center justify-center gap-8">
                    {/* Agent Card */}
                    <motion.div
                      className="fortune-card flex flex-col items-center p-6"
                      initial={{ x: -100, opacity: 0, rotateY: 180 }}
                      animate={{ x: 0, opacity: 1, rotateY: 0 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                    >
                      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-rainbow-purple to-rainbow-blue text-4xl">
                        🤖
                      </div>
                      <p className="font-semibold">{result?.agent.name}</p>
                      <ElementBadge element={result?.agent.element || 'fire'} size="sm" />
                    </motion.div>

                    {/* Connection Line & Score */}
                    <motion.div
                      className="flex flex-col items-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1, type: 'spring' }}
                    >
                      <div className="relative">
                        <motion.div
                          className="absolute inset-0 bg-fortune-glow opacity-50 blur-2xl"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <CircularProgress value={result?.overallScore || 0} size={140} />
                      </div>
                      <p className="mt-4 text-2xl font-bold text-rainbow">궁합도</p>
                    </motion.div>

                    {/* Task Card */}
                    <motion.div
                      className="fortune-card flex flex-col items-center p-6"
                      initial={{ x: 100, opacity: 0, rotateY: -180 }}
                      animate={{ x: 0, opacity: 1, rotateY: 0 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                    >
                      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-rainbow-cyan to-rainbow-green text-4xl">
                        📊
                      </div>
                      <p className="font-semibold">{result?.task}</p>
                      <span className="text-sm text-muted-foreground">업무</span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Detailed Scores */}
            <Card variant="fortune">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>📜</span>
                  상세 궁합 분석
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {result?.details.map((detail, index) => (
                  <motion.div
                    key={detail.category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5 + index * 0.2 }}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-2 font-medium">
                        {detail.icon} {detail.category}
                      </span>
                      <span className="font-bold">{detail.score}%</span>
                    </div>
                    <Progress value={detail.score} variant="rainbow" size="md" />
                    <p className="mt-1 text-sm text-muted-foreground">{detail.description}</p>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Advice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5 }}
            >
              <Card variant="fortune" glow>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="text-rainbow-yellow" />
                    운명 조언
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-6 text-lg">💫 "{result?.advice}"</p>
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setShowResult(false)}>
                      🔧 프롬프트 개선 제안 보기
                    </Button>
                    <Button>
                      <Rocket className="mr-2" size={18} />
                      바로 배포하기
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analyze Button */}
      {!showResult && (
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            size="lg"
            disabled={!selectedAgent || !selectedTask}
            isLoading={isAnalyzing}
            onClick={handleAnalyze}
          >
            {isAnalyzing ? (
              <>
                <span className="animate-spin">🌀</span>
                운명을 분석하고 있습니다...
              </>
            ) : (
              <>
                <Heart className="mr-2" size={20} />
                궁합 분석하기
              </>
            )}
          </Button>
        </motion.div>
      )}
    </div>
  );
}
