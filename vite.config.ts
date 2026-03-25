// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  root: process.cwd(),
  base: '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'build',
    sourcemap: false,
    minify: 'terser',
    cssCodeSplit: true, // 启用CSS代码拆分
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: false,
        pure_funcs: ['console.log', 'console.info', 'console.warn'],
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // 核心 React 和 DOM
          'react-core': ['react', 'react-dom'],
          // 状态管理
          'state-management': ['zustand', '@tanstack/react-query'],
          // UI 库
          'ui-components': [
            'antd',
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-hover-card',
            '@radix-ui/react-label',
            '@radix-ui/react-menubar',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-progress',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slider',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toggle',
            '@radix-ui/react-toggle-group',
            '@radix-ui/react-tooltip',
            '@radix-ui/themes',
            'lucide-react',
            'sonner',
            'input-otp',
            'cmdk',
            'react-resizable-panels',
            'react-day-picker',
            'react-device-detect',
            'react-jazzicon',
            'embla-carousel-react',
          ],
          'web3-other': [
            'ethers',
          ],
          'viem': [
            'viem',
          ],
          'wagmi': [
            'wagmi',
          ],
          // Web3 相关
          'web3-core': [
            '@web3-react/core',
            '@web3-react/types',
          ],
          // 钱包连接
          'wallet-connection': [
            '@rainbow-me/rainbowkit',
            '@metamask/sdk',
            // '@walletconnect',
          ],
          // 图表库 - 重要：只保留一个
          'recharts': ['recharts'],
          'echarts': ['echarts'],
          // 工具库
          'utils': [
            'lodash',
            'axios',
            'bignumber.js',
            'dayjs',
            'clsx',
            'class-variance-authority',
            'tailwind-merge',
          ],
          // 国际化
          'i18n': [
            'i18next',
            'react-i18next',
            'i18next-browser-languagedetector',
            'i18next-http-backend',
          ],
          // GraphQL
          'graphql': [
            'graphql',
            '@apollo/client',
          ],
          // 网络请求
          // 'api': ['axios'],
          // 加密相关
          // 'crypto': ['secp256k1'],
        },
        chunkFileNames: 'assets/chunks/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.names && assetInfo.names.some(name => name.endsWith('.css'))) {
            // 按功能拆分CSS文件
            if (assetInfo.names.some(name => /global|index|main/.test(name))) {
              return 'assets/css/global.[hash].css';
            } else if (assetInfo.names.some(name => /components/.test(name))) {
              return 'assets/css/components.[hash].css';
            } else if (assetInfo.names.some(name => /pages/.test(name))) {
              return 'assets/css/pages.[hash].css';
            } else {
              return 'assets/css/[name].[hash].[ext]';
            }
          }
          if (assetInfo.names && assetInfo.names.some(name => name.match(/\.(png|jpe?g|gif|svg|webp)$/))) {
            return 'assets/images/[name].[hash].[ext]';
          }
          if (assetInfo.names && assetInfo.names.some(name => name.match(/\.(woff|woff2|eot|ttf|otf)$/))) {
            return 'assets/fonts/[name].[hash].[ext]';
          }
          return 'assets/[name].[hash].[ext]';
        },
      },
    },
    chunkSizeWarningLimit: 1000, // 提高警告阈值
  },
  server: {
    port: 3000,
    open: true,
    host: true,
  },
});