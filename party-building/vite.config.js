import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    // 配置路径别名
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      components: fileURLToPath(new URL('./src/components', import.meta.url)),
    },
  },
  server: {
    proxy: {
      // 代理规则1：匹配 /api 开头的请求
      '/api': {
        target: 'http://192.168.81.251:8080', // 后端真实地址
        changeOrigin: true, // 修改请求头中的 Origin 为目标地址
        rewrite: (path) => path.replace(/^\/api/, ''), // 移除路径中的 /api 前缀
      },
      // 代理规则2：匹配 /socket 开头的 WebSocket
      // '/socket': {
      //   target: 'ws://10.100.153.239:8081',
      //   ws: true, // 启用 WebSocket 代理
      // },
    },
  },
})
