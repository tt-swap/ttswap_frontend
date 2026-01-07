/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
      colors: {
        primary: {
          DEFAULT: '#0fb981',
          hover: '#22c55e',
        },
        usdt: '#26a17b',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
  // 重要：启用优化，减少生成的CSS
  safelist: [
    // 常用的响应式类
    {
      pattern: /^(container|flex|grid|hidden|block|inline|p-|m-|gap-|text-|bg-|border-|w-|h-|max-w-|min-h-|col-|row-|items-|justify-|space-|rounded-|shadow-|font-|leading-|tracking-|placeholder-|divide-|ring-|focus-within:|hover:|focus:|active:|disabled:|group-|peer-)/,
    }
  ]
};