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
              <el-button type="primary">
                确认转为下一个状态
              </el-button>
              <el-button>
                中共预备党员管理
              </el-button>
            </div>
          </div>
        </template>

        <!-- 自定义操作列 -->
        <template #column-action="{ row }">
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
    label: '姓名',
    align: 'center',
    width: 120
  },
  {
    prop: 'number',
    label: '学号 / 工号',
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

// 筛选配置
const searchConfig = [
  {
    prop: 'branch',
    label: '所属党支部',
    type: 'select',
    placeholder: '请选择所属党支部',
    defaultValue: '年级',
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
    options: joinPartyStatusList
  }
]

// const get

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

onMounted(async () => {
  await getJoinPartyStatusListEvent()
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
