<template>
  <ContentCard title="查看历史领导班子">
    <!-- 搜索区域 -->
    <el-form :model="searchForm" inline class="search-form">
      <el-form-item label="所属党委">
        <el-select
          v-model="searchForm.committeeId"
          placeholder="请选择党委"
          clearable
          style="width: 200px"
        >
          <el-option
            v-for="item in committeeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="所属党支部">
        <el-select
          v-model="searchForm.branchId"
          placeholder="请先选择所属党委"
          :disabled="!searchForm.committeeId"
          clearable
          style="width: 200px"
        >
          <el-option
            v-for="item in branchOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="任期学年">
        <el-select
          v-model="searchForm.academicYear"
          placeholder="请选择学年"
          clearable
          style="width: 200px"
        >
          <el-option
            v-for="item in yearOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleSearch">
          筛选
        </el-button>
        <el-button :icon="Refresh" @click="handleReset">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 工具栏 -->
    <div class="toolbar">
      <el-button type="primary" :icon="Plus" @click="handleAdd">
        新增班子
      </el-button>
    </div>

    <!-- 结果展示区域（卡片式分组列表） -->
    <div v-loading="loading" class="result-container">
      <!-- 空状态 -->
      <el-empty v-if="!groupList.length && !loading" description="暂无数据" />

      <!-- 分组列表 -->
      <div
        v-for="(group, groupIndex) in groupList"
        :key="groupIndex"
        class="group-container"
      >
        <!-- 分组标题 -->
        <div class="group-header">
          <h3 class="group-title">{{ group.groupTitle }}</h3>
          <div class="group-actions">
            <el-icon class="action-icon" @click="handleEdit(group)">
              <Edit />
            </el-icon>
            <el-icon class="action-icon delete" @click="handleDelete(group)">
              <Delete />
            </el-icon>
          </div>
        </div>

        <!-- 成员卡片列表 -->
        <div class="member-cards">
          <div
            v-for="(member, memberIndex) in group.members"
            :key="memberIndex"
            class="member-card"
          >
            <span class="member-name">{{ member.name }}</span>
            <span class="member-position">{{ member.position }}</span>
            <span class="member-identity">{{ member.identity }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>
  </ContentCard>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, Edit, Delete } from '@element-plus/icons-vue'

// ============ 状态定义 ============

// 搜索表单
const searchForm = reactive({
  committeeId: '',
  branchId: '',
  academicYear: ''
})

// 下拉选项
const committeeOptions = ref([])
const branchOptions = ref([])
const yearOptions = ref([])

// 列表数据（嵌套结构）
const groupList = ref([])

// 分页信息
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 加载状态
const loading = ref(false)

// ============ 二级联动逻辑 ============

watch(
  () => searchForm.committeeId,
  async (newCommitteeId, oldCommitteeId) => {
    // 清空已选择的党支部
    searchForm.branchId = ''
    
    if (!newCommitteeId) {
      // 党委未选择时，清空党支部选项
      branchOptions.value = []
      return
    }
    
    // 党委切换时，重新获取党支部选项
    if (newCommitteeId !== oldCommitteeId) {
      try {
        // TODO: 调用真实接口 getPartyBranchOptions
        branchOptions.value = await fetchBranchOptions(newCommitteeId)
      } catch (error) {
        ElMessage.error('获取党支部选项失败')
      }
    }
  }
)

// ============ API 调用函数（模拟数据） ============

// 获取党委选项
const fetchCommitteeOptions = async () => {
  // TODO: 替换为真实接口调用
  // import { getPartyCommitteeOptions } from '@/api/committee'
  // return await getPartyCommitteeOptions()
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { value: '1001', label: '机关党委' },
        { value: '1002', label: '学生党委' },
        { value: '1003', label: '教工党委' }
      ])
    }, 300)
  })
}

// 获取党支部选项（二级联动）
const fetchBranchOptions = async (committeeId) => {
  // TODO: 替换为真实接口调用
  // import { getPartyBranchOptions } from '@/api/committee'
  // return await getPartyBranchOptions({ committeeId })
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockData = {
        '1001': [
          { value: '2001', label: '机关第一党支部' },
          { value: '2002', label: '机关第二党支部' }
        ],
        '1002': [
          { value: '2003', label: '本科生第一党支部' },
          { value: '2004', label: '本科生第二党支部' },
          { value: '2005', label: '研究生党支部' }
        ],
        '1003': [
          { value: '2006', label: '教工第一党支部' },
          { value: '2007', label: '教工第二党支部' }
        ]
      }
      resolve(mockData[committeeId] || [])
    }, 300)
  })
}

// 获取学年选项
const fetchYearOptions = async () => {
  // TODO: 替换为真实接口调用
  // import { getAcademicYearOptions } from '@/api/committee'
  // return await getAcademicYearOptions()
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { value: '2024-2025', label: '2024-2025' },
        { value: '2023-2024', label: '2023-2024' },
        { value: '2022-2023', label: '2022-2023' },
        { value: '2021-2022', label: '2021-2022' },
        { value: '2020-2021', label: '2020-2021' }
      ])
    }, 300)
  })
}

