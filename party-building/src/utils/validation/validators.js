// 校验函数

// 手机号
export const validatePhone = (value) => {
  const phoneReg = /^1[3-9]\d{9}$/
  return phoneReg.test(value)
}

// 身份证验证
export const validateIdCard = (value) => {
  const idCardReg = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[0-9Xx]$/
  if (!idCardReg.test(value)) return false

  // 加权因子
  const weightFactor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  // 校验码对应值
  const checkCodeList = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']

  const idCardArray = value.split('')
  let sum = 0
  for (let i = 0; i < 17; i++) {
    sum += parseInt(idCardArray[i]) * weightFactor[i]
  }
  const mod = sum % 11
  const checkCode = idCardArray[17].toUpperCase()

  return checkCodeList[mod] === checkCode
}
