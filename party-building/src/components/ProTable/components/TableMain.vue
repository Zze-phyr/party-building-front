<template>
  <div class="table-main">
    <el-table
      :data="data"
      :row-key="rowKey"
      v-loading="loading"
      border
      stripe
      v-bind="$attrs"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :min-width="column.minWidth"
        :align="column.align || 'left'"
        :fixed="column.fixed"
        :sortable="column.sortable"
        :type="column.type"
      >
        <template v-if="column.slot" #default="scope">
          <slot :name="`column-${column.prop}`" v-bind="scope"></slot>
        </template>
      </el-table-column>

      <template #empty>
        <el-empty description="暂无数据" />
      </template>
    </el-table>
  </div>
</template>

<script setup>
defineOptions({
  name: 'TableMain'
})

defineProps({
  data: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  rowKey: {
    type: String,
    default: 'id'
  }
})

const emit = defineEmits(['selection-change'])

const handleSelectionChange = (selection) => {
  emit('selection-change', selection)
}
</script>

<style lang="scss" scoped>
.table-main {
  :deep(.el-table) {
    font-size: 14px;

    .el-table__header {
      th {
        background-color: #fafafa;
        color: #606266;
        font-weight: 600;
      }
    }
  }
}
</style>
