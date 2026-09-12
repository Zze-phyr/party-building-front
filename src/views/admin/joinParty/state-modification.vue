<template>
  <ContentCard title="状态修改">
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
          <div class="table-toolbar">
            <div class="toolbar-left">
              <el-input placeholder="请输入学生姓名、学号" v-model="searchName" clearable></el-input>
            </div>
            <div class="toolbar-right">

              <el-button>
                中共预备党员管理
              </el-button>
            </div>
          </div>
        </template>

        <!-- 自定义操作列 -->
        <template #column-action="{ row }">
          <el-button link type="primary" size="small" @click="handleOpenStatusDialog(row)">
            确认转入下一状态
          </el-button>
        </template>
      </ProTable>
    </div>
  </ContentCard>
  <el-dialog
    v-model="statusDialogVisible"
    title="Tips"
    width="500"
    :before-close="handleClose"
  >
    <span>确认当前人员进入下一状态吗？</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="statusDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="statusDialogVisible = false">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { adminApi } from '@/api/admin.js'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

const tableData = ref([])

// 加载状态
const loading = ref(false)

// 选中的行
const selectedRows = ref([])

const joinPartyStatusList = reactive([])

const partyBranchDictionaryList = reactive([])

const isFrontPagination = ref(true)

const statusDialogVisible = ref(false)

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
    label: '姓名',
    align: 'center',
    width: 150
  },
  {
    prop: 'number',
    label: '学号 / 工号',
    align: 'center',
    width: 120
  },
  {
    prop: 'partyStatus',
    label: '状态',
    width: 100,
    align: 'center',
    // slot: 'status'
  },
  {
    prop: 'branch',
    label: '所属党支部',
    align: 'center',
    width: 120
  },
  {
    prop: 'updateUser',
    label: '处理人',
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

const defaultFilters = {
  branch: null,
  partyStatus: null
}

// 筛选配置
const searchConfig = [
  {
    prop: 'branch',
    label: '所属党支部',
    type: 'select',
    placeholder: '请选择所属党支部',
    options: partyBranchDictionaryList
  },
  {
    prop: 'partyStatus',
    label: '状态',
    type: 'select',
    placeholder: '请选择状态',
    options: joinPartyStatusList
  }
]

// 查看学生入党状态信息
const getStudentJoinPartyStatusInfoList = async (filters, paginationConfig) => {
  loading.value = true
  try {
    const res = await adminApi.checkStudentJoinPartyStatusInfo({
      ...filters,
      page: paginationConfig.currentPage,
      pageSize: paginationConfig.currentPageSize
    })
    console.log('getStudentJoinPartyStatusInfoList', res)
    if (res.data.code === 1) {
      tableData.value = res.data.data.records
      paginationConfig.total = res.data.data.total
      ElMessage.success(res.data.message || '获取成功')
      loading.value = false
    }
  } catch (error) {
    console.error('获取学生入党状态信息失败:', error)
    loading.value = false
  }
}

// 获取入党状态列表
const getJoinPartyStatusListEvent = async () => {
  try {
    const res = await adminApi.getJoinPartyStatusList()
    console.log('getJoinPartyStatusList', res)
    if (res.data.code === 1) {
      const options = res.data.data.map(item => {
        return {
          label: item,
          value: item
        }
      })
      Object.assign(joinPartyStatusList, options)
    }
  } catch (error) {
    console.error('获取入党状态列表失败:', error)
  }
}

// 获取党支部列表
const getPartyBranchDictionaryListEvent = async () => {
  try {
    const res = await adminApi.getPartyBranchDictionaryList({
      statusEnum: 'ENABLE'
    })
    console.log('getPartyBranchDictionaryList', res)
    if (res.data.code === 1) {
      const options = res.data.data.map(item => {
        console.log('item', item)
        return {
          label: item.name,
          value: item.id
        }
      })
      Object.assign(partyBranchDictionaryList, options)
    }
  } catch (error) {
    console.error('获取党支部列表失败:', error)
  }
}

// 打开状态转换对话框
const handleOpenStatusDialog = (row) => {
  statusDialogVisible.value = true
}

// 选择行变化时触发
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
  console.log('当前选中的行:', selectedRows.value)
}

// 筛选条件变化时触发
const handleSearch = (filters) => {
  Object.assign(defaultFilters, filters)
  paginationConfig.currentPage = 1
  getStudentJoinPartyStatusInfoList(defaultFilters, paginationConfig)
}

const handleRefresh = () => {
  getStudentJoinPartyStatusInfoList(defaultFilters, paginationConfig)
}

onMounted(async () => {
  await getJoinPartyStatusListEvent()
  await getPartyBranchDictionaryListEvent()
  await getStudentJoinPartyStatusInfoList(defaultFilters, paginationConfig)
})
</script>

<style lang="scss" scoped>
.table-toolbar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 40px;
}

.toolbar-right {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-right: 10px;
}
</style>
