import { ElMessage } from 'element-plus'
import { generalApi } from '@/api/general'
import { useUserStore } from '@/stores'

const userStore = useUserStore()

/**
 * 上传单个文件
 * @param {Object} file - 要上传的文件对象，应包含raw和name属性
 * @param {Object} fileData - 文件附加信息对象，包含attachTime、attachText等属性
 * @param {String} fileType - 文件类型标识符
 * @returns {Promise<void>} 无返回值的异步函数
 */
export const uploadSingleFiles = async (file, fileData, fileType) => {
  console.log(file, fileData, fileType)
  fileData.status = 1
  // 检查文件是否存在
  if (!file) {
    ElMessage.error('请选择需要上传的文件')
    return
  }
  // const fileRequestData = {
  //   fileType: fileType,
  //   userId: userStore.userId,
  //   attachTime: fileData.attachTime,
  //   attachText: fileData.attachText,
  //   file: file,
  //   fileName: file.name
  // }
  // 构造表单数据
  let formdata = new FormData()
  // formdata.append('uploadDTO', fileRequestData)
  formdata.append('fileType', fileType)
  formdata.append('userId', userStore.userId)
  formdata.append('attachTime', fileData.attachTime)
  formdata.append('attachText', fileData.attachText)
  formdata.append('file', file)
  formdata.append('fileName', file.name)
  for (let pair of formdata.entries()) {
    console.log(pair[0] + ', ' + pair[1]);
  }
  console.log('FormData is not empty, content shown above.');
  try {
    // 发起文件上传请求
    const { data: uploadData } = await generalApi.uploadFile(formdata)
    if (uploadData.code === 1) {
      // 根据状态设置文件ID并更新状态
      if (fileData.status === -2) fileData.status = 0
      fileData.fileId = uploadData.data.fileId
      ElMessage.success('文件上传成功！')
    } else {
      ElMessage.error(uploadData.msg)
    }
  } catch (err) {
    // 处理上传错误
    console.log(err)
    ElMessage.error('文件上传失败，请重试')
  }
}
