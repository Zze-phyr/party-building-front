import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores/index'
import '@/assets/main.scss'

// 创建app
const app = createApp(App)
app.use(pinia)
app.use(router)
// 挂载app
app.mount('#app')
