<template>
  <ContentCard title="文件查看">
    <div class="table-container">
      <ProTable
        :data="tableData"
        :columns="columns"
        :loading="tableLoading"
        :pagination="paginationConfig"
        :showPagination="true"
        :search-config="searchConfig"
        row-key="fileId"
        @selection-change="handleSelectionChange"
        @refresh="handleRefresh"
      >
        <!-- 自定义工具栏按钮 -->
        <template #toolbar>
          <el-button type="primary">
            批量删除
          </el-button>
          <el-button type="primary">
            批量下载
          </el-button>
        </template>
        <!-- 操作列插槽 -->
        <template #column-action="{ row }">
          <el-button link type="primary" size="small" @click="handleEdit(row)">
            修改
          </el-button>
        </template>
      </ProTable>
    </div>
  </ContentCard>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeMount, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { adminApi } from '@/api/admin.js'

const tableData = ref([])
const tableLoading = ref(false)
const materialTypeOptions = ref([])

// 选中的行
const selectedRows = ref([])

// 分页配置
const paginationConfig = reactive({
  currentPage: 1,
  currentPageSize: 10,
  total: 0,
  pageSize: 10,
  pageSizes: [10, 20, 50, 100],
  layout: 'total, sizes, prev, pager, next, jumper'
})

// 表格列配置
const columns = [
  {
    type: 'selection',
    width: 55,
    fixed: 'left'
  },
  {
    prop: 'fileName',
    label: '文件名',
    align: 'left',
    minWidth: 200,
    showOverflowTooltip: true
  },
  {
    prop: 'fileType',
    label: '材料类型',
    align: 'center',
    width: 120
  },
  {
    prop: 'attachText',
    label: '阶段任务',
    align: 'center',
    width: 150
  },
  {
    prop: 'attachTime',
    label: '批次',
    align: 'center',
    width: 120
  },
  {
    prop: 'uploadTime',
    label: '上传时间',
    align: 'center',
    width: 180
  },
  {
    prop: 'status',
    label: '状态',
    align: 'center',
    width: 80,
    slot: 'status'
  },
  {
    prop: 'action',
    label: '操作',
    align: 'center',
    width: 100,
    fixed: 'right',
    slot: 'action'
  }
]

// 筛选配置
const searchConfig = computed(() => [
  {
    props: 'fileName',
    label: '文件名',
    type: 'input',
    placeholder: '请输入文件名'
  },
  {
    prop: 'fileType',
    label: '文件类型',
    type: 'select',
    placeholder: '请选择文件类型',
    options: [
      ...materialTypeOptions.value
    ]
  },
])

/**
 * 获取文件类型列表事件处理函数
 * 该函数用于从后端获取文件类型列表，并筛选出包含"模板"或"讲解视频"的类型，
 * 然后将这些类型转换为下拉选项格式存储到materialTypeOptions中
 * @returns {Promise<void>} 无返回值的Promise
 */
const getFileTypeListEvent = async () => {
  try {
    const response = await adminApi.getFileTypeList()
    if (response.data.code === 1) {
      // 筛选出包含"模板"或"讲解视频"的文件类型，并映射为下拉选项格式
      materialTypeOptions.value = response.data.data
        .map(item => ({
          label: item.comment,
          value: item.type
        }))
    } else {
      ElMessage.error('获取文件类型列表失败')
    }
  } catch (error) {
    ElMessage.error('获取文件类型列表失败')
  }
}

/**
 * 选择变化处理
 * @param {Array} selection - 选中的行数据数组
 */
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
  console.log('当前选中的行:', selectedRows.value)
}

onMounted(async () => {
  await getFileTypeListEvent()
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
