// 公共路由
// 单一功能模块，default默认导出该数组。外部引用时无需使用花括号，可直接引用并自定义命名
export default [
  {
    path: '/',
    redirect: '/login',
    meta: {
      public: true, // 为公共路由,不需要登录即可访问
      hidden: true, // 不在导航栏中显示
    },
  },
  {
    name: 'Login',
    path: '/login',
    component: () => import('@/views/public/login/login-page.vue'),
    meta: {
      public: true,
      hidden: true,
    },
  },
  {
    name: 'Register',
    path: '/register',
    component: () => import('@/views/public/register/user-register.vue'),
    meta: {
      public: true,
      hidden: true,
    },
  },
  {
    name: '404',
    path: '/404',
    component: () => import('@/views/public/404/404-page.vue'),
    meta: {
      public: true,
      hidden: true,
    },
  },
]
