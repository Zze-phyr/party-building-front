import request from '@/utils/request'

// 注册接口
export const userRegister = (data) => {
  return request.post('/register', data)
}

// 登录接口
export const userLogin = (data) => {
  return request.post('/login', data)
}
//获取验证码接口
export const userVerification = (data) => {
  return request.get('/phoneVerify', {
    params: data,
  })
}
