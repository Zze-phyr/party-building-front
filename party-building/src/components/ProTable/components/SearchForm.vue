<template>
  <div class="search-form">
    <el-form
      ref="formRef"
      :model="formData"
      label-width="auto"
      class="search-form__form"
    >
      <el-row :gutter="20">
        <!-- 动态渲染表单项 -->
        <el-col
          v-for="(item, index) in searchConfig"
          :key="item.prop"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
          :xl="8"
        >
          <el-form-item :label="item.label" :prop="item.prop">
            <!-- 输入框 -->
            <el-input
              v-if="item.type === 'input'"
              v-model="formData[item.prop]"
              :placeholder="item.placeholder || `请输入${item.label}`"
              clearable
            />

            <!-- 下拉选择 -->
            <el-select
              v-else-if="item.type === 'select'"
              v-model="formData[item.prop]"
              :placeholder="item.placeholder || `请选择${item.label}`"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="option in item.options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>

            <!-- 日期选择 -->
            <el-date-picker
              v-else-if="item.type === 'date'"
              v-model="formData[item.prop]"
              type="date"
              :placeholder="item.placeholder || `请选择${item.label}`"
              clearable
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />

            <!-- 日期范围选择 -->
            <el-date-picker
              v-else-if="item.type === 'daterange'"
              v-model="formData[item.prop]"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              clearable
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />

            <!-- 时间选择 -->
            <el-time-picker
              v-else-if="item.type === 'time'"
              v-model="formData[item.prop]"
              :placeholder="item.placeholder || `请选择${item.label}`"
              clearable
              value-format="HH:mm:ss"
              style="width: 100%"
            />

            <!-- 数字输入框 -->
            <el-input-number
              v-else-if="item.type === 'number'"
              v-model="formData[item.prop]"
              :placeholder="item.placeholder || `请输入${item.label}`"
              :min="item.min"
              :max="item.max"
              :step="item.step"
              controls-position="right"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>

        <!--
          占位列：用于将操作按钮推到最右侧
          计算逻辑：
          1. 每行最多3个表单项（span=8）
          2. 计算最后一行已有多少个表单项
          3. 填充空白栅格，使按钮组靠右对齐
        -->
        <el-col
          v-if="emptyColSpan > 0"
          :xs="0"
          :sm="0"
          :md="emptyColSpan"
          :lg="emptyColSpan"
          :xl="emptyColSpan"
          class="search-form__placeholder"
        />

        <!-- 操作按钮列 -->
        <el-col
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
          :xl="8"
        >
          <el-form-item label-width="0">
            <div class="search-form__actions">
              <el-button
                type="primary"
                :loading="loading"
                :icon="Search"
                @click="handleSearch"
              >
                查询
              </el-button>
              <el-button
                :icon="Refresh"
                @click="handleReset"
              >
                重置
              </el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'

defineOptions({
  name: 'SearchForm'
})

const props = defineProps({
  // 搜索表单配置项
  searchConfig: {
    type: Array,
    default: () => []
  },
  // 加载状态
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['search', 'reset'])

// ==================== 响应式数据 ====================

// 表单引用
const formRef = ref(null)

// 表单数据
const formData = reactive({})

// ==================== 计算属性 ====================

/**
 * 计算占位列的 span 值
 * 目的：使操作按钮始终靠右对齐
 *
 * 逻辑说明：
 * 1. 假设每行最多3个表单项，每个表单项占 span=8
 * 2. 操作按钮也占 span=8
 * 3. 计算最后一行已有多少个表单项
 * 4. 填充剩余空白，使按钮推到最右侧
 *
 * 示例：
 * - 如果有2个表单项：最后一行有2个项，需要填充0个span，按钮紧跟其后（2*8 + 8 = 24）
 * - 如果有4个表单项：最后一行有1个项，需要填充8个span（1*8 + 8 + 8 = 24）
 * - 如果有3个表单项：最后一行有3个项，按钮另起一行，需要填充16个span（0*8 + 16 + 8 = 24）
 */
const emptyColSpan = computed(() => {
  const totalItems = props.searchConfig.length

  // 如果没有表单项，不需要占位
  if (totalItems === 0) {
    return 0
  }

  // 每行最多3个表单项
  const itemsPerRow = 3

  // 计算最后一行已有多少个表单项（1, 2, 或 3）
  const itemsInLastRow = totalItems % itemsPerRow || itemsPerRow

  // 计算需要填充的栅格数
  // 每行总共24格，每个表单项占8格，按钮占8格
  // 需要填充的格数 = 24 - (最后一行表单项数 * 8) - 8
  const emptySpan = 24 - (itemsInLastRow * 8) - 8

  // 确保返回值在合理范围内（0-16）
  return Math.max(0, Math.min(emptySpan, 16))
})

// ==================== 方法 ====================

/**
 * 初始化表单数据
 * 遍历配置项，为每个字段设置默认值
 */
const initFormData = () => {
  props.searchConfig.forEach(item => {
    // 如果配置中有默认值，使用默认值，否则使用空字符串
    formData[item.prop] = item.defaultValue !== undefined ? item.defaultValue : ''
  })
}

/**
 * 处理查询操作
 * 过滤掉空值，只传递有效的搜索条件
 */
const handleSearch = () => {
  const filters = {}

  Object.keys(formData).forEach(key => {
    const value = formData[key]

    // 过滤空值
    if (value !== '' && value !== null && value !== undefined) {
      // 如果是数组且为空，则不添加到筛选条件中
      if (Array.isArray(value) && value.length === 0) {
        return
      }
      filters[key] = value
    }
  })

  emit('search', filters)
}

/**
 * 处理重置操作
 * 重置表单到初始状态
 */
const handleReset = () => {
  // 使用 Element Plus 提供的重置方法
  if (formRef.value) {
    formRef.value.resetFields()
  }

  // 重新初始化为默认值
  initFormData()

  // 触发重置事件
  emit('reset')
}

// ==================== 生命周期 ====================

/**
 * 监听配置变化
 * 当 searchConfig 发生变化时，重新初始化表单数据
 */
watch(
  () => props.searchConfig,
  () => {
    initFormData()
  },
  {
    immediate: true,  // 立即执行
    deep: true        // 深度监听
  }
)
</script>

<style lang="scss" scoped>
.search-form {
  background-color: #f5f7fa;
  padding: 20px 20px 4px;
  margin-bottom: 16px;
  border-radius: 4px;

  &__form {
    // 调整表单项底部间距
    :deep(.el-form-item) {
      margin-bottom: 16px;
    }

    // 表单项标签样式
    :deep(.el-form-item__label) {
      font-weight: 500;
      color: #606266;
    }

    // 表单项内容样式
    :deep(.el-form-item__content) {
      line-height: 32px;
    }
  }

  // 占位列（仅用于布局，不显示任何内容）
  &__placeholder {
    height: 0;
    overflow: hidden;
  }

  // 操作按钮容器
  &__actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
    width: 100%;
  }
}
</style>
