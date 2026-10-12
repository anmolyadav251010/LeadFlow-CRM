import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './lib/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#dfeeff',
          200: '#bfdcff',
          300: '#8cc3ff',
          400: '#57a0ff',
          500: '#2d7ef0',
          600: '#1d66d1',
          700: '#1c51a8',
          800: '#1d437f',
          900: '#1a3765',
        },
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(15, 23, 42, 0.12)',
      },
    },
  },
  plugins: [],
};

export default config;
