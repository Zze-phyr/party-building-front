// 管理员接口
import request from '@/utils/request'

export const adminApi = {
  //查看批次
  getBatch: (data) => {
    return request.get('/admin/batch/get', data)
  },
}
