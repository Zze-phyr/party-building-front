<template>
  <div class="dictionary-tree">
    <!-- 工具栏 -->
    <TreeOperations
      :title="title"
      :loading="loading"
      @search="handleSearch"
      @refresh="handleRefresh"
      @expand-all="handleExpandAll"
      @collapse-all="handleCollapseAll"
    />

    <!-- 树形结构 -->
    <div class="tree-content" v-loading="loading">
      <el-scrollbar v-if="!loading && treeData.length > 0">
        <el-tree
          ref="treeRef"
          :data="treeData"
          :props="treeProps"
          show-checkbox
          node-key="id"
          highlight-current
        >
          <template #default="{ node, data }">
            <div class="tree-node">
              <div class="node-content">
                <el-icon class="node-icon">
                  <component :is="getNodeIcon(data.level)" />
                </el-icon>
                <span class="node-label">{{ data.label }}</span>
                <span class="node-count" v-if="data.childCount > 0">
                  ({{ data.childCount }})
                </span>
              </div>
              <NodeActions
                :node="node"
                :data="data"
                :tree-type="treeType"
                @add="handleAdd"
                @delete="handleDelete"
              />
            </div>
          </template>
        </el-tree>
      </el-scrollbar>

      <!-- 空状态 -->
      <el-empty
        v-else-if="!loading && treeData.length === 0"
        description="暂无数据"
        :image-size="100"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Calendar, School, Reading, User, Star, Flag } from '@element-plus/icons-vue'
import TreeOperations from './tree-operations.vue'
import NodeActions from './node-actions.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  treeType: {
    type: String,
    required: true,
    validator: (value) => ['academic', 'party'].includes(value)
  },
  treeConfig: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['add', 'delete', 'refresh'])

// 树组件引用
const treeRef = ref(null)
const loading = ref(false)
const treeData = ref([])
// const defaultExpandedKeys = ref([])

// 树配置
const treeProps = {
  label: 'label',
  children: 'children',
  isLeaf: 'isLeaf'
}

// 图标映射
const iconMap = {
  0: Calendar,
  1: props.treeType === 'academic' ? School : Star,
  2: props.treeType === 'academic' ? Reading : Flag,
  3: User
}

// 获取节点图标
const getNodeIcon = (level) => {
  return iconMap[level] || Calendar
}

// 加载年级数据
const loadGrades = async () => {
  if (loading.value) {
    console.log('正在加载中，跳过')
    return
  }

  loading.value = true
  try {
    console.log(`=== [${props.treeType}] 开始加载年级数据 ===`)

    if (!props.treeConfig.loader || typeof props.treeConfig.loader.loadGrades !== 'function') {
      throw new Error('loader 未正确配置')
    }

    const data = await props.treeConfig.loader.loadGrades()
    console.log(`[${props.treeType}] 年级数据:`, data)

    // ✅ 使用懒加载模式，不需要预设 children
    treeData.value = data.map(item => ({
      ...item,
      children: [{
        ...item,
        level: 1,
        isLeaf: item.children ? item.children.length === 0 : true
      }],
      childCount: item.children ? item.children.length : 1
    }))
    console.log(`[${props.treeType}] 年级数据初始化完成`)

    console.log(`[${props.treeType}] 树初始化完成`)

    if (data.length === 0) {
      ElMessage.warning('暂无年级数据')
    }
  } catch (error) {
    console.error('加载年级数据失败:', error)
    ElMessage.error('加载数据失败：' + (error.message || '未知错误'))
    treeData.value = []
  } finally {
    loading.value = false
  }
}

// 搜索过滤
const filterNode = (value, data) => {
  if (!value) return true
  return data.label.toLowerCase().includes(value.toLowerCase())
}

// 搜索处理
const handleSearch = (keyword) => {
  treeRef.value?.filter(keyword)
}

// 刷新处理
const handleRefresh = () => {
  console.log(`刷新树: ${props.treeType}`)
  emit('refresh', { treeType: props.treeType })
  defaultExpandedKeys.value = []
  loadGrades()
}

// 展开所有
const handleExpandAll = () => {
  // 获取所有节点ID
  const getAllNodeKeys = (nodes) => {
    const keys = []
    const traverse = (items) => {
      items.forEach(item => {
        if (!item.isLeaf) {
          keys.push(item.id)
        }
        if (item.children && item.children.length > 0) {
          traverse(item.children)
        }
      })
    }
    traverse(nodes)
    return keys
  }

  const keys = getAllNodeKeys(treeData.value)
  defaultExpandedKeys.value = keys
  console.log('展开所有节点:', keys)

  // 强制展开
  nextTick(() => {
    keys.forEach(key => {
      const node = treeRef.value?.getNode(key)
      if (node && !node.expanded) {
        node.expand()
      }
    })
  })
}

// 折叠所有
const handleCollapseAll = () => {
  // 获取所有已展开的节点并折叠
  const collapseAll = (nodes) => {
    nodes.forEach(node => {
      const treeNode = treeRef.value?.getNode(node.id)
      if (treeNode && treeNode.expanded) {
        treeNode.collapse()
      }
      if (node.children && node.children.length > 0) {
        collapseAll(node.children)
      }
    })
  }

  collapseAll(treeData.value)
  defaultExpandedKeys.value = []
  console.log('折叠所有节点')
}

// 添加节点
const handleAdd = (params) => {
  emit('add', { ...params, treeType: props.treeType })
}

// 删除节点
const handleDelete = (params) => {
  emit('delete', { ...params, treeType: props.treeType })
}

// 刷新当前树
const refresh = () => {
  defaultExpandedKeys.value = []
  // 重置树的状态
  treeData.value = []
  nextTick(() => {
    loadGrades()
  })
}

// 组件挂载
onMounted(() => {
  console.log(`=== [${props.treeType}] 组件挂载 ===`)
  nextTick(() => {
    loadGrades()
  })
})

// 暴露方法
defineExpose({
  refresh
})
</script>

<style scoped lang="scss">
.dictionary-tree {
  --el-color-primary: #bc0000;
  --el-color-primary-light-3: #C62424;
  --el-color-primary-light-5: #D14949;
  --el-color-primary-light-7: #ffbfbf;
  --el-color-primary-light-9: #ffe2e2;
  --el-color-primary-light-11: #fff4f4;
  --el-color-primary-light-13: #FDF3F3;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;

  .tree-content {
    flex: 1;
    overflow: hidden;
    padding: 4px 8px;

    :deep(.el-scrollbar) {
      height: 100%;
    }

    :deep(.el-tree) {
      background: transparent;

      .el-tree-node {

        &.is-current {
          > .el-tree-node__content {
            background: var(--el-color-primary-light-11);
            :deep(.el-tree-node__content):hover {
              background: transparent !important;
            }
          }
        }
      }

      .el-tree-node__content {
        height: auto;
        padding: 4px 0;
        background: transparent;

        &:hover {
          background: var(--el-color-primary-light-11);
        }
      }
    }

    .tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      border-radius: 4px;
      transition: all 0.2s;

      .node-content {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;

        .node-icon {
          font-size: 16px;
          // color: var(--el-color-primary);
        }

        .node-label {
          font-size: 14px;
          color: #303133;
          font-weight: 400;
        }

        .node-count {
          font-size: 12px;
          color: #909399;
        }
      }
    }
  }

  // :deep(.el-empty) {
  //   padding: 60px 0;
  // }
}
</style>
