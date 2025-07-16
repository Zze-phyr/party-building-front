<template>
  <div class="layout-container">
    <el-container>
      <!-- 顶部导航栏 -->
      <el-header class="nav-container">
        <el-menu
          :ellipsis="false"
          :default-active="activeIndex"
          class="nav"
          mode="horizontal"
          background-color="#BC0000"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <!-- 校徽 -->
          <div class="img-box">
            <img class="img" src="../../../assets/images/common/hnust-logo.png" alt="校徽" />
          </div>
          <!-- 菜单选择 -->
          <template v-for="route in dynamicRoutes" :key="route.name">
            <el-menu-item :index="route.name" @click="skipPage(`/common/${route.path}`)">
              {{ route.meta.title }}
            </el-menu-item>
          </template>
          <!-- 个人 -->
          <div class="self-box">
            <div
              class="party-icon-box"
              @click="skipPage('/common/personalCenter')"
              @mouseenter="handleMouseEnter"
              @mouseleave="handleMouseLeave"
            >
              <img class="img" :src="currentIcon" alt="个人图标" />
            </div>
            <div class="text">{{ infoStore.userInfo.name }}</div>
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

<script setup>
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import { useUserStore, useInfoStore } from '@/stores'

//动态路由
const router = useRouter()
const userStore = useUserStore()
const infoStore = useInfoStore()

let dynamicRoutes = userStore.getDynamicRoutes

dynamicRoutes = dynamicRoutes.filter((route) => !route.meta?.hidden)

// 当前激活菜单
const activeIndex = computed(() => {
  return router.currentRoute.value.name?.toString() || ''
})

const skipPage = (path) => {
  router.push(path)
}

// 定义默认图片和 hover 图片路径
const normalIcon = new URL('../../../assets/images/common/nav-icon.png', import.meta.url).href
const hoverIcon = new URL('../../../assets/images/common/nav-icon-2.png', import.meta.url).href

// 动态绑定的图片路径
const currentIcon = ref(normalIcon)

// hover 切换函数
const handleMouseEnter = () => {
  currentIcon.value = hoverIcon
}
const handleMouseLeave = () => {
  currentIcon.value = normalIcon
}
</script>

<style lang="scss" scoped>
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
      font-size: 20px !important;
    }
    :deep(.el-menu-item) {
      font-size: 20px !important;
    }
    .el-sub-menu .el-sub-menu__icon-arrow {
      font-size: 20px;
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
        font-size: 16px;
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
