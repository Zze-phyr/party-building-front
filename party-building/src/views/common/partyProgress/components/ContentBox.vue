<template>
  <div class="content-box">
    <!-- 标题插槽 -->
    <div class="title">
      <slot name="title"></slot>
    </div>
    <!-- 内容插槽 -->
    <slot></slot>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps({
  // 是否显示审核状态
  showReview: {
    type: Boolean,
    default: false,
  },
  reviewState: {
    type: Number,
  },
})
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
  }
}
</style>
