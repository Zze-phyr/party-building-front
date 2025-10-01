<!-- 结业证书 -->
<template>
  <ContentBox>
    <template #title> {{ name }} </template>
    <div v-if="metaData.status === -2" class="text-content">等待上传中</div>
    <div v-else-if="metaData.status === 1" class="img-content">
      <div class="img-box">
        <img class="img" :src="certificateImgUrl" :alt="name" />
      </div>
      <div class="time-box">结业时间：{{ metaData.attachTime }}</div>
    </div>
  </ContentBox>
</template>

<script setup>
import ContentBox from './ContentBox.vue'
import { onMounted, defineProps, ref, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getFileMetadata } from '@/utils/file/getFileMetadata'
import { generalApi } from '@/api/general'

const props = defineProps({
  name: {
    type: String,
    default: '结业证书',
  },
  fileType: {
    type: String,
  },
})

const requestParams = {
  userId: '-1',
  fileType: props.fileType,
}

const metaData = ref({
  fileId: null,
  status: -2,
  attachText: '',
  attachTime: '',
  returnText: '错误',
  fileName: '',
})

// 组件挂载后
onMounted(async () => {
  try {
    await getFileMetadata(requestParams, metaData)
  } catch (error) {
    console.log(error)
    ElMessage.error('数据获取失败')
  }
})

const certificateImgUrl = ref('')

const generateImgUrl = async (fileId) => {
  try {
    const response = await generalApi.downloadFile(fileId)
    const blob = response.data
    certificateImgUrl.value = URL.createObjectURL(blob)
  } catch (error) {
    console.error('下载失败:', error)
    ElMessage.error('图片下载失败')
  }
}

if (metaData.value.fileId) {
  generateImgUrl(metaData.value.fileId)
}

onUnmounted(() => {
  if (certificateImgUrl.value) URL.revokeObjectURL(certificateImgUrl.value)
})
</script>

<style lang="scss" scoped>
.img-content {
  .img-box {
    margin: 10px 20px;
    .img {
      width: 100%;
      aspect-ratio: 3/2; /* 宽:高 = 3:2 */
      object-fit: cover; /* 图片填充方式 */
    }
  }
  .time-box {
    margin-bottom: 10px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    font-size: 12px;
    font-weight: bold;
    color: #333;
  }
}
.text-content {
  height: 240px;
  color: #bc0000;
  font-size: 30px;
  line-height: 240px;
  text-align: center;
}
</style>
