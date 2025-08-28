<!-- 手册组件 -->
<template>
  <ContentBox :confirm="fileMetadata.status" :proposed-changes="fileMetadata.returnText">
    <template #title> 手册一 </template>
    <div class="manual-content">
      <!-- 模板 -->
      <div class="content manual-download-box">
        <el-button link disabled class="download-title">手册一模板</el-button>
        <el-button
          link
          :disabled="fileTemplateMetadata.status !== 1"
          class="download"
          :class="{ 'download-btn': fileTemplateMetadata.status === 1 }"
          @click="downloadFile(fileTemplateMetadata.fileId)"
        >
          {{ fileTemplateMetadata.status === 1 ? '点击下载模板到本地' : '等待管理员上传中' }}
        </el-button>
      </div>
      <!-- 手册 -->
      <div class="content manual-upload-box">
        <el-upload
          v-model:file-list="fileList"
          accept=".pdf"
          :auto-upload="false"
          :limit="1"
          :on-exceed="uploadExceed"
          :on-remove="fileRemove"
          :on-change="uploadChange"
        >
          <template #trigger>
            <el-button link type="info" v-if="fileMetadata.status !== 1">点击选择文件</el-button>
          </template>
          <!-- 首次上传 -->
          <el-button
            link
            class="upload btn"
            :loading="uploadLoading"
            @click="handleUploadFile()"
            v-if="fileMetadata.status === -2"
          >
            确认提交
          </el-button>
          <!-- 重新上传 -->
          <el-button
            link
            class="upload btn"
            :loading="uploadLoading"
            @click="handleUpdateFile()"
            v-else-if="fileMetadata.status === -1 || fileMetadata.status === 0"
          >
            确认重新提交
          </el-button>
          <el-button
            link
            type="info"
            class="upload btn"
            @click="downloadFile(fileMetadata.fileId)"
            v-if="fileMetadata.status !== -2"
          >
            下载文件
          </el-button>
        </el-upload>
      </div>
    </div>
  </ContentBox>
</template>

<script setup>
import ContentBox from './ContentBox.vue'
import { useUserStore } from '@/stores'
import { reactive, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getFileMetadata } from '@/api/general'
import { downloadFile } from '@/utils/file/downloadFile'
import { updateSingleFiles } from '@/utils/file/updateFile'
import { uploadSingleFiles } from '@/utils/file/uploadFile'

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
  status: -2,
  attachText: '',
  attachTime: '',
  fileName: '',
})
const fileMetadata = reactive({
  fileId: null,
  status: -2,
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

// 上传文件
const selectFile = ref(null)
const fileList = ref([])

// 文件验证逻辑保持不变
const fileValidate = (file) => {
  const isPDF = file.raw.type === 'application/pdf'
  const isLt10M = file.raw.size / 1024 / 1024 < 10

  if (!isPDF) {
    ElMessage.warning('只能上传PDF格式文件!')
    fileList.value = []
    return false
  }
  if (!isLt10M) {
    ElMessage.warning('文件大小不能超过10MB!')
    fileList.value = []
    return false
  }
  return true
}

// 触发超出限制事件
const uploadExceed = () => {
  ElMessage.warning('最多上传1个文件')
}
//文件变化
const fileRemove = () => {
  selectFile.value = null
}
const uploadChange = (file) => {
  const isValid = fileValidate(file)
  if (isValid) selectFile.value = file
}

const uploadLoading = ref(false)

// 单文件重新上传
const handleUpdateFile = async () => {
  try {
    uploadLoading.value = true
    await updateSingleFiles(selectFile.value, fileMetadata, 'HandbookFirst')
  } finally {
    uploadLoading.value = false
  }
}

// 单文件上传
const handleUploadFile = async () => {
  try {
    uploadLoading.value = true
    await uploadSingleFiles(selectFile.value, fileMetadata, 'HandbookFirst')
  } finally {
    uploadLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
// 手册一
.manual-content {
  padding: 30px 30px 20px;
  .content {
    display: flex;
    &::before {
      display: block;
      margin-right: 10px;
      content: '';
      width: 3px;
      height: 18px;
      background-color: #bc0000c0;
    }
  }
  .manual-download-box {
    margin-bottom: 15px;
    .download-title {
      color: #333;
    }
    .download {
      margin-left: 5px;
      color: #999;
    }
    .download-btn:hover {
      color: #bc0000c0;
    }
  }
  .manual-upload-box {
    .upload:hover {
      color: #bc0000c0;
    }
    .btn {
      margin-left: 5px;
    }
  }
}
</style>
