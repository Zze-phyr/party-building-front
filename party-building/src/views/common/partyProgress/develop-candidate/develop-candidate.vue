<template>
  <div class="develop-candidate-container">
    <!-- 入党流程标题 -->
    <BigTitle>发展对象的确定和考察</BigTitle>
    <!-- 入党志愿书&结业证书 -->
    <div class="autobiography-certificate-box">
      <!-- 入党志愿书（一） -->
      <div class="volunteer-letter-box">
        <HandBook
          :name="'入党志愿书（一）'"
          :is-pic-show="true"
          :file-types="['VolunteerLetterTemplateDev', 'VolunteerLetterDev']"
          :file-template-metadata="volunteerFileTemplateDevMetadata"
          :file-metadata="volunteerFileDevMetadata"
        ></HandBook>
      </div>
      <!-- 结业证书 -->
      <div class="certificate-box">
        <div class="title">发展对象结业证书</div>
        <div class="content">
          <div class="img-box">
            <img class="img" src="../../../../assets/images/partyProgress/certificate.png" alt="" />
          </div>
          <div class="time-box">结业时间：2025-02-01</div>
        </div>
      </div>
    </div>
    <!-- 手册二 -->
    <HandBook
      :name="'手册二（一）'"
      :file-types="['HandbookSecondTemplateDev', 'HandbookSecondDev']"
      :file-template-metadata="handbookSecondFileTemplateDevMetadata"
      :file-metadata="handbookSecondFileDevMetadata"
    ></HandBook>
  </div>
</template>

<script setup>
import BigTitle from '../components/BigTitle.vue'
import HandBook from '../components/HandBook.vue'
import { useUserStore } from '@/stores'
import { reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getFileMetadata } from '@/utils/file/getFileMetadata'

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
    ])
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
      margin-right: 20px;
      .content {
        padding: 30px;
        .load-box {
          display: flex;
          height: 60px;
          align-items: center;
          .img-box {
            .img {
              width: 35px;
              height: 35px;
            }
          }
          .load {
            margin-left: 30px;
            font-size: 14px;
          }
          .load:hover {
            color: #bc0000a8;
          }
        }
      }
    }
    // 结业证书
    .certificate-box {
      flex: 3;
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
  }
  // 入党志愿书
  .party-application-box {
    .content {
      padding: 20px 30px;
      .load-box {
        display: flex;
        height: 60px;
        align-items: center;
        .img-box {
          .img {
            width: 35px;
            height: 35px;
          }
        }
        .load {
          margin-left: 30px;
          font-size: 14px;
        }
        .load:hover {
          color: #bc0000a8;
        }
      }
    }
  }
}
</style>
