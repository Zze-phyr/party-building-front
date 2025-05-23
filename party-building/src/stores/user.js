import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore(
  'user', //该 store 的唯一标识
  () => {
    // 用户信息
    const token = ref('111')
    const permission = ref('Common')
    const status = ref('1')
    const userId = ref('张三')
    const hasAddedRoutes = ref(false) // 是否动态添加路由
    const dynamicRoutes = ref([]) // 存储动态路由信息

    // 操作
    //设置 token
    const login = (newToken, newPermission, newUserId, newStatus) => {
      token.value = newToken
      permission.value = newPermission
      userId.value = newUserId
      status.value = newStatus
      hasAddedRoutes.value = false // 重置路由状态
    }

    //用户注销或 token 过期时，需要重置所有与认证相关的状态
    const logout = () => {
      token.value = ''
      permission.value = ''
      userId.value = ''
      status.value = ''
      hasAddedRoutes.value = false
      dynamicRoutes.value = []
      window.location.reload() // 强制刷新重置路由
    }

    //获取status,计算属性默认只读
    const getStatus = computed(() => {
      return status.value
    })

    const setDynamicRoutes = (routes) => {
      dynamicRoutes.value = routes
    }
    const getDynamicRoutes = computed(() => {
      return dynamicRoutes.value
    })

    return {
      token,
      permission,
      status,
      userId,
      hasAddedRoutes,
      dynamicRoutes,
      login,
      logout,
      getStatus,
      setDynamicRoutes,
      getDynamicRoutes,
    }
  },
  // {
  //   // 配置项，启用数据持久化功能
  //   persist: true, // 启用持久化
  // },
)
