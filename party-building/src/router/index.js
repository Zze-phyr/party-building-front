// 路由主路口
import { createRouter, createWebHistory } from 'vue-router'
import publicRoutes from './public-routes'
import { setupRouteGuard } from './route-guard'
const router = createRouter({
  history: createWebHistory(),
  routes: publicRoutes,
})

// 设置路由守卫
setupRouteGuard(router)

export default router
