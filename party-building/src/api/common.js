// 用户接口

import request from '@/utils/request'

//获取个人信息
export const getCommonUserDetail = (userId) => {
  return request.get(`/common/getCommonUserDetail/${userId}`)
}

//修改个人信息
export const reviseCommonUserDetail = (data) => {
  return request.post('/common/revise', data)
}

//新增培养联系人
export const addNurtureContacts = (data) => {
  return request.post('/common/nurtureContacts/add', data)
}
