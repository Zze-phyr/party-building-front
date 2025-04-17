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
          <h2>用户注册</h2>
          <el-form-item label="学号" prop="studentId">
            <el-input v-model="registerForm.studentId" placeholder="请输入您的学号" />
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
            <el-link class="link" type="info">已有帐号，选择登录</el-link>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { userRegister, userVerification } from '../../api/user'
import { ElMessage } from 'element-plus'

//创建表单实例
const registerFormRef = ref(null)

const registerForm = reactive({
  studentId: '',
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
  if (!value) {
    callback(new Error('请填写电话号码'))
  } else {
    const reg = /^1[3-9]\d{9}$/
    if (reg.test(value)) {
      isDisabled.value = false
      callback()
    } else {
      callback(new Error('请输入有效的电话号码'))
    }
  }
}

//表单校验
const rules = reactive({
  studentId: [
    { required: true, message: '请填写学号', trigger: 'blur' },
    { min: 10, max: 11, message: '请输入有效的学号', trigger: 'blur' },
  ],
  idCard: [
    { required: true, message: '请填写身份证号', trigger: 'blur' },
    { validator: validateIdCard, trigger: 'blur' },
  ],
  phone: [{ validator: validatePhone, trigger: 'blur' }],
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
      countdown.validText = `获取验证码`
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
  await formEl.validate((valid, fields) => {
    if (valid) {
      userRegister(registerForm).then(({ data }) => {
        if (data.code === 1) {
          ElMessage.success('注册成功，请登录')
        }
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>

<style lang="less" scoped>
.bg-container {
  background-color: #d24529;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  .register-container {
    .form {
      position: absolute;
      top: 50%;
      left: 60%;
      margin-top: -283px;
      width: 400px;
      height: 586px;
      padding: 10px 20px;
      background-color: #fff;
      border-radius: 10px;
      h2 {
        text-align: center;
      }
      .btn-box {
        margin: 0;
        .btn {
          margin: 0 auto 12px;
        }
      }
      .link {
        margin: 0 auto;
      }
    }
  }
}
</style>
