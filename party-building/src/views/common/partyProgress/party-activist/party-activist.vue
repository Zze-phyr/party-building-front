<template>
  <div class="party-active-container">
    <!-- 入党流程标题 -->
    <BigTitle>入党积极分子的确定和培养教育</BigTitle>
    <!-- 入党积极分子培养联系人 -->
    <cultivateContacts />
    <!-- 思想汇报 -->
    <thinkingReport />
    <!-- 结业证书&手册一 -->
    <div class="certificate-manual-box">
      <!-- 结业证书 -->
      <div class="certificate-box">
        <CompletionCertificate
          file-type="ActivitiesCertificateCompletion"
          name="入党积极分子结业证书"
        />
      </div>
      <!-- 手册一 -->
      <div class="manual-box">
        <HandBook
          :file-template-metadata="fileTemplateMetadata"
          :file-metadata="fileMetadata"
        ></HandBook>
      </div>
    </div>
  </div>
</template>

<script setup>
import BigTitle from '../components/BigTitle.vue'
import cultivateContacts from './cultivate-contacts/cultivate-contacts.vue'
import thinkingReport from './thinking-report/thinking-report.vue'
import HandBook from '../components/HandBook.vue'
import CompletionCertificate from '../components/completionCertificate.vue'
import { useUserStore } from '@/stores'
import { reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getFileMetadata } from '@/utils/file/getFileMetadata'

const userStore = useUserStore()

// 获取文件元数据请求参数
const fileTemplateMetadataRequestParams = reactive({
  userId: '-1',
  fileType: 'HandbookFirstTemplate',
})
const fileMetadataRequestParams = reactive({
  userId: userStore.userId,
  fileType: 'HandbookFirst',
})

// 文件元数据
const fileTemplateMetadata = reactive({
  fileId: null,
  status: 1,
  attachText: '',
  attachTime: '',
  fileName: '',
})
const fileMetadata = reactive({
  fileId: null,
  status: -1,
  attachText: '',
  attachTime: '',
  returnText: '手册一错误',
  fileName: '',
})

// 组件挂载后
onMounted(async () => {
  try {
    await getFileMetadata(fileTemplateMetadataRequestParams, fileTemplateMetadata)
    await getFileMetadata(fileMetadataRequestParams, fileMetadata)
  } catch (error) {
    console.log(error)
    ElMessage.error('数据获取失败')
  }
})
</script>

<style lang="scss" scoped>
.party-active-container {
  // 结业证书&手册一
  .certificate-manual-box {
    display: flex;
    // 结业证书
    .certificate-box {
      flex: 7;
      margin-right: 20px;
    }
    .manual-box {
      flex: 9;
    }
  }
}
</style>
