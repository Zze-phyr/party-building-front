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
      name="入党志愿书（二）"
      :is-pic-show="true"
      :file-types="['VolunteerLetterTemplateFull', 'VolunteerLetterFull']"
    />
    <!-- 手册二（二） -->
    <HandBook
      name="手册二（二）"
      :file-types="['HandbookSecondTemplateFull', 'HandbookSecondFull']"
    />
  </div>
</template>

<script setup>
import BigTitle from '../components/BigTitle.vue'
import HandBook from '../components/HandBook.vue'
import meetingRecord from '../components/meetingRecord.vue'
import { reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getFileMetadata } from '@/utils/file/getFileMetadata'

// 获取文件元数据请求参数
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
