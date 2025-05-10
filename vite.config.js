import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  // 1️⃣ This is the only base your code ever sees:
  const API_BASE_URL = env.VITE_API_BASE_URL    // always "/api"

  // 2️⃣ Only in dev, proxy /api to your real backend:
  const shouldProxy = command === 'serve'
  const devTarget   = env.VITE_DEV_BACKEND_URL  // e.g. "http://localhost:8000"

  return {
    plugins: [vue()],
    resolve: {
      alias: { '@': path.resolve(__dirname, 'src') }
    },

    // 3️⃣ Dev-only proxy
    server: shouldProxy
      ? {
          proxy: {
            [API_BASE_URL]: {
              target: devTarget,
              changeOrigin: true,
              rewrite: p => p.replace(new RegExp(`^${API_BASE_URL}`), '')
            }
          }
        }
      : undefined,

    // 4️⃣ Bake "/api" into your client bundle
    define: {
      __API_BASE_URL__: JSON.stringify(API_BASE_URL)
    },

    build: { target: 'esnext' },
    esbuild: { target: 'esnext' }
  }
})
