<template>
  <div class="big-title">
    <slot>{{ defaultText }}</slot>
  </div>
</template>

<script setup>
const defaultText = '默认标题'
</script>

<style scoped>
.big-title {
  margin-bottom: 20px;
  width: 100%;
  background-color: #f2c3b2;
  border-radius: 8px;
  height: 40px;
  font-size: 20px;
  line-height: 40px;
  text-align: center;
  color: #bc0000da;
}
</style>
