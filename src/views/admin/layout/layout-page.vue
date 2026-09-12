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
          <el-badge :value="12" class="item">
            <el-button text circle>
              <i-ep-bell />
            </el-button>
          </el-badge>
          <el-dropdown>
            <el-avatar
              :src="userInfoStore.userInfo.avatar || ''"
            >
              {{ userInfoStore.userInfo.avatar ? '' : userInfoStore.userInfo.name }}
            </el-avatar>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item><i-ep-user style="margin-right: 5px;" />用户信息</el-dropdown-item>
                <el-dropdown-item><i-ep-switch-button style="margin-right: 5px;" />退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-col>
    </el-row>
    <el-row class="main-container">
      <!-- 左侧边导航栏 -->
      <el-col class="aside" :span="4">
        <el-menu
          active-text-color="#bc0000"
          background-color="#fff"
          :default-active="activeMenu"
          class="aside-menu"
        >
          <!-- 动态渲染菜单 -->
          <template v-for="(route, index) in dynamicRoutes" :key="index">
            <!-- 有子路由的菜单 -->
            <el-sub-menu v-if="route.children && route.children.length > 0 && !route.meta?.hiddenChildren" :index="route.path">
              <template #title>
                <i class="iconfont" v-html="route.meta.icon"></i>
                <el-tooltip
                  :content="route.meta.title"
                  placement="right"
                  :disabled="!isTextOverflow(`parent-${index}`)"
                >
                  <el-text
                    :ref="el => setTextRef(`parent-${index}`, el)"
                    truncated
                  >
                    {{ route.meta.title }}
                  </el-text>
                </el-tooltip>
              </template>
              <el-menu-item
                v-for="(child, childIndex) in route.children"
                :key="childIndex"
                :index="`${route.path}/${child.path}`"
                @click="navigateTo(`/admin/${route.path}/${child.path}`)"
              >
                <i class="iconfont" v-html="child.meta.icon"></i>
                <el-tooltip
                  :content="child.meta.title"
                  placement="right"
                  :disabled="!isTextOverflow(`child-${index}-${childIndex}`)"
                >
                  <el-text
                    :ref="el => setTextRef(`child-${index}-${childIndex}`, el)"
                    truncated
                  >
                    {{ child.meta.title }}
                  </el-text>
                </el-tooltip>
              </el-menu-item>
            </el-sub-menu>
            <!-- 一级菜单项 - 修复这里 -->
            <el-menu-item
              v-else
              :index="getMenuItemIndex(route)"
              @click="navigateTo(getMenuItemPath(route))"
            >
              <i class="iconfont" v-html="route.meta.icon"></i>
              <el-tooltip
                :content="route.meta.title"
                placement="right"
                :disabled="!isTextOverflow(`single-${index}`)"
              >
                <el-text
                  :ref="el => setTextRef(`single-${index}`, el)"
                  truncated
                >
                  {{ route.meta.title }}
                </el-text>
              </el-tooltip>
            </el-menu-item>
          </template>
        </el-menu>
      </el-col>
      <!-- 右侧边内容 -->
      <el-col class="main" :span="20"><router-view /></el-col>
    </el-row>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, nextTick } from 'vue'
import { useUserStore, useInfoStore } from '@/stores'
import { useRouter, useRoute } from 'vue-router'

//动态路由
const userStore = useUserStore()
const userInfoStore = useInfoStore()
const router = useRouter()
const route = useRoute()

// 存储文本元素引用
const textRefs = ref({})
const overflowMap = ref({})

// 设置文本引用
const setTextRef = (key, el) => {
  if (el) {
    textRefs.value[key] = el
  }
}

// 检查文本是否溢出
const isTextOverflow = (key) => {
  return overflowMap.value[key] || false
}

// 检查所有文本元素是否溢出
const checkTextOverflow = () => {
  nextTick(() => {
    Object.keys(textRefs.value).forEach(key => {
      const el = textRefs.value[key]
      if (el && el.$el) {
        const element = el.$el
        overflowMap.value[key] = element.scrollWidth > element.clientWidth
      }
    })
  })
}

// 获取菜单项的 index（用于一级菜单）
const getMenuItemIndex = (routeItem) => {
  // 如果有子路由但被隐藏，使用第一个子路由的路径
  if (routeItem.children && routeItem.children.length > 0) {
    return `${routeItem.path}/${routeItem.children[0].path}`
  }
  // 否则使用自己的路径
  return routeItem.path
}

// 获取菜单项的完整路径（用于导航）
const getMenuItemPath = (routeItem) => {
  // 如果有子路由但被隐藏，导航到第一个子路由
  if (routeItem.children && routeItem.children.length > 0) {
    return `/admin/${routeItem.path}/${routeItem.children[0].path}`
  }
  // 否则导航到自己
  return `/admin/${routeItem.path}`
}

// 导航方法
const navigateTo = (path) => {
  router.push(path)
}

// 使用计算属性获取动态路由并过滤隐藏的路由
const dynamicRoutes = computed(() => {
  // 路由加载完成后检查文本溢出
  nextTick(() => {
    checkTextOverflow()
  })
  return userStore.getDynamicRoutes.filter((route) => !route.meta?.hidden)
})

// 计算当前激活的菜单项
const activeMenu = computed(() => {
  const path = route.path

  // 移除 /admin 前缀
  const cleanPath = path.replace('/admin/', '')

  // 分割路径
  const pathSegments = cleanPath.split('/').filter(Boolean)

  if (pathSegments.length === 0) {
    return ''
  } else if (pathSegments.length === 1) {
    // 一级路由，需要检查是否有子路由
    const matchedRoute = dynamicRoutes.value.find(r => r.path === pathSegments[0])
    if (matchedRoute && matchedRoute.children && matchedRoute.children.length > 0) {
      // 如果有子路由，返回第一个子路由的路径
      return `${matchedRoute.path}/${matchedRoute.children[0].path}`
    }
    return pathSegments[0]
  } else {
    // 二级或更深路由，返回 parent/child 格式
    return `${pathSegments[0]}/${pathSegments[1]}`
  }
})

// 监听窗口大小变化，重新检查溢出
onMounted(() => {
  checkTextOverflow()

  window.addEventListener('resize', checkTextOverflow)

  // 组件卸载时移除监听
  return () => {
    window.removeEventListener('resize', checkTextOverflow)
  }
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
      align-items: center;
      gap: 40px;
      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-left: 20px;
      }
      .item {
        /* 新增图标字体定义 */
        font-family: 'iconfont';
        margin-left: 20px;
        cursor: pointer;
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
    // 左侧边导航栏
    .aside {
      height: calc(100vh - 60px);
      overflow-y: auto;
      box-sizing: border-box;
      .aside-menu {
        padding: 10px 15px;
        min-height: 100%;
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
          margin: 5px 0;
        }
      }
    }
    // 右侧边内容
    .main {
      height: calc(100vh - 60px);
      overflow-y: auto;
      padding: 20px;
    }
  }
}
</style>
