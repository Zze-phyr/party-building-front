<template>
  <ContentCard title="字典配置">
    <div class="dictionary-config">
      <!-- 右上角查看配置结果按钮 -->
      <div class="config-header">
        <el-button type="primary" link @click="handleViewResult">
          查看配置结果
        </el-button>
      </div>

      <!-- 配置表单 -->
      <div class="form-scroll-container">
        <el-form 
          ref="formRef"
          :model="formData" 
          label-width="120px" 
          class="config-form"
          label-position="left"
        >
          <!-- 配置类型选择 -->
          <el-form-item label="配置类型：" required>
            <el-select
              v-model="formData.configType"
              placeholder="请选择配置类型"
              @change="handleConfigTypeChange"
              class="full-width"
              clearable
            >
              <el-option
                label="年级学院专业班级"
                value="年级学院专业班级"
              />
              <el-option
                label="年级党委党支部班级"
                value="年级党委党支部班级"
              />
            </el-select>
          </el-form-item>

          <!-- 年级选择 -->
          <el-form-item label="年级：" required>
            <el-select
              v-model="formData.gradeId"
              placeholder="请选择年级"
              @change="handleGradeChange"
              :loading="loading.grade"
              class="full-width"
              clearable
              :disabled="!formData.configType"
            >
              <el-option
                v-for="item in gradeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <!-- 年级学院专业班级配置模式 -->
          <template v-if="formData.configType === '年级学院专业班级'">
            <!-- 学院选择 -->
            <el-form-item 
              label="学院：" 
              required
            >
              <el-select
                v-model="formData.collegeId"
                placeholder="请选择学院"
                @change="handleCollegeChange"
                :loading="loading.college"
                class="full-width"
                clearable
                :disabled="!formData.gradeId"
              >
                <el-option
                  v-for="item in collegeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  :disabled="item.disabled"
                />
              </el-select>
            </el-form-item>

            <!-- 专业多选 - 使用组件 -->
            <el-form-item 
              label="专业："          >
              <CheckboxList
                v-model="formData.majorIds"
                :list="majorList"
                :loading="loading.major"
                title="可选专业"
                @change="handleMajorChange"
              />
            </el-form-item>

            <!-- 班级多选 - 使用组件 -->
            <el-form-item 
              label="班级："
            >
              <CheckboxList
                v-model="formData.classIds"
                :list="classList"
                :loading="loading.class"
                title="可选班级"
              />
            </el-form-item>
          </template>

          <!-- 年级党委党支部班级配置模式 -->
          <template v-if="formData.configType === '年级党委党支部班级'">
            <!-- 党委选择 -->
            <el-form-item 
              label="党委：" 
              required
            >
              <el-select
                v-model="formData.partyCommitteeId"
                placeholder="请选择党委"
                @change="handlePartyChange"
                :loading="loading.party"
                class="full-width"
                clearable
              >
                <el-option
                  v-for="item in partyList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  :disabled="item.disabled"
                />
              </el-select>
            </el-form-item>

            <!-- 党支部选择 -->
            <el-form-item 
              label="党支部：" 
              required
            >
              <el-select
                v-model="formData.partyBranchId"
                placeholder="请选择党支部"
                @change="handleBranchChange"
                :loading="loading.branch"
                class="full-width"
                clearable
              >
                <el-option
                  v-for="item in branchList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  :disabled="item.disabled"
                />
              </el-select>
            </el-form-item>

            <!-- 班级多选 - 使用组件 -->
            <el-form-item 
              label="班级："
              v-if="formData.partyBranchId"
            >
              <CheckboxList
                v-model="formData.classIds"
                :list="classList"
                :loading="loading.class"
                title="可选班级"
              />
            </el-form-item>
          </template>
        </el-form>
      </div>

      <div class="form-footer">
        <div class="footer-content">
          <el-button 
            type="primary" 
            @click="handleSubmit"
            :disabled="!canSubmit"
            :loading="submitting"
          >
            组成配置
          </el-button>
          <el-button 
            @click="handleReset"
          >
            重置
          </el-button>
        </div>
      </div>
    </div>
  </ContentCard>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import CheckboxList from './components/checkbox-list.vue'  // 引入组件
import { adminApi } from '@/api/admin'
// ==================== 响应式数据定义 ====================

// 表单数据
const formData = reactive({
  configType: '年级学院专业班级',           // 配置类型
  gradeId: null,           // 年级ID
  collegeId: null,         // 学院ID
  partyCommitteeId: null,  // 党委ID
  partyBranchId: null,     // 党支部ID
  majorIds: [],            // 专业ID数组
  classIds: []             // 班级ID数组
})

