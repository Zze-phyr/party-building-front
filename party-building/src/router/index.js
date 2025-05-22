import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'

export const staticRoutes = [
  {
    path: '/',
    redirect: '/login',
    meta: {
      public: true, // 为公共路由
      hidden: true, // 不在菜单显示
    },
  },
  {
    name: 'Login',
    path: '/login',
    component: () => import('@/views/login/login-page.vue'),
    meta: {
      public: true, // 为公共路由
      hidden: true, // 不在菜单显示
    },
  },
  {
    name: 'Register',
    path: '/register',
    component: () => import('@/views/register/user-register.vue'),
    meta: {
      public: true, // 为公共路由,不需要登录即可访问
      hidden: true, // 不在菜单显示
    },
  },
  {
    name: '404',
    path: '/404',
    component: () => import('@/views/404/404-page.vue'),
    meta: {
      public: true, // 为公共路由
      hidden: true, // 不在菜单显示
    },
  },
  {
    name: 'Layout',
    path: '/layout',
    component: () => import('@/views/layout/layout-page.vue'),
    redirect: '/layout/index',
    children: [],
  },
]

//dynamicRoutes不导出,仅在路由守卫内部使用，保证路由配置的安全性和封装性。
const dynamicRoutes = [
  {
    name: 'Index',
    path: 'index',
    component: () => import('@/views/indexPage/index-page.vue'),
    meta: {
      roles: ['Admin', 'Common'],
      title: '首页',
    },
  },
  {
    name: 'PartyProgress',
    path: 'partyProgress',
    component: () => import('@/views/partyProgress/party-progress.vue'),
    meta: {
      roles: ['Admin', 'Common'],
      title: '入党进度',
    },
  },
  {
    name: 'MyOrg',
    path: 'myOrg',
    component: () => import('@/views/myOrganization/my-organization.vue'),
    meta: {
      roles: ['Common'],
      title: '我的组织',
    },
  },
  {
    name: 'PartyStudy',
    path: 'partyStudy',
    component: () => import('@/views/partyStudy/party-study.vue'),
    meta: {
      roles: ['Common'],
      title: '党建学习',
    },
  },
  {
    name: 'PersonalCenter',
    path: 'personalCenter',
    component: () => import('@/views/personalCenter/personal-center.vue'),
    meta: {
      roles: ['Common'],
      title: '个人中心',
      hidden: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: staticRoutes,
})

//路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const isPublic = to.meta.public

  //为公共路由，直接放行
  if (isPublic) return next()

  //不为公共路由且未登录
  if (!userStore.token) return next('/login')

  if (!userStore.hasAddedRoutes) {
    try {
      // 根据角色过滤动态路由
      const userRole = userStore.permission
      const allowedRoutes = dynamicRoutes.filter((route) => route.meta.roles.includes(userRole))
      // 添加动态路由
      allowedRoutes.forEach((route) => {
        router.addRoute('Layout', route)
      })
      router.addRoute({
        path: '/:pathMatch(.*)*',
        redirect: '/404',
        meta: { public: true, hidden: true },
      })
      // 存储动态路由信息用于生成菜单
      userStore.setDynamicRoutes(allowedRoutes)
      userStore.hasAddedRoutes = true
      console.log(11)
      console.log(userStore.getDynamicRoutes)
      // 处理可能存在的重复导航
      next(to.fullPath)
    } catch (error) {
      console.error('路由加载失败:', error)
      next('/404')
    }
  } else {
    console.log(22)

    next()
  }
})

export default router
