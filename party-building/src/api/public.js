// 公开接口
import request from '@/utils/network/request'

export const publicApi = {
  // 注册接口
  register: (data) => {
    return request.post('/public/register', data)
  },
  // 手机验证码登录接口
  loginByPhone: (data) => {
    return request.post('/public/login/phone', data)
  },
  // 账号密码登录接口
  loginByNumber: (data) => {
    return request.post('/public/login/number', data)
  },
  //获取验证码接口
  getVerification: (params) => {
    return request.get('/public/phoneVerify', { params })
  },
}
