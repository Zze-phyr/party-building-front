import { generalApi } from '@/api/general'
import { ElMessage } from 'element-plus'

function getFileNameFromDisposition(disposition) {
  if (!disposition) return null
  // 正则表达式匹配文件名，支持 UTF-8 编码的文件名，防止文件名编码乱码
  const match = disposition.match(/filename*?=(?:UTF-8'')?([^;]+)/i)
  // 解码并去除可能的引号
  return match ? decodeURIComponent(match[1].replace(/^"|"$/g, '')) : null
}
// TODO: 建议进一步抽离下，请求参数不应该直接写死在函数中，下载行为可抽离为独立工具函数
// 1、下载文件的函数应该体现在业务代码中，而不是放在一个通用的工具函数中
// 文件下载
export const downloadFile = async (fileId) => {
  try {
    if (!fileId) {
      ElMessage.error('文件不存在，下载失败')
      return
    }

    const response = await generalApi.downloadFile(fileId)
    const blob = response.data
    const contentDisposition = response.headers['content-disposition']
    const fileName = getFileNameFromDisposition(contentDisposition) || '下载文件.pdf'

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.click()
    URL.revokeObjectURL(url)
    ElMessage.success('文件下载成功')
  } catch (error) {
    console.error('下载失败:', error)
    ElMessage.error('文件下载失败')
  }
}
