<!-- 手册组件 -->
<template>
  <ContentBox :confirm="fileMetadata.status" :proposed-changes="fileMetadata.returnText">
    <template #title> {{ name }} </template>
    <div class="manual-content">
      <!-- 模板 -->
      <div class="content manual-download-box" :class="{ line: !isPicShow }">
        <div class="img-box" v-if="isPicShow">
          <img class="img" src="../../../../assets/images/partyProgress/word-pic.png" alt="" />
        </div>
        <el-button link disabled class="download-title">{{ name }}模板</el-button>
        <el-button
          :loading="loadings.templateDownload"
          link
          :disabled="fileTemplateMetadata.status !== 1"
          class="download"
          :class="{ 'download-btn': fileTemplateMetadata.status === 1 }"
          @click="handleDownloadFile(fileTemplateMetadata.fileId, 'templateDownload')"
        >
          {{ fileTemplateMetadata.status === 1 ? '点击下载模板到本地' : '等待管理员上传中' }}
        </el-button>
      </div>
      <!-- 手册 -->
      <div class="content manual-upload-box" :class="{ line: !isPicShow }">
        <div class="img-box" v-if="isPicShow">
          <img class="img" src="../../../../assets/images/partyProgress/pdf.png" alt="" />
        </div>
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
            :loading="loadings.upload"
            @click="handleUploadFile()"
            v-if="fileMetadata.status === -2"
          >
            确认提交
          </el-button>
          <!-- 重新上传 -->
          <el-button
            link
            class="upload btn"
            :loading="loadings.update"
            @click="handleUpdateFile()"
            v-else-if="fileMetadata.status === -1 || fileMetadata.status === 0"
          >
            确认重新提交
          </el-button>
          <el-button
            link
            type="info"
            class="upload btn"
            :loading="loadings.download"
            @click="handleDownloadFile(fileMetadata.fileId, 'download')"
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
import { ref, defineProps, onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { downloadFile } from '@/utils/file/downloadFile'
import { getFileMetadata } from '@/utils/file/getFileMetadata'
import { updateSingleFile } from '@/utils/file/updateFile'
import { uploadSingleFiles } from '@/utils/file/uploadFile'
import { useUserStore } from '@/stores'

const userStore = useUserStore()

const props = defineProps({
  name: {
    type: String,
  },
  fileTypes: {
    type: Array,
  },
  isPicShow: {
    type: Boolean,
    default: false,
  },
})

// 获取文件元数据请求参数
const fileTemplateMetadataRequestParams = {
  userId: '-1',
  fileType: props.fileTypes[0],
}
const fileMetadataRequestParams = {
  userId: userStore.userId,
  fileType: props.fileTypes[1],
}

// 模板文件源数据
const fileTemplateMetadata = ref({
  fileId: null,
  status: -2,
  attachText: '',
  attachTime: '',
  fileName: '',
})

// 提交文件源数据
const fileMetadata = ref({
  fileId: null,
  status: -2,
  attachText: '',
  attachTime: '',
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

const loadings = reactive({
  upload: false,
  update: false,
  templateDownload: false,
  download: false,
})

// 单文件上传
const handleUploadFile = async () => {
  try {
    loadings.upload = true
    await uploadSingleFiles(selectFile.value, fileMetadata, props.fileTypes[1])
  } finally {
    loadings.upload = false
  }
}
// 单文件重新上传
const handleUpdateFile = async () => {
  try {
    loadings.update = true
    await updateSingleFile(selectFile.value, fileMetadata, props.fileTypes[1])
  } finally {
    loadings.update = false
  }
}
// 文件删除
const handleDownloadFile = async (fileId, loadingName) => {
  try {
    loadings[loadingName] = true
    await downloadFile(fileId)
  } finally {
    loadings[loadingName] = false
  }
}
</script>

<style lang="scss" scoped>
// 手册一
.manual-content {
  padding: 30px 30px 20px;
  .content {
    display: flex;
    .img-box {
      margin-right: 10px;
      .img {
        width: 25px;
        height: 25px;
      }
    }
  }
  .line::before {
    display: block;
    margin-right: 10px;
    content: '';
    width: 3px;
    height: 18px;
    background-color: #bc0000c0;
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
