import { ElMessage } from 'element-plus'
import { fileUpload, fileDelete } from '@/api/general'
import { useUserStore } from '@/stores'

const userStore = useUserStore()

export const updateSingleFiles = async (file, fileData, fileType) => {
  console.log('updateSingleFiles:', file, fileData, fileType)
  if (!file) {
    ElMessage.error('请选择需要上传的文件')
    return
  }
  try {
    //重新上传先删除
    const { data: deletData } = await fileDelete(fileData.fileId)
    if (deletData.code === 0) {
      ElMessage.error(deletData.msg || '文件删除失败')
      return
    }
  } catch (err) {
    console.log(err)
    ElMessage.error('文件上传失败，请重试')
    return
  }
  try {
    let formdata = new FormData()
    formdata.append('fileType', fileType)
    formdata.append('userId', userStore.userId)
    formdata.append('attachTime', fileData.attachTime)
    formdata.append('attachText', fileData.attachText)
    formdata.append('file', file.raw)
    const { data: uploadData } = await fileUpload(formdata)
    if (uploadData.code === 1) {
      if (fileData.status === -1) fileData.status = 0
      fileData.fileId = uploadData.data.fileId
      ElMessage.success('文件上传成功！')
    } else {
      file = null
      fileData.status = -2
      ElMessage.error(uploadData.msg)
    }
  } catch (err) {
    file = null
    fileData.status = -2
    console.log(err)
    ElMessage.error('文件上传失败，请重试')
  }
}
