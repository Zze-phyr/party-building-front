import { generalApi } from '@/api/general'
import { ElMessage } from 'element-plus'

export const getFileMetadata = async (fileMetadataRequestParams, fileMetadata) => {
  const { data: fileTemplateGetData } = await generalApi.getFileMetadata(fileMetadataRequestParams)
  if (fileTemplateGetData.code === 1) {
    if (fileTemplateGetData.data.length > 0) {
      Object.assign(fileMetadata, fileTemplateGetData.data[0])
    }
  } else {
    ElMessage.error(fileTemplateGetData.msg)
  }
}
