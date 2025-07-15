// 公共路由
// 单一功能模块，default默认导出该数组。外部引用时无需使用花括号，可直接引用并自定义命名
export default [
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
]
