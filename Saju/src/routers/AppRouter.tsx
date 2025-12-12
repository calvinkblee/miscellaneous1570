import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { AuthLayout } from '@/components/layout/AuthLayout';
import {
  LoginPage,
  DashboardPage,
  AgentBuilderPage,
  AgentListPage,
  AgentChatPage,
  CompatibilityPage,
  VerisPage,
} from '@/pages';
import { useAuthStore } from '@/stores/authStore';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route
          element={
            <PublicRoute>
              <AuthLayout />
            </PublicRoute>
          }
        >
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<DashboardPage />} />

          {/* Agent Routes */}
          <Route path="/agents" element={<Navigate to="/agents/list" replace />} />
          <Route path="/agents/new" element={<AgentBuilderPage />} />
          <Route path="/agents/list" element={<AgentListPage />} />
          <Route path="/agents/:agentId" element={<AgentChatPage />} />
          <Route path="/agents/:agentId/edit" element={<AgentBuilderPage />} />
          <Route path="/agents/:agentId/test" element={<AgentChatPage />} />
          <Route path="/agents/compatibility" element={<CompatibilityPage />} />

          {/* Data Routes */}
          <Route path="/data" element={<Navigate to="/data/upload" replace />} />
          <Route path="/data/upload" element={<PlaceholderPage title="문서 업로드" emoji="📄" />} />
          <Route path="/data/knowledge-map" element={<PlaceholderPage title="지식맵" emoji="🗺️" />} />

          {/* Quality Routes */}
          <Route path="/quality" element={<Navigate to="/quality/veris" replace />} />
          <Route path="/quality/veris" element={<VerisPage />} />
          <Route path="/quality/test" element={<PlaceholderPage title="테스트" emoji="🧪" />} />

          {/* Other Routes */}
          <Route path="/deploy" element={<PlaceholderPage title="배포 운명" emoji="🚀" />} />
          <Route path="/monitoring" element={<PlaceholderPage title="운세 모니터링" emoji="📊" />} />
          <Route path="/settings" element={<PlaceholderPage title="설정" emoji="⚙️" />} />
          <Route path="/profile" element={<PlaceholderPage title="내 프로필" emoji="👤" />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// Placeholder for pages not yet implemented
function PlaceholderPage({ title, emoji }: { title: string; emoji: string }) {
  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col items-center justify-center">
      <div className="animate-bounce-in text-center">
        <span className="mb-4 block text-6xl">{emoji}</span>
        <h1 className="mb-2 text-3xl font-bold text-rainbow">{title}</h1>
        <p className="text-muted-foreground">이 페이지는 곧 준비될 예정입니다</p>
      </div>
    </div>
  );
}
