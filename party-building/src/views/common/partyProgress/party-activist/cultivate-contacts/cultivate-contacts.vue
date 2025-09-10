<template>
  <div class="cultivate-contacts-box">
    <ContentBox :confirm="confirmOne" :proposed-changes="returnTextOne">
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
        <el-button v-if="!FormDisabled" color="#d12626" @click="cultivateContactSubmnit()">{{
          confirmOne === -2 ? '确定提交' : '确定重新提交'
        }}</el-button>
      </div>
    </ContentBox>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { commonApi } from '@/api/common'
import { useUserStore } from '@/stores'
import ContentBox from '../../components/ContentBox.vue'

const userStore = useUserStore()

// 添加入党积极分子培养联系人表单数据
const addContactForm = {
  commonUserId: userStore.userId,
  name: '', //姓名
  number: '1', //第几联系人
  partyAge: 1, //党龄
  visage: '', //政治面貌
  unitOccupation: '', //单位职务/职业
}

// 修改入党积极分子培养联系人表单数据
const updateContactForm = {
  commonUserId: userStore.userId,
  name: '', //姓名
  number: '1', //第几联系人
  partyAge: 1, //党龄
  visage: '', //政治面貌
  unitOccupation: '', //单位职务/职业
  id: 0,
  confirm: 0,
  attachText: '请修改',
}

let cultivateContactForms

cultivateContactForms = ref([
  Object.assign({}, addContactForm, { number: '1' }),
  Object.assign({}, addContactForm, { number: '2' }),
])

// 组件挂载后
onMounted(async () => {
  try {
    const { data } = await commonApi.getNurtureContacts(userStore.userId)
    if (data.code === 1) {
      if (data.data.length > 0) {
        cultivateContactForms = ref([
          Object.assign({}, updateContactForm, { number: '1' }),
          Object.assign({}, updateContactForm, { number: '2' }),
        ])
        for (let i = 0; i < data.data.length; i++) {
          cultivateContactForms.value[i] = { ...cultivateContactForms.value[i], ...data.data[i] }
        }
      } else {
        // 创建两个表单数据对象
        cultivateContactForms = ref([
          Object.assign({}, addContactForm, { number: '1' }),
          Object.assign({}, addContactForm, { number: '2' }),
        ])
      }
    } else {
      ElMessage.error(data.msg || '获取培养联系人数据失败')
    }
  } catch (error) {
    console.log(error)
    ElMessage.error('数据获取失败')
  }
})

// 表单状态
const confirmOne = computed(() => {
  if (cultivateContactForms.value[0].confirm) {
    return cultivateContactForms.value[0].confirm
  } else return -2
})
const confirmTwo = computed(() => {
  if (cultivateContactForms.value[1].confirm) {
    return cultivateContactForms.value[1].confirm
  } else return -2
})

// 修改建议
const returnTextOne = computed(() => cultivateContactForms.value[0].returnText)

// 表单禁用状态
const FormDisabled = computed(() => confirmOne.value === 1 && confirmTwo.value === 1)

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
    let submitPromises
    // 如果是第一次提交
    if (confirmOne.value === -2 && confirmTwo.value === -2) {
      submitPromises = cultivateContactForms.map((form) => commonApi.addNurtureContacts(form))
    }
    // 如果是重新提交
    else {
      submitPromises = cultivateContactForms.map((form) => commonApi.updateNurtureContacts(form))
    }
    const results = await Promise.all(submitPromises)

    // 检查提交结果
    const allSuccess = results.every((res) => res.data.code === 1)
    if (allSuccess) {
      ElMessage.success('提交成功')
      // 如果是第一次提交成功，待提交状态-2
      if (confirmOne.value === -2 && confirmTwo.value === -2) {
        const array = cultivateContactForms.value
        // 转换成待审核
        cultivateContactForms.value = [
          Object.assign({}, updateContactForm),
          Object.assign({}, updateContactForm),
        ]
        for (let i = 0; i < array.length; i++) {
          cultivateContactForms.value[i] = { ...cultivateContactForms.value[i], ...array[i] }
        }
      }
      // 如果是审核失败的重新提交成功
      else if (confirmOne.value === -1 && confirmTwo.value === -1) {
        for (let i = 0; i < cultivateContactForms.value.length; i++) {
          // 则改为待审核状态
          cultivateContactForms.value[i].confirm = 0
        }
      }
    } else {
      ElMessage.error('提交失败，请重试')
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
