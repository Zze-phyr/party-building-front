<template>
  <div class="content-box">
    <!-- 标题插槽 -->
    <div class="title">
      <slot name="title"></slot>
      <span class="confirm-content" v-if="confirm === 0">审核中......</span>
      <span class="confirm-content" v-else-if="confirm === 1">审核成功！</span>
      <span
        class="confirm-content audit-failures"
        v-else-if="confirm === -1"
        @click="centerDialogVisible = true"
        >审核失败，点击查看原因</span
      >
    </div>
    <el-dialog
      v-model="centerDialogVisible"
      title="修改建议"
      width="500"
      align-center
      :show-close="false"
    >
      <span>{{ proposedChanges }}</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button color="#d12626" @click="centerDialogVisible = false"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 内容插槽 -->
    <slot></slot>
  </div>
</template>

<script setup>
import { defineProps, ref } from 'vue'

/* eslint-disable-next-line no-unused-vars */
const props = defineProps({
  // 是否显示审核状态
  confirm: {
    type: Number,
    default: -2,
  },
  proposedChanges: {
    type: String,
    default: '无',
  },
})

const centerDialogVisible = ref(false)
</script>

<style scoped>
.content-box {
  margin-bottom: 20px;
  width: 100%;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  .title {
    padding-left: 20px;
    height: 40px;
    font-size: 18px;
    line-height: 40px;
    background-color: #fbfbfb;
    transition: all 0.3s ease-in-out;
    .confirm-content {
      padding-left: 10px;
      color: #bc0000;
    }
    .audit-failures:hover {
      color: #bc00009e;
    }
  }
}
</style>
