import { useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, useNavigate, Link } from 'react-router-dom';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분
      retry: 2,
    },
  },
});

function HomePage() {
  const featuresRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/login');
  };

  const handleLearnMore = () => {
    // 기능 소개 섹션으로 스크롤
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="animate-[cosmic-portal_1.2s_cubic-bezier(0.34,1.56,0.64,1)]">
        <h1 className="bg-gradient-to-r from-[#ff3366] via-[#ffd700] to-[#7c4dff] bg-clip-text text-6xl font-bold text-transparent">
          🌈 Companion Foundry
        </h1>
      </div>
      <p className="mt-6 text-xl text-gray-300">
        "기업 업무를 끝까지 함께하는 AI 동반자를 만듭니다"
      </p>
      <div className="mt-8 flex gap-4">
        <button
          onClick={handleStart}
          className="rounded-full bg-gradient-to-r from-[#7c4dff] to-[#536dfe] px-8 py-4 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
        >
          🔮 시작하기
        </button>
        <button
          onClick={handleLearnMore}
          className="rounded-full border-2 border-[#7c4dff] px-8 py-4 font-semibold text-[#7c4dff] transition-all hover:bg-[#7c4dff] hover:text-white"
        >
          📖 더 알아보기
        </button>
      </div>
      <div ref={featuresRef} className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
        <FeatureCard
          icon="🪵"
          title="목(木) - 기획"
          description="AI 기획 검증 도구로 데이터 적합성 사전 검증"
          color="wood"
        />
        <FeatureCard
          icon="🔥"
          title="화(火) - 개발"
          description="LangBridge로 개발 속도 3배 향상"
          color="fire"
        />
        <FeatureCard
          icon="💧"
          title="수(水) - 품질"
          description="Veris로 할루시네이션 제로 도전"
          color="water"
        />
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  color: 'wood' | 'fire' | 'water';
}

function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  const colorClasses = {
    wood: 'border-[#4caf50] hover:shadow-[0_0_20px_rgba(76,175,80,0.3)]',
    fire: 'border-[#ff5722] hover:shadow-[0_0_20px_rgba(255,87,34,0.3)]',
    water: 'border-[#2196f3] hover:shadow-[0_0_20px_rgba(33,150,243,0.3)]',
  };

  return (
    <div
      className={`rounded-xl border-2 ${colorClasses[color]} bg-white/5 p-6 backdrop-blur-sm transition-all hover:scale-105`}
    >
      <div className="text-4xl">{icon}</div>
      <h3 className="mt-4 text-xl font-bold">{title}</h3>
      <p className="mt-2 text-gray-400">{description}</p>
    </div>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // 로그인 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 로그인 성공 후 대시보드로 이동
    navigate('/dashboard');
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] p-8">
      {/* 배경 포탈 효과 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-gradient-to-r from-[#7c4dff]/20 to-[#536dfe]/20 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* 로고 */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block transition-transform hover:scale-105">
            <h1 className="bg-gradient-to-r from-[#ff3366] via-[#ffd700] to-[#7c4dff] bg-clip-text text-4xl font-bold text-transparent">
              🌈 Companion Foundry
            </h1>
          </Link>
          <p className="mt-4 text-xl text-gray-300">✨ 운명의 동반자를 만나세요</p>
        </div>

        {/* 로그인 카드 */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-lg">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">이메일</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">📧</span>
                <input
                  type="email"
                  placeholder="이메일을 입력하세요"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-white placeholder-gray-500 transition-all focus:border-[#7c4dff] focus:outline-none focus:ring-2 focus:ring-[#7c4dff]/50"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">비밀번호</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                <input
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-white placeholder-gray-500 transition-all focus:border-[#7c4dff] focus:outline-none focus:ring-2 focus:ring-[#7c4dff]/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-gradient-to-r from-[#7c4dff] to-[#536dfe] py-4 font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  로그인 중...
                </span>
              ) : (
                <span>✨ 운명의 문 열기</span>
              )}
            </button>
          </form>

          {/* 소셜 로그인 */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-transparent px-4 text-gray-400">또는</span>
              </div>
            </div>

            <div className="mt-6 flex justify-center gap-4">
              <button className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg transition-all hover:bg-white/10">
                G
              </button>
              <button className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg transition-all hover:bg-white/10">
                M
              </button>
              <button className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm transition-all hover:bg-white/10">
                SSO
              </button>
            </div>
          </div>
        </div>

        {/* 홈으로 돌아가기 */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-gray-400 transition-colors hover:text-[#7c4dff]">
            ← 홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] p-8">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-white">🎉 환영합니다!</h1>
        <p className="mb-8 text-xl text-gray-300">Companion Foundry 대시보드에 오신 것을 환영합니다.</p>
        <div className="flex gap-4">
          <Link
            to="/"
            className="rounded-xl bg-white/10 px-6 py-3 font-semibold text-white transition-all hover:bg-white/20"
          >
            ← 홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
