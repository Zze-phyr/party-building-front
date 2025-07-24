<template>
  <div class="bg-container">
    <div class="form-container">
      <!-- 身份选择 -->
      <div class="roule-choice">
        <span :class="{ active: permission === 'Common' }" @click="choiceCommon()"
          >普通用户登录</span
        >
        <span :class="{ active: permission === 'Admin' }" @click="choiceAdmin()">管理员登录</span>
      </div>
      <!-- 手机验证码表单 -->
      <div v-if="loginWay" class="phone-login-container form-box">
        <el-form
          class="form"
          label-width="auto"
          label-position="top"
          size="normal"
          :model="phoneLoginForm"
          ref="phoneLoginFormRef"
          :rules="phoneLoginRules"
        >
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="phoneLoginForm.phone" placeholder="请输入您的手机号" />
          </el-form-item>
          <el-form-item class="verify" label="验证码">
            <el-input v-model="phoneLoginForm.verify" placeholder="请输入验证码">
              <!-- 输入框尾部追加一个span标签 -->
              <template #append>
                <el-button type="warning" :disabled="isDisabled" @click="countdownChange">{{
                  buttonText
                }}</el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item class="login-way">
            <span @click="switchLoginWay()">切换账号密码登录</span>
          </el-form-item>
          <el-form-item class="btn-box">
            <el-button
              class="btn"
              @click="submitLoginForm(phoneLoginFormRef, phoneLoginForm, userPhoneLogin)"
              >确认登录</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-link :underline="false" href="/register" class="link" type="info"
              >暂无帐号，立即注册</el-link
            >
          </el-form-item>
        </el-form>
      </div>
      <!-- 账号密码表单 -->
      <div v-else class="number-login-container form-box">
        <!-- 账号密码登录表单 -->
        <div class="form-box">
          <el-form
            class="form"
            label-width="auto"
            label-position="top"
            size="normal"
            :model="numberLoginForm"
            ref="numberLoginFormRef"
            :rules="numberLoginRules"
          >
            <el-form-item label="账号" prop="number">
              <el-input v-model="numberLoginForm.number" placeholder="请输入您的学号/工号" />
            </el-form-item>
            <el-form-item class="password" label="密码" prop="password">
              <el-input
                v-model="numberLoginForm.password"
                type="password"
                placeholder="请输入账号密码"
              />
            </el-form-item>
            <el-form-item class="login-way">
              <span @click="switchLoginWay()">切换手机号验证码登录</span>
            </el-form-item>
            <el-form-item class="btn-box">
              <el-button
                class="btn"
                @click="submitLoginForm(numberLoginFormRef, numberLogin, userNumberLogin)"
                >确认登录</el-button
              >
            </el-form-item>
            <el-form-item>
              <el-link :underline="false" href="/register" class="link" type="info"
                >暂无帐号，立即注册</el-link
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { userPhoneLogin, userVerification, userNumberLogin } from '@/api/public'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
import { validatePhone } from '@/utils/validators'
import { useCountdown } from '@/composables/useCountdown'
import { clearForm } from '@/composables/useFormUtils'

const userStore = useUserStore()
const router = useRouter()

// 身份切换
let permission = ref('Common')
const choiceCommon = () => (permission.value = 'Common')
const choiceAdmin = () => (permission.value = 'Admin')

// 登录方式切换
let loginWay = ref(1)
const switchLoginWay = () => {
  loginWay.value = loginWay.value ? 0 : 1
}

//创建表单实例——手机验证码
const phoneLoginFormRef = ref(null)
const phoneLoginForm = reactive({
  phone: '',
  verify: '',
  permission: '',
})
//创建表单实例——账号密码
const numberLoginFormRef = ref(null)
const numberLoginForm = reactive({
  number: '',
  password: '',
  permission: '',
})

//表单校验——手机验证码
let isDisabled = ref(true) // 是否可获取验证码
const phoneLoginRules = reactive({
  phone: [
    { required: true, message: '请填写电话号码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        const result = validatePhone(value)
        if (!result) callback('请输入有效的11位手机号码')
        else isDisabled.value = false
      },
      trigger: 'blur',
    },
  ],
  verify: [{ required: true, message: '请填写验证码', trigger: 'blur' }],
})
//表单校验——账号密码
const numberLoginRules = reactive({
  number: [{ required: true, message: '请填写账号', trigger: 'blur' }],
  password: [{ required: true, message: '请填写密码', trigger: 'blur' }],
})

//发送短信——手机验证码
const { buttonText, isCounting, start } = useCountdown(60, '获取验证码')
const countdownChange = async () => {
  if (isCounting.value) return
  try {
    const { data } = await userVerification({ phone: phoneLoginForm.phone })
    console.log(data)
    if (data.code === 1) {
      ElMessage.success('短信成功发送')
      start() //开始倒计时
    } else {
      ElMessage.error('短信发送失败')
    }
  } catch (error) {
    console.log(error)
    ElMessage.error('网络错误，请重试')
  }
}

// 提交登录表单
const submitLoginForm = async (formRef, formData, api) => {
  if (!formRef) return
  //手动触发校验
  try {
    await formRef.validate()
    formData.permission = permission
    const { data } = await api(formData)
    if (data.code === 1) {
      ElMessage.success('登录成功！')
      userStore.login(data.data)
      router.push(permission.value === 'Common' ? '/common/index' : '/admin/joinParty')
    } else {
      ElMessage.error(data.msg)
    }
  } catch (error) {
    console.log(error)
    clearForm(formRef, formData)
    ElMessage.error('登录失败，请重试')
  }
}
</script>

<style lang="scss" scoped>
.bg-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url(../../../assets/images/common/login-background.png);
  background-size: cover;
  background-position: center;
  z-index: -1;
  .form-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 10px 20px 0;
    background-color: #fff;
    border-radius: 10px;
    // 角色选择
    .roule-choice {
      display: flex;
      align-items: center;
      margin: 10px 0;
      height: 30px;
      font-weight: bold;
      font-size: 20px;
      text-align: center;
      span {
        width: 165px;
      }
      .active {
        color: #bc0000;
      }
    }
    //登录表单
    .form-box {
      margin: 20px 0;
      .el-form-item {
        :deep(.el-input) {
          --el-input-focus-border-color: #999;
        }
      }
      .login-way {
        margin: 5px 0;
        color: #888;
        span {
          font-size: 13px;
        }
      }
      .login-way:hover {
        color: #d24529;
        cursor: pointer;
      }
      .btn-box {
        margin: 0;
        .btn {
          margin: 12px auto;
          padding: 15px 40px;
          background-color: #d24529;
          border-color: #000;
          color: white;
        }
        .btn:hover {
          box-shadow: inset 3px 4px 5px rgba(0, 0, 0, 0.3); /* 内阴影效果，水平偏移0、垂直偏移0、模糊半径5px、颜色为黑色透明度0.3，可按需调整参数 */
        }
      }
      .link {
        margin: 0 auto;
        font-size: 13px;
      }
      .link:hover {
        color: #d24529;
      }
    }
    .phone-login-container {
      margin: 20px 0;
      .form {
        .verify {
          margin-bottom: 0;
        }
      }
    }
    .phone-login-container {
      .form {
        .verify {
          margin-bottom: 0;
        }
      }
    }
    .number-login-container {
      .form {
        .password {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
