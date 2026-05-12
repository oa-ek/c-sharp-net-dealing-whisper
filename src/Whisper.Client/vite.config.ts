import path from "path"
import { defineConfig, loadEnv } from 'vite' 
import fs from "fs"
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from "@tailwindcss/vite"
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  
  const certPath = '/home/chicago/fedora.tailfdec14.ts.net.crt';
  const keyPath = '/home/chicago/fedora.tailfdec14.ts.net.key';

  const hasCerts = fs.existsSync(certPath) && fs.existsSync(keyPath);

  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      tailwindcss(),
      (!hasCerts && mode === 'development') ? basicSsl() : []
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host: 'fedora.tailfdec14.ts.net',
      port: 5173,
      https: hasCerts ? {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
      } : (mode === 'development'),
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'https://fedora.tailfdec14.ts.net:7055',
          changeOrigin: true,
          secure: false,
        },
        '/ws': {
          target: env.VITE_API_URL || 'https://fedora.tailfdec14.ts.net:7055',
          ws: true,
          secure: false,
        },
      },
    }
  }
})