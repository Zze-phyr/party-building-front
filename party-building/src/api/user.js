import request from '@/utils/request'

// 注册接口
export const userRegister = (data) => request.post('/register', data)

// 登录接口
export const userLogin = (data) => request.post('/login', data)

//获取验证码接口
export const userVerification = (data) => request.get('/phoneVerify', data)
