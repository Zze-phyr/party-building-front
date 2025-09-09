<template>
  <div class="probation-member-box">
    <!-- 入党流程标题 -->
    <BigTitle>预备党员的接收、教育考察和转正</BigTitle>
    <!-- 吸收大会会议记录 -->
    <meetingRecord :name="'吸收大会会议记录'" :file-metadata="absorptionMeetingMetadata" />
    <!-- 预备党员转正支部会议记录 -->
    <meetingRecord
      :name="'预备党员转正支部会议记录'"
      :file-metadata="FullMemberConversionMetadata"
    />
    <!-- 入党志愿书（二） -->
    <HandBook
      :name="'入党志愿书（二）'"
      :is-pic-show="true"
      :file-types="['VolunteerLetterTemplateFull', 'VolunteerLetterFull']"
      :file-template-metadata="volunteerFileTemplateFullMetadata"
      :file-metadata="volunteerFileFullMetadata"
    />
    <!-- 手册二（二） -->
    <HandBook
      :name="'手册二（二）'"
      :file-types="['HandbookSecondTemplateFull', 'HandbookSecondFull']"
      :file-template-metadata="handbookSecondFileTemplateFullMetadata"
      :file-metadata="handbookSecondFileFullMetadata"
    />
  </div>
</template>

<script setup>
import BigTitle from '../components/BigTitle.vue'
import HandBook from '../components/HandBook.vue'
import meetingRecord from '../components/meetingRecord.vue'
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
// 吸收大会请求参数
const absorptionMeetingMetadataRequestParams = reactive({
  userId: '-1',
  fileType: 'AbsorptionMeetingMinutes',
})
// 预备党员转正支部会议请求参数
const FullMemberConversionMetadataRequestParams = reactive({
  userId: '-1',
  fileType: 'FullMemberConversionMinutes',
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

const absorptionMeetingMetadata = reactive({
  fileId: null,
  status: -2,
  attachText: '张三|2025-3-8|李四|一教101|王五、李六、赵三...',
  attachTime: '',
  returnText: '错误',
  fileName: '',
})

const FullMemberConversionMetadata = reactive({
  fileId: null,
  status: 1,
  attachText: '张三|2025-3-8|李四|一教101|王五、李六、赵三...',
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
      getFileMetadata(absorptionMeetingMetadataRequestParams, absorptionMeetingMetadata),
      getFileMetadata(FullMemberConversionMetadataRequestParams, FullMemberConversionMetadata),
    ])
  } catch (error) {
    console.log(error)
    ElMessage.error('数据获取失败')
  }
})
</script>

<style lang="scss" scoped></style>
