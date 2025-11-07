import { generalApi } from '@/api/general'
import { ElMessage } from 'element-plus'

/**
 * 获取文件元数据信息
 * @param {Object} fileMetadataRequestParams - 请求文件元数据的参数
 * @param {Object} fileMetadata - 用于存储文件元数据的响应式对象
 */
export const getFileMetadata = async (fileMetadataRequestParams, fileMetadata) => {
  // 发送请求获取文件元数据
  const { data: fileTemplateGetData } = await generalApi.getFileMetadata(fileMetadataRequestParams)
  // 判断请求是否成功
  if (fileTemplateGetData.code === 1) {
    // 当有数据时，将第一个数据赋值给fileMetadata
    if (fileTemplateGetData.data.length > 0) {
      fileMetadata.value = fileTemplateGetData.data[0]
    }
  } else {
    // 请求失败时显示错误消息
    ElMessage.error(fileTemplateGetData.msg)
  }
}
