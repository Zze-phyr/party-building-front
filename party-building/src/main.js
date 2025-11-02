import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores/index'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import '@/assets/main.scss'
import '@/assets/iconfont/iconfont.css'

const customZhCn = {
  ...zhCn,
  el: {
    ...zhCn.el,
    pagination: {
      goto: '前往',
      pagesize: '条/页',
      total: '共 {total} 条',
      pageClassifier: '页',
      page: '页',
      prev: '上一页',
      next: '下一页',
      currentPage: '第 {pager} 页',
      prevPages: '向前 {pager} 页',
      nextPages: '向后 {pager} 页',
      deprecationWarning: '你使用了一些已被废弃的用法，请参考 el-pagination 的官方文档'
    }
  }
}

// 创建app
const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(ElementPlus, {
  locale: customZhCn
})
// 挂载app
app.mount('#app')
