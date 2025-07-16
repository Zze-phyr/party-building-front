// 路由主路口
import { createRouter, createWebHistory } from 'vue-router'
import publicRoutes from './public-routes'
import { setupRouteGuard } from './route-guard'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes: publicRoutes,
})

// 设置路由守卫
const userStore = useUserStore()
setupRouteGuard(router, userStore)

export default router
