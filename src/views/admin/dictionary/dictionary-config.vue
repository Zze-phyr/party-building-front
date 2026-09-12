<template>
  <ContentCard title="字典配置">
    <div class="dictionary-config">
      <!-- 右上角查看配置结果按钮 -->
      <div class="config-header">
        <el-button type="primary" link @click="handleViewResult">
          查看配置结果
        </el-button>
        <el-button link type="primary" @click="$router.back()">返回</el-button>
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
            <ScrollableSelect
              v-model="formData.gradeId"
              :list="gradeList"
              :loading="loading.grade"
              :has-more="pagination.grade.hasMore"
              :disabled="!formData.configType"
              placeholder="请选择年级"
              @change="handleGradeChange"
              @load-more="handleLoadMoreGrade"
            />
          </el-form-item>

          <!-- 年级学院专业班级配置模式 -->
          <template v-if="formData.configType === '年级学院专业班级'">
            <!-- 学院选择 -->
            <el-form-item label="学院：" required>
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

            <!-- 专业多选 - 使用组件，支持分页 -->
            <el-form-item label="专业：">
              <CheckboxList
                v-model="formData.majorIds"
                :list="majorList"
                :loading="loading.major"
                :has-more="pagination.major.hasMore"
                title="可选专业"
                @change="handleMajorChange"
                @load-more="handleLoadMoreMajor"
              />
            </el-form-item>

            <!-- 班级多选 - 使用组件 -->
            <el-form-item label="班级：">
              <CheckboxList
                v-model="formData.classIds"
                :list="classList"
                :loading="loading.class"
                :has-more="pagination.class.hasMore"
                title="可选班级"
                @load-more="handleLoadMoreClass"
              />
            </el-form-item>
          </template>

          <!-- 年级党委党支部班级配置模式 -->
          <template v-if="formData.configType === '年级党委党支部班级'">
            <!-- 党委选择 -->
            <el-form-item label="党委：" required>
              <el-select
                :disabled="!formData.gradeId"
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
            <el-form-item label="党支部：" required>
              <el-select
                :disabled="!formData.partyCommitteeId"
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

            <!-- 专业多选 - 使用组件，支持分页 -->
            <el-form-item label="专业：">
              <ScrollableSelect
                :modelValue="formData.majorIds"
                :list="majorList"
                :loading="loading.major"
                :has-more="pagination.major.hasMore"
                :load-more="handleLoadMoreMajor"
                placeholder="请选择专业"
                @change="handleMajorClassChange"
                class="full-width"
                clearable
                :disabled="!formData.partyBranchId"
              >
              </ScrollableSelect>
            </el-form-item>

            <!-- 班级多选 - 使用组件 -->
            <el-form-item label="班级：" required>
              <CheckboxList
                v-model="formData.majorClassIds"
                :list="majorClassList"
                :loading="loading.majorClass"
                :has-more="pagination.majorClass.hasMore"
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
          <el-button @click="handleOpenResetDialog(formData)">
            重置
          </el-button>
        </div>
      </div>
    </div>
  </ContentCard>
  <el-dialog
    v-model="resetDialogVisible"
    title="Tips"
    width="500"
    :before-close="handleClose"
  >
    <span>确定要重置所有配置吗？</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleResetDialogCancel">取消</el-button>
        <el-button type="primary" @click="handleResetDialogConfirm">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import CheckboxList from './components/checkbox-list.vue'
import { adminApi } from '@/api/admin'
import { useRouter } from 'vue-router'
import ScrollableSelect from '@/components/admin/ScrollableSelect.vue'
import { treeManager } from './utils/treeDataManager'
import { partyTreeManager } from './utils/partyTreeDataManager'

// ==================== 响应式数据定义 ====================
const router = useRouter()

// 表单数据
const formData = reactive({
  configType: '年级学院专业班级',
  gradeId: null,
  collegeId: null,
  partyCommitteeId: null,
  partyBranchId: null,
  majorIds: [] | null,
  classIds: [],
  majorClassIds: []
})

// 数据列表
const gradeList = ref([])
const collegeList = ref([])
const partyList = ref([])
const branchList = ref([])
const majorList = ref([])
const classList = ref([])
const majorClassList = ref([])

