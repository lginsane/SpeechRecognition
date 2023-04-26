import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: "0.0.0.0",
    port: '8000',
    proxy: {
      '/api': {
        target: 'http://localhost:8090/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      },
      '/baidu': {
        target: 'http://vop.baidu.com/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/baidu/, '')
      }
    }
  },
});
