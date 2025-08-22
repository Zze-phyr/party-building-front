<template>
  <div class="cultivate-contacts-box">
    <ContentBox>
      <!-- 标题 -->
      <template #title> 入党积极分子培养联系人信息填写 </template>
      <el-row class="form-box" :gutter="40">
        <el-col v-for="(form, index) in cultivateContactForms" :key="index" :span="12">
          <el-form
            style="max-width: 600px"
            :model="form"
            label-width="auto"
            label-position="left"
            size="small"
            :ref="(el) => (formRefs[index] = el)"
            :rules="cultivateContactRules"
            :disabled="FormDisabled"
          >
            <el-form-item label="培养联系人姓名" prop="name">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="培养联系人" prop="number">
              <el-radio-group v-model="form.number">
                <el-radio border :value="'1'">培养联系人1</el-radio>
                <el-radio border :value="'2'">培养联系人2</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="党龄" prop="partyAge">
              <el-input-number
                v-model="form.partyAge"
                :min="1"
                :max="150"
                size="small"
                controls-position="right"
              />
            </el-form-item>
            <el-form-item label="政治面貌" prop="visage">
              <el-select v-model="form.visage" placeholder="请选择">
                <el-option label="群众" value="群众" />
                <el-option label="共青团员" value="共青团员" />
                <el-option label="中共党员" value="中共党员" />
              </el-select>
            </el-form-item>
            <el-form-item label="单位及职务" prop="unitOccupation">
              <el-input v-model="form.unitOccupation" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div class="btn-box">
        <el-button color="#d12626" @click="cultivateContactSubmnit()">确定提交</el-button>
      </div>
    </ContentBox>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { addNurtureContacts, getNurtureContacts } from '@/api/common'
import { useUserStore, useFileStore } from '@/stores'
import ContentBox from '../../components/ContentBox.vue'

const userStore = useUserStore()
const fileStore = useFileStore()

// 表单禁用
const FormDisabled = ref(false)

// 组件挂载后
onMounted(async () => {
  try {
    const { data: nurtureContactsData } = await getNurtureContacts(userStore.userId)
    if (nurtureContactsData.code === 1 && nurtureContactsData.data.length > 0) {
      fileStore.NurtureContacts.value = nurtureContactsData.data
      // 初始化表单数据
      nurtureContactsData.data.forEach((item, index) => {
        if (index < cultivateContactForms.length) {
          Object.assign(cultivateContactForms[index], {
            commonUserId: userStore.userId,
            name: item.name,
            number: item.number,
            partyAge: item.partyAge,
            visage: item.visage,
            unitOccupation: item.unitOccupation,
          })
        }
      })
      if (nurtureContactsData.data[0].confirm === 1 && nurtureContactsData.data[1].confirm === 1)
        FormDisabled.value = true
    } else {
      ElMessage.error(nurtureContactsData.msg || '获取培养联系人数据失败')
    }
  } catch (error) {
    console.log(error)
    ElMessage.error('数据获取失败')
  }
})

// 入党积极分子培养联系人表单数据
const baseContactForm = {
  commonUserId: userStore.userId,
  name: '', //姓名
  number: '1', //第几联系人
  partyAge: 1, //党龄
  visage: '', //政治面貌
  unitOccupation: '', //单位职务/职业
}

// 创建两个表单数据对象
const cultivateContactForms = reactive([
  Object.assign({}, baseContactForm, { number: '1' }),
  Object.assign({}, baseContactForm, { number: '2' }),
])

// 表单引用数组
const formRefs = ref([])

// 表单校验规则
const cultivateContactRules = reactive({
  name: [{ required: true, message: '请填写', trigger: 'blur' }],
  number: [{ required: true, message: '请填写', trigger: 'blur' }],
  partyAge: [{ required: true, message: '请填写', trigger: 'blur' }],
  visage: [{ required: true, message: '请填写', trigger: 'blur' }],
  unitOccupation: [{ required: true, message: '请填写', trigger: 'blur' }],
})

// 提交入党积极分子培养联系人表单
const cultivateContactSubmnit = async () => {
  try {
    // 验证所有表单
    const validatePromises = formRefs.value.map((ref) => ref?.validate())
    await Promise.all(validatePromises)

    // 设置用户ID
    cultivateContactForms.forEach((form) => {
      form.commonUserId = userStore.userId
    })

    // 并行提交所有表单
    const submitPromises = cultivateContactForms.map((form) => addNurtureContacts(form))
    const results = await Promise.all(submitPromises)

    // 检查提交结果
    const allSuccess = results.every((res) => res.data.code === 1)
    if (allSuccess) {
      ElMessage.success('提交成功')
      fileStore.NurtureContacts.value = [...cultivateContactForms]
    } else {
      results.forEach((res, index) => {
        if (res.data.code !== 1) {
          ElMessage.error(`联系人${index + 1}失败：${res.data.msg}`)
        }
      })
    }
  } catch (error) {
    console.log(error)
    ElMessage.error('提交失败，请重试')
  }
}
</script>

<style lang="scss" scoped>
.cultivate-contacts-box {
  .form-box {
    padding: 30px 50px 0px;
  }
  .btn-box {
    margin-bottom: 15px;
    text-align: center;
  }
}
</style>
