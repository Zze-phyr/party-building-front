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
      <el-col class="aside" :span="5">
        <el-menu
          active-text-color="#bc0000"
          background-color="#fff"
          default-active="1-1"
          class="aside-menu"
        >
          <!-- 动态渲染菜单 -->
          <template v-for="(route, index) in dynamicRoutes" :key="index">
            <!-- 有子路由的菜单 -->
            <el-sub-menu v-if="route.children && route.children.length > 0" :index="index + 1">
              <template #title>
                <i class="iconfont" v-html="route.meta.icon"></i>
                <span>{{ route.meta.title }}</span>
              </template>
              <!-- 递归渲染子菜单 -->
              <template v-for="(child, childIndex) in route.children" :key="childIndex">
                <el-menu-item
                  v-if="!child.children || child.children.length === 0"
                  :index="`${index + 1}-${childIndex + 1}`"
                  @click="navigateTo(`/admin/${route.path}/${child.path}`)"
                >
                  <i class="iconfont" v-html="child.meta.icon"></i>
                  <span>{{ child.meta.title }}</span>
                </el-menu-item>
                <!-- 三级菜单 -->
                <el-sub-menu v-else :index="`${index + 1}-${childIndex + 1}`">
                  <template #title>
                    <i class="iconfont" v-html="child.meta.icon"></i>
                    <span>{{ child.meta.title }}</span>
                  </template>
                  <el-menu-item
                    v-for="(grandchild, gcIndex) in child.children"
                    :key="gcIndex"
                    :index="`${index + 1}-${childIndex + 1}-${gcIndex + 1}`"
                    @click="navigateTo(`/admin/${route.path}/${child.path}/${grandchild.path}`)"
                  >
                    <i class="iconfont" v-html="grandchild.meta.icon"></i>
                    <span>{{ grandchild.meta.title }}</span>
                  </el-menu-item>
                </el-sub-menu>
              </template>
            </el-sub-menu>
            <!-- 无子路由的菜单 -->
            <el-menu-item v-else :index="index + 1" @click="navigateTo(`/admin/${route.path}`)">
              <i class="iconfont" v-html="child.meta.icon"></i>
              <span>{{ route.meta.title }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-col>
      <!-- 右侧边内容 -->
      <el-col class="main" :span="19"><router-view /></el-col>
    </el-row>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'

//动态路由
const userStore = useUserStore()
const router = useRouter()

// 导航方法
const navigateTo = (path) => {
  router.push(path)
}

// 使用计算属性获取动态路由并过滤隐藏的路由
const dynamicRoutes = computed(() => {
  return userStore.getDynamicRoutes.filter((route) => !route.meta?.hidden)
})
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
        &::before {
          font-size: 18px;
          margin-right: 4px;
        }
      }
      .message::before {
        content: '\e604';
      }
      .personal-center::before {
        content: '\e6d0';
      }
      .log-out::before {
        content: '\e97f';
      }
    }
  }
  .main-container {
    margin-top: 60px;
    // 左侧边导航栏
    .aside {
      height: 100vh;
      overflow-y: auto;
      .aside-menu {
        padding: 10px 15px;
        height: 100vh;
        .iconfont {
          padding-right: 10px;
        }
        :deep(.el-sub-menu__title:hover),
        :deep(.el-menu-item.is-active),
        :deep(.el-menu-item:hover) {
          background-color: #fee2e2;
          border-radius: 8px;
          color: #bc0000;
        }
        :deep(.el-sub-menu) {
          margin-bottom: 5px;
        }
        :deep(.el-menu-item) {
          margin-top: 5px;
        }
      }
    }
    // 右侧边内容
    .main {
      height: 100vh;
      overflow-y: auto;
      padding: 20px;
    }
  }
}
</style>
