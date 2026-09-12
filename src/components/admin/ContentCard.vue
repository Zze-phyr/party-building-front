<template>
  <div class="card-container">
    <div class="card-header">
      <div class="card-title">{{ title }}</div>
      <button v-if="showBackBtn" @click="handleBack" class="back-button">
        <el-icon :size="18"><Back /></el-icon>返回
      </button>
    </div>
    <div class="card-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { Back } from '@element-plus/icons-vue'

/* eslint-disable-next-line no-unused-vars */
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  showBackBtn: {
    type: Boolean,
    default: false,
  },
})

const router = useRouter()
const handleBack = () => router.go(-1)
</script>

<style lang="scss" scoped>
.card-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: calc(100vh - 100px);
  width: 100%;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;

    .card-title {
      color: #000;
      font-size: 22px;
      font-weight: bold;
    }

    .back-button {
      background-color: #f0f0f0;
      color: #333;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      transition: all 0.2s ease;

      &:hover {
        background-color: #e0e0e0;
        transform: translateY(-1px);
      }
    }
  }

  .card-content {
    padding: 16px 24px;
  }
}
</style>
