import { motion } from 'framer-motion';

export function CosmicPortal({ size = 200 }: { size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Outer Ring */}
      <motion.div
        className="absolute inset-0 rounded-full bg-fortune-glow opacity-30"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      {/* Middle Ring */}
      <motion.div
        className="absolute inset-4 rounded-full bg-gradient-to-r from-rainbow-purple via-rainbow-blue to-rainbow-cyan opacity-50"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      />

      {/* Inner Ring */}
      <motion.div
        className="absolute inset-8 rounded-full bg-gradient-to-r from-rainbow-cyan via-rainbow-green to-rainbow-yellow opacity-70"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      />

      {/* Core */}
      <motion.div
        className="absolute inset-12 flex items-center justify-center rounded-full bg-cosmic"
        animate={{
          boxShadow: [
            '0 0 30px rgba(124, 77, 255, 0.5)',
            '0 0 60px rgba(124, 77, 255, 0.8)',
            '0 0 30px rgba(124, 77, 255, 0.5)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.span
          className="text-4xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          🌀
        </motion.span>
      </motion.div>

      {/* Particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full bg-white"
          style={{
            left: '50%',
            top: '50%',
          }}
          animate={{
            x: [0, Math.cos((i * Math.PI) / 4) * (size / 2 - 10)],
            y: [0, Math.sin((i * Math.PI) / 4) * (size / 2 - 10)],
            opacity: [1, 0],
            scale: [0, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.25,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}
