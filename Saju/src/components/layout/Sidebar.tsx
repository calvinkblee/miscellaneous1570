import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Bot,
  Plus,
  List,
  Heart,
  Database,
  FileText,
  Map,
  Scale,
  TestTube,
  Rocket,
  BarChart3,
  Settings,
  User,
  Sparkles,
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    label: '대시보드',
    path: '/',
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: 'Agent 운세',
    path: '/agents',
    icon: <Bot size={20} />,
    children: [
      { label: '신규 생성', path: '/agents/new', icon: <Plus size={16} /> },
      { label: '목록 보기', path: '/agents/list', icon: <List size={16} /> },
      { label: '궁합 분석', path: '/agents/compatibility', icon: <Heart size={16} /> },
    ],
  },
  {
    label: '데이터 기운',
    path: '/data',
    icon: <Database size={20} />,
    children: [
      { label: '문서 등록', path: '/data/upload', icon: <FileText size={16} /> },
      { label: '지식맵', path: '/data/knowledge-map', icon: <Map size={16} /> },
    ],
  },
  {
    label: '품질 점괘',
    path: '/quality',
    icon: <Scale size={20} />,
    children: [
      { label: 'Veris 검증', path: '/quality/veris', icon: <Sparkles size={16} /> },
      { label: '테스트', path: '/quality/test', icon: <TestTube size={16} /> },
    ],
  },
  {
    label: '배포 운명',
    path: '/deploy',
    icon: <Rocket size={20} />,
  },
  {
    label: '운세 모니터링',
    path: '/monitoring',
    icon: <BarChart3 size={20} />,
  },
];

const bottomNavItems: NavItem[] = [
  {
    label: '설정',
    path: '/settings',
    icon: <Settings size={20} />,
  },
  {
    label: '내 프로필',
    path: '/profile',
    icon: <User size={20} />,
  },
];

export function Sidebar() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="glass fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-border">
      {/* Logo */}
      <div className="flex items-center gap-2 border-b border-border p-6">
        <motion.div
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-fortune-glow text-lg"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          🌈
        </motion.div>
        <div>
          <h1 className="bg-gradient-to-r from-rainbow-purple to-rainbow-cyan bg-clip-text font-bold text-transparent">
            COMPANION
          </h1>
          <p className="text-xs text-muted-foreground">FOUNDRY</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavItem item={item} isActive={isActive} />
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-border p-4">
        <ul className="space-y-2">
          {bottomNavItems.map((item) => (
            <li key={item.path}>
              <NavItem item={item} isActive={isActive} />
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

function NavItem({ item, isActive }: { item: NavItem; isActive: (path: string) => boolean }) {
  const active = isActive(item.path);

  return (
    <>
      <NavLink
        to={item.path}
        className={cn(
          'relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all',
          active
            ? 'bg-rainbow-purple/10 text-rainbow-purple'
            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
        )}
      >
        {active && (
          <motion.div
            className="absolute inset-0 rounded-xl bg-rainbow-purple/10"
            layoutId="activeNav"
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
        <span className="relative z-10">{item.icon}</span>
        <span className="relative z-10">{item.label}</span>
        {active && (
          <motion.div
            className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-rainbow-purple"
            layoutId="activeIndicator"
          />
        )}
      </NavLink>

      {/* Children */}
      {item.children && active && (
        <motion.ul
          className="ml-8 mt-2 space-y-1"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          {item.children.map((child) => (
            <li key={child.path}>
              <NavLink
                to={child.path}
                className={({ isActive: childActive }) =>
                  cn(
                    'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all',
                    childActive
                      ? 'text-rainbow-cyan'
                      : 'text-muted-foreground hover:text-foreground'
                  )
                }
              >
                {child.icon}
                {child.label}
              </NavLink>
            </li>
          ))}
        </motion.ul>
      )}
    </>
  );
}
