<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="500px"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="90px"
      label-position="top"
    >
      <el-form-item label="字典类型" prop="type">
        <el-select
          v-model="formData.type"
          placeholder="请选择字典类型"
          style="width: 100%"
          clearable
          :disabled="isEditMode"
          @change="handleDictTypeChange"
        >
          <el-option
            v-for="item in dictTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="字典名称" prop="name">
        <el-input
          v-model="formData.name"
          :placeholder="defaultDictNamePlaceholder"
          maxlength="50"
          show-word-limit
          clearable
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button
          type="primary"
          @click="handleConfirm"
          :loading="submitLoading"
        >
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'

// ==================== Props 定义 ====================
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  // 编辑模式的数据
  editData: {
    type: Object,
    default: null
  },
  // 是否为编辑模式
  isEdit: {
    type: Boolean,
    default: false
  }
})

// ==================== Emits 定义 ====================
const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

// ==================== 响应式数据 ====================
// 对话框显示状态
const dialogVisible = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

// 是否为编辑模式
const isEditMode = computed(() => props.isEdit)

// 对话框标题
const dialogTitle = computed(() => {
  return isEditMode.value ? '编辑字典' : '新增字典'
})

// 表单引用
const formRef = ref(null)

// 提交加载状态
const submitLoading = ref(false)

// 表单数据
const formData = reactive({
  id: '',
  type: '',
  name: ''
})

// 字典类型选项
const dictTypeOptions = [
  { label: '年级', value: '年级' },
  { label: '学院', value: '学院' },
  { label: '专业', value: '专业' },
  { label: '班级', value: '班级' },
  { label: '党委', value: '党委' },
  { label: '党支部', value: '党支部' }
]

const dictNamePlaceholderMap = {
  年级: '格式要求为“00-99级”，如"00级"',
  学院: '格式要求为“2-30个字符，支持中文”，如"计算机科学与工程学院"',
  专业: '格式要求为“2-30个字符，支持中文”，如"计算机科学与技术专业"',
  班级: '格式要求为“汉字数字 + 班”，如"一班"',
  党委: '格式要求：以“中共湖南科技大学”开头，“委员会”结尾，如"中共湖南科技大学委员会"',
  党支部: '以"本科生"或"研究生"开头，中间包含"第x党支部"，其中x为一位或两位中文数字，如"本科生第一党支部"'
}

const defaultDictNamePlaceholder = computed(() => {
  return dictNamePlaceholderMap[formData.type] || '请输入字典名称'
})

// ==================== 校验规则 ====================

/**
 * 年级校验器
 * 规则: 2位数字，范围 00-99
 */
const validateGrade = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入年级'))
    return
  }

  // 校验格式：必须是2位数字 + "级"
  const gradePattern = /^\d{2}级$/
  if (!gradePattern.test(value)) {
    callback(new Error('年级格式错误,请输入00-99之间的年份'))
    return
  }

  // 校验范围：00-99
  const year = parseInt(value.slice(0, 2))
  if (year < 0 || year > 99) {
    callback(new Error('年级格式错误,请输入00-99之间的年份'))
    return
  }

  callback()
}

/**
 * 学院校验器
 * 规则: 2-20个字符，支持中文
 */
const validateCollege = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入学院名称'))
    return
  }

  // 校验长度
  if (value.length < 2 || value.length > 20) {
    callback(new Error('学院名称长度为2-20个字符'))
    return
  }

  // 校验字符：只允许中文
  const collegePattern = /^[\u4e00-\u9fa5]+$/
  if (!collegePattern.test(value)) {
    callback(new Error('学院名称只能包含中文'))
    return
  }

  callback()
}

/**
 * 专业校验器
 * 规则: 2-30个字符，支持中文
 */
const validateMajor = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入专业名称'))
    return
  }

  // 校验长度
  if (value.length < 2 || value.length > 30) {
    callback(new Error('专业名称长度为2-30个字符'))
    return
  }

  // 校验字符：只允许中文
  const majorPattern = /^[\u4e00-\u9fa5]+$/
  if (!majorPattern.test(value)) {
    callback(new Error('专业名称只能包含中文'))
    return
  }

  callback()
}

/**
 * 班级校验器
 * 规则: 格式为"班级号"，如"1班"
 */
const validateClass = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入班级名称'))
    return
  }

  // 去除首尾空格
  const trimmedValue = value.trim()

  // 基本格式检查：必须以"班"结尾
  if (!trimmedValue.endsWith('班')) {
    callback(new Error('班级名称必须以"班"结尾'))
    return
  }

  // 提取"班"字前的数字部分
  const classNumber = trimmedValue.slice(0, -1)

  // 定义有效的汉字数字班级名称
  const validClassNumbers = [
    // 1-10班
    '一', '二', '三', '四', '五', '六', '七', '八', '九', '十',
    // 11-20班
    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九','二十'
  ]

  if (!validClassNumbers.includes(classNumber)) {
    callback(new Error('班级格式错误，请输入正确的汉字数字，如：一班、二班、十班、十一班、二十班等'))
    return
  }

  callback()
}

/**
 * 党委校验器
 * 规则: 2-30个字符，必须包含"党委"二字
 */
const validatePartyCommittee = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入党委名称'))
    return
  }

  // 校验长度
  if (value.length < 2 || value.length > 30) {
    callback(new Error('党委名称长度为2-30个字符'))
    return
  }
  callback()
}

/**
 * 党支部校验器
 * 规则: 2-30个字符，必须包含"党支部"或"支部"
 */
