// 校验函数

// 手机号
export const validatePhone = (value, callback) => {
  const phoneReg = /^1[3-9]\d{9}$/
  if (!phoneReg.test(value)) {
    callback(new Error('请输入有效的11位手机号码'))
    return
  }
  return true
}
