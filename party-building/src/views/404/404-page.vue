<template>
  <div class="page-404">
    <h1>404 - 页面未找到</h1>
    <p>很抱歉，您访问的页面不存在。</p>
    <el-button type="primary" @click="goBack">返回首页</el-button>
  </div>
</template>

<script setup>
// import { useRouter } from 'vue-router';

// const router = useRouter();

// const goBack = () => {
//   // 返回到首页，这里假设首页路径是'/'
//   router.push('/');
// };
</script>

<style scoped>
.page-404 {
  text-align: center;
  padding: 100px;
}

h1 {
  font-size: 64px;
  color: #333;
}

p {
  font-size: 24px;
  color: #666;
  margin-bottom: 30px;
}
</style>
