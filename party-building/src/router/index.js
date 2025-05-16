import { createRouter, createWebHistory } from 'vue-router'
// import { useUserStore } from '@/stores'

export const routes = [
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
    path: '/:pathMatch(.*)*',
    redirect: '/404',
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
    children: [
      {
        name: 'Index',
        path: 'index',
        component: () => import('@/views/indexPage/index-page.vue'),
        meta: {
          roles: ['Admin', 'Common'],
        },
      },
      {
        name: 'PartyProgress',
        path: 'partyProgress',
        component: () => import('@/views/partyProgress/party-progress.vue'),
        meta: {
          roles: ['Common'],
        },
      },
      {
        name: 'BranchFeature',
        path: 'branchFeature',
        component: () => import('@/views/branchFeature/branch-feature.vue'),
        meta: {
          roles: ['Common'],
        },
      },
      {
        name: ' MyOrg',
        path: 'myOrg',
        component: () => import('@/views/myOrganization/my-organization.vue'),
        meta: {
          roles: ['Common'],
        },
      },
      {
        name: 'PartyStudy',
        path: 'partyStudy',
        component: () => import('@/views/partyStudy/party-study.vue'),
        meta: {
          roles: ['Common'],
        },
      },
      {
        name: 'PersonalCenter',
        path: 'personalCenter',
        component: () => import('@/views/personalCenter/personal-center.vue'),
        meta: {
          roles: ['Common'],
        },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

//路由守卫
// router.beforeEach((to, from, next) => {
//   const userStore = useUserStore()
//   const isPublic = to.meta.public

//   //为公共路由，直接放行
//   if (isPublic) next()

//   //不为公共路由且未登录
//   if (!userStore.token) next('/login')

//   //已登录
//   const userRole = userStore.permission
//   const requiredRoles = to.meta.roles
//   if (requiredRoles.includes(userRole)) {
//     next()
//   } else {
//     next('/404')
//   }
// })

export default router
