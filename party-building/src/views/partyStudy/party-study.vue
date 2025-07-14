<template>
  <div class="vertical-stepper">
    <div
      v-for="(step, index) in reversedSteps"
      :key="index"
      class="step-container"
      :class="getStepStatus(index)"
      @click="handleStepClick(index)"
    >
      <!-- 步骤点 -->
      <div class="step-dot"></div>

      <!-- 步骤之间的连接线 -->
      <div v-if="index < reversedSteps.length - 1" class="step-connector"></div>

      <!-- 步骤内容 -->
      <div class="step-content">
        <div class="step-name">{{ step }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores' // 替换为你的Pinia store路径

const store = useUserStore()

// 从store获取步骤数据和当前状态
const steps = computed(() => store.steps)
const currentStepIndex = computed(() => store.status - 1) // 假设status从1开始

// 反转数组实现从下往上显示
const reversedSteps = computed(() => [...steps.value].reverse())

// 步骤状态判断
const getStepStatus = (index) => {
  const originalIndex = steps.value.length - 1 - index
  if (originalIndex === currentStepIndex.value) return 'active'
  if (originalIndex < currentStepIndex.value) return 'completed'
  return 'disabled'
}

// 处理步骤点击
const handleStepClick = (index) => {
  const originalIndex = steps.value.length - 1 - index
  if (originalIndex <= currentStepIndex.value) {
    // 查看已完成步骤的内容（这里可以触发查看逻辑）
    console.log('查看步骤:', steps.value[originalIndex])
  }
}
</script>

<style lang="scss" scoped>
.vertical-stepper {
  height: 500px;
  display: flex;
  flex-direction: column-reverse;
  padding: 20px 0;
  position: relative;
}

.step-container {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  padding: 12px 0;
  cursor: pointer;

  &.active {
    .step-dot {
      background: #1890ff;
      border-color: #1890ff;
      transform: scale(1.2);
    }
    .step-name {
      color: #1890ff;
      font-weight: bold;
    }
  }

  &.completed {
    .step-dot {
      background: #52c41a;
      border-color: #52c41a;
    }
    .step-connector {
      background: #52c41a;
    }
  }

  &.disabled {
    cursor: not-allowed;
    .step-dot {
      background: #f5f5f5;
      border-color: #d9d9d9;
    }
    .step-name {
      color: #999;
    }
  }
}

.step-dot {
  width: 16px;
  height: 16px;
  border: 2px solid #d9d9d9;
  border-radius: 50%;
  background: white;
  transition: all 0.3s;
  z-index: 1;
}

.step-connector {
  position: absolute;
  left: 7px;
  top: 100%;
  height: calc(100% - 16px);
  width: 2px;
  background: #d9d9d9;
  z-index: 0;
}

.step-content {
  margin-left: 24px;
  padding-right: 20px;
}

.step-name {
  transition: color 0.3s;
  font-size: 14px;
}
</style>
