<template>
  <ContentCard title="审核上传">
    <!-- 筛选表单 - 使用动态筛选表单组件 -->
    <DynamicFilterForm
      v-model:model="filterForm"
      :formItems="formItems"
      :searchPlaceholder="'请输入姓名或者学号查询'"
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
import { reactive, ref, onMounted, computed } from 'vue'
import { adminApi } from '@/api/admin'
import { ElMessage } from 'element-plus'
import { getFormItems } from './config/review-upload-form-items.js'

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
    const { data } = await adminApi.getBatch()
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

// 筛选表单
const filterForm = reactive({
  task: '', //任务
  batchId: '', //批次
})

// 表单配置项 - 定义要显示的表单项及其类型
// 传.value才能保持响应性
const formItems = computed(() => getFormItems(batchData.value))

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
