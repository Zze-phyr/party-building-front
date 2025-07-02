import request from '@/utils/request'

// 批量请求需要的文件元数据
export const getFileMetadata = (data) => {
  return request.post('/general/file/getFileMetadata', data)
}

//文件上传
export const fileUpload = (data) => {
  return request.post('/general/file/upload', data)
}
