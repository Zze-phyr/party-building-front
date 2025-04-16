import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'

import Register from '@/views/register/user-register.vue'
import Login from '@/views/login/user-login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'register',
      path: '/register',
      component: Register,
    },
    {
      name: 'login',
      path: '/login',
      component: Login,
    },
    {
      path: '/',
      redirect: '/login', //子路由
    },
  ],
})

router.beforeEach((to) => {
  // 如果没有token, 且访问的是非登录页，拦截到登录，其他情况正常放行
  const useStore = useUserStore()
  if (!useStore.token && to.path !== '/login') return '/login'
})

export default router
