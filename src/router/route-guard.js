// 路由守卫
import { getCommonRoutes, commonLayoutRoute } from './common-routes'
import { getAdminRoutes, adminLayoutRoute } from './admin-routes'
import { useUserStore } from '@/stores/modules/user'
import { EPermission } from '@/types/constants/auth'

export const setupRouteGuard = (router) => {
  console.log('路由守卫初始化')

  router.beforeEach(async (to, from, next) => {
    console.log('路由守卫触发 ->', to.path, 'from:', from.path)
    const userStore = useUserStore()
    const isPublic = to.meta.public

    // 公共路由直接放行
    if (isPublic) {
      return next()
    }

    // 未登录用户重定向到登录页
    if (!userStore.token) {
      return next('/login')
    }

    try {
      // 获取用户权限
      const permissions = userStore.getPermission
      if (!permissions || permissions.length === 0) {
        console.error('权限信息为空')
        userStore.logout()
        return next('/login')
      }

      const primaryRole = permissions[0]
      const thirdRole = permissions[2]

      let dynamicRoutes = []
      let layoutRoute = null
      let redirectPath = ''
      let layoutName = ''

      // 根据一级角色选择路由结构
      if (primaryRole === EPermission.COMMON) {
        layoutName = 'CommonLayout'
        layoutRoute = { ...commonLayoutRoute }
        dynamicRoutes = getCommonRoutes(thirdRole)
        redirectPath = '/common/index'
      } else if (primaryRole === EPermission.ADMIN) {
        layoutName = 'AdminLayout'
        layoutRoute = { ...adminLayoutRoute }
        dynamicRoutes = getAdminRoutes(thirdRole)
        redirectPath = '/admin/joinParty/reviewUpload'
      }

      // 检查路由是否已添加（通过检查布局路由是否存在）
      const routeExists = router.hasRoute(layoutName)

      if (!routeExists && layoutRoute && dynamicRoutes.length > 0) {
        console.log('添加动态路由...')

        // 添加布局路由
        router.addRoute(layoutRoute)

        // 添加动态子路由
        dynamicRoutes.forEach((route) => {
          router.addRoute(layoutName, route)
        })

        // 添加404通配路由（必须在最后）
        router.addRoute({
          path: '/:pathMatch(.*)*',
          redirect: '/404',
          meta: { public: true, hidden: true },
        })

        // 保存路由信息到store
        userStore.setDynamicRoutes(dynamicRoutes)
        userStore.setHasAddedRoutes(true)

        console.log('动态路由添加完成，重新导航到:', to.fullPath)

        // 关键：重新导航到目标路由
        return next({ ...to, replace: true })
      }

      // 如果路由已存在但 store 状态未更新（刷新后的情况）
      if (routeExists && !userStore.hasAddedRoutes) {
        userStore.setHasAddedRoutes(true)
        if (dynamicRoutes.length > 0) {
          userStore.setDynamicRoutes(dynamicRoutes)
        }
      }

      // 正常放行
      next()

    } catch (error) {
      console.error('路由守卫错误:', error)
      userStore.logout()
      next('/login')
    }
  })
}
