<template>
  <div class="search-form">
    <el-form
      ref="formRef"
      :model="formData"
      label-width="auto"
      class="search-form__form"
    >
      <el-row :gutter="16">
        <el-col
          v-for="item in searchConfig"
          :key="item.prop"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
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
          </el-form-item>
        </el-col>

        <!-- 操作按钮 -->
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item>
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
import { ref, reactive, watch } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'

defineOptions({
  name: 'SearchForm'
})

const props = defineProps({
  searchConfig: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['search', 'reset'])

// 表单引用
const formRef = ref(null)

// 表单数据
const formData = reactive({})

// 初始化表单数据
const initFormData = () => {
  props.searchConfig.forEach(item => {
    formData[item.prop] = item.defaultValue !== undefined ? item.defaultValue : ''
  })
}

// 监听配置变化，重新初始化
watch(() => props.searchConfig, () => {
  initFormData()
}, { immediate: true, deep: true })

// 处理查询
const handleSearch = () => {
  // 过滤空值
  const filters = {}
  Object.keys(formData).forEach(key => {
    const value = formData[key]
    if (value !== '' && value !== null && value !== undefined) {
      // 如果是数组且为空，则不添加
      if (Array.isArray(value) && value.length === 0) {
        return
      }
      filters[key] = value
    }
  })
  emit('search', filters)
}

// 处理重置
const handleReset = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  // 重置为默认值
  initFormData()
  emit('reset')
}
</script>

<style lang="scss" scoped>
.search-form {
  background-color: #f5f7fa;
  padding: 16px;
  margin-bottom: 8px;
  border-radius: 4px;

  &__form {
    :deep(.el-form-item) {
      margin-bottom: 0px;
    }

    :deep(.el-form-item__label) {
      font-weight: 500;
    }
  }

  &__actions {
    display: flex;
    gap: 8px;
  }
}
</style>
