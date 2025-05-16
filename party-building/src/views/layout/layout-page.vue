<template>
  <div class="layout-container">
    <el-container>
      <!-- 顶部导航栏 -->
      <el-header class="nav-container">
        <el-menu
          :ellipsis="false"
          :default-active="activeIndex2"
          class="nav"
          mode="horizontal"
          background-color="#BC0000"
          text-color="#fff"
          active-text-color="#ffd04b"
          @select="handleSelect"
        >
          <!-- 校徽 -->
          <div class="img-box">
            <img class="img" src="../../assets/images/common/hnust-logo.png" alt="" />
          </div>
          <!-- 菜单选择 -->
          <el-menu-item index="1" @click="skipPage('/layout/index')">首页</el-menu-item>
          <el-menu-item index="2" @click="skipPage('/layout/partyProgress')">入党进度</el-menu-item>
          <el-menu-item index="3">支部风采</el-menu-item>
          <el-menu-item index="4">我的组织</el-menu-item>
          <el-menu-item index="5">党建学习</el-menu-item>
          <!-- 个人 -->
          <div class="self-box">
            <div
              class="party-icon-box"
              @click="skipPage('/layout/personalCenter')"
              @mouseenter="handleMouseEnter"
              @mouseleave="handleMouseLeave"
            >
              <img class="img" :src="currentIcon" alt="" />
            </div>
            <div class="text">张三</div>
          </div>
        </el-menu>
      </el-header>
      <!-- 中间内容 -->
      <el-main class="main">
        <router-view></router-view>
      </el-main>
      <!-- 备案信息 -->
      <el-footer></el-footer>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'

// 定义默认图片和 hover 图片路径
const normalIcon = new URL('../../assets/images/common/nav-icon.png', import.meta.url).href
const hoverIcon = new URL('../../assets/images/common/nav-icon-2.png', import.meta.url).href

// 动态绑定的图片路径
const currentIcon = ref(normalIcon)

// hover 切换函数
const handleMouseEnter = () => {
  currentIcon.value = hoverIcon
}
const handleMouseLeave = () => {
  currentIcon.value = normalIcon
}

const activeIndex2 = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const router = useRouter()

const skipPage = (path) => {
  router.push(path)
}
</script>

<style lang="less" scoped>
.el-main {
  padding: 0;
}
.nav-container {
  padding: 0;
  height: 70px;
  .nav {
    height: 100%;
    .img-box {
      margin: 10px 50px;
      width: 217px;
      height: 49px;
      .img {
        height: 100%;
        width: 100%;
      }
    }
    :deep(.el-sub-menu__title) {
      font-size: 16px !important;
    }
    :deep(.el-menu-item) {
      font-size: 16px !important;
    }
    .el-sub-menu .el-sub-menu__icon-arrow {
      font-size: 16px;
      margin-top: -8px;
    }
    .self-box {
      margin-left: auto;
      margin-right: 40px;
      display: flex;
      .party-icon-box {
        margin: 22px 10px;
        width: 26px;
        height: 26px;
        .img {
          height: 100%;
          width: 100%;
        }
      }
      .text {
        font-size: 14px;
        color: white;
        line-height: 70px;
      }
    }
  }
  .el-menu--horizontal > .el-menu-item.is-active {
    border-bottom: 0 solid rgba(0, 0, 0, 0);
    color: white !important;
  }
  .el-menu--horizontal .el-menu .el-menu-item.is-active {
    color: var(--el-menu-active-color);
  }
}
</style>
