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

<script setup></script>

<style scoped>
.content-box {
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