// 数据列表
const gradeList = ref([])       // 年级列表
const collegeList = ref([])     // 学院列表
const partyList = ref([])       // 党委列表
const branchList = ref([])      // 党支部列表
const majorList = ref([])       // 专业列表
const classList = ref([])       // 班级列表

// 加载状态
const loading = reactive({
  grade: false,
  college: false,
  party: false,
  branch: false,
  major: false,
  class: false
})

// 提交状态
const submitting = ref(false)

// 表单引用
const formRef = ref(null)

const dataCache = new Map()

const canSubmit = computed(() => {
  if (!formData.configType || !formData.gradeId) return false
  
  if (formData.configType === '年级学院专业班级') {
    return formData.collegeId !== null
  }
  
  if (formData.configType === '年级党委党支部班级') {
    return formData.partyCommitteeId !== null && formData.partyBranchId !== null
  }
  
  return false
})
// ==================== 数据加载方法 ====================
const loadList = async (type) => {
  const cacheKey = `${type}_list`
  if (dataCache.has(cacheKey)) {
    // 根据类型设置对应的列表
    switch (type) {
      case 'grade':
        gradeList.value = dataCache.get(cacheKey)
        break
      case 'college':
        collegeList.value = dataCache.get(cacheKey)
        break
      case 'partyCommittee':
        partyList.value = dataCache.get(cacheKey)
        break
      case 'partyBranch':
        branchList.value = dataCache.get(cacheKey)
        break
      case 'major':
        majorList.value = dataCache.get(cacheKey)
        break
      case 'class':
        classList.value = dataCache.get(cacheKey)
        break
    }
    return
  }
  loading[type] = true
  try {
    let res = null
    switch (type) {
      case 'grade':
        res = await adminApi.getGradeDictionaryList()
        if (res && res.data) {
          gradeList.value = res.data.data.records
          dataCache.set(cacheKey, gradeList.value)
        }
        break
      case 'college':
        res = await adminApi.getCollegeDictionaryList()
        if (res && res.data) {
          collegeList.value = res.data.data
          dataCache.set(cacheKey, collegeList.value)
        }
        break
      case 'partyCommittee':
        res = await adminApi.getPartyCommitteeDictionaryList()
        if (res && res.data) {
          partyList.value = res.data.data
          dataCache.set(cacheKey, partyList.value)
        }
        break
      case 'partyBranch':
        res = await adminApi.getPartyBranchDictionaryList()
        if (res && res.data) {
          branchList.value = res.data.data
          dataCache.set(cacheKey, branchList.value)
        }
        break
      case 'major':
        res = await adminApi.getMajorDictionaryList({ collegeId: formData.collegeId })
        if (res && res.data) {
          majorList.value = res.data.data.records
          dataCache.set(cacheKey, majorList.value)
        }
        break
      case 'class':
        res = await adminApi.getClassDictionaryList({ partyBranchId: formData.partyBranchId })
        if (res && res.data) {
          classList.value = res.data.data
          dataCache.set(cacheKey, classList.value)
        }
        break
    }
    console.log(`${type}列表加载完成`, res)
    ElMessage.success(`${type}列表加载完成`)
  } catch (error) {
    console.error(`加载${type}列表失败:`, error)
    ElMessage.error(`加载${type}列表失败，请稍后重试`)
  } finally {
    loading[type] = false
  }
}

