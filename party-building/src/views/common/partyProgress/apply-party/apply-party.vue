<template>
  <div class="apply-party-box">
    <!-- 入党流程标题 -->
    <BigTitle>申请入党</BigTitle>
    <!-- 入党申请书上传 -->
    <div class="party-application-box">
      <ContentBox>
        <!-- 标题 -->
        <template #title> 入党申请书上传 </template>
        <!-- 待提交、待审核、审核失败 -->
        <el-row v-if="fileMetadataParams.status !== 1" class="wait-submit">
          <el-col :span="fileMetadataParams.status === -1 ? 12 : 24">
            <div class="upload-box">
              <!-- 状态提示 -->
              <div v-if="fileMetadataParams.status === 0" class="text">审核中...</div>
              <!-- 文件上传 -->
              <el-upload
                class="upload"
                v-model:file-list="fileList"
                drag
                action="#"
                :http-request="uploadFile"
                :limit="1"
                :on-exceed="uploadExceed"
                :on-remove="fileRemove"
                accept=".pdf"
                :before-upload="beforeUpload"
              >
                <el-icon class="upload-icon"><upload-filled /></el-icon>
                <div class="upload-text">拖拽PDF文件到这里或 <em>点击选择文件</em></div>
              </el-upload>
              <!-- 时间选择 -->
              <div class="date-picker-box">
                <div class="label">申请入党时间</div>
                <el-date-picker
                  v-model="form.attachTime"
                  type="date"
                  placeholder="请确认与入党申请书填写时间一致"
                  :disabled-date="disabledDate"
                  value-format="YYYY-MM-DD"
                />
              </div>
              <!-- 确认提交 -->
              <div class="btn-box">
                <el-button color="#d12626" :loading="loading" @click="onSubmit()">{{
                  fileMetadataParams.status === -2 ? '确认提交' : '确认重新提交'
                }}</el-button>
              </div>
            </div>
          </el-col>
          <el-col v-if="fileMetadataParams.status === -1" :span="12">
            <div class="not-pass-box">
              <div class="text">
                你的申请书被<span class="red">驳回</span>，请按照要求修改，并重新上传！
              </div>
              <div class="text">修改意见：</div>
              <el-scrollbar class="tips-box" height="100px">
                <p>
                  {{ fileMetadataParams.returnText }}
                </p>
              </el-scrollbar>
            </div>
          </el-col>
        </el-row>
        <!-- 审核成功 -->
        <div v-if="fileMetadataParams.status === 1" class="success-check-box">
          <div class="img-box">
            <img
              class="img"
              src="../../../../assets/images/partyProgress/success-check.png"
              alt=""
            />
          </div>
          <div class="text">恭喜你，你的入党申请书已通过！</div>
          <div class="btn-box">
            <el-button :loading="loading" @click="handleDownloadClick()">下载入党申请书</el-button>
          </div>
        </div>
      </ContentBox>
    </div>
  </div>
</template>

<script setup>
import { UploadFilled } from '@element-plus/icons-vue'
import { reactive, ref, onMounted } from 'vue'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import { fileUpload, getFileMetadata, fileDelete } from '@/api/general'
import BigTitle from '../components/BigTitle.vue'
import ContentBox from '../components/ContentBox.vue'
import { handleDownload } from '@/utils/downloadFile'

const userStore = useUserStore()

// 获取文件元数据请求参数
const fileMetadataRequestParams = reactive({
  userId: '',
  fileType: '',
})

// 文件元数据
const fileMetadataParams = reactive({
  fileId: null,
  status: -2,
  attachText: '',
  attachTime: '',
  returnText: '',
  fileName: '',
})

// 页面表单数据
const form = reactive({
  attachTime: '',
  file: '',
})

// 组件挂载后
onMounted(async () => {
  try {
    fileMetadataRequestParams.userId = userStore.userId
    fileMetadataRequestParams.fileType = 'JoinPartyApplication'
    const { data } = await getFileMetadata(fileMetadataRequestParams)
    if (data.code === 1) {
      if (data.data.length > 0) {
        Object.assign(fileMetadataParams, data.data[0])
        form.attachTime = data.data[0].attachTime
      }
    } else {
      ElMessage.error(data.msg)
    }
  } catch (error) {
    console.log(error)
    ElMessage.error('数据获取失败')
  }
})

