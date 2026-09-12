<template>
  <ContentCard title="文件模板上传">
    <div class="upload-container">
      <!-- 上传表单区域 -->
      <div class="upload-form-section">
        <el-form
          ref="uploadFormRef"
          :model="uploadForm"
          :rules="uploadFormRules"
          label-width="100px"
          class="upload-form"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="材料类型" prop="fileType">
                <el-select
                  v-model="uploadForm.fileType"
                  placeholder="请选择材料类型"
                  style="width: 100%"
                  clearable
                >
                  <el-option
                    v-for="item in materialTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="批次" prop="attachTime">
                <el-select
                  v-model="uploadForm.attachTime"
                  placeholder="请选择批次"
                  style="width: 100%"
                  clearable
                >
                  <el-option
                    v-for="item in batchOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="选择文件" prop="file">
                <div class="file-upload-wrapper">
                  <el-upload
                    ref="uploadRef"
                    class="upload-demo"
                    :auto-upload="false"
                    :limit="1"
                    :on-change="handleFileChange"
                    :on-exceed="handleExceed"
                    :before-upload="beforeFileUpload"
                    :on-remove="handleFileRemove"
                    accept=".pdf"
                    :file-list="fileList"
                  >
                    <el-button size="default">
                      <el-icon class="el-icon--left">
                        <Upload />
                      </el-icon>
                      选择文件
                    </el-button>
                    <template #tip>
                      <div class="el-upload__tip">
                        仅支持 pdf 格式文件，文件大小不超过 10MB
                      </div>
                    </template>
                  </el-upload>
                  <el-button
                    type="primary"
                    :loading="uploadLoading"
                    :disabled="!currentFile"
                    @click="handleUploadClick"
                    class="upload-btn"
                  >
                    <el-icon v-if="!uploadLoading" class="el-icon--left">
                      <Upload />
                    </el-icon>
                    {{ uploadLoading ? '上传中...' : '上传文件' }}
                  </el-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>


      <!-- 历史记录列表区域 -->
      <div class="upload-history-section">
        <div class="table-container">
          <ProTable
            :data="tableData"
            :columns="columns"
            :loading="tableLoading"
            :pagination="paginationConfig"
            :showPagination="true"
            row-key="fileId"
            @refresh="handleRefresh"
          >
            <template #toolbar>
              <div class="section-title">上传模版文件历史记录</div>
            </template>
            <!-- 状态列插槽 -->
            <template #column-status="{ row }">
              <el-tag v-if="row.status === '成功'" type="success" size="small">
                成功
              </el-tag>
              <el-tag v-else type="danger" size="small">
                失败
              </el-tag>
            </template>

            <!-- 操作列插槽 -->
            <template #column-action="{ row }">
              <el-button link type="primary" size="small" @click="handleEdit(row)">
                修改
              </el-button>
            </template>
          </ProTable>
        </div>
      </div>
    </div>

  </ContentCard>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeMount } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'
import { uploadSingleFiles } from '@/utils/file/uploadFile.js'
import { adminApi } from '@/api/admin.js'

// ==================== 页面状态定义 ====================

// 上传表单引用
const uploadFormRef = ref(null)
const uploadRef = ref(null)

// 上传加载状态
const uploadLoading = ref(false)

// 表格加载状态
const tableLoading = ref(false)

// 文件列表
const fileList = ref([])

// 当前选中的文件对象
const currentFile = ref(null)

// ==================== 表单数据定义 ====================

// 上传表单数据
const uploadForm = reactive({
  fileType: '',      // 材料类型
  attachText: '',    // 阶段任务
  attachTime: '',    // 批次
  file: null         // 文件
})

// 表单验证规则
const uploadFormRules = {
  fileType: [
    { required: true, message: '请选择材料类型', trigger: 'change' }
  ],
  attachText: [
    { required: true, message: '请选择阶段任务', trigger: 'change' }
  ],
  attachTime: [
    { required: true, message: '请选择批次', trigger: 'change' }
  ],
  file: [
    { required: true, message: '请选择要上传的文件', trigger: 'change' }
  ]
}

