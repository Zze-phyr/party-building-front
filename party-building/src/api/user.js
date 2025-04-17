import request from '@/utils/request'

// 注册接口
export const userRegister = (data) => {
  return request.post('/register', data)
}

// 手机验证码登录接口
export const userPhoneLogin = (data) => {
  return request.post('/login/phone', data)
}

// 账号密码登录接口
export const userNumberLogin = (data) => {
  return request.post('/login/number', data)
}

//获取验证码接口
export const userVerification = (params) => {
  return request.get('/phoneVerify', { params })
}
