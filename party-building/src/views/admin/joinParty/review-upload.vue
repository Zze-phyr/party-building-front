<template>
  <ContentCard title="审核上传">
    <!-- 筛选表单 -->
    <el-form :inline="true" :model="filterForm" ref="filterFormRef" class="filter-form">
      <el-form-item>
        <!-- 直接搜索 -->
        <el-input v-model="search" style="max-width: 240px" placeholder="请输入姓名或者学号查询">
          <template #append>
            <el-button class="search-btn" :icon="Search" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="阶段任务">
        <el-tree-select
          v-model="filterForm.task"
          :data="taskData"
          :render-after-expand="false"
          placeholder="请选择任务"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="批次">
        <el-select v-model="filterForm.batchId" placeholder="请选择批次" style="width: 240px">
          <el-option
            v-for="item in batchData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button color="#d12626" @click="onSubmit">确认筛选</el-button>
      </el-form-item>
    </el-form>
  </ContentCard>
</template>

<script setup>
import ContentCard from '@/components/admin/ContentCard.vue'
import { reactive, ref, onMounted } from 'vue'
import { getBatch } from '@/api/admin'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

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

// 直接搜索
const search = ref('')

// 筛选表单
const filterForm = reactive({
  task: '', //任务
  batchId: '', //批次
})
// 筛选表单实例
const filterFormRef = ref()

const onSubmit = () => {
  console.log('submit!')
  console.log(filterForm)
}
</script>

<style lang="scss" scoped>
.filter-form {
  display: flex;
  justify-content: center;
  width: 100%;
  .search-btn {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    /* 悬停状态 */
    &:hover {
      color: #bc0000 !important;
      border-color: #bc0000 !important;
      background-color: #feeaea !important;
    }
    /* 点击状态 */
    &:active {
      color: #feeaea !important;
      background-color: #bc0000 !important;
    }
  }
}
</style>