const validatePartyBranch = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入党支部名称'))
    return
  }

  // 校验长度
  if (value.length < 2 || value.length > 30) {
    callback(new Error('党支部名称长度为2-30个字符'))
    return
  }

  callback()
}

/**
 * 获取字典名称的动态校验规则
 * 根据字典类型返回不同的校验器
 */
const getDictNameRules = () => {
  const baseRules = [
    { required: true, message: '请输入字典名称', trigger: 'blur' }
  ]

  // 校验器映射表
  const validatorMap = {
    '年级': validateGrade,
    '学院': validateCollege,
    '专业': validateMajor,
    '班级': validateClass,
    '党委': validatePartyCommittee,
    '党支部': validatePartyBranch
  }

  // 根据字典类型添加对应的校验器
  if (formData.type && validatorMap[formData.type]) {
    baseRules.push({
      validator: validatorMap[formData.type],
      trigger: 'blur'
    })
  }

  return baseRules
}

/**
 * 表单校验规则（计算属性，动态更新）
 */
const formRules = computed(() => {
  return {
    type: [
      { required: true, message: '请选择字典类型', trigger: 'change' }
    ],
    name: getDictNameRules()
  }
})

// ==================== 方法定义 ====================

/**
 * 字典类型改变时的处理
 * 清空字典名称的校验结果，如果已输入则重新校验
 */
const handleDictTypeChange = () => {
  // 清空字典名称的校验结果
  if (formRef.value) {
    formRef.value.clearValidate('name')
  }

  // 如果已经输入了字典名称，重新触发校验
  if (formData.name) {
    setTimeout(() => {
      if (formRef.value) {
        formRef.value.validateField('name')
      }
    }, 100)
  }
}

/**
 * 初始化表单数据
 * 根据是否为编辑模式填充数据
 */
const initFormData = () => {
  if (isEditMode.value && props.editData) {
    // 编辑模式：填充编辑数据
    formData.id = props.editData.id || ''
    formData.type = props.editData.type || ''
    formData.name = props.editData.name || ''
  } else {
    // 新增模式：清空数据
    formData.id = ''
    formData.type = ''
    formData.name = ''
  }
}

/**
 * 重置表单
 * 清空表单数据和校验结果
 */
const resetForm = () => {
  formData.id = ''
  formData.type = ''
  formData.name = ''

  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

/**
 * 对话框关闭时的处理
 */
const handleClose = () => {
  resetForm()
}

/**
 * 取消按钮处理
 * 触发 cancel 事件，关闭对话框并重置表单
 */
const handleCancel = () => {
  emit('cancel')
  dialogVisible.value = false
  resetForm()
}

/**
 * 确定按钮处理
 * 执行表单校验，校验通过后触发 confirm 事件
 */
const handleConfirm = async () => {
  if (!formRef.value) return

  try {
    // 防止重复提交
    if (submitLoading.value) return

    // 执行表单校验
    await formRef.value.validate()

    // 设置提交状态
    submitLoading.value = true

    // 准备返回数据
    const submitData = {
      type: formData.type,
      name: formData.name
    }

    // 编辑模式需要传递 id
    if (isEditMode.value) {
      submitData.id = formData.id
    }

    // 触发 confirm 事件
    emit('confirm', submitData)

    // 不在这里关闭对话框，由父组件控制
    // 这样可以在提交失败时不关闭对话框
  } catch (error) {
    // 校验失败，Element Plus 会自动显示错误信息
    console.log('表单校验失败:', error)
  } finally {
    // 重置提交状态
    submitLoading.value = false
  }
}

// ==================== 生命周期监听 ====================

/**
 * 监听对话框打开，初始化表单数据
 */
watch(dialogVisible, (newVal) => {
  if (newVal) {
    // 对话框打开时，初始化表单数据
    initFormData()
  } else {
    // 对话框关闭时，延迟重置表单
    setTimeout(() => {
      resetForm()
    }, 200)
  }
})

/**
 * 监听编辑数据变化
 */
watch(() => props.editData, () => {
  if (dialogVisible.value && isEditMode.value) {
    initFormData()
  }
}, { deep: true })
</script>

<style lang="scss" scoped>
// 对话框底部按钮区域
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

// 表单项间距
:deep(.el-form-item) {
  margin-bottom: 20px;
}

// 对话框内容区域内边距
:deep(.el-dialog__body) {
  padding-top: 20px;
  padding-bottom: 10px;
}

// 对话框底部区域内边距
:deep(.el-dialog__footer) {
  padding-top: 30px;
}

// 必填项星号颜色
:deep(.el-form-item__label) {
  &::before {
    color: #f56c6c;
  }
}

// 表单项标签字体
:deep(.el-form-item__label) {
  font-weight: 500;
  font-size: 14px;
  color: #303133;
}

// 输入框聚焦样式
:deep(.el-input__wrapper) {
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 0 0 1px #c0c4cc inset;
  }

  &.is-focus {
    box-shadow: 0 0 0 1px #409eff inset;
  }
}

// 下拉框聚焦样式
:deep(.el-select) {
  .el-input__wrapper {
    &:hover {
      box-shadow: 0 0 0 1px #c0c4cc inset;
    }

    &.is-focus {
      box-shadow: 0 0 0 1px #409eff inset;
    }
  }
}

// 禁用状态样式优化
:deep(.el-select.is-disabled) {
  .el-input__wrapper {
    background-color: #f5f7fa;
    cursor: not-allowed;
    
    &:hover {
      box-shadow: 0 0 0 1px #dcdfe6 inset;
    }
  }
}

// 错误提示样式
:deep(.el-form-item__error) {
  font-size: 12px;
  line-height: 1.5;
  padding-top: 4px;
}
</style>