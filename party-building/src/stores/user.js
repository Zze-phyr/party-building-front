import { defineStore } from 'pinia'
import { ref } from 'vue'

// 创建了一个名为'user'的store
export const useUserStore = defineStore('user', () => {
  // 状态

  // 从localStorage中获取token
  const token = ref(localStorage.getItem('token') || '')
  // 标记路由是否已经加载
  const hasRoutes = ref(false)
  // 存储用户的角色信息
  const roles = ref([])

  // 操作

  // 接收新token，更新本地状态并存入localStorage
  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  // 清除token和localStorage中的值
  const resetToken = () => {
    token.value = ''
    localStorage.removeItem('token')
    hasRoutes.value = false
  }

  // 路由加载完成后设置为true
  const setHasRoutes = (value) => {
    hasRoutes.value = value
  }

  // // 模拟获取用户信息（实际需要对接API）
  // const getUserInfo = async () => {
  //   // 这里模拟API请求，实际开发需要替换为真实接口
  //   return new Promise(resolve => {
  //     setTimeout(() => {
  //       // 模拟返回用户角色（根据你的路由配置，角色应该是1-4的数字）
  //       const role = 4 // 这里可以根据实际登录用户返回
  //       roles.value = [role]
  //       resolve({ role })
  //     }, 500)
  //   })
  // }

  return {
    token,
    hasRoutes,
    roles,
    setToken,
    resetToken,
    setHasRoutes,
    // getUserInfo
  }
})
