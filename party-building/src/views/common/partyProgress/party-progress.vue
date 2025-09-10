<template>
  <div class="bg-container"></div>
  <div class="party-progress-container">
    <div class="step-container">
      <!-- 预备党员 -->
      <div class="step-item">
        <div
          class="step-dot"
          :class="{ 'dot-finished': status === 'ReservePartyMenbers' }"
          @click="checkFour()"
        ></div>
        <div
          class="step-connector"
          :class="{ 'connector-finished': status === 'ReservePartyMenbers' }"
        ></div>
        <div
          class="step-content"
          :class="{ 'content-finished': status === 'ReservePartyMenbers' }"
          @click="checkFour()"
        >
          预备党员的接收、教育考察和转正
        </div>
      </div>
      <!-- 发展对象的确定和考察 -->
      <div class="step-item">
        <div
          class="step-dot"
          :class="{
            'dot-finished': allowDevelopment.includes(status),
          }"
          @click="checkThree()"
        ></div>
        <div
          class="step-connector"
          :class="{
            'connector-finished': allowDevelopment.includes(status),
          }"
        ></div>
        <div
          class="step-content"
          :class="{
            'content-finished': allowDevelopment.includes(status),
          }"
          @click="checkThree()"
        >
          发展对象的确定和考察
        </div>
      </div>
      <!-- 入党积极分子的确定和培养教育 -->
      <div class="step-item">
        <div
          class="step-dot"
          :class="{
            'dot-finished': allowPartyActivities.includes(status),
          }"
          @click="checkTwo()"
        ></div>
        <div
          class="step-connector"
          :class="{ 'connector-finished': allowPartyActivities.includes(status) }"
        ></div>
        <div
          class="step-content"
          :class="{ 'content-finished': allowPartyActivities.includes(status) }"
          @click="checkTwo()"
        >
          入党积极分子的确定和培养教育
        </div>
      </div>
      <!-- 申请入党 -->
      <div class="step-item">
        <div class="step-dot dot-finished" @click="checkOne()"></div>
        <div class="step-content content-finished" @click="checkOne()">申请入党</div>
      </div>
      <!-- 温馨提示 -->
      <div class="tips">Tips:可点击圆点查看历史上传记录</div>
    </div>
    <div class="task-container">
      <component :is="tabs[checkState]"></component>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import applyParty from './apply-party/apply-party.vue'
import partyActivist from './party-activist/party-activist.vue'
import developCandidate from './develop-candidate/develop-candidate.vue'
import probationMember from './probationary-member/probationary-member.vue'

const userStore = useUserStore()
const status = userStore.getPermission[2]

const tabs = {
  Applicant: applyParty,
  PartyActivities: partyActivist,
  Development: developCandidate,
  ReservePartyMenbers: probationMember,
}

const checkState = ref(status)
const allowPartyActivities = ['PartyActivities', 'Development', 'ReservePartyMenbers']
const allowDevelopment = ['Development', 'ReservePartyMenbers']

//点击查看过往入党流程
const checkOne = () => {
  checkState.value = 'Applicant'
}

const checkTwo = () => {
  if (allowPartyActivities.includes(status)) checkState.value = 'PartyActivities'
}

const checkThree = () => {
  if (allowDevelopment.includes(status)) checkState.value = 'Development'
}

const checkFour = () => {
  if (status === 'ReservePartyMenbers') checkState.value = 'ReservePartyMenbers'
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
.party-progress-container {
  display: flex;
  margin: 40px 80px;
  .step-container {
    margin-right: 3%;
    width: 22%;
    min-width: 280px; // 设置最小宽度
    max-width: 320px;
    height: 510px;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 20px 35px;
    border-radius: 8px;
    .step-item {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      .step-dot {
        width: 20px;
        height: 20px;
        background-color: #fff;
        border-radius: 50%;
        border: 2px solid #efb1b9d7;
      }
      .step-connector {
        width: 2px;
        height: 115px;
        background-color: #efb1b9d7;
      }
      .step-content {
        position: absolute;
        padding: 5px;
        width: 90px;
        background-color: #efb1b9;
        border-radius: 5px;
        color: #fff;
        text-align: center;
      }
      &:nth-child(odd) .step-content {
        left: -8px;
      }
      &:nth-child(even) .step-content {
        right: -10px;
      }
      .connector-finished {
        background-color: #bc0000;
      }
      .content-finished {
        background-color: #bc0000;
        transition: all 0.3s ease-in-out;
        &:hover {
          padding: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        }
      }
      .dot-finished {
        background-color: #bc0000;
        border-color: #bc0000;
        transition: all 0.3s ease-in-out;
      }
      .dot-finished:hover {
        width: 25px;
        height: 25px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
      }
    }
    .tips {
      font-size: 12px;
      margin-top: 25px;
      text-align: center;
    }
  }
  .task-container {
    width: 75%;
  }
}
</style>
