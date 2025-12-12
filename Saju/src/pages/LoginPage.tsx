import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Sparkles } from 'lucide-react';
import { Button, Input, Card } from '@/components/ui';
import { CosmicPortal } from '@/components/common/CosmicPortal';
import { useAuthStore } from '@/stores/authStore';

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login
    await new Promise((resolve) => setTimeout(resolve, 1500));

    login({
      id: '1',
      email,
      name: '김기업',
      role: 'admin',
    });

    navigate('/');
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Portal Animation */}
      <motion.div
        className="mb-8"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <CosmicPortal size={150} />
      </motion.div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <Card variant="glass" className="w-[400px] p-8">
          <div className="mb-8 text-center">
            <motion.h1
              className="mb-2 text-2xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <span className="text-rainbow">✨ 운명의 동반자를 만나세요</span>
            </motion.h1>
            <motion.p
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Companion Foundry에 오신 것을 환영합니다
            </motion.p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
            >
              <Input
                type="email"
                placeholder="이메일"
                icon={<Mail size={18} />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
            >
              <Input
                type="password"
                placeholder="비밀번호"
                icon={<Lock size={18} />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
            >
              <Button type="submit" className="w-full" isLoading={isLoading}>
                <Sparkles className="mr-2" size={18} />
                운명의 문 열기
              </Button>
            </motion.div>
          </form>

          <motion.div
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-card px-4 text-muted-foreground">또는</span>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <motion.button
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary transition-colors hover:bg-secondary/80"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg">G</span>
              </motion.button>
              <motion.button
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary transition-colors hover:bg-secondary/80"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg">M</span>
              </motion.button>
              <motion.button
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary transition-colors hover:bg-secondary/80"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-sm">SSO</span>
              </motion.button>
            </div>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}
