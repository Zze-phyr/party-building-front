import { ElMessage } from 'element-plus'
import { fileDownload } from '@/api/general'

function getFileNameFromDisposition(disposition) {
  if (!disposition) return null
  // 正则表达式匹配文件名，支持 UTF-8 编码的文件名，防止文件名编码乱码
  const match = disposition.match(/filename*?=(?:UTF-8'')?([^;]+)/i)
  // 解码并去除可能的引号
  return match ? decodeURIComponent(match[1].replace(/^"|"$/g, '')) : null
}

// 文件下载
export const handleDownload = async (fileId) => {
  try {
    if (!fileId) {
      ElMessage.error('文件ID不存在')
      return
    }

    const response = await fileDownload(fileId)
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
    ElMessage.error('下载失败')
  }
}
