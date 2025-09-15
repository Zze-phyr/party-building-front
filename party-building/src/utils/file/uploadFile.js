import { ElMessage } from 'element-plus'
import { generalApi } from '@/api/general'
import { useUserStore } from '@/stores'

const userStore = useUserStore()

export const uploadSingleFiles = async (file, fileData, fileType) => {
  fileData.status = 1
  if (!file) {
    ElMessage.error('请选择需要上传的文件')
    return
  }
  let formdata = new FormData()
  formdata.append('fileType', fileType)
  formdata.append('userId', userStore.userId)
  formdata.append('attachTime', fileData.attachTime)
  formdata.append('attachText', fileData.attachText)
  formdata.append('file', file.raw)
  try {
    const { data: uploadData } = await generalApi.uploadFile(formdata)
    if (uploadData.code === 1) {
      if (fileData.status === -2) fileData.status = 0
      fileData.fileId = uploadData.data.fileId
      ElMessage.success('文件上传成功！')
    } else {
      ElMessage.error(uploadData.msg)
    }
  } catch (err) {
    console.log(err)
    ElMessage.error('文件上传失败，请重试')
  }
}
