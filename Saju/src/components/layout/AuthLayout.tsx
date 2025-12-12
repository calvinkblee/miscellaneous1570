import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Stars, ShootingStar } from '@/components/common/Stars';
import { CosmicPortal } from '@/components/common/CosmicPortal';

export function AuthLayout() {
  return (
    <div className="bg-cosmic relative flex min-h-screen items-center justify-center overflow-hidden">
      <Stars count={150} />
      <ShootingStar />

      {/* Background Portal */}
      <motion.div
        className="pointer-events-none absolute opacity-20"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        <CosmicPortal size={600} />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Outlet />
      </motion.div>
    </div>
  );
}
