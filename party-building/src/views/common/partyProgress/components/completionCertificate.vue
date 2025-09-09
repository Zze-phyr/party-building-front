<!-- 结业证书 -->
<template>
  <ContentBox>
    <template #title> {{ name }} </template>
    <div v-if="status === -2" class="text-content">等待上传中</div>
    <div v-else-if="status === 1" class="img-content">
      <div class="img-box">
        <img class="img" :src="imgUrl" :alt="name" />
      </div>
      <div class="time-box">结业时间：{{ time }}</div>
    </div>
  </ContentBox>
</template>

<script setup>
import ContentBox from './ContentBox.vue'
import { defineProps } from 'vue'

/* eslint-disable-next-line no-unused-vars */
const props = defineProps({
  name: {
    type: String,
    default: '结业证书',
  },
  status: {
    type: Number,
    default: -2,
  },
  imgUrl: {
    type: String,
  },
  date: {
    type: String,
  },
})
</script>

<style lang="scss" scoped>
.img-content {
  .img-box {
    margin: 10px 20px;
    .img {
      width: 100%;
      aspect-ratio: 3/2; /* 宽:高 = 3:2 */
      object-fit: cover; /* 图片填充方式 */
    }
  }
  .time-box {
    margin-bottom: 10px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    font-size: 12px;
    font-weight: bold;
    color: #333;
  }
}
.text-content {
  height: 240px;
  color: #bc0000;
  font-size: 30px;
  line-height: 240px;
  text-align: center;
}
</style>
