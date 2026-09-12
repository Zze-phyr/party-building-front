<template>
  <el-select
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :placeholder="placeholder"
    :disabled="disabled"
    :clearable="clearable"
    class="scrollable-select"
    :popper-class="`scrollable-select-dropdown-${uid}`"
    @visible-change="handleVisibleChange"
    @change="handleChange"
    v-bind="$attrs"
  >
    <el-option
      v-for="item in list"
      :key="item[valueKey]"
      :label="item[labelKey]"
      :value="item[valueKey]"
      :disabled="item.disabled"
    />
    
    <!-- 加载更多提示 -->
    <template v-if="hasMore">
      <el-option
        disabled
        :value="`loading-more-${uid}`"
        class="loading-more-option"
      >
        <div 
          class="load-more-trigger"
          @click.stop="handleLoadMore"
        >
          <div v-if="loading" class="loading-wrapper">
            <span class="loading-spinner"></span>
            <span class="loading-text">加载中...</span>
          </div>
          <span v-else class="load-more-text">点击或滚动加载更多...</span>
        </div>
      </el-option>
    </template>
    
    <!-- 已全部加载提示 -->
    <template v-else-if="list.length > 0 && !loading">
      <el-option
        disabled
        :value="`no-more-${uid}`"
        class="no-more-option"
      >
        <span class="no-more-text">已全部加载</span>
      </el-option>
    </template>
    
    <!-- 底部加载状态（当列表为空且正在加载时） -->
    <template v-if="list.length === 0 && loading">
      <el-option
        disabled
        :value="`initial-loading-${uid}`"
        class="initial-loading-option"
      >
        <div class="initial-loading-wrapper">
          <span class="loading-spinner"></span>
          <span class="loading-text">加载中...</span>
        </div>
      </el-option>
    </template>
  </el-select>
</template>

<script setup>
import { onMounted, onBeforeUnmount, nextTick, getCurrentInstance } from 'vue'

// 生成唯一ID
const uid = getCurrentInstance().uid

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: null
  },
  list: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: '请选择'
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: true
  },
  hasMore: {
    type: Boolean,
    default: false
  },
  valueKey: {
    type: String,
    default: 'id'
  },
  labelKey: {
    type: String,
    default: 'name'
  }
})

const emit = defineEmits(['update:modelValue', 'load-more', 'change'])

let scrollHandler = null

// 手动点击加载更多
const handleLoadMore = () => {
  if (!props.loading && props.hasMore) {
    console.log('🖱️ 点击加载更多')
    emit('load-more')
  }
}

// 设置滚动监听
const setupScrollListener = () => {
  nextTick(() => {
    const dropdown = document.querySelector(`.scrollable-select-dropdown-${uid} .el-select-dropdown__wrap`)
    
    if (dropdown && !scrollHandler) {
      scrollHandler = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target
        const threshold = 50
        const distanceToBottom = scrollHeight - scrollTop - clientHeight

        if (distanceToBottom < threshold && props.hasMore && !props.loading) {
          console.log('🔄 Select滚动触发加载更多')
          emit('load-more')
        }
      }
      
      dropdown.addEventListener('scroll', scrollHandler)
      console.log('✅ Select滚动监听已设置')
    }
  })
}

// 移除滚动监听
const removeScrollListener = () => {
  if (scrollHandler) {
    const dropdown = document.querySelector(`.scrollable-select-dropdown-${uid} .el-select-dropdown__wrap`)
    if (dropdown) {
      dropdown.removeEventListener('scroll', scrollHandler)
    }
    scrollHandler = null
  }
}

// 下拉框显示/隐藏时的处理
const handleVisibleChange = (visible) => {
  if (visible) {
    setupScrollListener()
  } else {
    removeScrollListener()
  }
}

// 处理选择变化
const handleChange = (value) => {
  emit('change', value)
}

onMounted(() => {
  setupScrollListener()
})

onBeforeUnmount(() => {
  removeScrollListener()
})
</script>

<style scoped lang="scss">
.scrollable-select {
  width: 100%;
}

.load-more-trigger {
  padding: 8px 12px;
  text-align: center;
  cursor: pointer;
  color: #409EFF;
  font-size: 13px;
  transition: all 0.3s;
  min-height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #F5F7FA;
    
    .load-more-text {
      color: #66B1FF;
    }
  }
}

.loading-wrapper,
.initial-loading-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 4px 0;
}

.loading-spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid #409EFF;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: #909399;
  font-size: 13px;
}

.load-more-text {
  color: #409EFF;
  transition: color 0.3s;
}

.no-more-option {
  .no-more-text {
    display: block;
    text-align: center;
    padding: 8px 12px;
    font-size: 12px;
    color: #C0C4CC;
  }
}

.initial-loading-option {
  .initial-loading-wrapper {
    padding: 12px;
  }
}
</style>

<style lang="scss">
// 全局样式
[class*="scrollable-select-dropdown"] {
  .loading-more-option,
  .no-more-option,
  .initial-loading-option {
    cursor: default !important;
    
    &:hover {
      background-color: transparent !important;
    }
  }

  .el-select-dropdown__item.is-disabled {
    cursor: default;
  }
  
  // 加载更多选项在 hover 时显示背景
  .loading-more-option {
    &:hover {
      background-color: #F5F7FA !important;
    }
    
    // 但如果正在加载，则不显示 hover 效果
    &.is-loading:hover {
      background-color: transparent !important;
      cursor: default !important;
    }
  }
}
</style>