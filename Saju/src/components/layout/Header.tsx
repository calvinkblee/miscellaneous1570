import { Bell, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui';

export function Header() {
  return (
    <header className="glass fixed left-64 right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-border px-6">
      {/* Search */}
      <div className="relative w-96">
        <Input
          placeholder="Agent, 문서, 기능 검색..."
          icon={<Search size={18} />}
          className="bg-secondary/30"
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <motion.button
          className="relative rounded-xl p-2 transition-colors hover:bg-secondary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Bell size={20} />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rainbow-red" />
        </motion.button>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium">김기업 님</p>
            <p className="text-xs text-muted-foreground">Enterprise</p>
          </div>
          <motion.div
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-rainbow-purple to-rainbow-blue text-lg"
            whileHover={{ scale: 1.05 }}
          >
            👤
          </motion.div>
        </div>
      </div>
    </header>
  );
}