//文件上传，删除

const fileList = ref([])

const loading = ref(false)

// 禁用今天之后的日期
const disabledDate = (time) => {
  return time.getTime() > Date.now()
}

const uploadFile = (params) => {
  form.file = params.file
}

// 触发超出限制事件
const uploadExceed = () => {
  ElMessage.error('最多上传1个文件')
}

// 文件验证逻辑保持不变
const beforeUpload = (file) => {
  const isPDF = file.type === 'application/pdf'
  const isLt10M = file.size / 1024 / 1024 < 10

  if (!isPDF) {
    ElMessage.error('只能上传PDF格式文件!')
    return false
  }
  if (!isLt10M) {
    ElMessage.error('文件大小不能超过10MB!')
    return false
  }
  return true
}

//文件变化
const fileRemove = () => {
  form.file = ''
}

const onSubmit = async () => {
  if (!form.attachTime) {
    ElMessage.error('请填写申请入党日期')
    return
  }
  if (!form.file) {
    ElMessage.error('请上传文件')
    return
  }
  loading.value = true
  let formdata = new FormData()
  formdata.append('fileType', 'JoinPartyApplication')
  formdata.append('creatorId', userStore.userId)
  formdata.append('userId', userStore.userId)
  formdata.append('attachTime', form.attachTime)
  formdata.append('file', form.file)
  try {
    //重新上传先删除
    const shouldDelete = fileMetadataParams.status !== -2 && fileMetadataParams.status !== 1
    if (shouldDelete) {
      const { data: deletData } = await fileDelete(fileMetadataParams.fileId)
      if (deletData.code === 0) {
        ElMessage.error('文件删除失败')
        return
      }
    }
    // 上传请求
    const { data: uploadData } = await fileUpload(formdata)
    if (uploadData.code === 1) {
      fileMetadataParams.fileId = uploadData.data.fileId
      if (fileMetadataParams.status !== 0) fileMetadataParams.status = 0
      ElMessage.success('文件上传成功！')
    } else {
      ElMessage.error(uploadData.msg)
    }
  } catch (err) {
    console.log(err)
    ElMessage.error('文件上传失败，请重试')
  } finally {
    loading.value = false
  }
}

const handleDownloadClick = async () => {
  try {
    loading.value = true
    await handleDownload(fileMetadataParams.fileId)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.apply-party-box {
  // 入党申请书上传
  .party-application-box {
    //确认提交
    .btn-box {
      margin-bottom: 12px;
      text-align: center;
    }
    // 待提交、待审核、审核失败
    .wait-submit {
      .upload-box {
        // height: 270px;
        // 状态提示
        .text {
          height: 100px;
          line-height: 100px;
          text-align: center;
          color: #d9001b;
          font-size: 30px;
        }
        //文件上传
        .upload {
          .upload-icon {
            font-size: 80px;
            color: #999;
          }
          .upload-text {
            color: #999;
            font-size: 16px;
          }
        }
        //时间选择
        .date-picker-box {
          margin: 10px;
          display: flex;
          height: 25px;
          justify-content: center;
          align-items: center;
          .label {
            color: #333;
            padding-right: 5px;
            font-size: 14px;
          }
        }
      }
      .not-pass-box {
        padding: 20px;
        .text {
          display: flex;
          margin-bottom: 20px;
          font-size: 16px;
          line-height: 25px;
          &::before {
            display: block;
            margin-right: 10px;
            content: '';
            width: 3px;
            height: 25px;
            background-color: #bc0000c0;
          }
          .red {
            color: #bc0000;
          }
        }
        &:last-child .text {
          margin-bottom: 10px;
        }
        .tips-box {
          padding: 5px 10px;
          border: 1px solid #ddd;
          border-radius: 3px;
          p {
            margin: 0;
            font-size: 14px;
          }
        }
      }
    }
    // 审核成功
    .success-check-box {
      margin: 20px 0;
      text-align: center;
      .img-box {
        .img {
          width: 150px;
          height: 150px;
        }
      }
      .text {
        margin: 20px 0;
        font-size: 14px;
        color: #bc0000;
      }
    }
  }
}
</style>
