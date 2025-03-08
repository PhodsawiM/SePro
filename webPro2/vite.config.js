import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    https:{
      key:"D:/WebDev_main_final/web_font_main2/nodeBack/my.key",
      cert:"D:/WebDev_main_final/web_font_main2/nodeBack/my.cert"
    },
    
    // proxy: {
    //   '/api': {
    //     target: [`169.254.221.159:5173`,`localhost:5000`,`169.254.221.159:5000`],
    //     changeOrigin: true,
    //     secure: false
    //     // rewrite: (path) => path.replace(/^\/api/, ''),
    //   },
    // },
  },
  plugins: [react()],
})



