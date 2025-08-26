<template>
  <div class="thinking-report-box">
    <ContentBox>
      <template #title> 每三月一次思想汇报 </template>
      <el-row class="report-content-box">
        <el-col class="upload-box content" :span="12">
          <div class="img-box">
            <img
              class="img"
              src="../../../../../assets/images/partyProgress/thought-report-1.png"
              alt=""
            />
          </div>
          <el-upload
            v-model:file-list="fileList"
            multiple
            accept=".pdf"
            :auto-upload="false"
            :limit="3"
            :on-exceed="uploadExceed"
            :on-remove="fileRemove"
            :on-change="uploadChange"
          >
            <template #trigger>
              <span class="text">点击选择思想汇报PDF文件</span>
            </template>
            <span class="text" :loading="loading" @click="uploadFiles()" color="#d12626"
              >确认提交
            </span>
          </el-upload>
        </el-col>
        <el-col class="download-box content" :span="12">
          <div class="img-box">
            <img
              class="img"
              src="../../../../../assets/images/partyProgress/thought-report-2.png"
              alt=""
            />
          </div>
          <div class="text">点击查看思想汇报</div>
        </el-col>
      </el-row>
    </ContentBox>
  </div>
</template>

<script setup>
import ContentBox from '../../components/ContentBox.vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { fileUpload } from '@/api/general'
import { useUserStore } from '@/stores'

const userStore = useUserStore()

//文件列表
const fileList = ref([])

const loading = ref(false)

// 触发超出限制事件
const uploadExceed = () => {
  ElMessage.error('一次最多上传3个文件')
}

// 文件验证逻辑保持不变
const fileValidate = (file) => {
  console.log('文件验证file', file)
  const isPDF = file.raw.type === 'application/pdf'
  const isLt10M = file.raw.size / 1024 / 1024 < 10

  if (!isPDF) {
    ElMessage.warning('只能上传PDF格式文件!')
    return false
  }
  if (!isLt10M) {
    ElMessage.warning('文件大小不能超过10MB!')
    return false
  }
  return true
}

//文件变化
const fileRemove = (file) => {
  fileList.value = fileList.value.filter((f) => f.uid !== file.uid)
}
const uploadChange = (file) => {
  const isValid = fileValidate(file, fileList)
  if (!isValid) fileList.value = fileList.value.filter((f) => f.uid !== file.uid)
}

// 文件上传
const uploadFiles = async () => {
  if (fileList.value.length <= 0) {
    ElMessage.error('请先选择您要上传的文件')
    return
  }
  loading.value = true

  try {
    // 存储所有上传成功的结果
    const successResults = []
    // 存储所有上传失败的结果
    const errorResults = []

    for (const file of fileList.value) {
      const formdata = new FormData()
      formdata.append('fileType', 'ThoughtReport')
      formdata.append('creatorId', userStore.userId)
      formdata.append('userId', userStore.userId)
      formdata.append('file', file.raw)
      try {
        // 上传请求
        const { data: uploadData } = await fileUpload(formdata)
        if (uploadData.code === 1) {
          successResults.push(file.name)
        } else {
          errorResults.push({ name: file.name, message: uploadData.msg })
        }
      } catch {
        errorResults.push({ name: file.name, message: '网络错误，上传失败' })
      }
    }
    // 显示上传结果
    if (successResults.length > 0) {
      ElMessage.success(`成功上传 ${successResults.length} 个文件: ${successResults.join('、')}`)
    }
    if (errorResults.length > 0) {
      errorResults.forEach((err) => {
        ElMessage.error(`文件 ${err.name} 上传失败: ${err.message}`)
      })
    }
  } finally {
    loading.value = false
    fileList.value = []
  }
}
</script>

<style lang="scss" scoped>
.thinking-report-box {
  .report-content-box {
    margin: 10px 0;
    .content {
      display: flex;
      justify-content: center;
      align-items: center;
      .img-box {
        .img {
          width: 55px;
          height: 55px;
        }
      }
      .text {
        margin-left: 30px;
        font-size: 14px;
      }
      .text:hover {
        color: #bc00009e;
      }
    }
    .upload-box {
      border-right: 1px #eee solid;
    }
    .download-box {
      border-left: 1px #eee solid;
    }
  }
}
</style>