// 分页信息
const pagination = reactive({
  grade: {
    page: 1,
    pageSize: 10,
    total: 0,
    hasMore: false
  },
  major: {
    page: 1,
    pageSize: 20,
    total: 0,
    hasMore: false
  },
  class: {
    page: 1,
    pageSize: 20,
    total: 0,
    hasMore: false
  },
  majorClass: {
    page: 1,
    pageSize: 20,
    total: 0,
    hasMore: false
  }
})

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

// 重置确认弹窗
const resetDialogVisible = ref(false)
const resetOlderValue = ref(null)

// 数据缓存
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

/**
 * 通用列表加载方法（支持分页）
 * @param {string} type - 数据类型
 * @param {number} page - 页码
 * @param {boolean} append - 是否追加数据（用于无限滚动）
 */
const loadList = async (type, page = 1, append = false) => {
  // 如果不是追加模式，检查缓存
  if (!append) {
    const cacheKey = `${type}_list_page_${page}`
    if (dataCache.has(cacheKey)) {
      setListData(type, dataCache.get(cacheKey).records, false)
      updatePagination(type, dataCache.get(cacheKey).pagination)
      return
    }
  }

  loading[type] = true

  try {
    const currentPage = append ? pagination[type]?.page + 1 : page
    const pageSize = pagination[type]?.pageSize || 20

    const data = {
      type: type,
      statusEnum: 'ENABLE',
      page: currentPage,
      pageSize: pageSize
    }

    let res = null
    let records = []
    let total = 0

    switch (type) {
      case 'grade':
        res = await adminApi.getGradeDictionaryList(data)
        if (res?.data?.data?.records) {
          records = res.data.data.records
          total = res.data.data.total || records.length
        }
        break

      case 'college':
        res = await adminApi.getCollegeDictionaryList(data)
        if (res?.data?.data) {
          records = res.data.data
          total = records.length
        }
        break

      case 'partyCommittee':
        res = await adminApi.getPartyDictionaryList(data)
        if (res?.data?.data) {
          records = res.data.data
          total = records.length
        }
        break

      case 'partyBranch':
        res = await adminApi.getPartyBranchDictionaryList(data)
        if (res?.data?.data) {
          records = res.data.data
          total = records.length
        }
        break

      case 'major':
        res = await adminApi.getMajorDictionaryList(data)
        if (res?.data?.data?.records) {
          records = res.data.data.records
          total = res.data.data.total || records.length
        }
        break

      case 'class':
        res = await adminApi.getClassDictionaryList(data)
        if (res?.data?.data) {
          records = res.data.data
          total = records.length
        }
        break

      case 'majorClass':
        res = await adminApi.getMajorClassDictionaryList(data)
        if (res?.data?.data?.records) {
          records = res.data.data.records
          total = res.data.data.total || records.length
        }
        break
    }

    console.log(`${type}列表加载完成，页码:${currentPage}，数量:${records.length}，总数:${total}`)

    // 设置数据
    setListData(type, records, append)

    // 更新分页信息
    const paginationInfo = {
      page: currentPage,
      pageSize: pageSize,
      total: total,
      hasMore: currentPage * pageSize < total
    }
    updatePagination(type, paginationInfo)

    // 缓存数据
    if (!append) {
      const cacheKey = `${type}_list_page_${currentPage}`
      dataCache.set(cacheKey, { records, pagination: paginationInfo })
    }

  } catch (error) {
    console.error(`加载${type}列表失败:`, error)
    ElMessage.error(`加载${type}列表失败，请稍后重试`)
  } finally {
    loading[type] = false
  }
}

/**
 * 设置列表数据
 */
const setListData = (type, records, append) => {
  console.log('setListData', type, records, append)
  switch (type) {
    case 'grade':
      gradeList.value = append ? [...gradeList.value, ...records] : records
      gradeList.value.sort((a, b) => {
        // 提取name中的数字部分进行比较
        const aNum = parseInt(a.name.replace(/\D/g, ''))
        const bNum = parseInt(b.name.replace(/\D/g, ''))
        return aNum - bNum
      })
      break
    case 'college':
      collegeList.value = append ? [...collegeList.value, ...records] : records
      break
    case 'partyCommittee':
      partyList.value = append ? [...partyList.value, ...records] : records
      break
    case 'partyBranch':
      branchList.value = append ? [...branchList.value, ...records] : records
      break
    case 'major':
      majorList.value = append ? [...majorList.value, ...records] : records
      break
    case 'class':
      classList.value = append ? [...classList.value, ...records] : records
      break
  }
}

