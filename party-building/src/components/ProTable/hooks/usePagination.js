import { ref, computed } from 'vue'

/**
 * 分页逻辑 Hook
 * @param {Array} data - 数据源
 * @param {Object} config - 分页配置
 * @returns {Object} 分页相关的方法和状态
 */
export function usePagination(data, config = {}) {
  const defaultConfig = {
    pageSize: 10,
    pageSizes: [10, 20, 50, 100]
  }

  const paginationConfig = { ...defaultConfig, ...config }

  // 当前页码
  const currentPage = ref(1)

  // 每页条数
  const pageSize = ref(paginationConfig.pageSize)

  // 总条数
  const total = computed(() => data.value?.length || 0)

  // 总页数
  const totalPages = computed(() => {
    return Math.ceil(total.value / pageSize.value)
  })

  // 当前页数据
  const currentPageData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return data.value?.slice(start, end) || []
  })

  // 切换页码
  const changePage = (page) => {
    if (page < 1 || page > totalPages.value) {
      return
    }
    currentPage.value = page
  }

  // 切换每页条数
  const changePageSize = (size) => {
    pageSize.value = size
    currentPage.value = 1
  }

  // 重置到第一页
  const resetPage = () => {
    currentPage.value = 1
  }

  // 上一页
  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }

  // 下一页
  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
    }
  }

  return {
    currentPage,
    pageSize,
    total,
    totalPages,
    currentPageData,
    changePage,
    changePageSize,
    resetPage,
    prevPage,
    nextPage,
    pageSizes: paginationConfig.pageSizes
  }
}
