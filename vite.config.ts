import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  base: '/card-game/',
  plugins: [tsconfigPaths()],
  build: {
    outDir: 'docs',
  },
})