/**
 * 更新分页信息
 */
const updatePagination = (type, info) => {
  if (pagination[type]) {
    Object.assign(pagination[type], info)
  }
}

/**
 * 重置分页信息
 */
const resetPagination = (type) => {
  if (pagination[type]) {
    pagination[type].page = 1
    pagination[type].total = 0
    pagination[type].hasMore = false
  }
}

// ==================== 无限滚动加载处理 ====================
const handleLoadMoreGrade = async () => {
  if (loading.grade || !pagination.grade.hasMore) return
  console.log('🔄 加载更多年级数据...')
  await loadList('grade', pagination.grade.page, true)
}

/**
 * 加载更多专业
 */
const handleLoadMoreMajor = async () => {
  if (loading.major || !pagination.major.hasMore) return
  console.log('🔄 加载更多专业数据...')
  await loadList('major', pagination.major.page, true)
}

/**
 * 加载更多班级
 */
const handleLoadMoreClass = async () => {
  if (loading.class || !pagination.class.hasMore) return
  console.log('🔄 加载更多班级数据...')
  await loadList('class', pagination.class.page, true)
}

// ==================== 表单变更处理 ====================


// 打开重置对话框
const handleOpenResetDialog = (value) => {
  resetDialogVisible.value = true
  resetOlderValue.value = value
}

// 确认重置
const handleResetDialogConfirm = async () => {
  resetFormData(false)
  resetDialogVisible.value = false
  resetOlderValue.value = null
}

// 取消重置
const handleResetDialogCancel = () => {
  formData.configType = formData.configType === '年级学院专业班级' ? '年级党委党支部班级' : '年级学院专业班级'
  resetDialogVisible.value = false
  resetOlderValue.value = null
}

