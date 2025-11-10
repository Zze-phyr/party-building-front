<template>
  <ContentCard title="人员信息">
    <div class="person-check-container">
      <ProTable
        :data="tableData"
        :columns="columns"
        :searchConfig="searchConfig"
        :loading="loading"
        :pagination="paginationConfig"
        :total="paginationConfig.total"
        :showPagination="true"
        :isFrontPagination="false"
        @refresh="handleRefresh"
        @search="handleSearch"
        @reset="handleReset"
        @selection-change="handleSelectionChange"
        @page-change="handlePageChange"
      >
        <!-- 工具栏插槽 -->
        <template #toolbar>
          <el-button
            type="danger"
            :icon="Delete"
            :disabled="selectedRows.length === 0"
            @click="handleBatchDelete"
          >
            批量删除
          </el-button>
        </template>

        <!-- 入党状态列自定义渲染 -->
        <template #column-partyStatus="{ row }">
          <el-tag
            :type="getPartyStatusType(row.partyStatus)"
            size="small"
            effect="plain"
          >
            {{ row.partyStatus }}
          </el-tag>
        </template>

        <!-- 操作列自定义渲染 -->
        <template #column-action="{ row }">
          <el-button
            link
            type="primary"
            size="small"
            :icon="View"
            @click="handleView(row)"
          >
            查看
          </el-button>
          <el-button
            link
            type="danger"
            size="small"
            :icon="Delete"
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </ProTable>
    </div>
  </ContentCard>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { adminApi } from '@/api/admin'

// ==================== 响应式状态定义 ====================

// 加载状态
const loading = ref(false)

// 表格数据
const tableData = ref([])

// 选中的行数据
const selectedRows = ref([])

// 搜索条件
const searchFilters = ref({})

// 分页配置
const paginationConfig = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
  pageSizes: [10, 20, 50, 100],
  layout: 'total, sizes, prev, pager, next, jumper'
})

// ==================== 下拉选项数据 ====================

// 身份选项
const identityOptions = reactive([
  { label: '全部', value: '' },
  { label: '学生', value: '学生' },
  { label: '老师', value: '老师' },
  { label: '管理员', value: '管理员' }
])

// 所属党支部选项
const partyBranchOptions = reactive([
  { label: '全部', value: '' },
  { label: '本科生第一党支部', value: '本科生第一党支部' },
  { label: '本科生第二党支部', value: '本科生第二党支部' },
  { label: '本科生第三党支部', value: '本科生第三党支部' },
  { label: '本科生第六党支部', value: '本科生第六党支部' },
  { label: '研究生第二党支部', value: '研究生第二党支部' }
])

// 入党状态选项
const partyStatusOptions = reactive([
  { label: '全部', value: '' },
  { label: '未申请入党', value: '未申请入党' },
  { label: '入党积极分子', value: '入党积极分子' },
  { label: '中共预备党员', value: '中共预备党员' },
  { label: '共产党员', value: '共产党员' }
])

// 年级专业班级选项
const classGradeOptions = reactive([
  { label: '全部', value: '' },
  { label: '2019级计算机科学与技术专业1班', value: '2019级计算机科学与技术专业1班' },
  { label: '2022级软件工程专业2班', value: '2022级软件工程专业2班' },
  { label: '2023级计算机科学与技术专业3班', value: '2023级计算机科学与技术专业3班' },
  { label: '2024级物联网工程专业3班', value: '2024级物联网工程专业3班' }
])

// ==================== 搜索配置 ====================

const searchConfig = reactive([
  {
    prop: 'keyword',
    label: '综合搜索',
    type: 'input',
    placeholder: '输入姓名、学工号或普通年级专业班级进行搜索',
    clearable: true,
    style: { width: '100%' }
  },
  {
    prop: 'identity',
    label: '身份',
    type: 'select',
    placeholder: '请选择身份',
    options: identityOptions,
    clearable: true
  },
  {
    prop: 'partyBranch',
    label: '所属党支部',
    type: 'select',
    placeholder: '请选择所属党支部',
    options: partyBranchOptions,
    clearable: true
  },
  {
    prop: 'partyStatus',
    label: '入党状态',
    type: 'select',
    placeholder: '请选择入党状态',
    options: partyStatusOptions,
    clearable: true
  },
  {
    prop: 'classGrade',
    label: '年级专业班级',
    type: 'select',
    placeholder: '请选择年级专业班级',
    options: classGradeOptions,
    clearable: true
  }
])

// ==================== 表格列配置 ====================

