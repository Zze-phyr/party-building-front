<template>
  <ContentCard title="配置结果">
    <div class="dictionary-result">
      <!-- 退回当前页面 -->
      <div class="back-button">
        <el-button link type="primary" @click="$router.back()">返回</el-button>
      </div>
      <!-- 左侧：年级学院专业班级 -->
      <div class="tree-section">
        <DictionaryTree
          ref="academicTreeRef"
          title="年级学院专业班级"
          tree-type="academic"
          :tree-config="academicConfig"
          @add="handleAdd"
          @delete="handleDelete"
          @refresh="handleRefresh"
        />
      </div>

      <!-- 分割线 -->
      <el-divider direction="vertical" class="divider" />

      <!-- 右侧：年级党委党支部班级 -->
      <div class="tree-section">
        <!-- <DictionaryTree
          ref="partyTreeRef"
          title="年级党委党支部班级"
          tree-type="party"
          :tree-config="partyConfig"
          @add="handleAdd"
          @delete="handleDelete"
          @refresh="handleRefresh"
        /> -->
      </div>
    </div>
  </ContentCard>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import DictionaryTree from './components/dictionary-tree.vue'
import { createAcademicLoader, createPartyLoader } from '@/utils/dictionary-loader'

// 树组件引用
const academicTreeRef = ref(null)
const partyTreeRef = ref(null)

// 学院体系配置
const academicConfig = reactive({
  levels: [
    { type: 'grade', label: '年级', icon: 'Calendar', loadMethod: 'loadGrades' },
    { type: 'college', label: '学院', icon: 'School', loadMethod: 'loadGradeCollege' },
    { type: 'major', label: '专业', icon: 'Reading', loadMethod: 'loadCollegeMajor' },
    { type: 'class', label: '班级', icon: 'User', loadMethod: 'loadMajorClass' }
  ],
  loader: createAcademicLoader()
})

// 党组织体系配置
const partyConfig = reactive({
  levels: [
    { type: 'grade', label: '年级', icon: 'Calendar', loadMethod: 'loadGradeCommittee' },
    { type: 'committee', label: '党委', icon: 'Star', loadMethod: 'loadCommitteeBranch' },
    { type: 'branch', label: '党支部', icon: 'Flag', loadMethod: 'loadBranchClass' },
    { type: 'class', label: '班级', icon: 'User', loadMethod: null }
  ],
  loader: createPartyLoader()
})

// 添加节点处理
const handleAdd = async ({ node, data, treeType }) => {
  try {
    console.log('添加节点:', { node, data, treeType })
    ElMessage.warning('添加功能待实现')
  } catch (error) {
    console.error('添加节点失败:', error)
    ElMessage.error('添加失败')
  }
}

// 删除节点处理
const handleDelete = async ({ node, data, treeType }) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除"${data.label}"吗？删除后将无法恢复。`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    console.log('删除节点:', { node, data, treeType })
    ElMessage.warning('删除功能待实现')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除节点失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 刷新处理
const handleRefresh = ({ treeType }) => {
  if (treeType === 'academic') {
    academicTreeRef.value?.refresh()
  } else {
    partyTreeRef.value?.refresh()
  }
  ElMessage.success('刷新成功')
}
</script>

<style scoped lang="scss">
.dictionary-result {
  display: flex;
  gap: 16px;
  height: calc(100vh - 250px);
  min-height: 600px;
  max-height: 800px;
  position: relative;

  .back-button {
    position: absolute;
    top: -50px;
    right: 16px;
  }

  .tree-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 4px;
    overflow: hidden;
  }

  .divider {
    height: auto;
    margin: 0;
    border-left: 2px solid #EBEEF5;
  }
}
</style>