// 配置类型变更
const handleConfigTypeChange = async (value) => {
  if (!value) return
  
  // 如果有已选数据，提示确认
  if (formData.gradeId || formData.collegeId || formData.partyCommitteeId) {
    try {
      await ElMessage.confirm(
        '切换配置类型将清空当前已选择的数据，是否继续？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      
      // 用户确认，重置表单数据
      resetFormData(false)
    } catch {
      // 用户取消，恢复原值
      const oldValue = value === 'grade-college-major-class' 
        ? 'grade-party-branch-class' 
        : 'grade-college-major-class'
      formData.configType = oldValue
    }
  }

}

// 年级变更
const handleGradeChange = async (value) => {
  // 清空下级数据
  formData.collegeId = null
  formData.partyCommitteeId = null
  formData.partyBranchId = null
  formData.majorIds = []
  formData.classIds = []
  
  collegeList.value = []
  partyList.value = []
  branchList.value = []
  majorList.value = []
  classList.value = []
  
  if (!value) return
  
  // 根据配置类型加载对应数据
  if (formData.configType === '年级学院专业班级') {
    await loadList('college')
  } else if (formData.configType === '年级党委党支部班级') {
    await loadList('partyCommittee')
  }
}

// 学院变更
const handleCollegeChange = async (value) => {
  // 清空下级数据
  formData.majorIds = []
  formData.classIds = []
  majorList.value = []
  classList.value = []
  
  if (!value) return
  
  await loadList('major')
}

// 党委变更
const handlePartyChange = async (value) => {
  // 清空下级数据
  formData.partyBranchId = null
  formData.classIds = []
  branchList.value = []
  classList.value = []
  
  if (!value) return
  
  await loadList('partyBranch')
}

// 党支部变更
const handleBranchChange = async (value) => {
  // 清空下级数据
  formData.classIds = []
  classList.value = []
  
  if (!value) return
  
  await loadList('class')
}

// 专业变更
const handleMajorChange = async (value) => {
  // 清空班级数据
  formData.classIds = []
  classList.value = []
  
  if (!value || !value.length) return
  
  await loadList('class')
}

// 查看配置结果
const handleViewResult = () => {
  
}

// 重置表单
const handleReset = async () => {
  
}

// 提交配置
const handleSubmit = async () => {
  if (!canSubmit.value) {
    ElMessage.warning('请完成必填项选择')
    return
  }
  
  const submitData = formatSubmitData()
  
  console.log('提交配置数据:', submitData)
  
  submitting.value = true
  try {
    // 这里调用实际的提交接口
    // await adminApi.submitDictionaryConfig(submitData)
    
    // 模拟提交延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('配置提交成功')
    
    // 可以选择是否重置表单或跳转页面
    // resetFormData(true)
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('配置提交失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

// ==================== 工具方法 ====================

// 格式化提交数据
const formatSubmitData = () => {
  const baseData = {
    configType: formData.configType,
    grade: gradeList.value.find(item => item.id === formData.gradeId) || null
  }
  
  if (formData.configType === '年级学院专业班级') {
    return {
      ...baseData,
      college: collegeList.value.find(item => item.id === formData.collegeId) || null,
      majors: majorList.value.filter(item => formData.majorIds.includes(item.id)),
      classes: classList.value.filter(item => formData.classIds.includes(item.id)),
      majorCount: formData.majorIds.length,
      classCount: formData.classIds.length
    }
  }
  
  if (formData.configType === '年级党委党支部班级') {
    return {
      ...baseData,
      partyCommittee: partyList.value.find(item => item.id === formData.partyCommitteeId) || null,
      partyBranch: branchList.value.find(item => item.id === formData.partyBranchId) || null,
      classes: classList.value.filter(item => formData.classIds.includes(item.id)),
      classCount: formData.classIds.length
    }
  }
  
  return baseData
}

// 重置表单数据
const resetFormData = (resetType = true) => {
  if (resetType) {
    formData.configType = ''
  }
  formData.gradeId = null
  formData.collegeId = null
  formData.partyCommitteeId = null
  formData.partyBranchId = null
  formData.majorIds = []
  formData.classIds = []
  
  collegeList.value = []
  partyList.value = []
  branchList.value = []
  majorList.value = []
  classList.value = []
}

// ==================== 生命周期 ====================

onMounted(() => {
  // 初始化加载年级列表
  loadList('grade')
})
</script>

<style scoped lang="scss">
.dictionary-config {
  position: relative;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 200px); // 根据实际情况调整高度
  min-height: 500px;
  max-height: 800px;
  background: #fff;
  
  .config-header {
    position: absolute;
    top: -50px;
    right: 20px;
    z-index: 10;
  }
  
  // 可滚动的表单容器
  .form-scroll-container {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0px 20px;
    
    // 滚动条样式
    &::-webkit-scrollbar {
      width: 8px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #C0C4CC;
      border-radius: 4px;
      
      &:hover {
        background: #A8ABB2;
      }
    }
    
    &::-webkit-scrollbar-track {
      background: #F5F7FA;
      border-radius: 4px;
    }
  }
  
  .config-form {
    margin: 0 auto;
    padding-bottom: 20px; // 给底部留出一些空间
    
    .full-width {
      width: 100%;
    }
    
    :deep(.el-form-item__label) {
      font-weight: 500;
      color: #303133;
    }
  }
  
  // 固定在底部的按钮区域
  .form-footer {
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    border-top: 1px solid #EBEEF5;
    padding: 16px 20px 0;
    z-index: 100;
    
    .footer-content {
      max-width: 700px;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
    }
  }
}
</style>