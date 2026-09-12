<template>
  <div class="checkbox-group-container">
    <div class="checkbox-header">
      <span class="checkbox-title">
        <slot name="title">{{ title }}</slot>
      </span>
      <div class="checkbox-actions">
        <el-button
          type="success"
          link
          size="small"
          :disabled="!list.length || isAllSelected"
          @click="handleSelectAll"
        >
          全选
        </el-button>
        <el-button
          type="danger"
          link
          size="small"
          :disabled="!modelValue.length"
          @click="handleClearAll"
        >
          取消全选
        </el-button>
      </div>
    </div>

    <div
      ref="listContainerRef"
      class="checkbox-list"
      v-loading="loading"
      @scroll="handleScroll"
    >
      <el-checkbox-group
        :model-value="modelValue"
        @update:model-value="handleChange"
      >
        <div
          v-for="item in list"
          :key="item[valueKey]"
          class="checkbox-item"
          :class="{ 'is-checked': modelValue.includes(item[valueKey]) }"
        >
          <el-checkbox
            :label="item[valueKey]"
            :disabled="item.disabled"
          >
            {{ item[labelKey] }}
          </el-checkbox>
          <el-tooltip
            v-if="item.disabled && item.disabledReason"
            :content="item.disabledReason"
            placement="top"
          >
            <el-icon class="disabled-icon"><WarningFilled /></el-icon>
          </el-tooltip>
        </div>
      </el-checkbox-group>

      <!-- 加载更多提示 -->
      <div v-if="hasMore && !loading" class="load-more-trigger">
        <span class="load-more-text">滚动加载更多...</span>
      </div>

      <!-- 没有更多数据提示 -->
      <div v-if="!hasMore && list.length > 0 && !loading" class="no-more-data">
        <span>已全部加载</span>
      </div>

      <el-empty
        v-if="!list.length && !loading"
        :description="emptyText"
        :image-size="80"
      />
    </div>

    <div class="checkbox-footer">
      <span class="selected-count">已选 {{ modelValue.length }} 项</span>
      <span v-if="hasMore" class="total-hint">（还有更多数据未加载）</span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { WarningFilled } from '@element-plus/icons-vue'

// Props 定义
const props = defineProps({
  // 双向绑定的值（选中的ID数组）
  modelValue: {
    type: Array,
    default: () => []
  },
  // 数据列表
  list: {
    type: Array,
    default: () => []
  },
  // 标题
  title: {
    type: String,
    default: '可选项'
  },
  // 值字段名
  valueKey: {
    type: String,
    default: 'id'
  },
  // 标签字段名
  labelKey: {
    type: String,
    default: 'name'
  },
  // 加载状态
  loading: {
    type: Boolean,
    default: false
  },
  // 空数据提示文本
  emptyText: {
    type: String,
    default: '暂无数据'
  },
  // 是否还有更多数据
  hasMore: {
    type: Boolean,
    default: false
  }
})

// Emits 定义
const emit = defineEmits(['update:modelValue', 'change', 'load-more'])

// 列表容器引用
const listContainerRef = ref(null)

// 是否全选
const isAllSelected = computed(() => {
  if (!props.list.length) return false
  const availableItems = props.list.filter(item => !item.disabled)
  return availableItems.length > 0 &&
         availableItems.every(item => props.modelValue.includes(item[props.valueKey]))
})

// 处理值变化
const handleChange = (value) => {
  emit('update:modelValue', value)
  emit('change', value)
}

// 全选
const handleSelectAll = () => {
  const availableIds = props.list
    .filter(item => !item.disabled)
    .map(item => item[props.valueKey])
  handleChange([...availableIds])
}

// 取消全选
const handleClearAll = () => {
  handleChange([])
}

// 处理滚动事件 - 无限滚动加载
const handleScroll = (e) => {
  if (props.loading || !props.hasMore) return

  const container = e.target
  const scrollHeight = container.scrollHeight
  const scrollTop = container.scrollTop
  const clientHeight = container.clientHeight

  // 距离底部还有 50px 时触发加载
  const threshold = 50
  const distanceToBottom = scrollHeight - scrollTop - clientHeight

  if (distanceToBottom < threshold) {
    emit('load-more')
  }
}
</script>

