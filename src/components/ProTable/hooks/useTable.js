import { ref } from 'vue'

/**
 * 表格逻辑 Hook
 * @returns {Object} 表格相关的方法和状态
 */
export function useTable() {
  // 加载状态
  const loading = ref(false)

  // 选中的行
  const selectedRows = ref([])

  // 设置加载状态
  const setLoading = (state) => {
    loading.value = state
  }

  // 处理选择变化
  const handleSelectionChange = (selection) => {
    selectedRows.value = selection
  }

  // 清空选择
  const clearSelection = () => {
    selectedRows.value = []
  }

  // 刷新
  const refresh = async (fetchFn) => {
    if (!fetchFn) return

    try {
      setLoading(true)
      await fetchFn()
    } catch (error) {
      console.error('刷新失败:', error)
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    selectedRows,
    setLoading,
    handleSelectionChange,
    clearSelection,
    refresh
  }
}
