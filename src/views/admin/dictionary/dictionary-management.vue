<template>
  <ContentCard title="字典管理">
    <div class="table-container">
      <ProTable
        :data="tableData"
        :columns="columns"
        :searchConfig="searchConfig"
        :loading="loading"
        @refresh="handleRefresh"
        @search="handleSearch"
        @reset="handleReset"
        @selection-change="handleSelectionChange"
        :pagination="paginationConfig"
        :total="paginationConfig.total"
        :showPagination="true"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
        :isFrontPagination="isFrontPagination"
      >
        <!-- 自定义工具栏按钮 -->
        <template #toolbar>
          <!-- <el-input v-model="" placeholder="请输入字典名称" clearable style="width: 200px;" /> -->
          <el-button type="primary" :icon="Plus" @click="handleAddClick">
            新增字典
          </el-button>
          <el-button type="primary" :icon="Config" @click="handleConfigClick">
            字典配置
          </el-button>
        </template>

        <!-- 自定义操作列 -->
        <template #column-action="{ row }">
          <el-button link type="primary" size="small" @click="handleChangeStatus(row)">
            {{ row.status === 0 ? '启用' : '停用' }}
          </el-button>
          <el-button link type="primary" size="small" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button link type="danger" size="small" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </ProTable>
    </div>
  </ContentCard>
  <AddDictDialog
    v-model="dictionaryDialogVisible"
    :isEdit="isEditMode"
    :editData="editingRow"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { adminApi } from '@/api/admin.js'
import { ElMessage } from 'element-plus'
import AddDictDialog from './components/add-dict-dialog.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const tableData = ref([])

// 加载状态
const loading = ref(false)

// 选中的行
const selectedRows = ref([])

const isFrontPagination = ref(true)

// 分页配置
const paginationConfig = reactive({
  currentPage: 1,
  currentPageSize: 10,
  total: 0,
  pageSize: 10,
  pageSizes: [10, 20, 50, 100],
  layout: 'total, sizes, prev, pager, next, jumper'
})

// 列配置
const columns = [
  {
    type: 'selection',
    width: 55,
    fixed: 'left'
  },
  {
    prop: 'id',
    label: 'ID',
    width: 200,
    align: 'center',
    sortable: true
  },
  {
    prop: 'name',
    label: '字典名称',
    align: 'center',
    width: 120,
    sortable: true
  },
  {
    prop: 'status',
    label: '状态',
    width: 100,
    align: 'center',
    // slot: 'status'
  },
  {
    prop: 'createTime',
    label: '创建时间',
    align: 'center',
    sortable: true
  },
  {
    prop: 'action',
    label: '操作',
    width: 200,
    fixed: 'right',
    align: 'center',
    slot: 'action'
  }
]

const defaultFilters = reactive({
  type: '年级',
  status: 1
})

// 弹窗状态
const dictionaryDialogVisible = ref(false)
const isEditMode = ref(false)
const editingRow = ref(null)

const statusEnum = new Map([
  [1, 'ENABLE'],
  [0, 'DISABLE'],
  [-1, 'DELETE']
])

// 筛选配置
const searchConfig = [
  {
    prop: 'type',
    label: '字典类型',
    type: 'select',
    placeholder: '请选择字典类型',
    defaultValue: defaultFilters.type,
    options: [
      { label: '年级', value: '年级' },
      { label: '学院', value: '学院' },
      { label: '专业', value: '专业' },
      { label: '班级', value: '班级' },
      { label: '党委', value: '党委' },
      { label: '党支部', value: '党支部' },
      { label: '批次', value: '批次' }
    ]
  },
  {
    prop: 'status',
    label: '状态',
    type: 'select',
    placeholder: '请选择状态',
    defaultValue: defaultFilters.status,
    options: [
      { label: '启用', value: 1 },
      { label: '停用', value: 0 }
    ]
  }
]

// 新增字典弹窗打开
const handleAddClick = () => {
  isEditMode.value = false
  editingRow.value = null
  dictionaryDialogVisible.value = true
}


