<template>
  <div class="develop-candidate-container">
    <!-- 入党流程标题 -->
    <BigTitle>发展对象的确定和考察</BigTitle>
    <!-- 确定发展对象会议记录 -->
    <meetingRecord :name="'确定发展对象会议记录'" :file-metadata="DevConfirmationMetadata" />
    <!-- 手册二 -->
    <HandBook
      :name="'手册二（一）'"
      :file-types="['HandbookSecondTemplateDev', 'HandbookSecondDev']"
      :file-template-metadata="handbookSecondFileTemplateDevMetadata"
      :file-metadata="handbookSecondFileDevMetadata"
    />
    <!-- 入党志愿书&结业证书 -->
    <div class="autobiography-certificate-box">
      <!-- 结业证书 -->
      <div class="certificate-box">
        <completionCertificate
          name="发展对象结业证书"
          :status="DevCertificateMetadata.status"
          :date="DevCertificateMetadata.attachTime"
          :img-url="certificateImgUrl"
        />
      </div>
      <!-- 入党志愿书（一） -->
      <div class="volunteer-letter-box">
        <HandBook
          :name="'入党志愿书（一）'"
          :is-pic-show="true"
          :file-types="['VolunteerLetterTemplateDev', 'VolunteerLetterDev']"
          :file-template-metadata="volunteerFileTemplateDevMetadata"
          :file-metadata="volunteerFileDevMetadata"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import BigTitle from '../components/BigTitle.vue'
import HandBook from '../components/HandBook.vue'
import completionCertificate from '../components/completionCertificate.vue'
import meetingRecord from '../components/meetingRecord.vue'
import { useUserStore } from '@/stores'
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getFileMetadata } from '@/utils/file/getFileMetadata'
import { generalApi } from '@/api/general'

const userStore = useUserStore()

// 获取文件元数据请求参数
// 志愿书模板请求参数
const volunteerFileTemplateDevMetadataRequestParams = reactive({
  userId: '-1',
  fileType: 'VolunteerLetterTemplateDev',
})
// 志愿书请求参数
const volunteerDevFileMetadataRequestParams = reactive({
  userId: userStore.userId,
  fileType: 'VolunteerLetterDev',
})
// 手册二模板请求参数
const handbookSecondFileTemplateDevMetadataRequestParams = reactive({
  userId: '-1',
  fileType: 'HandbookSecondTemplateDev',
})
// 手册二请求参数
const handbookSecondDevFileMetadataRequestParams = reactive({
  userId: userStore.userId,
  fileType: 'HandbookSecondDev',
})
// 发展对象结业证书请求参数
const DevCertificateMetadataRequestParams = reactive({
  userId: '-1',
  fileType: 'DevelopmentCertificateCompletion',
})
// 确定发展对象请求参数
const DevConfirmationMetadataRequestParams = reactive({
  userId: '-1',
  fileType: 'DevelopmentConfirmationMinutes',
})

// 文件元数据
const volunteerFileTemplateDevMetadata = reactive({
  fileId: null,
  status: -2,
  attachText: '',
  attachTime: '',
  fileName: '',
})
const volunteerFileDevMetadata = reactive({
  fileId: null,
  status: -2,
  attachText: '',
  attachTime: '',
  returnText: '错误',
  fileName: '',
})

const handbookSecondFileTemplateDevMetadata = reactive({
  fileId: null,
  status: -2,
  attachText: '',
  attachTime: '',
  fileName: '',
})
const handbookSecondFileDevMetadata = reactive({
  fileId: null,
  status: -2,
  attachText: '',
  attachTime: '',
  returnText: '错误',
  fileName: '',
})

const DevCertificateMetadata = reactive({
  fileId: null,
  status: -2,
  attachText: '',
  attachTime: '',
  returnText: '错误',
  fileName: '',
})

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
    await Promise.all([
      getFileMetadata(
        volunteerFileTemplateDevMetadataRequestParams,
        volunteerFileTemplateDevMetadata,
      ),
      getFileMetadata(volunteerDevFileMetadataRequestParams, volunteerFileDevMetadata),
      getFileMetadata(
        handbookSecondFileTemplateDevMetadataRequestParams,
        handbookSecondFileTemplateDevMetadata,
      ),
      getFileMetadata(handbookSecondDevFileMetadataRequestParams, handbookSecondFileDevMetadata),
      getFileMetadata(DevCertificateMetadataRequestParams, DevCertificateMetadata),
      getFileMetadata(DevConfirmationMetadataRequestParams, DevConfirmationMetadata),
    ])
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

if (DevCertificateMetadata.fileId) {
  generateImgUrl(DevCertificateMetadata.fileId)
}

onUnmounted(() => {
  if (certificateImgUrl.value) URL.revokeObjectURL(certificateImgUrl.value)
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
