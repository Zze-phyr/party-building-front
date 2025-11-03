<template>
  <div class="node-actions" @click.stop>
    <el-button
      type="success"
      text
      :icon="Plus"
      size="small"
      @click="handleAdd"
      v-if="!isLastLevel"
    >
      添加
    </el-button>
    <el-button
      type="danger"
      text
      :icon="Delete"
      size="small"
      @click="handleDelete"
      v-if="!isRootLevel"
    >
      删除
    </el-button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Plus, Delete } from '@element-plus/icons-vue'

const props = defineProps({
  node: {
    type: Object,
    required: true
  },
  data: {
    type: Object,
    required: true
  },
  treeType: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['add', 'delete'])

// 是否为根节点
const isRootLevel = computed(() => {
  return props.data.level === 0
})

// 是否为最后一级
const isLastLevel = computed(() => {
  return props.data.level === 3
})

// 添加
const handleAdd = () => {
  emit('add', {
    node: props.node,
    data: props.data
  })
}

// 删除
const handleDelete = () => {
  emit('delete', {
    node: props.node,
    data: props.data
  })
}
</script>

<style scoped lang="scss">
.node-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;

  .tree-node:hover & {
    opacity: 1;
  }

  :deep(.el-button) {
    padding: 4px 8px;
    height: auto;
    
    &.el-button--success {
      &:hover {
        color: #67C23A;
        background: rgba(103, 194, 58, 0.1);
      }
    }

    &.el-button--danger {
      &:hover {
        color: #F56C6C;
        background: rgba(245, 108, 108, 0.1);
      }
    }
  }
}
</style>