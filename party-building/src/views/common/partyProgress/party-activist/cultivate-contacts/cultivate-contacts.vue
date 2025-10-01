<template>
  <div class="cultivate-contacts-box">
    <ContentBox>
      <!-- 标题 -->
      <template #title> 入党积极分子培养联系人信息填写 </template>
      <el-row class="confirm-box" :gutter="40">
        <el-col :span="12">
          <div class="confirm-content" v-if="confirmOne === 0">审核中......</div>
          <div class="confirm-content" v-else-if="confirmOne === 1">审核成功！</div>
          <span
            class="confirm-content audit-failures"
            v-else-if="confirmOne === -1"
            @click="centerDialogOneVisible = true"
          >
            审核失败，点击查看原因
          </span>
          <el-dialog
            v-model="centerDialogOneVisible"
            title="修改建议"
            width="500"
            align-center
            :show-close="false"
          >
            <span>{{ returnTextOne }}</span>
            <template #footer>
              <div class="dialog-footer">
                <el-button color="#d12626" @click="centerDialogOneVisible = false">
                  确认
                </el-button>
              </div>
            </template>
          </el-dialog>
        </el-col>
        <el-col :span="12">
          <div class="confirm-content" v-if="confirmTwo === 0">审核中......</div>
          <div class="confirm-content" v-else-if="confirmTwo === 1">审核成功！</div>
          <span
            class="confirm-content audit-failures"
            v-else-if="confirmTwo === -1"
            @click="centerDialogTwoVisible = true"
          >
            审核失败，点击查看原因
          </span>
          <el-dialog
            v-model="centerDialogTwoVisible"
            title="修改建议"
            width="500"
            align-center
            :show-close="false"
          >
            <span>{{ returnTextTwo }}</span>
            <template #footer>
              <div class="dialog-footer">
                <el-button color="#d12626" @click="centerDialogTwoVisible = false">
                  确认
                </el-button>
              </div>
            </template>
          </el-dialog>
        </el-col>
      </el-row>
      <el-row class="form-box" :gutter="40">
        <el-col :span="12">
          <el-form
            style="max-width: 600px"
            :model="contactFormOne"
            label-width="auto"
            label-position="left"
            size="small"
            ref="formRefOne"
            :rules="cultivateContactRules"
            :disabled="isFormOneDisabled"
          >
            <el-form-item label="培养联系人姓名" prop="name">
              <el-input v-model="contactFormOne.name" />
            </el-form-item>
            <el-form-item label="培养联系人" prop="number">
              <el-radio-group v-model="contactFormOne.number">
                <el-radio border :value="1">培养联系人1</el-radio>
                <el-radio border :value="2">培养联系人2</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="党龄" prop="partyAge">
              <el-input-number
                v-model="contactFormOne.partyAge"
                :min="1"
                :max="150"
                size="small"
                controls-position="right"
              />
            </el-form-item>
            <el-form-item label="政治面貌" prop="visage">
              <el-select v-model="contactFormOne.visage" placeholder="请选择">
                <el-option label="群众" value="群众" />
                <el-option label="共青团员" value="共青团员" />
                <el-option label="中共党员" value="中共党员" />
              </el-select>
            </el-form-item>
            <el-form-item label="单位及职务" prop="unitOccupation">
              <el-input v-model="contactFormOne.unitOccupation" />
            </el-form-item>
          </el-form>
          <div class="btn-box">
            <el-button
              v-if="!isFormOneDisabled"
              :loading="loadingOne"
              color="#d12626"
              @click="submitForm('one')"
              >{{ confirmOne === -2 ? '确定提交' : '确定重新提交' }}</el-button
            >
          </div>
        </el-col>
        <el-col :span="12">
          <el-form
            style="max-width: 600px"
            :model="contactFormTwo"
            label-width="auto"
            label-position="left"
            size="small"
            ref="formRefTwo"
            :rules="cultivateContactRules"
            :disabled="isFormTwoDisabled"
          >
            <el-form-item label="培养联系人姓名" prop="name">
              <el-input v-model="contactFormTwo.name" />
            </el-form-item>
            <el-form-item label="培养联系人" prop="number">
              <el-radio-group v-model="contactFormTwo.number">
                <el-radio border :value="1">培养联系人1</el-radio>
                <el-radio border :value="2">培养联系人2</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="党龄" prop="partyAge">
              <el-input-number
                v-model="contactFormTwo.partyAge"
                :min="1"
                :max="150"
                size="small"
                controls-position="right"
              />
            </el-form-item>
            <el-form-item label="政治面貌" prop="visage">
              <el-select v-model="contactFormTwo.visage" placeholder="请选择">
                <el-option label="群众" value="群众" />
                <el-option label="共青团员" value="共青团员" />
                <el-option label="中共党员" value="中共党员" />
              </el-select>
            </el-form-item>
            <el-form-item label="单位及职务" prop="unitOccupation">
              <el-input v-model="contactFormTwo.unitOccupation" />
            </el-form-item>
          </el-form>
          <div class="btn-box">
            <el-button
              :loading="loadingTwo"
              v-if="!isFormTwoDisabled"
              color="#d12626"
              @click="submitForm('two')"
              >{{ confirmTwo === -2 ? '确定提交' : '确定重新提交' }}</el-button
            >
          </div>
        </el-col>
      </el-row>
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
const getAddContactForm = (number = 1) => ({
  commonUserId: userStore.userId,
  name: '', //姓名
  number: number, //第几联系人
  partyAge: null, //党龄
  visage: '', //政治面貌
  unitOccupation: '', //单位职务/职业
})
// 初始化表单,使用函数确保两个表单指向的是不同的对象
const contactFormOne = ref(getAddContactForm('1'))
const contactFormTwo = ref(getAddContactForm('2'))

