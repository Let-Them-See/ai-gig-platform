import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(108, 99, 255)',
          50: '#f0efff',
          100: '#dddaff',
          200: '#bbb5ff',
          300: '#9990ff',
          400: '#7d74ff',
          500: '#6C63FF',
          600: '#5449e6',
          700: '#3d36bf',
          800: '#292499',
          900: '#1a1573',
        },
        secondary: {
          DEFAULT: 'rgb(34, 211, 238)',
          50: '#e8fdff',
          100: '#c5f9ff',
          200: '#89f1ff',
          300: '#4de8ff',
          400: '#22D3EE',
          500: '#0cb8d4',
          600: '#0093ae',
          700: '#00748a',
          800: '#005a6c',
          900: '#004959',
        },
        background: 'rgb(var(--background))',
        foreground: 'rgb(var(--foreground))',
        card: {
          DEFAULT: 'rgb(var(--card))',
          foreground: 'rgb(var(--card-foreground))',
        },
        muted: {
          DEFAULT: 'rgb(var(--muted))',
          foreground: 'rgb(var(--muted-foreground))',
        },
        border: 'rgb(var(--border))',
        input: 'rgb(var(--input))',
        ring: 'rgb(var(--ring))',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
      },
      boxShadow: {
        'glow': '0 0 30px rgba(108, 99, 255, 0.3)',
        'glow-secondary': '0 0 30px rgba(34, 211, 238, 0.3)',
      },
    },
  },
  plugins: [],
};

export default config;
