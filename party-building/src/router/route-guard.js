// 路由守卫
import { getCommonRoutes, commonLayoutRoute } from './common-routes'
import { getAdminRoutes, adminLayoutRoute } from './admin-routes'
import { useUserStore } from '@/stores/modules/user'

export const setupRouteGuard = (router) => {
  router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore()
    const isPublic = to.meta.public

    // 公共路由直接放行
    if (isPublic) return next()

    // 未登录用户重定向到登录页
    if (!userStore.token) return next('/login')

    // 已登录但未添加动态路由
    if (!userStore.hasAddedRoutes) {
      try {
        const permissions = userStore.getPermission
        const primaryRole = permissions[0]
        const thirdRole = permissions[2]

        let dynamicRoutes = []
        let layoutRoute = null
        let redirectPath = ''

        // 根据一级角色选择路由结构
        if (primaryRole === 'Common') {
          // 添加用户布局路由
          layoutRoute = { ...commonLayoutRoute }
          router.addRoute(layoutRoute)

          // 获取用户子路由
          dynamicRoutes = getCommonRoutes(thirdRole)
          redirectPath = '/common/index'
        } else if (primaryRole === 'Admin') {
          // 添加管理员布局路由
          layoutRoute = { ...adminLayoutRoute }
          router.addRoute(layoutRoute)

          // 获取管理子路由
          dynamicRoutes = getAdminRoutes(thirdRole)

          redirectPath = '/admin/joinParty/reviewUpload'
        }
        // 未知身份异常处理
        if (dynamicRoutes.length === 0) {
          throw new Error(`未知角色: ${thirdRole}`)
        }
        // 添加动态子路由
        if (layoutRoute) {
          dynamicRoutes.forEach((route) => {
            router.addRoute(layoutRoute.name, route)
          })
        }

        // 添加404通配路由
        router.addRoute({
          path: '/:pathMatch(.*)*',
          redirect: '/404',
          meta: { public: true, hidden: true },
        })

        // 保存路由信息并标记已添加
        userStore.setDynamicRoutes(dynamicRoutes)
        userStore.setHasAddedRoutes(true)

        // 重定向到角色对应的首页
        return next({ path: redirectPath, replace: true })
      } catch (error) {
        console.error('路由加载失败:', error)
        // localStorage.setItem(
        //   'user',
        //   '{"token":"111","permission":["Common", "Student", "Applicant"],"userId":123,"name":"张三","hasAddedRoutes":false,"dynamicRoutes":[]}',
        // )
        userStore.logout()
        next('/login')
      }
    }

    // 检查路由权限
    const permissions = userStore.getPermission
    const thirdRole = permissions[2]
    const routeRoles = to.meta.roles

    // 检查是否无权限
    if (!routeRoles.includes(thirdRole)) {
      next('/404')
      return
    }

    // 其他情况正常放行
    next()
  })
}
