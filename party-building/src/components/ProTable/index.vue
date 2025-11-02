<template>
  <div class="pro-table">
    <!-- 筛选区域 -->
    <SearchForm
      v-if="searchConfig && searchConfig.length > 0"
      :searchConfig="searchConfig"
      :loading="loading"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 工具栏 -->
    <Toolbar
      :loading="loading"
      @refresh="handleRefresh"
    >
      <template #default>
        <slot name="toolbar"></slot>
      </template>
    </Toolbar>

    <!-- 表格主体 -->
    <TableMain
      :columns="columns"
      :data="currentPageData"
      :loading="loading"
      :rowKey="rowKey"
      v-bind="$attrs"
      @selection-change="handleSelectionChange"
    >
      <!-- 传递所有列插槽 -->
      <template
        v-for="column in slotColumns"
        :key="column.prop"
        #[`column-${column.prop}`]="scope"
      >
        <slot :name="`column-${column.prop}`" v-bind="scope"></slot>
      </template>
    </TableMain>

    <!-- 分页 -->
    <div v-if="showPagination" class="pro-table__pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="currentPageSize"
        :page-sizes="paginationConfig.pageSizes"
        :layout="paginationConfig.layout"
        :total="filteredData.length"
        :background="true"
        :page-sizes-text="paginationConfig.smallText"
        :total-text="paginationConfig.totalText"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import SearchForm from './components/SearchForm.vue'
import Toolbar from './components/Toolbar.vue'
import TableMain from './components/TableMain.vue'
import { filterData } from './utils/index.js'

// 定义组件名称
defineOptions({
  name: 'ProTable'
})

// Props 定义
const props = defineProps({
  // 表格数据源
  data: {
    type: Array,
    default: () => []
  },
  // 列配置
  columns: {
    type: Array,
    required: true
  },
  // 筛选配置
  searchConfig: {
    type: Array,
    default: () => []
  },
  // 分页配置
  pagination: {
    type: [Object, Boolean],
    default: true
  },
  // 加载状态
  loading: {
    type: Boolean,
    default: false
  },
  // 行数据的唯一标识
  rowKey: {
    type: String,
    default: 'id'
  },
  // 是否是前端做分页
  isFrontPagination: {
    type: Boolean,
    default: true
  }
})

// Emits 定义
const emit = defineEmits(['refresh', 'search', 'reset', 'selection-change'])

// 筛选条件
const searchFilters = ref({})

// 分页相关状态
const currentPage = ref(1)
const currentPageSize = ref(10)

// 计算分页配置
const paginationConfig = computed(() => {
  if (props.pagination === false) {
    return null
  }

  const defaultConfig = {
    pageSize: 10,
    pageSizes: [10, 20, 50, 100],
    layout: 'total, sizes, prev, pager, next, jumper',
    // 自定义文字配置
    smallText: '条/页',
    totalText: '共 {total} 条'
  }

  return typeof props.pagination === 'object'
    ? { ...defaultConfig, ...props.pagination }
    : defaultConfig
})

// 是否显示分页
const showPagination = computed(() => {
  return props.pagination !== false
})

// 筛选后的数据
const filteredData = computed(() => {
  if (Object.keys(searchFilters.value).length === 0) {
    return props.data
  }
  return filterData(props.data, searchFilters.value)
})

// 当前页数据
const currentPageData = computed(() => {
  // 后端分页：直接返回传入的数据（后端已处理分页和筛选）
  if (!props.isFrontPagination) {
    return props.data || []
  }
  
  // 前端分页：需要在前端进行筛选和分页
  // 如果不显示分页，返回所有筛选后的数据
  if (!showPagination.value) {
    return filteredData.value || []
  }

  // 前端分页计算
  const start = (currentPage.value - 1) * currentPageSize.value
  const end = start + currentPageSize.value
  
  return filteredData.value?.slice(start, end) || []
})

// 获取需要插槽的列
const slotColumns = computed(() => {
  return props.columns.filter(column => column.slot)
})

// 监听数据变化，重置到第一页
watch(() => props.data, () => {
  currentPage.value = 1
}, { deep: true })

// 监听筛选条件变化，重置到第一页
watch(searchFilters, () => {
  currentPage.value = 1
}, { deep: true })

// 处理搜索
const handleSearch = (filters) => {
  searchFilters.value = { ...filters }
  emit('search', filters)
}

// 处理重置
const handleReset = () => {
  searchFilters.value = {}
  currentPage.value = 1
  emit('reset')
}

// 处理刷新
const handleRefresh = () => {
  emit('refresh')
}

// 处理选择变化
const handleSelectionChange = (selection) => {
  emit('selection-change', selection)
}

// 处理每页条数变化
const handleSizeChange = (size) => {
  currentPageSize.value = size
  currentPage.value = 1
}

// 处理当前页变化
const handleCurrentChange = (page) => {
  currentPage.value = page
}

// 初始化分页大小
if (paginationConfig.value) {
  currentPageSize.value = paginationConfig.value.pageSize
}
</script>

<style lang="scss" scoped>
.pro-table {
  &__pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }
}
</style>
