import axios from 'axios'
import { ElMessage } from 'element-plus'
// import router from '@/router'
import { useUserStore } from '@/stores/index'

// const baseURL = 'http://172.20.10.4:8080'

const instance = axios.create({
  //基础地址
  baseURL: '/api',
  //超时时间
  timeout: 60000,
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 添加token
    const userStore = useUserStore()
    //要等Pinia实例尚被挂载到 Vue 应用之后使用 Pinia Store，所以必须在拦截器里面定义
    if (userStore.token) {
      config.headers['token'] = userStore.token
    }
    return config
  },
  (err) => Promise.reject(err),
)

// 响应拦截器
instance.interceptors.response.use(
  //res相关数据信息
  (res) => {
    if (res.data.code === 1) {
      return res
    }
    //对接口异常，需要给用户提示
    if (res.data.code === 0) {
      ElMessage.warning(res.data.message)
      return Promise.reject(res.data) // 阻止后续链式调用
    }
  },
  (err) => {
    //处理401错误
    console.log(err)
    // console.log(err.data.msg)

    // if (err.response.status === 401) {
    //   const userStore = useUserStore()
    //   userStore.logout()
    //   router.push({ name: 'Login' })
    //   ElMessage.warning('身份验证失败，请重新登录')
    // } else {
    //   ElMessage.error(err.response?.data?.message || '网络请求失败')
    // }

    return Promise.reject(err)
  },
)

export default instance
