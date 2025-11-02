import { ref, computed } from 'vue'
import { filterData } from '../utils/index.js'

/**
 * 筛选逻辑 Hook
 * @param {Array} data - 原始数据
 * @returns {Object} 筛选相关的方法和状态
 */
export function useSearch(data) {
  // 筛选条件
  const searchFilters = ref({})

  // 筛选后的数据
  const filteredData = computed(() => {
    if (Object.keys(searchFilters.value).length === 0) {
      return data.value
    }
    return filterData(data.value, searchFilters.value)
  })

  // 设置筛选条件
  const setFilters = (filters) => {
    searchFilters.value = { ...filters }
  }

  // 重置筛选条件
  const resetFilters = () => {
    searchFilters.value = {}
  }

  // 更新单个筛选条件
  const updateFilter = (key, value) => {
    searchFilters.value = {
      ...searchFilters.value,
      [key]: value
    }
  }

  return {
    searchFilters,
    filteredData,
    setFilters,
    resetFilters,
    updateFilter
  }
}
