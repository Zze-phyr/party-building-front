<template>
  <!-- 修改信息对话框 -->
  <el-dialog v-model="dialogVisible" fullscreen center>
    <el-form :model="userInfoForm" class="form">
      <el-row :gutter="120">
        <el-col :span="12">
          <el-form-item label="姓名">
            <el-input v-model="userInfoForm.name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证号">
            <el-input v-model="userInfoForm.idCard" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="120">
        <el-col :span="12">
          <el-form-item label="民族">
            <el-input v-model="userInfoForm.ethnicity" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="文化程度">
            <el-select v-model="userInfoForm.educationLevel" placeholder="请选择文化程度">
              <el-option label="小学" value="小学" />
              <el-option label="初中" value="初中" />
              <el-option label="高中" value="高中" />
              <el-option label="大专" value="大专" />
              <el-option label="本科" value="本科" />
              <el-option label="硕士研究生" value="硕士研究生" />
              <el-option label="博士研究生" value="博士研究生" />
              <el-option label="博士后" value="博士后" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="120">
        <el-col :span="12">
          <el-form-item label="籍贯">
            <el-input v-model="userInfoForm.originPlace" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出生地">
            <el-input v-model="userInfoForm.birthplace" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="120">
        <el-col :span="12">
          <el-form-item label="政治面貌">
            <el-select v-model="userInfoForm.politicalStatus" placeholder="请选择政治面貌">
              <el-option label="群众" value="群众" />
              <el-option label="共青团员" value="共青团员" />
              <el-option label="中共党员" value="中共党员" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入团时间">
            <el-date-picker
              v-model="userInfoForm.joinLeagueDate"
              type="date"
              placeholder="请选择入团时间"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="120">
        <el-col :span="12">
          <el-form-item label="学号">
            <el-input v-model="userInfoForm.number" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="QQ">
            <el-input v-model="userInfoForm.qq" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="120">
        <el-col :span="12">
          <el-form-item label="邮箱">
            <el-input v-model="userInfoForm.email" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电话">
            <el-input v-model="userInfoForm.phone" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="120">
        <el-col :span="12">
          <el-form-item label="性别">
            <el-radio-group v-model="userInfoForm.gender">
              <el-radio-button label="女" :value="1" />
              <el-radio-button label="男" :value="0" />
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="年龄">
            <el-input-number
              v-model="userInfoForm.age"
              :min="1"
              :max="150"
              controls-position="right"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="120">
        <el-col :span="12">
          <el-form-item label="年级">
            <el-input v-model="userInfoForm.grade" placeholder="例：23级" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="专业">
            <el-input v-model="userInfoForm.major" placeholder="例：软件工程" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="120">
        <el-col :span="12">
          <el-form-item label="班级">
            <el-input v-model="userInfoForm.sclass" placeholder="例：三班" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属支部">
            <el-input v-model="userInfoForm.branch" placeholder="例：三班" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-table :data="userInfoForm.mainRelationships" border style="width: 100%">
        <el-table-column prop="name" label="姓名">
          <template #default="scope">
            <el-form-item
              :prop="`mainRelationships[${scope.$index}].name`"
              :rules="{ required: true, message: '姓名必填', trigger: 'blur' }"
            >
              <el-input v-model="scope.row.name" placeholder="请输入姓名" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="relationship" label="关系">
          <template #default="scope">
            <el-form-item
              :prop="`mainRelationships[${scope.$index}].role`"
              :rules="{ required: true, message: '关系必填', trigger: 'blur' }"
            >
              <el-input v-model="scope.row.role" placeholder="请输入关系" />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="text" text-color="#ff4949" @click="handleDelete(scope.$index)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="success" @click="handleAdd" style="margin-top: 10px"> + 增加 </el-button>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false"> 确认提交 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { useUserStore } from '@/stores'
// import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const emit = defineEmits(['update:modelValue'])

// 添加props接收父组件传递的值
const props = defineProps({
  modelValue: Boolean,
})

// 使用计算属性管理对话框状态
const dialogVisible = ref(false)

// 监听父组件传递的值变化
watch(
  () => props.modelValue,
  (newVal) => {
    dialogVisible.value = newVal
  },
)

// 监听对话框状态变化并通知父组件
watch(dialogVisible, (newVal) => {
  emit('update:modelValue', newVal)
})

//用户信息表单
let userInfoForm = reactive({
  name: '', //姓名
  number: '', //学号
  idCard: '', //身份证号
  branch: '', //所属支部
  ethnicity: '', //民族
  educationLevel: '', //文化程度
  originPlace: '', //籍贯
  birthplace: '', //出生地
  politicalStatus: '', //政治面貌
  joinLeagueDate: '', //入团时间
  qq: '', //QQ
  email: '', //电子邮箱
  phone: '', //手机号
  gender: null, //性别0男1女
  age: null, //年龄
  grade: '', //年级
  major: '', //专业
  sclass: '', //班级
  status: null, //状态，-1为政审不通过
  mainRelationships: [],
})

// 监听对话框打开，初始化表单数据（使用深拷贝）
watch(dialogVisible, (visible) => {
  if (visible) {
    // 使用深拷贝初始化表单
    const userInfo = userStore.userInfo
    Object.keys(userInfoForm).forEach((key) => {
      if (Array.isArray(userInfo[key])) {
        userInfoForm[key] = JSON.parse(JSON.stringify(userInfo[key]))
      } else {
        userInfoForm[key] = userInfo[key]
      }
    })
  }
})

// 增加主要关系
const handleAdd = () => {
  userInfoForm.mainRelationships.push({
    name: '',
    relationship: '',
  })
}

// 删除
const handleDelete = (index) => {
  userInfoForm.mainRelationships.splice(index, 1)
}
</script>

<style lang="less" scoped>
.form {
  margin: 20px 50px 5px;
}
</style>
