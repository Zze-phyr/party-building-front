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
              <span class="click-text">点击选择思想汇报PDF文件</span>
            </template>
            <el-button
              plain
              class="click-text"
              :loading="uploadLoading"
              @click="uploadFiles()"
              color="#d12626"
              >确认提交
            </el-button>
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
          <el-button @click="openDialog()" plain color="#d12626" class="click-text"
            >点击查看思想汇报</el-button
          >
          <el-dialog v-model="dialogTableVisible" title="历史思想汇报" align-center>
            <el-table :data="fileMetadataData" height="400">
              <el-table-column property="fileName" label="文件名" width="200" />
              <el-table-column align="center" property="status" label="审核状态">
                <template #default="scope">
                  <el-tag v-if="scope.row.status === 0" type="primary" round>审核中...</el-tag>
                  <el-tag v-else-if="scope.row.status === 1" type="success" round>审核成功</el-tag>
                  <el-tag v-else-if="scope.row.status === -1" type="danger" round>审核失败</el-tag>
                  <el-tag v-else-if="scope.row.status === -2" type="warning" round
                    >重新上传失败</el-tag
                  >
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template #default="scope">
                  <el-button
                    link
                    type="primary"
                    size="small"
                    @click="downloadFile(scope.row.fileId)"
                    v-if="scope.row.status !== -2"
                  >
                    下载
                  </el-button>
                  <el-upload
                    v-if="scope.row.status === 0 || scope.row.status === -1"
                    :auto-upload="false"
                    accept=".pdf"
                    :limit="1"
                    :on-exceed="singleUploadExceed"
                    :on-remove="() => singleFileRemove(scope.row.fileId)"
                    :on-change="(file) => singleUploadChange(file, scope.row.fileId)"
                  >
                    <template #trigger>
                      <el-button link type="info" size="small">点击选择文件</el-button>
                    </template>
                    <el-button
                      link
                      type="danger"
                      size="small"
                      :loading="uploadLoading"
                      @click="
                        updateSingleFile(updateFile[scope.row.fileId], scope.row, 'ThoughtReport')
                      "
                      >确认重新提交
                    </el-button>
                  </el-upload>

                  <span v-if="scope.row.status === -2" style="color: #e6a23c">
                    请移步到初始上传思想汇报入口重新上传文件
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                property="returnText"
                label="附加信息"
                width="200"
                show-overflow-tooltip
              />
            </el-table>
          </el-dialog>
        </el-col>
      </el-row>
    </ContentBox>
  </div>
</template>

<script setup>
import ContentBox from '../../components/ContentBox.vue'
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores'
import { updateSingleFile } from '@/utils/file/updateFile'
import { downloadFile } from '@/utils/file/downloadFile'
import { generalApi } from '@/api/general'

const userStore = useUserStore()

//文件列表
const fileList = ref([])

const uploadLoading = ref(false)

// 触发超出限制事件
const uploadExceed = () => {
  ElMessage.warning('一次最多上传3个文件')
}

// 文件验证逻辑保持不变
const fileValidate = (file) => {
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
  const isValid = fileValidate(file)
  if (!isValid) fileList.value = fileList.value.filter((f) => f.uid !== file.uid)
}

// 多文件上传
const uploadFiles = async () => {
  if (fileList.value.length <= 0) {
    ElMessage.error('请先选择您要上传的文件')
    return
  }
  uploadLoading.value = true

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
        const { data: uploadData } = await generalApi.uploadFile(formdata)
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
    uploadLoading.value = false
    fileList.value = []
  }
}

const dialogTableVisible = ref(false)

// 文件元数据
const fileMetadataData = ref([
  {
    fileId: 1,
    status: 0,
    attachText: '',
    attachTime: '',
    returnText: '',
    fileName: '审核中合气泡水产品研究_周桂珍',
  },
  {
    fileId: 2,
    status: 1,
    attachText: '',
    attachTime: '',
    returnText: '',
    fileName: '审核成功复合气泡水产品研究_周桂珍',
  },
  {
    fileId: 3,
    status: -1,
    attachText: '',
    attachTime: '',
    returnText: '文件×××处有×××××××××问题，请修改后重新上传',
    fileName: '审核失败气泡水产品研究',
  },
  {
    fileId: 4,
    status: -2,
    attachText: '',
    attachTime: '',
    returnText: '文件×××处有×××××××××问题，请修改后重新上传',
    fileName: '重新上传失败产品研',
  },
])

const openDialog = async () => {
  dialogTableVisible.value = true
  try {
    const { data } = await generalApi.getFileMetadata({
      userId: userStore.userId,
      fileType: 'ThoughtReport',
    })
    if (data.code === 1) {
      fileMetadataData.value = data.data
    } else {
      ElMessage.error(data.msg)
    }
  } catch (error) {
    console.log(error)
    ElMessage.error('数据获取失败')
  }
}

//重新上传单文件
const updateFile = reactive({})

const singleUploadExceed = () => {
  ElMessage.warning('最多上传1个文件')
}

const singleUploadChange = (file, fileId) => {
  const isValid = fileValidate(file)
  if (isValid) updateFile[fileId] = file
}

const singleFileRemove = (fileId) => {
  delete updateFile[fileId]
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
      .click-text {
        margin-left: 30px;
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
