import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bot, Target, Wallet, Plus, Heart, Scale, Rocket, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Progress, Button } from '@/components/ui';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function DashboardPage() {
  const navigate = useNavigate();

  const today = new Date();
  const dateString = today.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const quickActions = [
    { icon: Plus, label: '새 Agent\n생성', path: '/agents/new', emoji: '✨' },
    { icon: Heart, label: '궁합 분석', path: '/agents/compatibility', emoji: '🔮' },
    { icon: Scale, label: '품질 점괘', path: '/quality/veris', emoji: '⚖️' },
    { icon: Rocket, label: '배포 운명', path: '/deploy', emoji: '🚀' },
  ];

  const agents = [
    { name: '고객상담 Agent', score: 92 },
    { name: '재무분석 Agent', score: 78 },
    { name: '문서작성 Agent', score: 88 },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Today's Fortune Banner */}
      <motion.div variants={itemVariants}>
        <Card variant="fortune" className="overflow-hidden">
          <div className="relative">
            <div className="absolute inset-0 bg-aurora opacity-20" />
            <div className="relative p-8">
              <div className="flex items-center justify-between">
                <div>
                  <motion.div
                    className="mb-2 flex items-center gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className="text-2xl">🌟</span>
                    <h2 className="text-xl font-semibold">오늘의 Agent 운세</h2>
                  </motion.div>
                  <motion.p
                    className="text-2xl font-bold text-rainbow"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    "새로운 동반자를 맞이할 최적의 시기입니다"
                  </motion.p>
                </div>
                <motion.div
                  className="text-right text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {dateString}
                </motion.div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6">
        <motion.div variants={itemVariants}>
          <Card variant="fortune" glow>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rainbow-purple/20">
                  <Bot className="text-rainbow-purple" size={24} />
                </div>
                <div>
                  <CardTitle className="text-muted-foreground text-sm font-normal">활성 Agent</CardTitle>
                  <div className="flex items-baseline gap-2">
                    <motion.span
                      className="text-3xl font-bold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      12
                    </motion.span>
                    <span className="text-sm text-rainbow-green">개</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-sm text-rainbow-green">
                <TrendingUp size={16} />
                <span>+3 this week</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card variant="fortune">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rainbow-yellow/20">
                  <Target className="text-rainbow-yellow" size={24} />
                </div>
                <div>
                  <CardTitle className="text-muted-foreground text-sm font-normal">오늘의 품질</CardTitle>
                  <div className="flex items-baseline gap-2">
                    <motion.span
                      className="text-3xl font-bold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      95
                    </motion.span>
                    <span className="text-sm text-muted-foreground">점</span>
                    <span className="text-lg">⭐⭐⭐</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Veris 평균 점수</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card variant="fortune">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rainbow-cyan/20">
                  <Wallet className="text-rainbow-cyan" size={24} />
                </div>
                <div>
                  <CardTitle className="text-muted-foreground text-sm font-normal">운명 비용</CardTitle>
                  <div className="flex items-baseline gap-2">
                    <motion.span
                      className="text-3xl font-bold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      ₩2.34M
                    </motion.span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-sm text-rainbow-green">
                <TrendingDown size={16} />
                <span>-15% vs 예상</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Agent Compatibility */}
        <motion.div variants={itemVariants}>
          <Card variant="fortune">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-xl">🔮</span>
                Agent 궁합 현황
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {agents.map((agent, index) => (
                <motion.div
                  key={agent.name}
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="flex justify-between text-sm">
                    <span>{agent.name}</span>
                    <span className="font-bold">{agent.score}%</span>
                  </div>
                  <Progress value={agent.score} variant="rainbow" size="sm" />
                </motion.div>
              ))}
              <Button variant="ghost" className="mt-4 w-full" onClick={() => navigate('/agents/compatibility')}>
                상세 사주 분석 보기 →
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Fortune Trend */}
        <motion.div variants={itemVariants}>
          <Card variant="fortune">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-xl">📈</span>
                운세 트렌드
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-48 items-end justify-around">
                {[65, 80, 72, 90, 85, 92, 88].map((value, i) => (
                  <motion.div
                    key={i}
                    className="w-8 rounded-t-lg"
                    style={{
                      background: `linear-gradient(to top, ${
                        ['#FF3366', '#FF8C42', '#FFD700', '#00E676', '#00E5FF', '#536DFE', '#7C4DFF'][i]
                      }, transparent)`,
                    }}
                    initial={{ height: 0 }}
                    animate={{ height: `${value}%` }}
                    transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
                  />
                ))}
              </div>
              <div className="mt-4 flex justify-around text-xs text-muted-foreground">
                {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
              <p className="mt-4 text-center text-sm text-muted-foreground">지난 7일간 변화</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card variant="fortune">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">🌈</span>
              빠른 실행
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.label}
                  className="group flex flex-col items-center gap-3 rounded-2xl bg-secondary/50 p-6 transition-all hover:bg-secondary"
                  onClick={() => navigate(action.path)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <motion.div
                    className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rainbow-purple to-rainbow-blue text-3xl transition-all group-hover:shadow-lg group-hover:shadow-rainbow-purple/30"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                  >
                    {action.emoji}
                  </motion.div>
                  <span className="text-center text-sm font-medium whitespace-pre-line">{action.label}</span>
                </motion.button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
