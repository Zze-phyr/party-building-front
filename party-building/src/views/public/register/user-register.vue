<template>
  <div class="bg-container">
    <div class="register-container">
      <!-- 注册表单 -->
      <div class="form-box">
        <el-form
          class="form"
          style="max-width: 600px"
          label-width="auto"
          label-position="top"
          size="small"
          :model="registerForm"
          ref="registerFormRef"
          :rules="registerRules"
        >
          <div class="title">
            <div class="img-container">
              <img class="img" src="../../../assets/images/common/party-emblem-1.png" alt="" />
            </div>
            <div class="text">学生党建平台</div>
          </div>
          <el-form-item label="学号" prop="number">
            <el-input v-model="registerForm.number" placeholder="学号将默认为您的账号" />
          </el-form-item>
          <el-form-item label="身份证号" prop="idCard">
            <el-input v-model="registerForm.idCard" placeholder="请输入您的身份证号" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="registerForm.phone" placeholder="请输入您的手机号" />
          </el-form-item>
          <el-form-item label="验证码">
            <el-input v-model="registerForm.verify" placeholder="请输入验证码">
              <!-- 输入框尾部追加一个span标签 -->
              <template #append>
                <el-button type="warning" :disabled="isDisabled" @click="countdownChange">{{
                  buttonText
                }}</el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="请设置账号密码"
            />
          </el-form-item>
          <el-form-item label="确认密码" prop="repassword">
            <el-input
              v-model="registerForm.repassword"
              type="password"
              placeholder="请再次确认密码"
            />
          </el-form-item>
          <el-form-item class="btn-box">
            <el-button
              :loading="loading"
              class="btn"
              color="#d12626"
              @click="submitRegister(registerFormRef, registerForm)"
              >确认注册</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-link :underline="false" href="/login" class="link" type="info"
              >已有帐号，选择登录</el-link
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { publicApi } from '@/api/public'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { validateIdCard } from '@/utils/validation/validators'
import { useCountdown } from '@/composables/useCountdown'

const router = useRouter()

//创建表单实例
const registerFormRef = ref(null)
const registerForm = reactive({
  number: '',
  idCard: '',
  phone: '',
  verify: '',
  password: '',
  repassword: '',
})

// 自定义二次验证密码函数
const validateRepassword = (rule, value, callback) => {
  if (registerForm.password && registerForm.repassword) {
    if (value !== registerForm.password || value !== registerForm.repassword) {
      callback(new Error('两次密码填写不一致'))
    } else {
      callback()
    }
  }
}

//表单校验
let isDisabled = ref(true) // 是否可获取验证码
const registerRules = reactive({
  number: [
    { required: true, message: '请填写学号', trigger: 'blur' },
    { min: 10, max: 11, message: '请输入有效的学号', trigger: 'blur' },
  ],
  idCard: [
    { required: true, message: '请填写身份证号', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (!validateIdCard(value)) {
          callback(new Error('请输入有效的18位身份证号码'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  phone: [
    { required: true, message: '请填写电话号码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (!value) {
          isDisabled.value = true
          callback(new Error('请填写手机号码'))
        } else if (!/^1[3-9]\d{9}$/.test(value)) {
          callback(new Error('请输入有效的11位手机号码'))
          isDisabled.value = true
        } else {
          callback() // 验证成功
          isDisabled.value = false
        }
      },
      trigger: ['change', 'blur'],
    },
  ],
  verify: [{ required: true, message: '请填写验证码', trigger: 'blur' }],
  password: [
    { required: true, message: '请填写密码', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{11,16}$/,
      message: '密码必须为11-16位，且只能包含数字和英文',
      trigger: 'blur',
    },
    { validator: validateRepassword, trigger: 'blur' },
  ],
  repassword: [
    { required: true, message: '请填写密码', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{11,16}$/,
      message: '密码必须为11-16位，且只能包含数字和英文',
      trigger: 'blur',
    },
    { validator: validateRepassword, trigger: 'blur' },
  ],
})

//发送短信——手机验证码
const { buttonText, isCounting, start } = useCountdown(60, '获取验证码')
const countdownChange = async () => {
  if (isCounting.value) return
  try {
    const { data } = await publicApi.getVerification({ phone: registerForm.phone })
    if (data.code === 1) {
      ElMessage.success('短信成功发送')
      start() //开始倒计时
    } else {
      ElMessage.error('短信发送失败')
      isCounting.value = false
    }
  } catch (error) {
    console.log(error)
    ElMessage.error('网络错误，请重试')
    isCounting.value = false
  }
}

const loading = ref(false)
//提交表单
const submitRegister = async (formRef) => {
  if (!formRef) return
  //手动触发校验
  try {
    await formRef.validate()
    loading.value = true
    const { data } = await publicApi.register(registerForm)
    if (data.code === 1) {
      ElMessage.success('注册成功，请登录')
      router.push('/login')
    } else {
      ElMessage.error(data.msg)
    }
  } catch (error) {
    console.log(error)
    ElMessage.error('注册失败，请重试')
  } finally {
    loading.value = false
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
  .register-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .form {
      width: 400px;
      height: 520px;
      padding: 18px 50px;
      background-color: #fff;
      border-radius: 10px;
      .title {
        display: flex;
        justify-content: center;
        height: 50px;
        margin-bottom: 8px;
        .img-container {
          width: 50px;
          height: 50px;
          margin-right: 5px;
          .img {
            width: 100%;
            height: 100%;
          }
        }
        .text {
          font-size: 40px;
          font-weight: bold;
          font-family: Arial, sans-serif;
          color: #d24529;
          line-height: 50px;
        }
      }
      .el-form-item {
        margin-bottom: 12px;
        :deep(.el-form-item__label) {
          margin-bottom: 0 !important;
          color: #000;
        }
        :deep(.el-input) {
          --el-input-focus-border-color: #999;
        }
      }
      .btn-box {
        margin: 0;
        .btn {
          margin: 0 auto 12px;
          padding: 15px 40px;
        }
      }
      .link {
        margin: 0 auto;
        font-size: 12px;
      }
      .link:hover {
        color: #d24529;
      }
    }
  }
}
</style>
