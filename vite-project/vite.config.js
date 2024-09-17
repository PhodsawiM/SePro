import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// https://vitejs.dev/config/
export default defineConfig({
  server:{
    https:{
      key:"./babu-privateKey.key",
      cert:"./babu.crt"
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Mongo Url
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  plugins: [react()],
})