// 表单状态
const confirmOne = ref(-2)
const confirmTwo = ref(-2)
// 修改建议
const returnTextOne = ref('1错误')
const returnTextTwo = ref('2错误')
// 表单禁用状态
const isFormOneDisabled = computed(() => {
  return confirmOne.value === 1
})
const isFormTwoDisabled = computed(() => {
  return confirmTwo.value === 1
})
// 弹窗现隐
const centerDialogOneVisible = ref(false)
const centerDialogTwoVisible = ref(false)

// 组件挂载后
onMounted(async () => {
  try {
    const { data } = await commonApi.getNurtureContacts(userStore.userId)
    //如果有返回数据
    if (data.code === 1) {
      // 如果至少填了一个联系人
      if (data.data.length >= 1) {
        contactFormOne.value = data.data[0]
        confirmOne.value = data.data[0].confirm
        returnTextOne.value = data.data[0].returnText
      }
      // 如果填了两个联系人
      if (data.data.length === 2) {
        contactFormTwo.value = data.data[1]
        confirmTwo.value = data.data[1].confirm
        returnTextTwo.value = data.data[1].returnText
      }
    } else {
      ElMessage.error(data.msg || '获取培养联系人数据失败')
    }
  } catch (error) {
    console.log(error)
    ElMessage.error('数据获取失败')
  }
})

// 表单引用
const formRefOne = ref(null)
const formRefTwo = ref(null)

// 表单校验规则
const cultivateContactRules = reactive({
  name: [{ required: true, message: '请填写', trigger: 'blur' }],
  number: [{ required: true, message: '请填写', trigger: 'blur' }],
  partyAge: [{ required: true, message: '请填写', trigger: 'blur' }],
  visage: [{ required: true, message: '请填写', trigger: 'blur' }],
  unitOccupation: [{ required: true, message: '请填写', trigger: 'blur' }],
})

const loadingOne = ref(false)
const loadingTwo = ref(false)

// 提交入党积极分子培养联系人表单
const submitForm = (formNumber) => {
  if (formNumber === 'one')
    cultivateContactSubmit(formRefOne.value, confirmOne, contactFormOne, loadingOne, returnTextOne)
  else if (formNumber === 'two')
    cultivateContactSubmit(formRefTwo.value, confirmTwo, contactFormTwo, loadingTwo, returnTextTwo)
}
const cultivateContactSubmit = async (formRefValue, confirm, contactForm, loading, returnText) => {
  console.log(loading)

  if (!formRefValue) return
  try {
    // 验证所有表单
    await formRefValue.validate()
    loading.value = true

    let res
    // 如果是第一次提交
    if (confirm.value === -2) {
      res = await commonApi.addNurtureContacts(contactForm.value)
    }
    // 如果是重新提交
    else {
      contactForm.value.commonUserId = userStore.userId
      res = await commonApi.updateNurtureContacts(contactForm.value)
    }

    // 检查提交结果
    if (res.data.code === 1) {
      ElMessage.success('提交成功')
      // 如果是第一次提交成功，待提交状态-2
      if (confirm.value === -2) {
        // 转换成待审核
        const { data } = await commonApi.getNurtureContacts(userStore.userId)
        data.data.forEach((item) => {
          if (item.name === contactForm.value.name) {
            contactForm.value = item
            confirm.value = item.value
            returnText.value = item.returnText
          }
        })
      }
      // 如果是审核失败的重新提交成功
      else if (confirm.value === -1) {
        // 则改为待审核状态
        confirm.value = 0
        contactForm.value.confirm = 0
      }
    } else {
      ElMessage.error(res.data.msg || '提交失败，请重试')
    }
  } catch (error) {
    console.log(error)
    ElMessage.error('提交失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.cultivate-contacts-box {
  .confirm-box {
    padding: 15px 50px 0px;
    .confirm-content {
      padding: 3px 8px;
      border-radius: 18px;
      font-size: 20px;
      color: #ffd700;
    }
    .audit-failures:hover {
      color: #fff;
      background-color: #ffd700;
    }
  }
  .form-box {
    padding: 15px 50px 0px;
  }
  .btn-box {
    margin-bottom: 15px;
    text-align: center;
  }
}
</style>
