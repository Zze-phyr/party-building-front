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
      // TODO： 对于对象清空的方式有点问题，建议修改
      // 1、这种不建议使用reactive，因为会导致响应式丢失
      // 2、缺少对数据类型比如说是函数、数组等的处理 
      formData[key] = reactive({}) 
    } else {
      formData[key] = null
    }
  })
}