// 字典配置页面跳转
const handleConfigClick = () => {
  // 跳转到字典配置页面
  router.push({ name: 'DictionaryConfig' })
}

// 编辑字典弹窗打开
const handleEdit = (row) => {
  isEditMode.value = true
  editingRow.value = {
    id: row.id,
    type: defaultFilters.type,
    name: row.name,
    status: statusEnum.get(row.status)
  }
  dictionaryDialogVisible.value = true
}

/**
 * 选择变化处理
 * @param {Array} selection - 选中的行数据数组
 */
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
  console.log('当前选中的行:', selectedRows.value)
}

// 搜索处理
const handleSearch = (filters) => {
  console.log('filters', filters)
  Object.assign(defaultFilters, filters)
  paginationConfig.currentPage = 1
  console.log('defaultFilters', defaultFilters)
  getDictionaryList(filters, paginationConfig)
}

// 刷新处理
const handleRefresh = () => {
  getDictionaryList(defaultFilters, paginationConfig)
}

// 获取数据列表
const getDictionaryList = async (filters, pagination) => {
  console.log('filters', filters)
  console.log('pagination', pagination)
  loading.value = true
  tableData.value = []
  const data = {
    type: filters.type,
    statusEnum: statusEnum.get(filters.status),
    page: pagination.currentPage,
    pageSize: pagination.currentPageSize
  }
  console.log('data', data)
  try {
    let res = null;
    switch (filters.type) {
      case '年级':
        res = await adminApi.getGradeDictionaryList(data)
        isFrontPagination.value = false
        break
      case '学院':
        res = await adminApi.getCollegeDictionaryList(data)
        isFrontPagination.value = true
        break
      case '专业':
        res = await adminApi.getMajorDictionaryList(data)
        isFrontPagination.value = false
        break
      case '班级':
        res = await adminApi.getClassDictionaryList(data)
        isFrontPagination.value = true
        break
      case '党委':
        res = await adminApi.getPartyDictionaryList(data)
        isFrontPagination.value = true
        break
      case '党支部':
        res = await adminApi.getPartyBranchDictionaryList(data)
        isFrontPagination.value = true
        break
      case '批次':
        res = await adminApi.getBatch(data)
        isFrontPagination.value = true
        break
      default:
        res = []
        break
    }
    // console.log('res', res)
    if (res && res.data) {
      console.log('res.data', res.data)
      let records = filters.type === '年级' || filters.type === '专业' || filters.type === '批次' ? res.data.data.records || [] : res.data.data || []
      if (records && records.length === 0) {
        ElMessage.warning('暂无数据')
        return
      }
      records.forEach(item => {
        item.type = filters.type
        if (!item.status) {
          item.status = filters.status
        }
      })
      console.log('records', records)
      tableData.value = records
      paginationConfig.total = filters.type === '年级' || filters.type === '专业' || filters.type === '批次'  ? res.data.data.total : records.length
      console.log('paginationConfig.total', paginationConfig.total)
      ElMessage.success('获取字典列表成功')
    } else {
      tableData.value = []
      paginationConfig.total = 0
    }
    loading.value = false
  } catch (error) {
    console.error('获取字典列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 加载字典列表
const handleConfirm = async (formData) => {
  try {
    let res = null
    const {name, type} = formData
    console.log('name', name)
    switch (type) {
        case '年级':
          res = isEditMode.value ? await adminApi.updateGrade(formData) : await adminApi.addGrade(name)
          break
        case '学院':
          res = isEditMode.value ? await adminApi.updateCollege(formData) : await adminApi.addCollege(name)
          break
        case '专业':
          res = isEditMode.value ? await adminApi.updateMajor(formData) : await adminApi.addMajor(name)
          break
        case '班级':
          res = isEditMode.value ? await adminApi.updateClass(formData) : await adminApi.addClass(name)
          break
        case '党委':
          res = isEditMode.value ? await adminApi.updateParty(formData) : await adminApi.addParty({name})
          break
        case '党支部':
          res = isEditMode.value ? await adminApi.updatePartyBranch(formData) : await adminApi.addPartyBranch({name})
          break
        case '批次':
          res = isEditMode.value ? await adminApi.updateBatch(formData) : await adminApi.addBatch({name})
          break
      }
      console.log('res', res)
      if (res && res.data && res.data.code === 1) {
        ElMessage.success(isEditMode.value ? '编辑字典成功' : '新增字典成功')
        dictionaryDialogVisible.value = false
        handleSearch(defaultFilters)
      } else {
        ElMessage.error(isEditMode.value ? '编辑字典失败' : '新增字典失败')
      }
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error(isEditMode.value ? '编辑字典失败' : '新增字典失败')
  }
}

/**
 * 处理字典项的保存操作（包括新增和编辑）
 * @param {Object} row - 要操作的字典数据对象
 */
const handleDelete = async (row) => {
  console.log('row', row)
  const data = {
    ...row,
    status: -1,
  }
  try {
    let res = null
    // 根据字典类型调用对应的API接口
    switch (defaultFilters.type) {
        case '年级':
          res = await adminApi.updateGrade(data)
          break
        case '学院':
          res = await adminApi.updateCollege(data)
          break
        case '专业':
          res = await adminApi.updateMajor(data)
          break
        case '班级':
          res = await adminApi.updateClass(data)
          break
        case '党委':
          res = await adminApi.updateParty(data)
          break
        case '党支部':
          res = await adminApi.updatePartyBranch(data)
          break
        case '批次':
          res = await adminApi.updateBatch(data)
          break
      }

      // 处理API响应结果
      if (res && res.data) {
        ElMessage.success(isEditMode.value ? '编辑字典成功' : '新增字典成功')
        dictionaryDialogVisible.value = false
        handleSearch(defaultFilters)
      } else {
        ElMessage.error(isEditMode.value ? '编辑字典失败' : '新增字典失败')
      }
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error(isEditMode.value ? '编辑字典失败' : '新增字典失败')
  }
}

const handleChangeStatus = async (row) => {
  console.log('row', row)
  const rowData = {
    id: row.id,
    name: row.name,
    status: row.status === 1 ? 0 : 1
  }
  try {
    let res = null;
    switch (defaultFilters.type) {
      case '年级':
        res = await adminApi.updateGrade(rowData)
        break
      case '学院':
        res = await adminApi.updateCollege(rowData)
        break
      case '专业':
        res = await adminApi.updateMajor(rowData)
        break
      case '班级':
        res = await adminApi.updateClass(rowData)
        break
      case '党委':
        res = await adminApi.updateParty(rowData)
        break
      case '党支部':
        res = await adminApi.updatePartyBranch(rowData)
        break
      case '批次':
        res = await adminApi.updateBatch(rowData)
        break
      default:
        res = null
        break
    }
    console.log('res', res)
    if (res && res.data) {
      ElMessage.success('修改字典状态成功')
      handleSearch(defaultFilters)
    } else {
      ElMessage.error('修改字典状态失败')
    }
  } catch (error) {
    console.error('修改字典状态失败:', error)
  }
}

// 分页事件处理
const handlePageChange = (page) => {
  console.log('page', page)
  Object.assign(paginationConfig, {
    ...paginationConfig,
    currentPage: page.page,
    pageSize: page.pageSize,
    currentPageSize: page.pageSize,
  })
  getDictionaryList(defaultFilters, paginationConfig)
}

// 每页条数变化处理
const handlePageSizeChange = (size) => {
  console.log('size', size)
  Object.assign(paginationConfig, {
    ...paginationConfig,
    currentPageSize: size,
  })
  getDictionaryList(defaultFilters, paginationConfig)
}

onMounted(() => {
  // handleSearch(defaultFilters)
  getDictionaryList(defaultFilters, paginationConfig)
})

</script>

<style lang="scss" scoped>

.table-container {
  width: 100%;
  height: calc(100vh - 200px);
  overflow: auto;
  box-sizing: border-box;
}
</style>
