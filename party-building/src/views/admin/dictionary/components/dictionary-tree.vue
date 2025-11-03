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
          node-key="id"
          :default-expanded-keys="defaultExpandedKeys"
          highlight-current
          @node-expand="handleNodeExpand"
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
const defaultExpandedKeys = ref([])

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

    // 为每个年级节点添加空的 children 数组（重要！）
    const processedData = data.map(grade => ({
      ...grade,
      children: [] // 初始化为空数组，表示可以展开但还未加载
    }))

    treeData.value = processedData
    console.log(`[${props.treeType}] 处理后的数据:`, processedData)

    // 设置默认展开第一个年级
    if (processedData.length > 0) {
      defaultExpandedKeys.value = [processedData[0].id]
      console.log('设置默认展开:', defaultExpandedKeys.value)
    }

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

// 查找节点
const findNode = (nodes, id) => {
  for (const node of nodes) {
    if (node.id === id) {
      return node
    }
    if (node.children && node.children.length > 0) {
      const found = findNode(node.children, id)
      if (found) return found
    }
  }
  return null
}

// 节点展开事件 - 懒加载子节点
const handleNodeExpand = async (data, node) => {
  console.log(`[${props.treeType}] 节点展开:`, data.label, data)

  // 如果是叶子节点，不需要加载
  if (data.isLeaf) {
    console.log('叶子节点，无需加载')
    return
  }

  // 如果已经有子节点数据，不重复加载
  if (data.children && data.children.length > 0) {
    console.log('已有子节点数据，跳过加载')
    return
  }

  // 获取当前节点的配置
  const config = props.treeConfig.levels[data.level]
  console.log(`节点配置:`, config)

  if (!config?.loadMethod) {
    console.log('没有加载方法')
    return
  }

  try {
    console.log(`调用加载方法: ${config.loadMethod}`)
    const children = await props.treeConfig.loader[config.loadMethod](data)
    console.log(`加载到 ${children.length} 个子节点:`, children)

    // 为子节点添加空的 children 数组（除了叶子节点）
    const processedChildren = children.map(child => ({
      ...child,
      children: child.isLeaf ? undefined : []
    }))

    // 更新节点数据
    data.children = processedChildren
    data.childCount = children.length

    // 强制更新视图
    treeData.value = [...treeData.value]

    console.log('子节点加载完成，数据已更新')
  } catch (error) {
    console.error('加载子节点失败:', error)
    ElMessage.error('加载失败：' + (error.message || '未知错误'))
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
  const expandAll = (nodes) => {
    const keys = []
    nodes.forEach(node => {
      if (!node.isLeaf) {
        keys.push(node.id)
        if (node.children && node.children.length > 0) {
          keys.push(...expandAll(node.children))
        }
      }
    })
    return keys
  }

  defaultExpandedKeys.value = expandAll(treeData.value)
  console.log('展开所有节点:', defaultExpandedKeys.value)
}

// 折叠所有
const handleCollapseAll = () => {
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
  loadGrades()
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
    padding: 16px;

    :deep(.el-scrollbar) {
      height: 100%;
    }

    :deep(.el-tree) {
      background: transparent;

      .el-tree-node {

        &.is-current {
          > .el-tree-node__content {
            background-color: transparent !important;
            .tree-node {
              background: var(--el-color-primary-light-11);
            }
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
          background: transparent !important;
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
          color: var(--el-color-primary);
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

  :deep(.el-empty) {
    padding: 60px 0;
  }
}
</style>
