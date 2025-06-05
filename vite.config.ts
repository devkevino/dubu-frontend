import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Whether to polyfill specific globals.
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      // Whether to polyfill Node.js built-in modules.
      protocolImports: true,
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: [
      '@web3auth/modal',
      '@web3auth/base',
      '@web3auth/openlogin-adapter',
      '@web3auth/ethereum-provider',
      'web3',
    ],
    exclude: ['@web3auth/torus-wallet-connector'],
  },
  build: {
    rollupOptions: {
      external: [],
    },
  },
})