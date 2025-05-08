import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.{test,spec}.{js,ts}'],
    build: {
      sourceMap: true
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.{test,spec}.{js,ts}',
        '**/setup.js'
      ],
      include: [
        'src/**/*.{js,vue}'
      ],
      reportsDirectory: './coverage',
      lines: 80,
      branches: 80,
      functions: 80,
      statements: 80
    },
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})