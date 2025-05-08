import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig(({ mode }) => {
  // 1) load the right .env file for this mode
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    plugins: [vue()],
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') }
    },
    server: {
      port: 3000,
      proxy: {
        // 2) proxy /api to whatever VITE_API_BASE_URL is
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: p => p.replace(/^\/api/, '')
        }
      }
    },
    define: {
      // 3) make it easy to import in code if you like
      __API_BASE_URL__: JSON.stringify(env.VITE_API_BASE_URL)
    }
  }
})
