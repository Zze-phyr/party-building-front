<template>
  <div class="toolbar">
    <div class="toolbar__left">
      <slot></slot>
    </div>
    <div class="toolbar__right">
      <el-tooltip content="刷新" placement="top">
        <el-button
          :icon="Refresh"
          circle
          :loading="loading"
          @click="handleRefresh"
        />
      </el-tooltip>
    </div>
  </div>
</template>

<script setup>
import { Refresh } from '@element-plus/icons-vue'

defineOptions({
  name: 'Toolbar'
})

defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['refresh'])

const handleRefresh = () => {
  emit('refresh')
}
</script>

<style lang="scss" scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  min-height: 40px;

  &__left {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  &__right {
    display: flex;
    gap: 8px;
    align-items: center;
  }
}
</style>
