/**
 * 数据筛选函数
 * @param {Array} data - 原始数据
 * @param {Object} filters - 筛选条件
 * @returns {Array} 筛选后的数据
 */
export function filterData(data, filters) {
  // console.log('data', data)
  // console.log('filters', filters)
  if (!data || data.length === 0) {
    return []
  }

  if (!filters || Object.keys(filters).length === 0) {
    return data
  }

  return data.filter(item => {
    return Object.keys(filters).every(key => {
      // console.log('key', key)
      const filterValue = filters[key]
      const itemValue = item[key]
      // console.log('filterValue', filterValue)
      // console.log('itemValue', itemValue)

      // 如果筛选值为空，则不筛选
      if (filterValue === '' || filterValue === null || filterValue === undefined) {
        return true
      }

      // 数组类型（日期范围）
      if (Array.isArray(filterValue)) {
        if (filterValue.length === 0) {
          return true
        }

        // 日期范围筛选
        if (filterValue.length === 2) {
          const [start, end] = filterValue
          const itemDate = new Date(itemValue).getTime()
          const startDate = new Date(start).getTime()
          const endDate = new Date(end).getTime()
          return itemDate >= startDate && itemDate <= endDate
        }

        return true
      }

      // 字符串模糊匹配
      if (typeof filterValue === 'string') {
        const itemStr = String(itemValue || '').toLowerCase()
        const filterStr = filterValue.toLowerCase()
        return itemStr.includes(filterStr)
      }

      // 精确匹配
      return itemValue === filterValue
    })
  })
}

/**
 * 格式化日期
 * @param {Date|String} date - 日期
 * @param {String} format - 格式
 * @returns {String} 格式化后的日期字符串
 */
export function formatDate(date, format = 'YYYY-MM-DD') {
  if (!date) return ''

  const d = new Date(date)
  if (isNaN(d.getTime())) return ''

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')
  const second = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hour)
    .replace('mm', minute)
    .replace('ss', second)
}

/**
 * 深拷贝
 * @param {*} obj - 要拷贝的对象
 * @returns {*} 拷贝后的对象
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj)
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item))
  }

  const clonedObj = {}
  Object.keys(obj).forEach(key => {
    clonedObj[key] = deepClone(obj[key])
  })

  return clonedObj
}
