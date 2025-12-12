import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Play, CheckCircle, AlertTriangle, XCircle, Wrench, Rocket, RotateCcw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Progress } from '@/components/ui';
import { sampleAgents } from '@/stores/agentStore';
import { FORTUNE_PHRASES } from '@/configs/api';
import { VerisResult } from '@/types/agent';

type VerisGrade = 'excellent' | 'good' | 'fair' | 'poor';

const gradeEmojis: Record<VerisGrade, string> = {
  excellent: '⭐⭐⭐',
  good: '⭐⭐',
  fair: '⭐',
  poor: '⚠️',
};

const gradeColors: Record<VerisGrade, string> = {
  excellent: 'text-rainbow-yellow',
  good: 'text-rainbow-green',
  fair: 'text-rainbow-orange',
  poor: 'text-rainbow-red',
};

const hexagramSymbols = ['☰', '☱', '☲', '☳', '☴', '☵', '☶', '☷'];

export function VerisPage() {
  const [selectedAgent, setSelectedAgent] = useState<(typeof sampleAgents)[0] | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<VerisResult | null>(null);

  const handleVerify = async () => {
    if (!selectedAgent) return;

    setIsVerifying(true);
    setResult(null);
    setProgress(0);

    // Simulate verification progress
    for (let i = 0; i <= 100; i += 2) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setProgress(i);
    }

    // Generate mock result based on agent
    const score = selectedAgent.compatibility.overall;
    const grade: VerisGrade = score >= 90 ? 'excellent' : score >= 75 ? 'good' : score >= 50 ? 'fair' : 'poor';

    const verisResult: VerisResult = {
      score,
      grade,
      details: [
        {
          category: 'accuracy',
          score: selectedAgent.compatibility.accuracy,
          description: '답변 정확도 검증',
          issues: score < 90 ? ['일부 답변에서 부정확한 정보 감지'] : [],
        },
        {
          category: 'relevance',
          score: selectedAgent.compatibility.relevance,
          description: '맥락 관련성 검증',
          issues: [],
        },
        {
          category: 'completeness',
          score: selectedAgent.compatibility.completeness,
          description: '답변 완전성 검증',
          issues: score < 85 ? ['일부 필수 정보 누락'] : [],
        },
        {
          category: 'safety',
          score: selectedAgent.compatibility.safety,
          description: '안전성 검증',
          issues: [],
        },
        {
          category: 'compliance',
          score: selectedAgent.compatibility.compliance,
          description: '규정 준수 검증',
          issues: score < 80 ? ['금융 규정 준수 확인 필요'] : [],
        },
      ],
      recommendations:
        score < 90
          ? ['프롬프트에 정확성 강조 문구 추가', '컨텍스트 길이 최적화 권장']
          : ['현재 설정을 유지하세요'],
      passedTests: Math.floor((score / 100) * 50),
      totalTests: 50,
    };

    setResult(verisResult);
    setIsVerifying(false);
  };

  const handleReset = () => {
    setSelectedAgent(null);
    setResult(null);
    setProgress(0);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="mb-2 text-3xl font-bold">
          <span className="text-rainbow">⚖️ Veris 품질 점괘</span>
        </h1>
        <p className="text-muted-foreground">Agent의 품질을 딥러닝으로 검증합니다</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Agent Selection */}
        {!isVerifying && !result && (
          <motion.div
            key="selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card variant="fortune">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="text-rainbow-purple" />
                  검증할 Agent 선택
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-4">
                {sampleAgents.map((agent, index) => (
                  <motion.button
                    key={agent.id}
                    className={`rounded-xl border-2 p-6 text-left transition-all ${
                      selectedAgent?.id === agent.id
                        ? 'border-rainbow-purple bg-rainbow-purple/10 shadow-lg shadow-rainbow-purple/20'
                        : 'border-border hover:border-rainbow-purple/50'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedAgent(agent)}
                  >
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rainbow-purple to-rainbow-blue text-3xl">
                      🤖
                    </div>
                    <p className="mb-1 font-semibold">{agent.name}</p>
                    <p className="text-sm text-muted-foreground">{agent.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        마지막 검증: {agent.updatedAt.toLocaleDateString()}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </CardContent>
            </Card>

            <div className="mt-6 flex justify-center">
              <Button size="lg" disabled={!selectedAgent} onClick={handleVerify}>
                <Play className="mr-2" size={20} />
                품질 점괘 시작
              </Button>
            </div>
          </motion.div>
        )}

        {/* Verification in Progress */}
        {isVerifying && (
          <motion.div
            key="verifying"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Card variant="fortune" className="py-16">
              <CardContent className="flex flex-col items-center text-center">
                {/* Mandala Animation */}
                <motion.div
                  className="relative mb-8 h-48 w-48"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ transform: `rotate(${i * 45}deg)` }}
                    >
                      <motion.span
                        className="text-4xl text-rainbow-purple"
                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                      >
                        {hexagramSymbols[i]}
                      </motion.span>
                    </motion.div>
                  ))}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span
                      className="text-5xl"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      🌀
                    </motion.span>
                  </div>
                </motion.div>

                <h2 className="mb-2 text-2xl font-bold">점괘 진행 중...</h2>
                <p className="mb-8 text-muted-foreground">"Agent의 운명을 살펴보고 있습니다"</p>

                <div className="w-full max-w-md">
                  <div className="mb-2 flex justify-between text-sm">
                    <span>진행률</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} variant="rainbow" size="lg" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Result */}
        {result && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Score Card */}
            <Card variant="fortune" className="overflow-hidden">
              <div className="relative py-12">
                <div className="absolute inset-0 bg-aurora opacity-10" />
                <CardContent className="relative text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                  >
                    <h2 className="mb-8 text-2xl font-bold">⭐ 점괘 결과 ⭐</h2>
                    <div className="relative mx-auto mb-6 inline-block">
                      <motion.div
                        className="absolute inset-0 bg-rainbow-yellow opacity-30 blur-3xl"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <div className="relative flex h-40 w-40 flex-col items-center justify-center rounded-2xl border-4 border-rainbow-yellow bg-card">
                        <motion.span
                          className="text-5xl font-bold"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          {result.score}
                        </motion.span>
                        <span className="text-lg">점</span>
                      </div>
                    </div>
                    <motion.p
                      className={`text-2xl font-bold ${gradeColors[result.grade]}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      {gradeEmojis[result.grade]} {FORTUNE_PHRASES[result.grade]}
                    </motion.p>
                  </motion.div>
                </CardContent>
              </div>
            </Card>

            {/* Category Cards */}
            <div className="grid grid-cols-4 gap-4">
              {result.details.slice(0, 4).map((detail, index) => (
                <motion.div
                  key={detail.category}
                  initial={{ opacity: 0, rotateY: 180 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  transition={{ delay: 1 + index * 0.2 }}
                >
                  <Card variant="fortune" className="text-center">
                    <CardContent className="py-6">
                      <span className="mb-2 block text-3xl">{hexagramSymbols[index]}</span>
                      <p className="mb-2 text-sm text-muted-foreground">{detail.description}</p>
                      <p className="text-2xl font-bold">{detail.score}%</p>
                      <p className={`text-sm ${detail.score >= 90 ? 'text-rainbow-green' : detail.score >= 70 ? 'text-rainbow-yellow' : 'text-rainbow-red'}`}>
                        {detail.score >= 90 ? '대길' : detail.score >= 70 ? '중길' : '소길'}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Detailed Report */}
            <Card variant="fortune">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>📋</span>
                  상세 점괘 해석
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-rainbow-green">
                    <CheckCircle size={20} />
                    <span>통과한 테스트: {result.passedTests}/{result.totalTests}</span>
                  </div>
                  {result.details.some((d) => d.issues.length > 0) && (
                    <div className="flex items-center gap-2 text-rainbow-orange">
                      <AlertTriangle size={20} />
                      <span>주의 필요: {result.details.filter((d) => d.issues.length > 0).length}건</span>
                    </div>
                  )}
                </div>

                {result.details.some((d) => d.issues.length > 0) && (
                  <div className="rounded-xl bg-secondary/50 p-4">
                    <h4 className="mb-2 font-medium">발견된 이슈:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {result.details
                        .flatMap((d) => d.issues)
                        .map((issue, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <XCircle size={14} className="text-rainbow-red" />
                            {issue}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <Button variant="outline" onClick={handleReset}>
                    <RotateCcw className="mr-2" size={18} />
                    다른 Agent 검증
                  </Button>
                  {result.score < 90 && (
                    <Button variant="outline">
                      <Wrench className="mr-2" size={18} />
                      문제 수정하기
                    </Button>
                  )}
                  <Button>
                    <Rocket className="mr-2" size={18} />
                    배포 진행하기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
