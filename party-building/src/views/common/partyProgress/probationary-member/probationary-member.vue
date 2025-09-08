<template>
  <div class="probation-member-box">
    <!-- 入党流程标题 -->
    <BigTitle>预备党员的接收、教育考察和转正</BigTitle>
    <!-- 吸收大会会议记录 -->
    <div class="absorb-general-assembly-record-box content-box">
      <div class="title">吸收大会会议记录</div>
      <!-- 内容 -->
      <div class="absorb-content">
        <div class="record-content">
          <div class="record-item">
            <span class="record-item-title">当事人</span>
            <span class="record-item-content">张三</span>
          </div>
          <div class="record-item">
            <span class="record-item-title">时间</span>
            <span class="record-item-content">2025-3-8</span>
          </div>
          <div class="record-item">
            <span class="record-item-title">主持人</span>
            <span class="record-item-content">李四</span>
          </div>
          <div class="record-item">
            <span class="record-item-title">会议地点</span>
            <span class="record-item-content">一教101</span>
          </div>
          <div class="record-item">
            <span class="record-item-title">参加人员</span>
            <span class="record-item-content">王五、李六、赵三...</span>
          </div>
          <div class="download-box">
            <div class="img-box">
              <img class="img" src="../../../../assets/images/icons/photo.png" alt="" />
            </div>
            <div class="download">点击下载查看吸收大会佐证材料</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 入党志愿书（二） -->
    <HandBook
      :name="'入党志愿书（二）'"
      :is-pic-show="true"
      :file-types="['VolunteerLetterTemplateFull', 'VolunteerLetterFull']"
      :file-template-metadata="volunteerFileTemplateFullMetadata"
      :file-metadata="volunteerFileFullMetadata"
    ></HandBook>
    <!-- 手册二（二） -->
    <HandBook
      :name="'手册二（二）'"
      :file-types="['HandbookSecondTemplateFull', 'HandbookSecondFull']"
      :file-template-metadata="handbookSecondFileTemplateFullMetadata"
      :file-metadata="handbookSecondFileFullMetadata"
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
const volunteerFileTemplateFullMetadataRequestParams = reactive({
  userId: '-1',
  fileType: 'VolunteerLetterTemplateFull',
})
// 志愿书请求参数
const volunteerFullFileMetadataRequestParams = reactive({
  userId: userStore.userId,
  fileType: 'VolunteerLetterFull',
})
// 手册二模板请求参数
const handbookSecondFileTemplateFullMetadataRequestParams = reactive({
  userId: '-1',
  fileType: 'HandbookSecondTemplateFull',
})
// 手册二请求参数
const handbookSecondFullFileMetadataRequestParams = reactive({
  userId: userStore.userId,
  fileType: 'HandbookSecondFull',
})

// 文件元数据
const volunteerFileTemplateFullMetadata = reactive({
  fileId: null,
  status: -2,
  attachText: '',
  attachTime: '',
  fileName: '',
})
const volunteerFileFullMetadata = reactive({
  fileId: null,
  status: -2,
  attachText: '',
  attachTime: '',
  returnText: '错误',
  fileName: '',
})

const handbookSecondFileTemplateFullMetadata = reactive({
  fileId: null,
  status: -2,
  attachText: '',
  attachTime: '',
  fileName: '',
})
const handbookSecondFileFullMetadata = reactive({
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
        volunteerFileTemplateFullMetadataRequestParams,
        volunteerFileTemplateFullMetadata,
      ),
      getFileMetadata(volunteerFullFileMetadataRequestParams, volunteerFileFullMetadata),
      getFileMetadata(
        handbookSecondFileTemplateFullMetadataRequestParams,
        handbookSecondFileTemplateFullMetadata,
      ),
      getFileMetadata(handbookSecondFullFileMetadataRequestParams, handbookSecondFileFullMetadata),
    ])
  } catch (error) {
    console.log(error)
    ElMessage.error('数据获取失败')
  }
})
</script>

<style lang="scss" scoped>
.probation-member-box {
  // 记录
  .record-content {
    padding: 20px 30px;
    .record-item {
      display: flex;
      font-size: 14px;
      margin-bottom: 15px;
      .record-item-title {
        flex: 1;
        font-size: 15px;
      }
      .record-item-content {
        flex: 9;
        color: #222;
      }
      &::before {
        display: block;
        margin-right: 10px;
        content: '';
        width: 3px;
        height: 25px;
        background-color: #bc0000c0;
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
    //右下角下载
    .download-box {
      display: flex;
      justify-content: flex-end;
      .img-box {
        .img {
          width: 22px;
          height: 22px;
        }
      }
      .download {
        margin-left: 5px;
        font-size: 14px;
        color: #333;
      }
    }
  }
}
</style>
