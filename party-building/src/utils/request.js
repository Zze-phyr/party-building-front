import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'
const baseURL = ''

const instance = axios.create({
  //基础地址
  baseURL,
  //超时时间
  timeout: 10000,
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // token
    const token = localStorage.getItem('party_token')
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  (err) => Promise.reject(err),
)

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    if (res.data.code === 1) {
      return res
    }
    //对接口异常，需要给用户提示
    if (res.data.code === 0) {
      ElMessage.warning(res.data.message)
    }
    //token过期
    if (res.data.code === -1) {
      localStorage.removeItem('party_token')
      window.location.href = window.location.origin
    }
  },
  (err) => {
    //处理401错误
    // 错误的特殊情况 => 401 权限不足 或 token 过期 => 拦截到登录
    if (err.response?.status === 401) {
      router.push('/login1')
    }

    // 错误的默认情况 => 只要给提示
    ElMessage.error(err.response.data.message || '服务异常')
    return Promise.reject(err)
  },
)

export default instance
export { baseURL }
