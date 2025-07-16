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
          :rules="rules"
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
                  countdown.validText
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
            <el-button class="btn" @click="submitRegister(registerFormRef)">确认注册</el-button>
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
import { userRegister, userVerification } from '@/api/public'
import { ElMessage } from 'element-plus'

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

// 自定义身份证验证函数

// 加权因子
const weightFactor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
// 校验码对应值
const checkCodeList = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']

// 身份证验证函数
const validateIdCard = (rule, value, callback) => {
  const idCardReg = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[0-9Xx]$/
  if (!idCardReg.test(value)) {
    callback(new Error('请输入有效的18位身份证号码'))
    return
  }

  const idCardArray = value.split('')
  let sum = 0
  for (let i = 0; i < 17; i++) {
    sum += parseInt(idCardArray[i]) * weightFactor[i]
  }
  const mod = sum % 11
  const checkCode = idCardArray[17].toUpperCase()
  if (checkCodeList[mod] !== checkCode) {
    callback(new Error('请输入有效的18位身份证号码'))
    return
  }

  callback()
}

// 自定义二次验证密码函数
const validateRepassword = (rule, value, callback) => {
  if (value !== registerForm.password) {
    callback(new Error('两次密码填写不一致'))
  } else {
    callback()
  }
}

let isDisabled = ref(true)
// 自定义手机号验证函数
const validatePhone = (rule, value, callback) => {
  const reg = /^1[3-9]\d{9}$/
  if (reg.test(value)) {
    isDisabled.value = false
    callback()
  } else {
    callback(new Error('请输入有效的电话号码'))
  }
}

//表单校验
const rules = reactive({
  number: [
    { required: true, message: '请填写学号', trigger: 'blur' },
    { min: 10, max: 11, message: '请输入有效的学号', trigger: 'blur' },
  ],
  idCard: [
    { required: true, message: '请填写身份证号', trigger: 'blur' },
    { validator: validateIdCard, trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请填写电话号码', trigger: 'blur' },
    { validator: validatePhone, trigger: 'blur' },
  ],
  verify: [{ required: true, message: '请填写验证码', trigger: 'blur' }],
  password: [
    { required: true, message: '请填写密码', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{11,16}$/,
      message: '密码必须为11-16位，且只能包含数字和英文',
      trigger: 'blur',
    },
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

//发送短信
const countdown = reactive({
  validText: '获取验证码',
  time: 60,
})
let flag = false
const countdownChange = () => {
  //如果已发送,则不重复处理
  if (flag) return
  //判断手机号是否正确

  //倒计时
  let interval = setInterval(() => {
    if (countdown.time <= 0) {
      countdown.time = 60
      countdown.validText = '获取验证码'
      flag = false
      clearInterval(interval)
    } else {
      countdown.time -= 1
      countdown.validText = `剩余${countdown.time}s`
    }
  }, 1000)
  flag = true
  userVerification({ phone: registerForm.phone }).then(({ data }) => {
    console.log(data, 'data')
    if (data.code === 1) {
      ElMessage.success('发送成功')
    }
  })
}

//提交表单
const submitRegister = async (formEl) => {
  if (!formEl) return
  //手动触发校验
  try {
    await formEl.validate()
    const { data } = await userRegister(registerForm)
    if (data.code === 1) {
      ElMessage.success('注册成功，请登录')
    } else {
      ElMessage.error(data.msg)
    }
  } catch (error) {
    console.log(error)
    ElMessage.error('注册失败，请重试')
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
    .form {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -260px;
      margin-left: -200px;
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
        font-size: 12px;
      }
      .link:hover {
        color: #d24529;
      }
    }
  }
}
</style>
