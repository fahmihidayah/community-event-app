import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

export default defineConfig({
  plugins: [
    tsconfigPaths(), // Membaca alias dari tsconfig.json otomatis
    react()          // Dibutuhkan jika nanti ada test komponen React
  ],
  test: {
    globals: true,
    // Gunakan 'node' untuk testing action/logic backend
    // Gunakan 'jsdom' jika mayoritas testing adalah komponen UI
    environment: 'node', 
    include: [
      '**/*.{test,spec}.{ts,tsx}', // Mencakup semua file test
      'tests/int/**/*.int.spec.ts' 
    ],
    setupFiles: ['./src/test/setup.ts'], // Pastikan file ini ada
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})