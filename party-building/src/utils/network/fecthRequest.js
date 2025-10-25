import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { useUserStore } from '@/stores/index'

const instance = axios.create({
  baseURL: '/api',
  timeout: 5000,
  adapter: fetchAdapter,
})

const fetchAdapter = async (config) => {
  const response = await fetch(
    config.url,
    {
      method: config.method,
      body: config.data,
      headers: config.headers,
    }
  )
  const data = await response.json()
  console.log(data)
  return {
    data,
    status: response.status,
    statusText: response.statusText,
  }
}

instance.interceptors.request.use(
  (config) => {
    // 添加token
    const userStore = useUserStore()
    //要等Pinia实例尚被挂载到 Vue 应用之后使用 Pinia Store，所以必须在拦截器里面定义
    if (userStore.token) {
      config.headers['Authorization'] = userStore.token
    }
    return config
  },
  (err) => Promise.reject(err),
)

instance.interceptors.response.use(
  //res相关数据信息
  (res) => {
    //二进制文件直接通过
    if (res.config.responseType === 'blob') {
      return res
    }

    if (res.data.code === 1) {
      return res
    } else {
      return res
    }
  },
  (err) => {
    //处理401错误
    console.log(err)
    console.log(err.data.msg)

    if (err.response.status === 401) {
      const userStore = useUserStore()
      userStore.logout()
      router.push({ name: 'Login' })
      ElMessage.warning('身份验证失败，请重新登录')
    } else {
      ElMessage.error(err.response?.data?.message || '网络请求失败')
    }

    return Promise.reject(err)
  },
)

export default instance