<style scoped lang="scss">
.checkbox-group-container {
  box-sizing: border-box;
  --el-color-primary: #bc0000;
  --el-color-primary-light-3: #C62424;
  --el-color-primary-light-5: #D14949;
  --el-color-primary-light-7: #ffbfbf;
  --el-color-primary-light-9: #ffe2e2;
  --el-color-primary-light-11: #fff4f4;
  --el-color-primary-light-13: #FDF3F3;
  --el-color-primary-dark-2: #990000;

  width: 100%;
  background: #ffffff;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);

  .checkbox-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 12px;
    background: linear-gradient(to bottom, #F5F7FA, #FAFAFA);
    border-bottom: 1px solid #EBEEF5;

    .checkbox-title {
      font-size: 14px;
      font-weight: 600;
      color: #303133;
      display: flex;
      align-items: center;

      &::before {
        content: '';
        display: inline-block;
        width: 3px;
        height: 14px;
        background: var(--el-color-primary);
        margin-right: 8px;
        border-radius: 2px;
      }
    }

    .checkbox-actions {
      display: flex;
      gap: 8px;
      align-items: center;
    }
  }

  .checkbox-list {
    min-height: 120px;
    max-height: 320px;
    overflow-y: auto;
    padding: 12px 16px;
    position: relative;

    .el-checkbox-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .checkbox-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 12px;
      color: #606266;
      border-radius: 4px;
      transition: all 0.2s ease;
      border: 1px solid transparent;

      &:hover {
        background: var(--el-color-primary-light-11);
        border-color: var(--el-color-primary-light-13);
      }

      &.is-checked {
        background: var(--el-color-primary-light-9);
        border-color: var(--el-color-primary-light-7);

        &:hover {
          background: var(--el-color-primary-light-7);
        }
      }

      :deep(.el-checkbox) {
        flex: 1;
        margin-right: 8px;

        .el-checkbox__label {
          color: #606266;
          font-size: 14px;
          line-height: 1.5;
        }

        &.is-checked .el-checkbox__label {
          color: var(--el-color-primary);
          font-weight: 500;
        }
      }

      .disabled-icon {
        margin-left: 8px;
        color: #E6A23C;
        cursor: help;
        font-size: 16px;
        flex-shrink: 0;

        &:hover {
          color: #F56C6C;
        }
      }
    }

    // 加载更多提示
    .load-more-trigger {
      padding: 12px 0;
      text-align: center;

      .load-more-text {
        font-size: 13px;
        color: #909399;
        display: inline-flex;
        align-items: center;
        gap: 8px;

        &::before {
          content: '↓';
          font-size: 16px;
          animation: bounce 1.5s infinite;
        }
      }
    }

    // 没有更多数据
    .no-more-data {
      padding: 12px 0;
      text-align: center;
      font-size: 13px;
      color: #C0C4CC;
      border-top: 1px dashed #EBEEF5;
      margin-top: 8px;
    }
  }

  .checkbox-footer {
    padding: 4px 12px;
    border-top: 1px solid #EBEEF5;
    background: #FAFAFA;
    display: flex;
    align-items: center;
    gap: 8px;

    .selected-count {
      font-size: 13px;
      color: #606266;
      font-weight: 500;

      &::before {
        content: '✓ ';
        color: #67C23A;
        font-weight: bold;
      }
    }

    .total-hint {
      font-size: 12px;
      color: #909399;
    }
  }
}

// 滚动条样式优化
.checkbox-list {
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #C0C4CC;
    border-radius: 3px;

    &:hover {
      background: #A8ABB2;
    }
  }

  &::-webkit-scrollbar-track {
    background: #F5F7FA;
    border-radius: 3px;
  }
}

// Loading 样式优化
:deep(.el-loading-mask) {
  background-color: rgba(255, 255, 255, 0.7);

  .el-loading-spinner {
    .circular {
      width: 32px;
      height: 32px;
    }
  }
}

// 空状态样式优化
:deep(.el-empty) {
  padding: 30px 0;

  .el-empty__description {
    color: #909399;
    font-size: 13px;
  }
}

// 加载动画
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(4px);
  }
}
</style>
