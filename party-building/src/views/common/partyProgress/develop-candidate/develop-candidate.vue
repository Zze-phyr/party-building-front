<template>
  <div class="develop-candidate-container">
    <!-- 入党流程标题 -->
    <BigTitle>发展对象的确定和考察</BigTitle>
    <!-- 确定发展对象会议记录 -->
    <meetingRecord :name="'确定发展对象会议记录'" :file-metadata="DevConfirmationMetadata" />
    <!-- 手册二 -->
    <HandBook
      name="手册二（一）"
      :file-types="['HandbookSecondTemplateDev', 'HandbookSecondDev']"
    />
    <!-- 入党志愿书&结业证书 -->
    <div class="autobiography-certificate-box">
      <!-- 结业证书 -->
      <div class="certificate-box">
        <CompletionCertificate
          name="发展对象结业证书"
          file-type="DevelopmentCertificateCompletion"
        />
      </div>
      <!-- 入党志愿书（一） -->
      <div class="volunteer-letter-box">
        <HandBook
          name="入党志愿书（一）"
          :is-pic-show="true"
          :file-types="['VolunteerLetterTemplateDev', 'VolunteerLetterDev']"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import BigTitle from '../components/BigTitle.vue'
import HandBook from '../components/HandBook.vue'
import CompletionCertificate from '../components/CompletionCertificate.vue'
import meetingRecord from '../components/meetingRecord.vue'
import { reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getFileMetadata } from '@/utils/file/getFileMetadata'

// 获取文件元数据请求参数

const DevConfirmationRequestParams = reactive({
  userId: '-1',
  fileType: 'DevConfirmation',
})

// 文件元数据

const DevConfirmationMetadata = reactive({
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
    await Promise.all([getFileMetadata(DevConfirmationRequestParams, DevConfirmationMetadata)])
  } catch (error) {
    console.log(error)
    ElMessage.error('数据获取失败')
  }
})
</script>

<style lang="scss" scoped>
.develop-candidate-container {
  // 入党志愿书&结业证书
  .autobiography-certificate-box {
    display: flex;
    // 入党志愿书
    .volunteer-letter-box {
      flex: 5;
    }
    // 结业证书
    .certificate-box {
      flex: 3;
      margin-right: 20px;
    }
  }
}
</style>
