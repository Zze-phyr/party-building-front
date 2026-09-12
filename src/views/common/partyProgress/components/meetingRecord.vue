<template>
  <ContentBox>
    <template #title> {{ name }} </template>
    <div class="record-content">
      <div v-if="fileMetadata.status === -2" class="not-uploaded">等待上传中</div>
      <div v-else-if="fileMetadata.status === 1" class="uploaded">
        <div v-for="(item, index) in itemTitle" :key="index" class="record-item">
          <span class="record-item-title">{{ item }}</span>
          <span class="record-item-content">{{ itemContent[index] }}</span>
        </div>
        <div class="download-box">
          <div class="img-box">
            <img class="img" src="../../../../assets/images/icons/photo.png" alt="" />
          </div>
          <el-button
            link
            :loading="loading"
            class="download"
            @click="handleDownloadFile(fileMetadata.fileId)"
          >
            点击下载查看{{ name }}佐证材料
          </el-button>
        </div>
      </div>
    </div>
  </ContentBox>
</template>

<script setup>
import { ref, defineProps, onMounted } from 'vue'
import ContentBox from './ContentBox.vue'
import { downloadFile } from '@/utils/file/downloadFile'
import { ElMessage } from 'element-plus'
import { getFileMetadata } from '@/utils/file/getFileMetadata'

const props = defineProps({
  name: {
    type: String,
    default: '会议记录',
  },
  fileType: {
    type: String,
  },
})

// 获取文件元数据请求参数
const fileMetadataRequestParams = {
  userId: '-1',
  fileType: props.fileType,
}
// 文件元数据
const fileMetadata = ref({
  fileId: null,
  status: 1,
  attachText: '张三|2025-3-8|李四|一教101|王五、李六、赵三...',
  attachTime: '',
  fileName: '',
})

// 组件挂载后
onMounted(async () => {
  try {
    await getFileMetadata(fileMetadataRequestParams, fileMetadata)
  } catch (error) {
    console.log(error)
    ElMessage.error('数据获取失败')
  }
})

const itemContent = ref([])

if (fileMetadata.value.attachText) {
  itemContent.value = fileMetadata.value.attachText.split('|')
}

const itemTitle = ref(['当事人', '时间', '主持人', '会议地点', '参加人员'])

const loading = ref(false)
// 文件下载
const handleDownloadFile = async (fileId) => {
  try {
    loading.value = true
    await downloadFile(fileId)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.record-content {
  padding: 20px 30px;
  .not-uploaded {
    height: 200px;
    color: #bc0000;
    font-size: 30px;
    line-height: 200px;
    text-align: center;
  }
  .uploaded {
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
        color: #666;
        &:hover {
          color: #bc0000c0;
        }
      }
    }
  }
}
</style>
