import { createRouter, createWebHistory } from 'vue-router'

import Register from '@/views/register/user-register.vue'
import Login1 from '@/views/login/user-login1.vue'
import Login2 from '@/views/login/user-login2.vue'
// import Layout from '@/views/layout/top-index.vue'

// 基础公共路由（所有角色可见）
export const constantRoutes = [
  {
    name: 'register',
    path: '/register',
    component: Register,
    hidden: true,
  },
  {
    name: 'login1',
    path: '/login1',
    component: Login1,
    hidden: true,
  },
  {
    name: 'login2',
    path: '/login2',
    component: Login2,
    hidden: true,
  },
  {
    path: '/',
    redirect: '/login1',
  },
  // {
  //   path: '/404',
  //   component: () => import('@/views/404.vue'),
  //   hidden: true,
  // },
]

// 动态路由（根据权限动态加载）
export const asyncRoutes = [
  // {
  //   path: '/dashboard',
  //   component: Layout,
  //   children: [
  //     {
  //       path: '',
  //       component: Layout,
  //       meta: { title: '仪表盘', icon: 'dashboard', roles: [1, 2, 3, 4] },
  //     },
  //   ],
  // },
  // {
  //   path: '/user',
  //   component: Layout,
  //   meta: { title: '用户管理', icon: 'user', roles: [2, 3, 4] },
  //   children: [
  //     {
  //       path: 'list',
  //       component: () => import('@/views/user/List.vue'),
  //       meta: { title: '用户列表', roles: [2, 3, 4] },
  //     },
  //     {
  //       path: 'permission',
  //       component: () => import('@/views/user/Permission.vue'),
  //       meta: { title: '权限配置', roles: [4] }, // 仅超超管可见
  //     },
  //   ],
  // },
  // // 添加404通配符路由，确保放在最后
  // {
  //   path: '/:pathMatch(.*)*',
  //   redirect: '/404',
  //   hidden: true,
  // },
]

const router = createRouter({
  //???//
  // import.meta.env.BASE_URL
  // // vite.config.js
  // export default defineConfig({
  //   base: '/admin/'  // 部署在子路径时
  //取什么名字比较好
  // })
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
})

// router.beforeEach((to) => {
//   // 如果没有token, 且访问的是非登录页，拦截到登录，其他情况正常放行
//   const token = localStorage.getItem('party_token')
//   if (!token && to.path !== '/login') return '/login'
// })

export default router
