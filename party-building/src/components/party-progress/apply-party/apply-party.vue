<template>
  <div class="apply-party-box">
    <!-- 入党申请书上传 -->
    <div class="party-application-box content-box">
      <!-- 标题 -->
      <div class="title">入党申请书上传</div>
      <div class="upload-box">
        <!-- 文件上传 -->
        <el-upload
          class="upload"
          drag
          action="#"
          :http-request="uploadFile"
          :limit="1"
          :on-exceed="uploadExceed"
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
          />
        </div>
        <!-- 确认提交 -->
        <div class="btn-box">
          <el-button @click="onSubmit()">确认提交 </el-button>
        </div>
      </div>
    </div>
    <!-- 谈话佐证材料记录 -->
    <div class="talk-materials-box content-box">
      <div class="title">谈话佐证材料记录</div>
      <div class="text">等待文件上传</div>
    </div>
  </div>
</template>

<script setup>
import { UploadFilled } from '@element-plus/icons-vue'
import { reactive } from 'vue'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import { fileUpload } from '@/api/user'

const userStore = useUserStore()

const form = reactive({
  attachTime: '',
  file: '',
})

// 禁用今天之后的日期
const disabledDate = (time) => {
  return time.getTime() > Date.now()
}

const uploadFile = (params) => {
  form.file = params.file
}

const uploadExceed = () => {
  console.log('触发超出限制事件')
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

const onSubmit = async () => {
  if (form.attachTime === '') {
    ElMessage.error('请填写申请入党日期')
    return
  }
  if (form.file === '') {
    ElMessage.error('请上传文件')
    return
  }
  let formdata = new FormData()
  formdata.append('fileType', 'JOIN_PARTY_APPLICATION')
  formdata.append('creatorId', userStore.userId)
  formdata.append('userId', userStore.userId)
  formdata.append('attachTime', form.attachTime)
  formdata.append('file', form.file)
  try {
    const { data } = await fileUpload(formdata)
    if (data.code === 1) {
      ElMessage.success('文件上传成功成功！')
    } else {
      ElMessage.error(data.msg)
    }
  } catch {
    ElMessage.error('文件上传失败，请重试')
  }
}
</script>

<style lang="less" scoped>
.apply-party-box {
  .content-box {
    width: 100%;
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    .title {
      padding-left: 20px;
      height: 40px;
      font-size: 18px;
      line-height: 40px;
      // background-color: #f5f5f5;
      background-color: #fbfbfb;
    }
  }
  // 入党申请书上传
  .party-application-box {
    margin-bottom: 20px;
    .upload-box {
      // height: 270px;
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
        :deep(.el-upload) {
          --el-upload-dragger-padding-horizontal: 30px;
        }
        :deep(.el-upload:hover) {
          color: #d9001b;
          .el-upload-dragger {
            border-color: #d9001b;
            .upload-icon {
              color: #d9001b;
            }
            .upload-text {
              color: #d9001b;
            }
          }
        }
        :deep(.el-upload:focus) {
          .el-upload-dragger {
            border-color: #d9001b;
          }
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
        :deep(.el-date-editor.el-input) {
          height: 25px;
          width: 255px;
        }
        :deep(.el-input__wrapper) {
          font-size: 14px;
          .is-focus {
            box-shadow: 0 0 0 1px #bc0000 inset;
          }
        }
        :deep(.el-input__wrapper.is-focus) {
          box-shadow: 0 0 0 1px #bc000062 inset;
        }
      }
      //确认提交
      .btn-box {
        margin-bottom: 12px;
        text-align: center;
        :deep(.el-button) {
          background-color: #bc0000;
          color: #fff;
          &:active {
            background-color: #bc0000a8;
          }
          &:hover {
            background-color: #bc0000a8;
          }
        }
      }
    }
  }
  // 谈话佐证材料记录
  .talk-materials-box {
    .text {
      height: 270px;
      line-height: 270px;
      text-align: center;
      color: #d9001b;
      font-size: 30px;
    }
  }
}
</style>
