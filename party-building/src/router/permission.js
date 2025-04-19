import router from './index'
import { useUserStore } from '@/stores/user'
import asyncRoutes from './index'

// 路由过滤函数
function filterAsyncRoutes(routes, role) {
  const res = []
  routes.forEach((route) => {
    const tmp = { ...route }
    if (hasPermission(role, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, role)
      }
      res.push(tmp)
    }
  })
  return res
}

// 权限校验函数
function hasPermission(role, route) {
  // 检测路由对象是否存在 meta.roles 元数据
  if (route.meta?.roles) {
    return route.meta.roles.includes(role)
  }
  //路由对象不存在 meta.roles 元数据，则允许所有角色访问
  return true
}

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // // 设置页面标题
  // if (to.meta.title) {
  //   document.title = `${to.meta.title} - 系统名称`
  // }

  // 1. 已登录状态
  if (userStore.token) {
    // 首次登录需要动态加载路由
    if (!userStore.hasRoutes) {
      try {
        // 获取用户角色
        const { role } = await userStore.getUserInfo()

        // 过滤动态路由
        const accessedRoutes = filterAsyncRoutes(asyncRoutes, role)

        // 动态添加路由
        accessedRoutes.forEach((route) => {
          router.addRoute(route)
        })

        // 标记已加载路由
        userStore.setHasRoutes(true)

        // 重定向到目标路由
        next({ ...to, replace: true })
      } catch {
        // 如果获取用户信息失败，清除token并跳转到登录页
        userStore.resetToken()
        next(`/login?redirect=${to.path}`)
      }
    } else {
      next()
    }
  }
  // 2. 未登录状态
  else {
    // 白名单中的路由直接放行
    if (to.path === '/login') {
      next()
    }
  }
})
