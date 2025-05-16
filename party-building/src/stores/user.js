import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user', //该 store 的唯一标识
  () => {
    // 用户信息
    const token = ref('')
    const permission = ref('Common')
    const status = ref('')
    const userId = ref('')

    // 操作
    //设置 token
    const login = (newToken, newPermission, newUserId, newStatus) => {
      token.value = newToken
      permission.value = newPermission
      userId.value = newUserId
      status.value = newStatus
    }

    //用户注销或 token 过期时，需要重置所有与认证相关的状态
    const logout = () => {
      token.value = ''
      permission.value = ''
      userId.value = ''
      status.value = ''
    }

    // const login = (userToken, userRole) => {
    //   token.value = userToken
    //   role.value = userRole
    //   localStorage.setItem('token', userToken)
    //   localStorage.setItem('role', userRole)
    // }

    // const logout = () => {
    //   token.value = ''
    //   role.value = 'user'
    //   localStorage.clear()
    // }

    return {
      token,
      permission,
      login,
      logout,
    }
  },
  {
    // 配置项，启用数据持久化功能
    persist: true, // 启用持久化
  },
)
