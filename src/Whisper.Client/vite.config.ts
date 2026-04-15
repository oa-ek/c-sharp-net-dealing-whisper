import path from "path"
import { defineConfig, loadEnv } from 'vite' // Додаємо loadEnv
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from "@tailwindcss/vite"
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      tailwindcss(),
      mode === 'development' ? basicSsl() : []
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host: true,
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'https://localhost:7055',
          changeOrigin: true,
          secure: false,
        },
        '/ws': {
          target: env.VITE_API_URL || 'https://localhost:7055',
          ws: true,
          secure: false,
        },
      },
    }
  }
})