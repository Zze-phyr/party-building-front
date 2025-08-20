<template>
  <ContentCard title="审核上传">
    <!-- 筛选表单 - 使用动态筛选表单组件 -->
    <DynamicFilterForm
      v-model:model="filterForm"
      :form-items="formItems"
      :search-placeholder="'请输入姓名或者学号查询'"
      :loading="loading"
      @search="handleSeach"
      @submit="onSubmit"
    />
    <!-- 表格数据展示 -->
    <el-table :data="currentTableData" style="width: 100%">
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="branch" label="党支部" />
      <el-table-column prop="partyStatus" label="入党状态" />
      <el-table-column prop="number" label="学号" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="auditStatus" label="审核状态" />
      <el-table-column v-if="false" prop="uploadStatus" label="上传状态" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)"> Edit </el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页展示 -->
    <el-pagination :page-size="20" :pager-count="11" layout="prev, pager, next" :total="1000" />
  </ContentCard>
</template>

<script setup>
import ContentCard from '@/components/admin/ContentCard.vue'
import DynamicFilterForm from '@/components/admin/DynamicFilterForm.vue'
import { reactive, ref, onMounted } from 'vue'
import { getBatch } from '@/api/admin'
import { ElMessage } from 'element-plus'

// 编辑操作
const handleEdit = (index, row) => {
  console.log(index)
  console.log(row)
}

// 删除操作
const handleDelete = (index, row) => {
  console.log(index)
  console.log(row)
}

// 批次数据
const batchData = ref([
  { value: '1', label: '2023-2024-1' },
  { value: '2', label: '2023-2024-2' },
])

onMounted(async () => {
  try {
    const { data } = await getBatch()
    if (data.code === 1) {
      batchData.value = data.records.map((item) => ({
        value: item.id,
        label: item.name,
      }))
    } else {
      ElMessage.error(data.msg)
    }
  } catch (error) {
    console.log(error)
    ElMessage.error('数据获取失败')
  }
})

// 任务数据
const taskData = [
  {
    label: '申请入党',
    children: [
      {
        value: '审核入党申请书',
      },
    ],
  },
  {
    label: '入党积极分子的确定和培养教育',
    children: [
      {
        value: '审核入党积极分子培养联系人',
      },
      {
        value: '审核手册一',
      },
      {
        value: '上传入党积极分子结业证书',
      },
    ],
  },
  {
    label: '发展对象的确定和考察',
    children: [
      {
        value: '审核自传',
      },
      {
        value: '审核入党志愿书（部分）',
      },
      {
        value: '审核手册二',
      },
      {
        value: '上传发展对象结业证书',
      },
    ],
  },
  {
    label: '预备党员的接收',
    children: [
      {
        value: '审核入党志愿书（部分）',
      },
      {
        value: '上传吸收大会会议记录',
      },
      {
        value: '上传与上级党委联系人谈话记录',
      },
      {
        value: '上传入党宣誓会议记录',
      },
    ],
  },
  {
    label: '预备党员的教育考察和转正',
    children: [
      {
        value: '上传支部大会会议记录',
      },
    ],
  },
]

// 筛选表单
const filterForm = reactive({
  task: '', //任务
  batchId: '', //批次
})

// 表单配置项 - 定义要显示的表单项及其类型
const formItems = [
  {
    id: '1',
    type: 'tree-select',
    label: '阶段任务',
    prop: 'task',
    data: taskData,
    placeholder: '请选择任务',
  },
  {
    id: '2',
    type: 'select',
    label: '批次',
    prop: 'batchId',
    options: batchData,
    placeholder: '请选择批次',
  },
]

// 加载状态
const loading = ref(false)

// 处理搜索事件
const handleSeach = (searchValue) => {
  console.log('搜索:', searchValue)
  // 执行搜索逻辑
}

// 处理提交事件
const onSubmit = (formData) => {
  console.log('提交筛选:', formData)
  // 执行搜索逻辑
}
</script>

<style lang="scss" scoped></style>
