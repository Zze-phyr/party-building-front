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
        :showPagination="true"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
        :isFrontPagination="isFrontPagination"
      >
        <!-- 自定义工具栏按钮 -->
        <template #toolbar>
          <!-- <el-input v-model="" placeholder="请输入字典名称" clearable style="width: 200px;" /> -->
          <el-button type="primary" :icon="Plus" @click="handleAddClick">
            新增
          </el-button>
        </template>

        <!-- 自定义状态列 -->
        <!-- <template #column-status="{ row }">
          <el-tag :type="getStatusType(row.status)" size="small">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template> -->

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
    v-model="dictionaryAddDialogVisible"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { adminApi } from '@/api/admin.js'
import { ElMessage } from 'element-plus'
import AddDictDialog from './components/add-dict-dialog.vue'

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
    width: 80,
    align: 'center',
    sortable: true
  },
  {
    prop: 'name',
    label: '字典名称',
    align: 'center',
    width: 120
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
  type: '年级'
})

// 新增字典弹窗的可见性
const dictionaryAddDialogVisible = ref(false)

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
      { label: '党支部', value: '党支部' }
    ]
  },
  {
    prop: 'status',
    label: '状态',
    type: 'select',
    placeholder: '请选择状态',
    options: [
      { label: '启用', value: 1 },
      { label: '停用', value: 0 }
    ]
  }
]

const handleAddClick = () => {
  dictionaryAddDialogVisible.value = true
}

const handleSearch = (filters) => {
  console.log('filters', filters)
  Object.assign(defaultFilters, filters)
  paginationConfig.currentPage = 1
  console.log('defaultFilters', defaultFilters)
  getDictionaryList(filters, paginationConfig)
}

const handleRefresh = () => {
  getDictionaryList(defaultFilters, paginationConfig)
}

const getDictionaryList = async (filters, paginationConfig) => {
  console.log('filters', filters)
  console.log('paginationConfig', paginationConfig)
  loading.value = true
  const data = {
    type: filters.type,
    status: filters.status,
    page: paginationConfig.currentPage,
    pageSize: paginationConfig.currentPageSize
  }
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
      default:
        res = []
        break
    }
    // console.log('res', res)
    if (res && res.data) {
      // console.log('res.data', res.data)
      let records = res.data.data.records
      if (filters.status !== undefined && filters.status !== '') {
        records = records.filter(item => item.status === filters.status)
      }
      tableData.value = records
      paginationConfig.total = res.data.data.total
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

const handleConfirm = async (formData) => {
  console.log('formData', formData)
  const {type, ...rest} = formData
  console.log('type', type)
  console.log('name', name)
  try {
    let res = null;
    switch (type) {
      case '年级':
        res = await adminApi.addGrade(rest.name)
        break
      case '学院':
        res = await adminApi.addCollege(rest)
        break
      case '专业':
        res = await adminApi.addMajor(rest)
        break
      case '班级':
        res = await adminApi.addClass(rest)
        break
      case '党委':
        res = await adminApi.addParty(rest)
        break
      case '党支部':
        res = await adminApi.addPartyBranch(rest)
        break
      default:
        res = null
        break
    }
    console.log('res', res)
    if (res && res.data) {
      ElMessage.success('新增字典成功')
      dictionaryAddDialogVisible.value = false
      handleSearch(defaultFilters)
    } else {
      ElMessage.error('新增字典失败')
    }
  } catch (error) {
    console.error('新增字典失败:', error)
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
  paginationConfig.currentPage = page
  getDictionaryList(defaultFilters, paginationConfig)
}

// 每页条数变化处理
const handlePageSizeChange = (size) => {
  paginationConfig.currentPageSize = size
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
  box-sizing: border-box;
}
</style>
