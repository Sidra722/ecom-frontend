import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Local dev: set VITE_API_BASE_URL=/api and VITE_BACKEND_URL to your Express port.
// Production builds ignore this proxy; use VITE_API_BASE_URL pointing at App Service (see AZURE_DEPLOYMENT.md).
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL || 'http://localhost:5000',
          changeOrigin: true,
        },
      },
    },
  };
});
