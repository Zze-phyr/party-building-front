<template>
  <ContentCard title="审核上传">
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
</template>

<script setup>
import ContentCard from '@/components/admin/ContentCard.vue'
import { reactive, ref, onMounted, computed } from 'vue'
import { adminApi } from '@/api/admin'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import { EPermission } from '@/types/constants/auth'

const router = useRouter()
const userInfo = useUserStore().userInfo

const auth = computed(() => userInfo?.permission[1])

const tableData = ref([])

// 加载状态
const loading = ref(false)

const selectedRows = ref([])

const isFrontPagination = ref(true)

const taskDictionaryList = ref([])

const batchIdList = ref([])

// 获取党支部列表
const partyBranchDictionaryList = ref([])

// 获取入党状态列表
const joinPartyStatusList = ref([])

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
    prop: 'phone',
    label: '手机号',
    align: 'center',
    width: 120
  },
  {
    prop: 'updateUser',
    label: '处理人',
    align: 'center',
  },
  {
    prop: 'updateStatus',
    label: '处理状态',
    align: 'center',
    width: 100,
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
  task: null,
  branch: null,
  partyStatus: null,
  batch: null,
}

// 筛选配置
const searchConfig = computed(() => [
  {
    prop: 'task',
    label: '任务',
    type: 'select',
    placeholder: '请选择任务',
    // 在 computed 内部，Vue 会自动追踪 taskDictionaryList 的变化
    options: taskDictionaryList.value
  },
  {
    prop: 'branch',
    label: '所属党支部',
    type: 'select',
    placeholder: '请选择所属党支部',
    options: partyBranchDictionaryList.value
  },
  {
    prop: 'partyStatus',
    label: '状态',
    type: 'select',
    placeholder: '请选择状态',
    options: joinPartyStatusList.value
  },
  {
    prop: 'batch',
    label: '批次ID',
    type: 'select',
    placeholder: '请选择批次ID',
    options: batchIdList.value
  },
])

const getTaskListEvent = async () => {
  const res = await adminApi.getFileTypeList()
  console.log(res)
  if (res.data.code !== 1) {
    ElMessage.error('获取任务列表失败')
    return
  }
  taskDictionaryList.value = res.data.data.map(item => {
    if (item.comment === '头像') return null;
    if (item.comment.includes('模板') || item.comment.includes('讲解视频')) return null;
    return {
      label: item.comment,
      value: item.type
    }
  }).filter(item => item !== null)
  console.log(taskDictionaryList.value)
}

const getBatchIdListEvent = async () => {
  const res = await adminApi.getBatch({
    statusEnum: 'ENABLE',
    page: 1,
    pageSize: 10
  })
  console.log(res)
  if (res.data.code !== 1) {
    ElMessage.error('获取批次ID列表失败')
    return
  }
  batchIdList.value = res.data.data.records.map(item => {
    return {
      label: item.name,
      value: item.id
    }
  })
  // .filter(item => {
  //   if (auth.value === EPermission.ADMIN || auth.value === EPermission.ORGANIZER) return true;
  //   return item.name === userInfo.batch;
  // })
  console.log(batchIdList.value)
}

const getPartyBranchDictionaryListEvent = async () => {
  const res = await adminApi.getPartyBranchDictionaryList({
    statusEnum: 'ENABLE'
  })
  console.log(res)
  if (res.data.code !== 1) {
    ElMessage.error('获取党支部列表失败')
    return
  }
  partyBranchDictionaryList.value = res.data.data.map(item => {
    return {
      label: item.name,
      value: item.id
    }
  })
  console.log(partyBranchDictionaryList.value)
}

const getJoinPartyStatusListEvent = async () => {
  const res = await adminApi.getJoinPartyStatusList()
  console.log(res)
  if (res.data.code !== 1) {
    ElMessage.error('获取入党状态列表失败')
    return
  }
  joinPartyStatusList.value = res.data.data.map(item => {
    return {
      label: item,
      value: item
    }
  })
  console.log(joinPartyStatusList.value)
}


onMounted(async () => {
  await getTaskListEvent()
  await getBatchIdListEvent()
  await getPartyBranchDictionaryListEvent()
  await getJoinPartyStatusListEvent()

  console.log(auth)
})
</script>

<style lang="scss" scoped></style>