const columns = reactive([
  {
    type: 'selection',
    width: 55,
    fixed: 'left',
    align: 'center'
  },
  {
    prop: 'name',
    label: '姓名',
    width: 120,
    align: 'left'
  },
  {
    prop: 'studentId',
    label: '学工号',
    width: 150,
    align: 'center'
  },
  {
    prop: 'identity',
    label: '身份',
    width: 100,
    align: 'center'
  },
  {
    prop: 'partyStatus',
    label: '入党状态',
    width: 150,
    align: 'center',
    slot: true  // 使用自定义插槽渲染
  },
  {
    prop: 'classGrade',
    label: '年级专业班级',
    width: 280,
    align: 'left',
    showOverflowTooltip: true
  },
  {
    prop: 'partyBranch',
    label: '所属党支部',
    width: 180,
    align: 'center'
  },
  {
    prop: 'phone',
    label: '联系电话',
    width: 150,
    align: 'center'
  },
  {
    prop: 'qq',
    label: 'QQ账号',
    width: 150,
    align: 'center'
  },
  {
    prop: 'action',
    label: '操作',
    width: 180,
    align: 'center',
    fixed: 'right',
    slot: true  // 使用自定义插槽渲染
  }
])

// ==================== 工具函数 ====================

/**
 * 获取入党状态对应的标签类型
 */
const getPartyStatusType = (status) => {
  const statusMap = {
    '未申请入党': '',
    '入党积极分子': 'danger',
    '中共预备党员': 'warning',
    '共产党员': 'danger'
  }
  return statusMap[status] || ''
}

// ==================== API 请求函数 ====================

/**
 * 获取用户列表数据
 */
const fetchData = async () => {
  loading.value = true
  try {
    const params = {
      page: paginationConfig.page,
      pageSize: paginationConfig.pageSize,
      ...searchFilters.value  // 合并搜索条件
    }

    const res = await adminApi.checkAllUserInfo(params)

    if (res.code === 1) {
      tableData.value = res.data.list || []
      paginationConfig.total = res.data.total || 0
    } else {
      ElMessage.error(res.msg || '获取数据失败')
      tableData.value = []
      paginationConfig.total = 0
    }
  } catch (error) {
    ElMessage.error('网络请求失败，请稍后重试')
    console.error('fetchData error:', error)
    tableData.value = []
    paginationConfig.total = 0
  } finally {
    loading.value = false
  }
}

// ==================== 事件处理函数 ====================

/**
 * 处理搜索事件
 */
const handleSearch = (filters) => {
  console.log('搜索条件:', filters)
  searchFilters.value = { ...filters }
  paginationConfig.page = 1  // 重置到第一页
  fetchData()
}

/**
 * 处理重置事件
 */
const handleReset = () => {
  console.log('重置搜索条件')
  searchFilters.value = {}
  paginationConfig.page = 1
  fetchData()
}

/**
 * 处理刷新事件
 */
const handleRefresh = () => {
  console.log('刷新数据')
  fetchData()
}

/**
 * 处理分页变化事件
 */
const handlePageChange = ({ page, pageSize }) => {
  console.log('分页变化:', { page, pageSize })
  paginationConfig.page = page
  paginationConfig.pageSize = pageSize
  fetchData()
}

/**
 * 处理表格选中变化事件
 */
const handleSelectionChange = (selection) => {
  console.log('选中行变化:', selection)
  selectedRows.value = selection
}

/**
 * 处理筛选按钮点击
 */
const handleFilter = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要筛选的用户')
    return
  }

  console.log('筛选选中的用户:', selectedRows.value)
  // TODO: 实现筛选逻辑
  ElMessage.info(`已筛选 ${selectedRows.value.length} 个用户`)
}

/**
 * 处理重置所有（包括选中状态）
 */
const handleResetAll = () => {
  console.log('重置所有状态')
  searchFilters.value = {}
  selectedRows.value = []
  paginationConfig.page = 1
  fetchData()
}

/**
 * 处理批量删除
 */
const handleBatchDelete = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要删除的用户')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确认删除选中的 ${selectedRows.value.length} 个用户吗？此操作不可恢复。`,
      '批量删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    loading.value = true

    const ids = selectedRows.value.map(row => row.id)

    // TODO: 调用批量删除API
    const res = await adminApi.batchDeleteUsers(ids)

    if (res.code === 1) {
      ElMessage.success('删除成功')
      selectedRows.value = []
      fetchData()
    } else {
      ElMessage.error(res.msg || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败，请稍后重试')
      console.error('batchDelete error:', error)
    }
  } finally {
    loading.value = false
  }
}

/**
 * 处理查看详情
 */
const handleView = (row) => {
  console.log('查看详情:', row)
  // TODO: 实现跳转到详情页或打开详情弹窗
  ElMessage.info(`查看用户：${row.name}`)
}

/**
 * 处理删除单个用户
 */
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确认删除用户"${row.name}"吗？此操作不可恢复。`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    loading.value = true

    // TODO: 调用删除API
    const res = await adminApi.deleteUser(row.id)

    if (res.code === 1) {
      ElMessage.success('删除成功')
      fetchData()
    } else {
      ElMessage.error(res.msg || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败，请稍后重试')
      console.error('delete error:', error)
    }
  } finally {
    loading.value = false
  }
}

// ==================== 生命周期钩子 ====================

onMounted(() => {
  console.log('页面初始化，加载数据')
  fetchData()

  // TODO: 如果需要，这里可以加载动态的下拉选项数据
  // loadPartyBranches()
  // loadClassGrades()
})

</script>

<style lang="scss" scoped>
.person-check-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