// ==================== 下拉选项数据 ====================

// 材料类型选项
const materialTypeOptions = ref([])

// 阶段任务选项
const stageTaskOptions = ref([
  { label: '入党积极分子', value: '入党积极分子' },
  { label: '递交入党申请书', value: '递交入党申请书' },
  { label: '发展对象', value: '发展对象' },
  { label: '预备党员', value: '预备党员' }
])

// 批次选项
const batchOptions = ref([])

// ==================== 表格配置 ====================

// 表格数据
const tableData = ref([])

// 分页配置
const paginationConfig = reactive({
  currentPage: 1,
  currentPageSize: 10,
  total: 0,
  pageSize: 10,
  pageSizes: [10, 20, 50, 100],
  layout: 'total, sizes, prev, pager, next, jumper'
})

// 表格列配置
const columns = [
  {
    prop: 'fileName',
    label: '文件名',
    align: 'left',
    minWidth: 200,
    showOverflowTooltip: true
  },
  {
    prop: 'fileType',
    label: '材料类型',
    align: 'center',
    width: 120
  },
  {
    prop: 'attachText',
    label: '阶段任务',
    align: 'center',
    width: 150
  },
  {
    prop: 'attachTime',
    label: '批次',
    align: 'center',
    width: 120
  },
  {
    prop: 'uploadTime',
    label: '上传时间',
    align: 'center',
    width: 180
  },
  {
    prop: 'status',
    label: '状态',
    align: 'center',
    width: 80,
    slot: 'status'
  },
  {
    prop: 'action',
    label: '操作',
    align: 'center',
    width: 100,
    fixed: 'right',
    slot: 'action'
  }
]

// ==================== 文件上传相关方法 ====================

/**
 * 获取文件类型列表事件处理函数
 * 该函数用于从后端获取文件类型列表，并筛选出包含"模板"或"讲解视频"的类型，
 * 然后将这些类型转换为下拉选项格式存储到materialTypeOptions中
 * @returns {Promise<void>} 无返回值的Promise
 */
const getFileTypeListEvent = async () => {
  try {
    const response = await adminApi.getFileTypeList()
    if (response.data.code === 1) {
      // 筛选出包含"模板"或"讲解视频"的文件类型，并映射为下拉选项格式
      materialTypeOptions.value = response.data.data
        .filter(item => item.comment.includes('模板') || item.comment.includes('讲解视频'))
        .map(item => ({
          label: item.comment,
          value: item.type
        }))
    } else {
      ElMessage.error('获取文件类型列表失败')
    }
  } catch (error) {
    ElMessage.error('获取文件类型列表失败')
  }
}

const getBatchEvent = async () => {
  try {
    const response = await adminApi.getBatch({
      page: 1,
      pageSize: 20,
      statusEnum: 'ENABLE',
    })
    if (response.data.code === 1) {
      console.log(response.data.data)
      batchOptions.value = response.data.data.records.map(item => ({
        label: item.name || item.label,
        value: item.id
      }))
    } else {
      ElMessage.error('获取批次列表失败')
    }
  } catch (error) {
    ElMessage.error('获取批次列表失败')
  }
}

/**
 * 文件选择变化处理
 */
const handleFileChange = (file, uploadFiles) => {
  console.log('文件选择变化:', file)

  // 验证文件
  const isValid = beforeFileUpload(file.raw)
  if (!isValid) {
    // 移除无效文件
    uploadRef.value?.handleRemove(file)
    return
  }

  currentFile.value = file.raw
  uploadForm.file = file.raw
  fileList.value = uploadFiles

  // 手动触发表单验证，清除文件字段的错误提示
  uploadFormRef.value?.validateField('file')
}

/**
 * 文件移除处理
 */
const handleFileRemove = () => {
  currentFile.value = null
  uploadForm.file = null
  fileList.value = []
}

/**
 * 文件超出数量限制处理
 */
const handleExceed = () => {
  ElMessage.warning('最多只能上传1个文件')
}

/**
 * 上传前文件验证
 */
