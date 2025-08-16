// 用户权限状态
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useInfoStore } from '@/stores'
import Cookies from 'js-cookie'

export const useUserStore = defineStore(
  'user', //该 store 的唯一标识
  () => {
    // 认证状态
    const token = ref('Bearer 111')
    const permission = ref(['Common', 'Applicant', 'DevelopmentOver'])
    // const permission = ref(['Admin', 'Administrator'])
    const userId = ref(null)
    const hasAddedRoutes = ref(false) // 是否动态添加路由
    const dynamicRoutes = ref([]) // 存储动态路由信息
    // 用户infoStore引用
    const infoStore = useInfoStore()

    //登录成功
    const login = (userData) => {
      token.value = userData.token
      permission.value = userData.permission
      userId.value = userData.userId
      infoStore.userInfo.name = userData.username
      infoStore.hasGetInfo = false
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

    // 获取用户权限
    const getPermission = computed(() => permission.value)

    // 动态路由
    const setDynamicRoutes = (routes) => {
      dynamicRoutes.value = routes
    }

    // 标记路由已添加
    const setHasAddedRoutes = (status) => {
      hasAddedRoutes.value = status
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
      setHasAddedRoutes,
    }
  },
  {
    // 配置项，启用数据持久化功能
    persist: {
      storage: {
        // cookie存储需指定操作方法
        getItem: (key) => Cookies.get(key),
        setItem: (key, value) =>
          Cookies.set(key, value, {
            expires: 7, // 7天后过期
          }),
        removeItem: (key) => Cookies.remove(key),
      },
      paths: ['token'],
    },
  },
)