// 配置类型变更
const handleConfigTypeChange = async (value) => {
  if (!value) return
  console.log('配置类型变更:', value)
  console.log('当前表单数据:', formData)

  // 如果有已选数据，提示确认
  if (formData.gradeId || formData.collegeId || formData.partyCommitteeId) {
    try {
      handleOpenResetDialog(formData)
    } catch {
      // 用户取消，恢复原值
      const oldValue = value === '年级学院专业班级'
        ? '年级党委党支部班级'
        : '年级学院专业班级'
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

  // 重置分页
  resetPagination('major')
  resetPagination('class')

  if (!value) return

  // 加载第一页专业数据
  await loadList('major', 1, false)
}

// 党委变更
const handlePartyChange = async (value) => {
  // 清空下级数据
  formData.partyBranchId = null
  formData.classIds = []
  branchList.value = []
  classList.value = []

  resetPagination('class')

  if (!value) return

  await loadList('partyBranch')
}

// 党支部变更
const handleBranchChange = async (value) => {
  // 清空下级数据
  formData.classIds = []
  classList.value = []

  resetPagination('class')

  if (!value) return

  await loadList('major', 1, false)
  await loadList('class', 1, false)
}

// 专业变更
const handleMajorChange = async (value) => {
  // 清空班级数据
  formData.classIds = []
  classList.value = []

  resetPagination('class')

  if (!value || !value.length) return

  await loadList('class', 1, false)
}

const handleMajorClassChange = (value) => {
  formData.majorClassIds = [],
  majorClassList.value = []

  resetPagination('majorClass')

  if (!value || !value.length) return

  loadList('majorClass', 1, false)
}

// 查看配置结果
const handleViewResult = () => {
  router.push({ name: 'DictionaryResult' })
}

// 提交配置
const handleSubmit = async () => {
  if (!canSubmit.value) {
    ElMessage.warning('请完成必填项选择')
    return
  }

  let submitData = formatSubmitData()
  console.log('提交配置数据:', submitData)

  submitting.value = true

  try {
    if (submitData.configType === '年级学院专业班级') {
      await handleGradeCollegeMajorClassSubmit(submitData)
    } else if (submitData.configType === '年级党委党支部班级') {
      await handleGradePartyBranchClassSubmit(submitData)
    }
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('配置提交失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

/**
 * 处理年级学院专业班级配置提交
 */
const handleGradeCollegeMajorClassSubmit = async (submitData) => {
  let gradeCollegeId = null
  let hasNewRelation = false // 标记是否有新的关联被添加

  // ==================== 第一步：处理年级-学院关联 ====================
  if (submitData.gradeId && submitData.collegeId) {
    // 1. 先在本地树形数据中查找
    const existsInTree = treeManager.findByBusinessIdInParent(
      'college',
      submitData.collegeId,
      { gradeId: submitData.gradeId }
    )

    if (existsInTree) {
      console.log('本地树形数据中已存在年级-学院关联:', existsInTree)
      gradeCollegeId = existsInTree.data.id
    } else {
      // 2. 本地不存在，从服务器查询
      const getGradeCollegeRes = await adminApi.getGradeCollege(submitData.gradeId)
      console.log('服务器查询年级-学院关联:', getGradeCollegeRes)

      if (getGradeCollegeRes.data.code === 1 && getGradeCollegeRes.data.data.length > 0) {
        // 将服务器数据同步到本地树
        treeManager.add('college', getGradeCollegeRes.data.data, { gradeId: submitData.gradeId })

        // 再次检查是否存在
        const serverCollege = getGradeCollegeRes.data.data.find(
          item => item.collegeId === submitData.collegeId
        )

        if (serverCollege) {
          console.log('服务器中已存在年级-学院关联')
          gradeCollegeId = serverCollege.id
        }
      }

      // 3. 如果仍不存在，则添加新的年级-学院关联
      if (!gradeCollegeId) {
        const addGradeCollegeRes = await adminApi.addGradeCollege({
          gradeId: submitData.gradeId,
          collegeId: submitData.collegeId
        })
        console.log('添加年级-学院关联:', addGradeCollegeRes)

        if (addGradeCollegeRes.data.code === 1) {
          gradeCollegeId = addGradeCollegeRes.data.data
          hasNewRelation = true

          // 同步到本地树
          treeManager.add('college', {
            id: gradeCollegeId,
            collegeId: submitData.collegeId,
            collegeName: submitData.collegeName,
            status: 1
          }, { gradeId: submitData.gradeId })

          console.log('✅ 成功添加年级-学院关联')
        } else {
          throw new Error('添加年级-学院关联失败')
        }
      }
    }
  }
  console.log('gradeCollegeId:', gradeCollegeId)

  // ==================== 第二步：处理学院-专业关联 ====================
  const collegeMajorIds = [] // 存储所有的学院-专业关联ID
  const newMajorIds = [] // 需要新建关联的专业ID

  if (gradeCollegeId && submitData.majorIds && submitData.majorIds.length > 0) {
    // 1. 先从服务器查询现有的学院-专业关联
    const getCollegeMajorRes = await adminApi.getCollegeMajor(gradeCollegeId)
    console.log('服务器查询学院-专业关联:', getCollegeMajorRes)

    if (getCollegeMajorRes.data.code === 1 && getCollegeMajorRes.data.data.length > 0) {
      // 同步到本地树
      treeManager.add('major', getCollegeMajorRes.data.data, {
        gradeId: submitData.gradeId,
        collegeId: submitData.collegeId
      })
    }

    // 2. 遍历所有选中的专业，检查哪些需要新建关联
    for (const majorId of submitData.majorIds) {
      // 在本地树中查找
      const existsInTree = treeManager.findByBusinessIdInParent(
        'major',
        majorId,
        {
          gradeId: submitData.gradeId,
          collegeId: submitData.collegeId
        }
      )

      if (existsInTree) {
        console.log(`专业 ${majorId} 已存在关联`)
        collegeMajorIds.push(existsInTree.data.id)
      } else {
        console.log(`专业 ${majorId} 需要新建关联`)
        newMajorIds.push(majorId)
      }
    }

    // 3. 为需要新建关联的专业添加学院-专业关联
    if (newMajorIds.length > 0) {
      for (const majorId of newMajorIds) {
        const addCollegeMajorRes = await adminApi.addCollegeMajor({
          gradeCollegeId: gradeCollegeId,
          majorId: majorId
        })
        console.log(`添加学院-专业关联 (majorId: ${majorId}):`, addCollegeMajorRes)

        if (addCollegeMajorRes.data.code === 1) {
          const collegeMajorId = addCollegeMajorRes.data.data
          collegeMajorIds.push(collegeMajorId)
          hasNewRelation = true

          // 同步到本地树
          const majorInfo = majorList.value.find(m => m.id === majorId)
          treeManager.add('major', {
            id: collegeMajorId,
            majorId: majorId,
            majorName: majorInfo?.name || '',
            status: 1
          }, {
            gradeId: submitData.gradeId,
            collegeId: submitData.collegeId
          })

          console.log(`✅ 成功添加学院-专业关联 (majorId: ${majorId})`)
        } else {
          console.error(`❌ 添加学院-专业关联失败 (majorId: ${majorId})`)
        }
      }
    }
  }

  // ==================== 第三步：处理专业-班级关联 ====================
  if (collegeMajorIds.length > 0 && submitData.classIds && submitData.classIds.length > 0) {
    let totalNewClassRelations = 0

    // 遍历每个专业
    for (let i = 0; i < collegeMajorIds.length; i++) {
      const collegeMajorId = collegeMajorIds[i]
      const majorId = submitData.majorIds[i]

      // 1. 从服务器查询现有的专业-班级关联
      const getMajorClassRes = await adminApi.getMajorClassByCollegeMajorId(collegeMajorId)
      console.log(`服务器查询专业-班级关联 (collegeMajorId: ${collegeMajorId}):`, getMajorClassRes)

      if (getMajorClassRes.data.code === 1 && getMajorClassRes.data.data.length > 0) {
        // 同步到本地树
        treeManager.add('class', getMajorClassRes.data.data, {
          gradeId: submitData.gradeId,
          collegeId: submitData.collegeId,
          majorId: majorId
        })
      }

      // 2. 检查哪些班级需要新建关联
      const newClassIds = []
      for (const classId of submitData.classIds) {
        const existsInTree = treeManager.findByBusinessIdInParent(
          'class',
          classId,
          {
            gradeId: submitData.gradeId,
            collegeId: submitData.collegeId,
            majorId: majorId
          }
        )

        if (!existsInTree) {
          newClassIds.push(classId)
        }
      }

      // 3. 添加新的专业-班级关联
      if (newClassIds.length > 0) {
        for (const classId of newClassIds) {
          const addMajorClassRes = await adminApi.addMajorClass({
            collegeMajorId: collegeMajorId,
            classId: classId
          })
          console.log(`添加专业-班级关联 (majorId: ${majorId}, classId: ${classId}):`, addMajorClassRes)

          if (addMajorClassRes.data.code === 1) {
            totalNewClassRelations++
            hasNewRelation = true

            // 同步到本地树
            const classInfo = classList.value.find(c => c.id === classId)
            treeManager.add('class', {
              id: `${collegeMajorId}_${classId}`, // 临时ID
              classId: classId,
              className: classInfo?.name || '',
              status: 1
            }, {
              gradeId: submitData.gradeId,
              collegeId: submitData.collegeId,
              majorId: majorId
            })

            console.log(`✅ 成功添加专业-班级关联 (majorId: ${majorId}, classId: ${classId})`)
          } else {
            console.error(`❌ 添加专业-班级关联失败 (majorId: ${majorId}, classId: ${classId})`)
          }
        }
      }
    }

    if (totalNewClassRelations > 0) {
      console.log(`✅ 总共添加了 ${totalNewClassRelations} 个专业-班级关联`)
    }
  }

  // ==================== 第四步：显示结果提示 ====================
  if (hasNewRelation) {
    ElMessage.success('配置提交成功！')
    // 可选：重置表单或跳转到结果页面
    resetFormData(false)
    // router.push({ name: 'DictionaryResult' })
  } else {
    ElMessage.warning('当前配置均已关联，无需重复关联')
  }
}

/**
 * 处理年级党委党支部班级配置提交
 */
const handleGradePartyBranchClassSubmit = async (submitData) => {
  let gradeCommitteeId = null
  let hasNewRelation = false // 标记是否有新的关联被添加

  if (submitData.gradeId && submitData.partyCommitteeId) {
    // 1. 先从本地树中查找
    const existsInTree = partyTreeManager.findByBusinessIdInParent(
      'committee',
      submitData.partyCommitteeId,
      { gradeId: submitData.gradeId }
    )

    if (existsInTree) {
      console.log(`党委 ${submitData.partyCommitteeId} 已存在关联`)
      gradeCommitteeId = existsInTree.data.id
    } else {
      const getGradeCommitteeRes = await adminApi.getGradeCommitteesByGradeId(submitData.gradeId)
      console.log(`查询年级党委 ${submitData.partyCommitteeId} 关联结果:`, getGradeCommitteeRes)

      if (getGradeCommitteeRes.data.code === 1 && getGradeCommitteeRes.data.data.length > 0) {
        partyTreeManager.add('committee', getGradeCommitteeRes.data.data, { gradeId: submitData.gradeId })

        const serverCommittee = getGradeCommitteeRes.data.data.find(item => item.committeeId === submitData.partyCommitteeId)
        if (serverCommittee) {
          console.log('服务器已存在年级-党委关联')
          gradeCommitteeId = serverCommittee.id
        }
      }

      if (!gradeCommitteeId) {
        const addGradeCommitteeRes = await adminApi.addGradeCommittee({
          gradeId: submitData.gradeId,
          committeeId: submitData.partyCommitteeId
        })
        console.log(`添加年级-党委关联 (gradeId: ${submitData.gradeId}, committeeId: ${submitData.partyCommitteeId}):`, addGradeCommitteeRes)

        if (addGradeCommitteeRes.data.code === 1) {
          gradeCommitteeId = addGradeCommitteeRes.data.data
          hasNewRelation = true
          partyTreeManager.add('committee', {
            id: gradeCommitteeId,
            committeeId: submitData.partyCommitteeId,
            committeeName: submitData.partyCommitteeName,
            status: 1
          }, { gradeId: submitData.gradeId })
          console.log('✅ 成功添加年级-党委关联')
        } else {
          throw new Error('添加年级-党委关联失败')
        }
      }
    }
  }
  console.log('gradeCommitteeId', gradeCommitteeId)

  let committeeBranchId = null
  if (gradeCommitteeId && submitData.partyBranchId) {
    const existsInTree = partyTreeManager.findByBusinessIdInParent(
      'branch',
      submitData.partyBranchId,
      { gradeId: submitData.gradeId, committeeId: submitData.partyCommitteeId }
    )
    if (existsInTree) {
      committeeBranchId = existsInTree.data.id
    } else {
      const getCommitteeBranchRes = await adminApi.getCommitteeBranchesByGradeCommitteeId(gradeCommitteeId)
      console.log(`查询年级-党委党支部关联结果:`, getCommitteeBranchRes)

      if (getCommitteeBranchRes.data.code === 1 && getCommitteeBranchRes.data.data.length > 0) {
        partyTreeManager.add('branch', getCommitteeBranchRes.data.data, { gradeId: submitData.gradeId, committeeId: submitData.partyCommitteeId })

        const serverBranch = getCommitteeBranchRes.data.data.find(item => item.branchId === submitData.partyBranchId)
        if (serverBranch) {
          console.log('服务器已存在年级-党委党支部关联')
          committeeBranchId = serverBranch.id
        }
      }

      if (!committeeBranchId) {
        const addCommitteeBranchRes = await adminApi.addCommitteeBranch({
          gradeCommitteeId: gradeCommitteeId,
          branchId: submitData.partyBranchId
        })
        console.log(`添加年级-党委党支部关联 (gradeCommitteeId: ${gradeCommitteeId}, branchId: ${submitData.partyBranchId}):`, addCommitteeBranchRes)

        if (addCommitteeBranchRes.data.code === 1) {
          committeeBranchId = addCommitteeBranchRes.data.data
          hasNewRelation = true
          partyTreeManager.add('branch', {
            id: committeeBranchId,
            branchId: submitData.partyBranchId,
            branchName: submitData.partyBranchName,
            status: 1
          }, { gradeId: submitData.gradeId, committeeId: submitData.partyCommitteeId })
          console.log('✅ 成功添加年级-党委党支部关联')
        } else {
          throw new Error('添加年级-党委党支部关联失败')
        }
      }
    }
  }
  console.log('committeeBranchId', committeeBranchId)

  if (committeeBranchId && submitData.classIds && submitData.classIds.length > 0) {
    let totalNewClassRelations = 0

    for (const classId of submitData.classIds) {
      const getBranchClassesRes = await adminApi.getBranchClassesByCommitteeBranchId(committeeBranchId)
      console.log(`查询年级-党委党支部班级关联结果:`, getBranchClassesRes)

      if (getBranchClassesRes.data.code === 1 && getBranchClassesRes.data.data.length > 0) {
        partyTreeManager.add('class', getBranchClassesRes.data.data, { gradeId: submitData.gradeId, committeeId: submitData.partyCommitteeId, branchId: submitData.partyBranchId })
      }

      const newClassIds = []
      for (const classId of submitData.classIds) {
        const existsInTree = partyTreeManager.findByBusinessIdInParent(
          'class',
          classId,
          {
            gradeId: submitData.gradeId,
            committeeId: submitData.partyCommitteeId,
            branchId: submitData.partyBranchId
          }
        )

        if (!existsInTree) {
          newClassIds.push(classId)
        }
      }

      if (newClassIds.length > 0) {
        for (const classId of newClassIds) {
          const addBranchClassRes = await adminApi.addBranchClass({
            committeeBranchId: committeeBranchId,
            classId: classId
          })
          console.log(`添加年级-党委党支部班级关联 (committeeBranchId: ${committeeBranchId}, classId: ${classId}):`, addBranchClassRes)

          if (addBranchClassRes.data.code === 1) {
            hasNewRelation = true
            totalNewClassRelations++

            partyTreeManager.add('class', {
              id: addBranchClassRes.data.data,
              classId: classId,
              className: classList.value.find(item => item.id === classId)?.name || null,
              status: 1
            }, { gradeId: submitData.gradeId, committeeId: submitData.partyCommitteeId, branchId: submitData.partyBranchId })
            console.log('✅ 成功添加年级-党委党支部班级关联')
          } else {
            throw new Error('添加年级-党委党支部班级关联失败')
          }
        }
      }
    }
    if (totalNewClassRelations > 0) {
      console.log(`✅ 总共添加了 ${totalNewClassRelations} 个专业-班级关联`)
    }
  }

  if (hasNewRelation) {
    ElMessage.success('配置提交成功！')
    // 可选：重置表单或跳转到结果页面
    resetFormData(false)
    // router.push({ name: 'DictionaryResult' })
  } else {
    ElMessage.warning('当前配置均已关联，无需重复关联')
  }
}

// ==================== 工具方法 ====================

// 格式化提交数据
const formatSubmitData = () => {
  const baseData = {
    configType: formData.configType,
    gradeId: gradeList.value.find(item => item.id === formData.gradeId)?.id || null,
  }

  if (formData.configType === '年级学院专业班级') {
    return {
      ...baseData,
      collegeId: collegeList.value.find(item => item.id === formData.collegeId)?.id || null,
      collegeName: collegeList.value.find(item => item.id === formData.collegeId)?.name || null,
      majorIds: majorList.value.filter(item => formData.majorIds.includes(item.id)).map(item => item.id),
      classIds: classList.value.filter(item => formData.classIds.includes(item.id)).map(item => item.id),
      majorCount: formData.majorIds.length,
      classCount: formData.classIds.length
    }
  }

  if (formData.configType === '年级党委党支部班级') {
    return {
      ...baseData,
      partyCommitteeId: partyList.value.find(item => item.id === formData.partyCommitteeId)?.id || null,
      partyBranchId: branchList.value.find(item => item.id === formData.partyBranchId)?.id || null,
      classIds: classList.value.filter(item => formData.classIds.includes(item.id)).map(item => item.id),
      classCount: formData.classIds.length
    }
  }

  return baseData
}

// 重置表单数据
const resetFormData = (resetType = true) => {
  if (resetType) {
    formData.configType = '年级学院专业班级'
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

  // 重置所有分页
  resetPagination('grade')
  resetPagination('major')
  resetPagination('class')
}

// ==================== 生命周期 ====================
onMounted( async () => {
  // 初始化加载年级列表（第一页）
  await loadList('grade', 1, false)
  treeManager.add('grade', gradeList.value)
})
</script>

<style scoped lang="scss">
// ... 样式保持不变
.dictionary-config {
  position: relative;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 200px);
  min-height: 500px;
  max-height: 800px;
  background: #fff;

  .config-header {
    position: absolute;
    top: -50px;
    right: 20px;
    z-index: 10;
  }

  .form-scroll-container {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0px 20px;

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
    padding-bottom: 20px;

    .full-width {
      width: 100%;
    }

    :deep(.el-form-item__label) {
      font-weight: 500;
      color: #303133;
    }
  }

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
