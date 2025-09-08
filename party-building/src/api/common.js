// 用户接口

import request from '@/utils/request'

//获取个人信息
export const getCommonUserDetail = () => {
  return request.get('/common/self/getCommonUserDetail')
}

//修改个人信息
export const reviseCommonUserDetail = (data) => {
  return request.post('/common/self/revise', data)
}

//新增培养联系人
export const addNurtureContacts = (data) => {
  return request.post('/common/nurtureContacts/add', data)
}

// 根据用户id获取培养联系人
export const getNurtureContacts = (commonUserId) => {
  return request.get(`/common/nurtureContacts/getByCommonId/${commonUserId}`)
}

// 修改培养联系人
export const updateNurtureContacts = (data) => {
  return request.put('/common/nurtureContacts/update', data)
}
