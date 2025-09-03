<template>
  <div class="bg-container"></div>
  <div class="person-center-box">
    <!-- 信息盒子 -->
    <div class="info-box">
      <!-- 小卡片 -->
      <div class="card small-card">
        <div class="title">个人信息</div>
        <div class="avatar-container">
          <el-upload>
            <img
              style="width: 100px; height: 140px"
              src="../../../assets/images/common/profile-photo.png"
              fit="fill"
          /></el-upload>
        </div>
        <div class="info-item">
          <img src="../../../assets/images/icons/number.png" alt="" class="icon" />
          <span class="label">学号/工号</span>
          <span class="value">{{ infoStore.userInfo.number }}</span>
        </div>
        <div class="info-item">
          <img src="../../../assets/images/icons/name.png" alt="" class="icon" />
          <span class="label">用户姓名</span>
          <span class="value">{{ infoStore.userInfo.name }}</span>
        </div>
        <div class="info-item">
          <img src="../../../assets/images/icons/phone.png" alt="" class="icon" />
          <span class="label">手机号码</span>
          <span class="value">{{ infoStore.userInfo.phone }}</span>
        </div>
        <div class="info-item">
          <img src="../../../assets/images/icons/id.png" alt="" class="icon" />
          <span class="label">身份证号</span>
          <span class="value">{{ infoStore.userInfo.idCard }}</span>
        </div>
        <div class="info-item">
          <img src="../../../assets/images/icons/branch.png" alt="" class="icon" />
          <span class="label">所属支部</span>
          <span class="value">{{ infoStore.userInfo.branch }}</span>
        </div>
        <!-- <div class="info-item">
          <img src="../../assets/images/icons/post.png" alt="" class="icon" />
          <span class="label">现任职务</span>
          <span class="value">支部委员</span>
        </div> -->
        <div class="btn-box">
          <button class="btn" @click="openUserInfoDialog()">修改信息</button>
        </div>
      </div>
      <!-- 大卡片 -->
      <div class="card big-card">
        <div class="tabs">
          <div
            v-for="item in tabs"
            :key="item"
            @click="activeTab = item"
            :class="{ active: activeTab === item }"
            class="tab"
          >
            <text>{{ item }}</text>
          </div>
        </div>
        <div class="contents">
          <userData v-if="activeTab === '用户信息'"></userData>
          <systemSet v-if="activeTab === '系统设置'"></systemSet>
        </div>
      </div>
    </div>
    <!-- 修改信息对话框 -->
    <div class="dialog-box">
      <userInfoDialog v-model="dialogVisible"></userInfoDialog>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import systemSet from '@/views/common/personalCenter/system-set/system-set.vue'
import userData from '@/views/common/personalCenter/user-data/user-data.vue'
import userInfoDialog from '@/views/common/personalCenter/user-info-dialog/user-info-dialog.vue'
import { getCommonUserDetail } from '@/api/common'
import { ElMessage } from 'element-plus'
import { useInfoStore, useUserStore } from '@/stores'

const userStore = useUserStore()
const infoStore = useInfoStore()

const tabs = ['用户信息', '系统设置']
const activeTab = ref('用户信息')

// 组件挂载后
onMounted(async () => {
  try {
    if (!infoStore.hasGetInfo) {
      const { data } = await getCommonUserDetail(userStore.userId)
      infoStore.userInfo = data.data
    }
  } catch (error) {
    console.log(error)
    ElMessage.error('数据请求失败')
  }
})

//打开修改个人信息对话框
const dialogVisible = ref(false)
const openUserInfoDialog = () => {
  dialogVisible.value = true
}
</script>

<style lang="scss" scoped>
.bg-container {
  background: url(../../../assets/images/common/person-center-bg.png) no-repeat 0 0 / 100% fixed;
  background-size: cover; //图片比例与屏幕不匹配
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: -1;
}
.person-center-box {
  .info-box {
    display: flex;
    padding: 40px 80px 20px;
    .card {
      background-color: rgba(255, 255, 255, 0.6);
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .small-card {
      margin-right: 20px;
      padding-bottom: 10px;
      width: 300px;
      height: 400px;
      .title {
        font-size: 14px;
      }
      .avatar-container {
        text-align: center;
        margin: 5px 0 8px 0;
      }
      .info-item {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        color: #333;
        .icon {
          width: 20px;
          height: 20px;
          margin-right: 8px;
        }
        .label {
          width: 80px;
        }
      }
      .btn-box {
        height: 48px;
        text-align: center;
        line-height: 48px;
        .btn {
          background-color: #bc0000;
          color: white;
          border: none;
          border-radius: 12px;
          padding: 8px 30px;
          cursor: pointer;
          font-size: 16px;
        }
        .btn:hover {
          box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.3);
        }
      }
    }
    .big-card {
      width: 1000px;
      // height: 680px;
      .tabs {
        display: flex;
        .tab {
          width: 75px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          color: #333;
          border-bottom: 2px solid #333;
        }
        .tab:hover,
        .active {
          color: #bc0000;
          border-bottom: 2px solid #bc0000;
        }
      }
    }
  }
}
</style>
