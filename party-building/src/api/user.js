import request from '@/utils/request'

// 注册接口
export const userRegister = (data) => {
  return request.post('/public/register', data)
}

// 手机验证码登录接口
export const userPhoneLogin = (data) => {
  return request.post('/public/login/phone', data)
}

// 账号密码登录接口
export const userNumberLogin = (data) => {
  return request.post('/public/login/number', data)
}

//获取验证码接口
export const userVerification = (params) => {
  return request.get('/public/phoneVerify', { params })
}

//文件上传
export const fileUpload = (data) => {
  return request.post('/general/file/upload', data)
}

//获取个人信息
export const getCommonUserDetail = (userId) => {
  return request.get(`/common/getCommonUserDetail/${userId}`)
}

//修改个人信息
export const reviseCommonUserDetail = (data) => {
  return request.post('/common/revise', data)
}
