/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B35',
          light: '#FF8C5A',
          dark: '#E55A2B',
        },
        secondary: '#5D4037',
        cream: '#FFF8F0',
        beige: '#F5E6D3',
      },
      fontFamily: {
        sans: ['Pretendard', 'sans-serif'],
        display: ['Outfit', 'Pretendard', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.1)',
        primary: '0 4px 14px rgba(255, 107, 53, 0.25)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};


