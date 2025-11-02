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
      >
        <!-- 自定义工具栏按钮 -->
        <template #toolbar>
          <el-button type="primary" :icon="Plus" @click="handleAdd">
            新增
          </el-button>
        </template>

        <!-- 自定义性别列 -->
        <template #column-gender="{ row }">
          <el-tag :type="row.gender === '男' ? 'primary' : 'success'" size="small">
            {{ row.gender }}
          </el-tag>
        </template>

        <!-- 自定义状态列 -->
        <template #column-status="{ row }">
          <el-tag :type="getStatusType(row.status)" size="small">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>

        <!-- 自定义操作列 -->
        <template #column-action="{ row }">
          <el-button link type="primary" size="small" @click="handleView(row)">
            查看
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
</template>

<script setup>
import { ref } from 'vue'
const tableData = ref([])

// 加载状态
const loading = ref(false)

// 选中的行
const selectedRows = ref([])

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
    sortable: true
  },
  {
    prop: 'name',
    label: '字典名称',
    width: 120
  },
  {
    prop: 'status',
    label: '状态',
    width: 100,
    align: 'center',
    slot: 'status'
  },
  {
    prop: 'createTime',
    label: '创建时间',
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
    prop: 'name',
    label: '字典名称',
    type: 'select',
    placeholder: '请选择字典名称',
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

// 获取状态类型
const getStatusType = (status) => {
  const statusMap = {
    1: 'success',
    0: 'info'
  }
  return statusMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    1: '在职',
    0: '离职'
  }
  return statusMap[status] || '未知'
}


</script>

<style lang="scss" scoped>

.table-container {
  width: 100%;
  box-sizing: border-box;
}
</style>
