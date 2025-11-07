// 通用接口
import request from '@/utils/network/request'

export const generalApi = {
  // 批量请求需要的文件元数据
  getFileMetadata: (data) => {
    return request.post('/general/file/getFileMetadata', data)
  },

  // 文件上传
  uploadFile(data) {
    return request.post(`/general/file/upload`, data);
  },

  // 根据id删除文件
  deleteFile: (params) => {
    return request.delete(`/general/file/delete/${params}`)
  },

  // 根据文件id下载文件
  downloadFile: (fileId) => {
    return request.get(`/general/file/download/${fileId}`, {
      responseType: 'blob', // 没有固定结构的二进制对象
    })
  },
}
