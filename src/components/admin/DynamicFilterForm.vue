<template>
  <el-form :inline="inline" :model="formModel" ref="formRef" class="filter-form">
    <!-- 搜索框 -->
    <el-form-item v-if="showSearch">
      <el-input
        v-model="searchValue"
        :style="{ maxWidth: searchMaxWidth }"
        :placeholder="searchPlaceholder"
        clearable
      >
        <template #append>
          <el-button
            @click="handleSearchClick"
            class="search-btn"
            :icon="Search"
            :loading="loading"
          />
        </template>
      </el-input>
    </el-form-item>

    <!-- 动态渲染表单项 -->
    <template v-for="(item, index) in formItems" :key="index.id">
      <!-- Tree Select 组件 -->
      <el-form-item v-if="item.type === 'tree-select'" :label="item.label">
        <el-tree-select
          v-model="formModel[item.prop]"
          :data="getOptions(item.data)"
          :placeholder="item.placeholder"
          :style="{ width: item.width || '240px' }"
          clearable
        />
      </el-form-item>

      <!-- Select 组件 -->
      <el-form-item v-else-if="item.type === 'select'" :label="item.label">
        <el-select
          v-model="formModel[item.prop]"
          :placeholder="item.placeholder"
          :style="{ width: item.width || '240px' }"
          clearable
        >
          <el-option
            v-for="option in getOptions(item.options)"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
    </template>

    <!-- 提交按钮 -->
    <el-form-item>
      <el-button color="#d12626" @click="handleSubmit" :loading="loading">
        {{ submitButtonText }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'

// 定义组件 props
const props = defineProps({
  // 表单数据模型，通过 v-model:model 绑定
  model: {
    type: Object,
    default: () => ({}),
  },
  // 表单配置项数组，定义要显示的表单项
  formItems: {
    type: Array,
    default: () => [],
  },
  // 是否内联表单
  inline: {
    type: Boolean,
    default: true,
  },
  // 是否显示搜索框
  showSearch: {
    type: Boolean,
    default: true,
  },
  // 搜索框宽度
  searchMaxWidth: {
    type: String,
    default: '240px',
  },
  // 搜索框占位符
  searchPlaceholder: {
    type: String,
    default: '请输入关键词搜索',
  },
  // 提交按钮文本
  submitButtonText: {
    type: String,
    default: '确认筛选',
  },
  // 加载状态
  loading: {
    type: Boolean,
    default: false,
  },
})

// 定义组件事件
const emit = defineEmits(['search', 'submit', 'update:model'])

// 表单引用
const formRef = ref(null)

// 表单数据模型
const formModel = computed({
  get() {
    return props.model
  },
  set(value) {
    emit('update:model', value)
  },
})

// 搜索值
const searchValue = ref('')

// 监听模型变化，确保 formModel 中包含所有表单项的属性
// watch(
//   () => props.formItems,
//   (newItems) => {
//     newItems.forEach((item) => {
//       if (item.prop && !(item.prop in formModel.value)) {
//         // 使用 nextTick 避免在计算属性中直接修改
//         setTimeout(() => {
//           formModel.value[item.prop] = ''
//         }, 0)
//       }
//     })
//   },
//   { immediate: true, deep: true },
// )

// 处理搜索点击事件
const handleSearchClick = () => {
  emit('search', searchValue.value)
}

// 处理提交事件
const handleSubmit = () => {
  emit('submit', formModel.value)
}

// 获取选项数据（处理 ref 或普通数组）
const getOptions = (options) => {
  if (!options) return []
  // 处理 ref 对象
  if (typeof options === 'object' && 'value' in options) {
    return options.value || []
  }
  // 处理普通数组或其他可迭代对象
  return Array.isArray(options) ? options : []
}

// 暴露方法给父组件
defineExpose({
  formRef,
  getOptions,
})
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
