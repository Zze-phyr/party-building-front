<template>
  <!-- 管理端导航栏 -->
  <div class="admin-layout">
    <!-- 顶部导航栏 -->
    <el-row>
      <el-col class="header" :span="24">
        <div class="left">
          <img class="img" src="../../../assets/images/admin/product-mark.jpg" alt="" />
          <span>党建后台管理系统</span>
        </div>
        <div class="right">
          <div class="item message">消息</div>
          <div class="item personal-center">管理员</div>
          <div class="item log-out">退出</div>
        </div>
      </el-col>
    </el-row>
    <el-row class="main-container">
      <!-- 左侧边导航栏 -->
      <el-col class="aside" :span="5"> </el-col>
      <!-- 右侧边内容 -->
      <el-col class="main" :span="19"><router-view></router-view></el-col>
    </el-row>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores'
import { computed } from 'vue'

//动态路由
const userStore = useUserStore()

// 使用计算属性获取动态路由，确保响应式更新
const dynamicRoutes = computed(() => userStore.getDynamicRoutes)
console.log('初始动态路由:', dynamicRoutes.value)
</script>

<style lang="scss" scoped>
/* 新增字体定义 */
@font-face {
  font-family: 'iconfont';
  src:
    url('@/assets/iconfont/iconfont.woff2') format('woff2'),
    url('@/assets/iconfont/iconfont.woff') format('woff');
}

.admin-layout {
  height: 100vh;
  background-color: #f5f7fa;
  overflow: hidden;
  // 顶部导航栏
  .header {
    position: fixed;
    width: 100%;
    height: 60px;
    background: #fff;
    font-size: 17px;
    color: #333;
    padding: 0 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    // 左边
    .left {
      display: flex;
      align-items: center;
      color: #bc0000;
      font-size: 20px;
      font-weight: bold;
      .img {
        width: 40px;
        height: 40px;
        margin-right: 10px;
      }
    }
    // 右边
    .right {
      display: flex;
      .item {
        /* 新增图标字体定义 */
        font-family: 'iconfont';
        margin-left: 20px;
        &:hover {
          color: #bc0000;
        }
      }
      .message::before {
        content: '\e604';
        margin-right: 2px;
        font-size: 20px;
      }
      .personal-center::before {
        content: '\e621';
        margin-right: 4px;
      }
      .log-out::before {
        content: '\e97f';
        margin-right: 4px;
        font-size: 18px;
      }
    }
  }
  .main-container {
    margin-top: 60px;
    // 左侧边导航栏
    .aside {
      height: 100vh;
      overflow-y: auto;
    }
    // 右侧边内容
    .main {
      height: 100vh;
      overflow-y: auto;
    }
  }
}
</style>
