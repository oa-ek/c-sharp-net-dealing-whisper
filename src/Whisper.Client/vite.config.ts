import path from "path"
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss()
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
        target: 'http://26.205.72.169:5055',
        changeOrigin: true,
        secure: false,
      },
      '/ws': {
        target: 'http://26.205.72.169:5055',
        ws: true, // Підтримка WebSockets для SignalR
        secure: false,
      },
    },
  }
})