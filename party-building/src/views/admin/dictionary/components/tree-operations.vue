<template>
  <div class="tree-operations">
    <div class="operations-header">
      <h3 class="tree-title">{{ title }}</h3>
      <div class="actions">
        <el-button
          type="primary"
          text
          :icon="RefreshRight"
          :loading="loading"
          @click="emit('refresh')"
          size="small"
        >
          刷新
        </el-button>
        <el-button
          type="primary"
          text
          :icon="Expand"
          @click="emit('expand-all')"
          size="small"
        >
          全部展开
        </el-button>
        <el-button
          type="primary"
          text
          :icon="Fold"
          @click="emit('collapse-all')"
          size="small"
        >
          全部折叠
        </el-button>
      </div>
    </div>

    <div class="search-box">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索节点名称"
        :prefix-icon="Search"
        clearable
        @input="handleSearch"
        size="default"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search, RefreshRight, Expand, Fold } from '@element-plus/icons-vue'
import { debounce } from '@/utils/tree-helper'

defineProps({
  title: {
    type: String,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['search', 'refresh', 'expand-all', 'collapse-all'])

const searchKeyword = ref('')

// 搜索防抖处理
const handleSearch = debounce((value) => {
  emit('search', value)
}, 300)
</script>

<style scoped lang="scss">
.tree-operations {
  --el-color-primary: #bc0000;
  padding: 16px;
  border-bottom: 1px solid #EBEEF5;
  background: #fff;

  .operations-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;

    .tree-title {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      display: flex;
      align-items: center;
      gap: 8px;

      &::before {
        content: '';
        width: 3px;
        height: 16px;
        background: var(--el-color-primary);
        border-radius: 2px;
      }
    }

    .actions {
      display: flex;
      gap: 8px;
    }
  }

  .search-box {
    :deep(.el-input__wrapper) {
      box-shadow: 0 0 0 1px #DCDFE6 inset;
      transition: box-shadow 0.2s;

      &:hover {
        box-shadow: 0 0 0 1px #C0C4CC inset;
      }
    }

    :deep(.el-input__wrapper.is-focus) {
      box-shadow: 0 0 0 1px var(--el-color-primary) inset !important;
    }
  }
}
</style>
