import path from "path"
import { defineConfig, loadEnv } from 'vite' 
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from "@tailwindcss/vite"
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  const backendTarget = env.VITE_API_URL || 'https://localhost:7055';

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
      host: '127.0.0.1', 
      port: 5173,
      allowedHosts: ['.whisper-secure.space', 'whisper-secure.space'],
      https: true, 
      
      proxy: {
        '/api': {
          target: backendTarget,
          changeOrigin: true,
          secure: false, 
        },
        '/ws': {
          target: backendTarget,
          ws: true,
          secure: false,
        },
      },
    }
  }
})