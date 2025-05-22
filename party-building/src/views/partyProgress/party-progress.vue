<template>
  <div class="bg-container"></div>
  <div class="party-progress-container">
    <div class="step-container">
      <el-steps direction="vertical" :active="2">
        <el-step title="申请入党" />
        <el-step title="入党积极分子的确定和培养教育" />
        <el-step title="发展对象的确定和考察" />
        <el-step title="预备党员的接收" />
        <el-step title="预备党员的教育考察和转正" />
      </el-steps>
    </div>
    <div class="task-container">
      <applyParty v-if="checkState === 'one'" />
      <partyActivist v-else-if="checkState === 'two'" />
      <developCandidate v-else-if="checkState === '3'" />
      <probationMember v-else-if="checkState === '4'" />
      <fullPartyMember v-else-if="checkState === '5'" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import applyParty from '@/components/party-progress/apply-party/apply-party.vue'
import partyActivist from '@/components/party-progress/party-activist/party-activist.vue'
import developCandidate from '@/components/party-progress/develop-candidate/develop-candidate.vue'
import probationMember from '@/components/party-progress/probation-member/probation-member.vue'
import fullPartyMember from '@/components/party-progress/full-party-member/full-party-member.vue'

const userStore = useUserStore()
const status = userStore.getStatus
const checkState = ref(status)

//点击查看过往入党流程
// const checkOne = () => {
//   checkState.value = 'one'
// }

// const checkTwo = () => {
//   if (status !== 'one') checkState.value = 'two'
// }

console.log(status)
</script>

<style lang="less" scoped>
.bg-container {
  background: url(../../assets/images/common/party-progress-bg.jpg) no-repeat 0 0 / 100% fixed;
  background-size: cover; //图片比例与屏幕不匹配
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: -1;
}
.party-progress-container {
  display: flex;
  margin: 40px 80px;
  .step-container {
    margin-right: 3%;
    width: 22%;
    height: 640px;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 20px 35px;
    border-radius: 8px;
    //步骤条已完成
    ::v-deep .el-step__head.is-finish {
      color: #bc0000;
    }
    ::v-deep .el-step__line-inner {
      border-width: 1.5px !important;
    }
    ::v-deep .el-step__head.is-finish.el-step__icon.is-text {
      border: 2.5px solid;
    }
    ::v-deep .el-step__title.is-finish {
      color: #bc0000;
    }
    // 步骤条正在完成
    ::v-deep .el-step__head.is-process {
      color: #ffb900;
    }
    ::v-deep .el-step__head.is-process.el-step__icon.is-text {
      border: 2.5px solid;
    }
    ::v-deep .el-step__title.is-process {
      color: #ffb900;
      font-weight: normal;
    }
  }
  .task-container {
    width: 75%;
  }
}
</style>
