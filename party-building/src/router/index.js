import { createRouter, createWebHistory } from 'vue-router'

import Register from '@/views/register/user-register.vue'
import Login1 from '@/views/login/user-login1.vue'
import Login2 from '@/views/login/user-login2.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'register',
      path: '/register',
      component: Register,
    },
    {
      name: 'login1',
      path: '/login1',
      component: Login1,
    },
    {
      name: 'login2',
      path: '/login2',
      component: Login2,
    },
    {
      path: '/',
      redirect: '/login1',
    },
  ],
})

// router.beforeEach((to) => {
//   // 如果没有token, 且访问的是非登录页，拦截到登录，其他情况正常放行
//   const token = localStorage.getItem('party_tocken')
//   if (!token && to.path !== '/login') return '/login'
// })

export default router
