/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Rainbow Colors (from design.md)
        rainbow: {
          red: '#FF3366',
          orange: '#FF8C42',
          yellow: '#FFD700',
          green: '#00E676',
          cyan: '#00E5FF',
          blue: '#536DFE',
          purple: '#7C4DFF',
          magenta: '#FF00FF',
        },
        // Five Elements Colors
        element: {
          wood: '#4CAF50',
          fire: '#FF5722',
          earth: '#FFEB3B',
          metal: '#9E9E9E',
          water: '#2196F3',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Pretendard Variable', 'Pretendard', 'system-ui', 'sans-serif'],
        display: ['Clash Display', 'Space Grotesk', 'sans-serif'],
        korean: ['Gowun Batang', 'serif'],
      },
      animation: {
        'rainbow-flow': 'rainbow-flow 8s ease infinite',
        'oracle-pulse': 'oracle-pulse 2s ease-in-out infinite',
        'cosmic-portal': 'cosmic-portal 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        'rainbow-flow': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'oracle-pulse': {
          '0%, 100%': {
            boxShadow:
              '0 0 20px rgba(124, 77, 255, 0.5), 0 0 40px rgba(124, 77, 255, 0.3)',
          },
          '50%': {
            boxShadow:
              '0 0 40px rgba(124, 77, 255, 0.8), 0 0 80px rgba(124, 77, 255, 0.5)',
          },
        },
        'cosmic-portal': {
          '0%': {
            opacity: '0',
            transform: 'scale(0) rotate(-180deg)',
            filter: 'blur(20px)',
          },
          '50%': {
            opacity: '0.5',
            transform: 'scale(1.2) rotate(-90deg)',
            filter: 'blur(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1) rotate(0deg)',
            filter: 'blur(0)',
          },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