const beforeFileUpload = (file) => {
  const isPdf = file.name.toLowerCase().endsWith('.pdf')
  const isLt10M = file.size / 1024 / 1024 < 10

  if (!isPdf) {
    ElMessage.error('只能上传 .pdf 格式的文件!')
    return false
  }
  if (!isLt10M) {
    ElMessage.error('上传文件大小不能超过 10MB!')
    return false
  }
  return true
}

/**
 * 点击上传按钮
 */
const handleUploadClick = async () => {
  // 表单验证
  if (!uploadFormRef.value) {
    return
  }

  try {
    await uploadFormRef.value.validate()
  } catch (error) {
    console.log('表单验证失败:', error)
    ElMessage.warning('请完整填写表单信息')
    return
  }

  // 检查是否选择了文件
  if (!currentFile.value) {
    ElMessage.warning('请选择要上传的文件')
    return
  }

  // 开始上传
  uploadLoading.value = true

  try {
    // 构造 fileData 参数
    const fileData = {
      attachTime: uploadForm.attachTime,
      attachText: uploadForm.attachText,
      status: 0
    }

    console.log('开始上传文件:', {
      file: currentFile.value,
      fileData: fileData,
      fileType: uploadForm.fileType
    })

    // 调用上传函数
    await uploadSingleFiles(
      currentFile.value,
      fileData,
      uploadForm.fileType
    )

    // 上传成功后的处理
    ElMessage.success('文件上传成功')

    // 重置表单
    resetUploadForm()

    // 刷新历史记录列表
    await fetchUploadHistory()

  } catch (error) {
    console.error('上传失败:', error)
    ElMessage.error(error.message || '文件上传失败，请重试')
  } finally {
    uploadLoading.value = false
  }
}

/**
 * 重置上传表单
 */
const resetUploadForm = () => {
  // 重置表单字段
  uploadFormRef.value?.resetFields()

  // 清空文件
  uploadRef.value?.clearFiles()
  fileList.value = []
  currentFile.value = null
  uploadForm.file = null
}

// ==================== 历史记录列表相关方法 ====================

/**
 * 获取上传历史记录
 */
const fetchUploadHistory = async () => {
  // tableLoading.value = true

  // try {
  //   // 调用API获取历史记录
  //   // 注意：这里需要根据实际后端接口进行调整
  //   const res = await adminApi.getUploadHistory()

  //   if (res.data.code === 1) {
  //     tableData.value = res.data.data || []
  //     console.log('获取上传历史成功:', tableData.value)
  //   } else {
  //     ElMessage.error(res.data.msg || '获取上传历史失败')
  //     tableData.value = []
  //   }
  // } catch (error) {
  //   console.error('获取上传历史失败:', error)

  //   // 如果接口未实现，使用模拟数据
  //   if (error.message && error.message.includes('404')) {
  //     console.warn('接口未实现，使用模拟数据')
  //     tableData.value = getMockData()
  //   } else {
  //     ElMessage.error(error.message || '获取上传历史失败')
  //     tableData.value = []
  //   }
  // } finally {
  //   tableLoading.value = false
  // }
}

/**
 * 获取模拟数据（用于开发测试）
 */
const getMockData = () => {
  return [
    {
      fileId: 'file_001',
      fileName: '手册一_入党积极分子_2023-2024-1.docx',
      fileType: '手册一',
      attachText: '入党积极分子',
      attachTime: '2023-2024-1',
      uploadTime: '2024-01-15 10:30:00',
      status: '成功'
    },
    {
      fileId: 'file_002',
      fileName: '手册一_递交入党申请书_2023-2024-1.docx',
      fileType: '手册一',
      attachText: '递交入党申请书',
      attachTime: '2023-2024-1',
      uploadTime: '2024-01-16 14:20:00',
      status: '成功'
    },
    {
      fileId: 'file_003',
      fileName: '手册一_发展对象_2023-2024-2.docx',
      fileType: '手册一',
      attachText: '发展对象',
      attachTime: '2023-2024-2',
      uploadTime: '2024-03-10 09:15:00',
      status: '失败'
    },
    {
      fileId: 'file_004',
      fileName: '手册一_预备党员_2024-2025-1.docx',
      fileType: '手册一',
      attachText: '预备党员',
      attachTime: '2024-2025-1',
      uploadTime: '2024-09-20 16:45:00',
      status: '成功'
    },
    {
      fileId: 'file_005',
      fileName: '手册一_入党积极分子_2024-2025-1.docx',
      fileType: '手册一',
      attachText: '入党积极分子',
      attachTime: '2024-2025-1',
      uploadTime: '2024-10-05 11:30:00',
      status: '成功'
    }
  ]
}

