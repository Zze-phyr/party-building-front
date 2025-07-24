// 表单操作
import { reactive } from 'vue'

// 清空表单内容函数
export const clearForm = (formRef, formData) => {
  if (formRef) {
    formRef.resetFields() // 重置表单验证状态
  }
  // 清空表单数据
  Object.keys(formData).forEach((key) => {
    if (typeof formData[key] === 'string') {
      formData[key] = ''
    } else if (typeof formData[key] === 'object' && formData[key] !== null) {
      formData[key] = reactive({})
    } else {
      formData[key] = null
    }
  })
}
