// 用户权限状态
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useInfoStore } from '@/stores'

export const useUserStore = defineStore(
  'user', //该 store 的唯一标识
  () => {
    // 认证状态
    const token = ref('111')
    const permission = ref(['Common', 'Applicant', 'DevelopmentOver'])
    const userId = ref(null)
    const hasAddedRoutes = ref(false) // 是否动态添加路由
    const dynamicRoutes = ref([]) // 存储动态路由信息
    // 用户infoStore引用
    const infoStore = useInfoStore()

    // 操作
    //登录成功
    const login = (newToken, newPermission, newUserId, newName) => {
      token.value = newToken
      permission.value = newPermission
      userId.value = newUserId
      infoStore.userInfo.name = newName
      hasAddedRoutes.value = false // 重置路由状态
    }

    //用户注销或 token 过期时，需要重置所有与认证相关的状态
    const logout = () => {
      token.value = ''
      permission.value = []
      userId.value = null
      hasAddedRoutes.value = false
      dynamicRoutes.value = []
      infoStore.hasGetInfo = false
      window.location.reload() // 强制刷新重置路由
    }

    //响应式获取permission
    const getPermission = computed(() => {
      return permission.value
    })

    // 动态路由
    const setDynamicRoutes = (routes) => {
      dynamicRoutes.value = routes
    }

    const getDynamicRoutes = computed(() => {
      return dynamicRoutes.value
    })

    return {
      token,
      permission,
      userId,
      hasAddedRoutes,
      dynamicRoutes,
      login,
      logout,
      setDynamicRoutes,
      getDynamicRoutes,
      getPermission,
    }
  },
  // {
  //   // 配置项，启用数据持久化功能
  //   persist: { paths: ['token', 'permission'] },
  // },
)