/**
 * 刷新列表
 */
const handleRefresh = () => {
  console.log('刷新列表')
  fetchUploadHistory()
}

/**
 * 编辑操作
 */
const handleEdit = (row) => {
  console.log('编辑行:', row)

  ElMessageBox.confirm(
    `确定要修改文件 "${row.fileName}" 吗？`,
    '修改确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.info(`编辑功能开发中: ${row.fileName}`)
    // TODO: 实现编辑逻辑
    // 可以跳转到编辑页面或打开编辑弹窗
  }).catch(() => {
    console.log('取消编辑')
  })
}

// ==================== 下拉选项数据获取（可选） ====================

/**
 * 获取材料类型列表
 */
const fetchMaterialTypes = async () => {
  try {
    const res = await adminApi.getMaterialTypes()
    if (res.data.code === 1) {
      materialTypeOptions.value = (res.data.data || []).map(item => ({
        label: item.name || item.label,
        value: item.value
      }))
      console.log('获取材料类型成功:', materialTypeOptions.value)
    }
  } catch (error) {
    console.warn('获取材料类型失败，使用默认值:', error)
    // 使用默认值，已在定义时设置
  }
}

/**
 * 获取阶段任务列表
 */
const fetchStageTasks = async () => {
  try {
    const res = await adminApi.getStageTasks()
    if (res.data.code === 1) {
      stageTaskOptions.value = (res.data.data || []).map(item => ({
        label: item.name || item.label,
        value: item.value
      }))
      console.log('获取阶段任务成功:', stageTaskOptions.value)
    }
  } catch (error) {
    console.warn('获取阶段任务失败，使用默认值:', error)
    // 使用默认值，已在定义时设置
  }
}

// ==================== 生命周期钩子 ====================
onBeforeMount(async() => {
  console.log('页面加载开始')

  await getFileTypeListEvent()

  await getBatchEvent()
})

onMounted(async () => {
  console.log('页面加载完成')
  // 页面加载时获取历史记录
  await fetchUploadHistory()
})
</script>

<style lang="scss" scoped>
.upload-container {
  height: calc(100vh - 200px);
}
// 上传表单区域
.upload-form-section {
  padding: 0 20px;
  height: 140px;
  background: #fff;
  border-radius: 4px;

  .upload-form {
    max-width: 1200px;
  }

  .file-upload-wrapper {
    display: flex;
    align-items: flex-start;
    width: 100%;
    gap: 10px;

    .upload-demo {
      flex: 1;

      :deep(.el-upload) {
        width: 100%;
      }

      :deep(.el-upload-list) {
        margin-top: 10px;
      }
    }

    .upload-btn {
      flex-shrink: 0;
      min-width: 120px;
    }

    :deep(.el-upload__tip) {
      margin-top: 8px;
      font-size: 12px;
      color: #909399;
      line-height: 1.5;
    }
  }
}

// 历史记录区域
.upload-history-section {
  height: calc(100% - 140px);
  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 16px;
    padding-left: 12px;
    border-left: 3px solid #bc0000;
  }

  .table-container {
    background: #fff;
    border-radius: 4px;
  }
}

// 表单项标签对齐
:deep(.el-form-item__label) {
  font-weight: 500;
}

// 分割线样式
:deep(.el-divider) {
  margin: 24px 0;
}

// 图标样式
.el-icon--left {
  margin-right: 4px;
}

// 上传组件按钮样式优化
:deep(.el-upload) {
  .el-button {
    width: 100%;
  }
}

// 表格标签样式
:deep(.el-tag) {
  font-weight: 500;
}
</style>
