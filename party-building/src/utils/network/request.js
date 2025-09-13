import axios from 'axios'
import { ElMessage } from 'element-plus'
// import router from '@/router'
import { useUserStore } from '@/stores/index'
// TODO：IP地址不要放在这里，建议建立一个.env文件，然后把各个环境的配置放在这里
// 1、.env.development 开发环境
// 2、.env.production 生产环境
// 3、.env.test 测试环境
// const baseURL = 'http://172.20.10.4:8080'

// TODO： 建议在弄一个适配fetch的请求，保证流式文件的下载问题
// 具体的方案是：
//  const service = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL,
//   timeout: 10000,
//   adapter: fetchAdapter, 
// })
const instance = axios.create({
  //基础地址
  baseURL: '/api',
  //超时时间
  timeout: 1000,
})

// 请求拦截器
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

// 响应拦截器
instance.interceptors.response.use(
  //res相关数据信息
  (res) => {
    //二进制文件直接通过
    if (res.config.responseType === 'blob') {
      return res
    }

    if (res.data.code === 1) {
      return res
    }

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
