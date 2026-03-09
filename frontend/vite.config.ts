import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vite.dev/config/
export default defineConfig(() => {
  const isExtension = process.env.VITE_VSCODE_EXT === 'true';

  return {
    plugins: [
      vue(),
      ...(isExtension ? [viteSingleFile()] : []),
    ],
    server: {
      proxy: {
        // Proxy API requests to the local Hono server during development
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    build: {
      outDir: isExtension ? '../extension/vscode/dist-web' : 'dist',
      emptyOutDir: true,
    }
  }
})
