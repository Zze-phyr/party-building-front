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
        <ContentBox>
          <template #title> 入党积极分子结业证书 </template>
          <div class="content">
            <div class="img-box">
              <img
                class="img"
                src="../../../../assets/images/partyProgress/certificate.png"
                alt=""
              />
            </div>
            <div class="time-box">结业时间：2025-02-01</div>
          </div>
        </ContentBox>
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
import ContentBox from '../components/ContentBox.vue'
import thinkingReport from './thinking-report/thinking-report.vue'
import HandBook from '../components/HandBook.vue'
import { useUserStore } from '@/stores'
import { reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getFileMetadata } from '@/api/general'

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
    const { data: fileTemplateGetData } = await getFileMetadata(fileTemplateMetadataRequestParams)
    if (fileTemplateGetData.code === 1) {
      if (fileTemplateGetData.data.length > 0) {
        Object.assign(fileTemplateMetadata, fileTemplateGetData.data[0])
      }
    } else {
      ElMessage.error(fileTemplateGetData.msg)
    }
    const { data: fileGetData } = await getFileMetadata(fileMetadataRequestParams)
    if (fileGetData.code === 1) {
      if (fileGetData.data.length > 0) {
        Object.assign(fileMetadata, fileGetData.data[0])
      }
    } else {
      ElMessage.error(fileGetData.msg)
    }
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
      .content {
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
          color: #333;
        }
      }
    }
    .manual-box {
      flex: 9;
    }
  }
}
</style>