// 获取班子列表（分组数据）
const fetchData = async () => {
  loading.value = true
  
  try {
    const params = {
      committeeId: searchForm.committeeId,
      branchId: searchForm.branchId,
      academicYear: searchForm.academicYear,
      page: pagination.currentPage,
      pageSize: pagination.pageSize
    }
    
    // TODO: 替换为真实接口调用
    // import { getCommitteeList } from '@/api/committee'
    // const { data } = await getCommitteeList(params)
    // groupList.value = data.list
    // pagination.total = data.total
    
    // 模拟数据（嵌套结构）
    const mockResponse = await getMockCommitteeList(params)
    groupList.value = mockResponse.list
    pagination.total = mockResponse.total
  } catch (error) {
    ElMessage.error('数据加载失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 模拟接口返回的分组数据
const getMockCommitteeList = async (params) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        list: [
          {
            groupTitle: '本科生第一党支部（2023-2024）',
            committeeId: '1002',
            branchId: '2003',
            academicYear: '2023-2024',
            members: [
              { id: '10001', name: '张强', position: '党支部书记', identity: '老师' },
              { id: '10002', name: '李明', position: '党支部副书记', identity: '学生' },
              { id: '10003', name: '王丽', position: '纪律委员', identity: '学生' },
              { id: '10004', name: '赵刚', position: '组织委员', identity: '学生' },
              { id: '10005', name: '孙悦', position: '宣传委员', identity: '学生' }
            ]
          },
          {
            groupTitle: '本科生第一党支部（2022-2023）',
            committeeId: '1002',
            branchId: '2003',
            academicYear: '2022-2023',
            members: [
              { id: '10006', name: '周敏', position: '党支部书记', identity: '老师' },
              { id: '10007', name: '吴涛', position: '党支部副书记', identity: '学生' },
              { id: '10008', name: '郑芳', position: '纪律委员', identity: '学生' },
              { id: '10009', name: '钱伟', position: '组织委员', identity: '学生' }
            ]
          },
          {
            groupTitle: '研究生党支部（2023-2024）',
            committeeId: '1002',
            branchId: '2005',
            academicYear: '2023-2024',
            members: [
              { id: '10010', name: '陈杰', position: '党支部书记', identity: '老师' },
              { id: '10011', name: '林娜', position: '党支部副书记', identity: '学生' },
              { id: '10012', name: '黄勇', position: '组织委员', identity: '学生' }
            ]
          }
        ],
        total: 15
      })
    }, 500)
  })
}

// ============ 事件处理函数 ============

// 搜索
const handleSearch = () => {
  pagination.currentPage = 1
  fetchData()
}

// 重置
const handleReset = () => {
  searchForm.committeeId = ''
  searchForm.branchId = ''
  searchForm.academicYear = ''
  pagination.currentPage = 1
  fetchData()
}

// 分页：每页数量变化
const handleSizeChange = (newSize) => {
  pagination.pageSize = newSize
  pagination.currentPage = 1
  fetchData()
}

// 分页：页码变化
const handlePageChange = (newPage) => {
  pagination.currentPage = newPage
  fetchData()
}

// 新增班子
const handleAdd = () => {
  // TODO: 打开新增弹窗
  ElMessage.info('打开新增班子弹窗（待实现）')
}

// 编辑班子
const handleEdit = (group) => {
  // TODO: 打开编辑弹窗，回显数据
  ElMessage.info(`编辑班子：${group.groupTitle}（待实现）`)
  console.log('编辑数据：', group)
}

// 删除班子
const handleDelete = (group) => {
  ElMessageBox.confirm(
    `确定要删除"${group.groupTitle}"的班子信息吗？此操作不可恢复。`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(async () => {
      try {
        // TODO: 调用删除接口
        // import { deleteCommitteeGroup } from '@/api/committee'
        // await deleteCommitteeGroup(group.id)
        
        ElMessage.success('删除成功')
        fetchData()
      } catch (error) {
        ElMessage.error('删除失败')
      }
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

// ============ 生命周期 ============

onMounted(async () => {
  // 初始化下拉选项
  committeeOptions.value = await fetchCommitteeOptions()
  yearOptions.value = await fetchYearOptions()
  
  // 加载列表数据
  fetchData()
})
</script>

<style lang="scss" scoped>
// ============ 搜索区域样式 ============
.search-form {
  margin-bottom: 16px;
  
  :deep(.el-form-item) {
    margin-bottom: 16px;
  }
}

// ============ 工具栏样式 ============
.toolbar {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
}

// ============ 结果展示区域样式 ============
.result-container {
  min-height: 400px;
}

// ============ 分组容器样式 ============
.group-container {
  margin-bottom: 32px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

// ============ 分组标题样式 ============
.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  margin-bottom: 16px;
  border-bottom: 1px solid #DCDFE6;
  
  .group-title {
    margin: 0;
    font-size: 16px;
    font-weight: bold;
    color: #303133;
  }
  
  .group-actions {
    display: flex;
    gap: 12px;
    
    .action-icon {
      font-size: 18px;
      color: #606266;
      cursor: pointer;
      transition: color 0.3s;
      
      &:hover {
        color: #409EFF;
      }
      
      &.delete:hover {
        color: #F56C6C;
      }
    }
  }
}

// ============ 成员卡片列表样式 ============
.member-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

// ============ 单张成员卡片样式 ============
.member-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 20px;
  background-color: #F5F7FA;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
  
  // 响应式布局
  flex: 1 1 calc(25% - 12px); // 默认4列
  min-width: 240px;
  
  @media (max-width: 1400px) {
    flex: 1 1 calc(33.333% - 12px); // 中屏3列
  }
  
  @media (max-width: 992px) {
    flex: 1 1 calc(50% - 12px); // 小屏2列
  }
  
  @media (max-width: 576px) {
    flex: 1 1 100%; // 超小屏1列
  }
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  // 姓名样式
  .member-name {
    font-size: 14px;
    font-weight: bold;
    color: #303133;
    white-space: nowrap;
  }
  
  // 职位样式（红色重点标识）
  .member-position {
    font-size: 14px;
    color: #F56C6C;
    white-space: nowrap;
  }
  
  // 身份样式
  .member-identity {
    font-size: 14px;
    color: #606266;
    white-space: nowrap;
  }
}

// ============ 分页样式 ============
.pagination-container {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}
</style>