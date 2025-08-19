// 管理员接口
import request from '@/utils/request'

//查看批次
export const getBatch = () => {
  return request.get(`/admin/batch/get`)
}
