<template>
  <div class="bg-container">
    <div class="phone-login-container">
      <!-- 手机验证码表单 -->
      <div class="form-box">
        <el-form
          class="form"
          style="max-width: 600px"
          label-width="auto"
          label-position="top"
          size="small"
          :model="phoneLoginForm"
          ref="phoneLoginFormRef"
          :rules="rules"
        >
          <h2>手机验证码登录</h2>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="phoneLoginForm.phone" placeholder="请输入您的手机号" />
          </el-form-item>
          <el-form-item label="验证码">
            <el-input v-model="phoneLoginForm.verify" placeholder="请输入验证码">
              <!-- 输入框尾部追加一个span标签 -->
              <template #append>
                <el-button type="warning" :disabled="isDisabled" @click="countdownChange">{{
                  countdown.validText
                }}</el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item class="btn-box">
            <el-button class="btn" @click="submitPhoneLogin(phoneLoginFormRef)">确认登录</el-button>
          </el-form-item>
          <el-form-item>
            <el-link class="link" type="info">暂无帐号，立即注册</el-link>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { userPhoneLogin, userVerification } from '../../api/user'
import { ElMessage } from 'element-plus'

//创建表单实例
const phoneLoginFormRef = ref(null)

const phoneLoginForm = reactive({
  phone: '',
  verify: '',
})

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
  phone: [{ validator: validatePhone, trigger: 'blur' }],
  verify: [{ required: true, message: '请填写验证码', trigger: 'blur' }],
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
  userVerification({ phone: phoneLoginForm.phone }).then(({ data }) => {
    console.log(data, 'data')
    if (data.code === 1) {
      ElMessage.success('发送成功')
    }
  })
}

//提交表单
const submitPhoneLogin = async (formEl) => {
  if (!formEl) return
  //手动触发校验
  await formEl.validate((valid, fields) => {
    if (valid) {
      userPhoneLogin(phoneLoginForm).then(({ data }) => {
        if (data.code === 1) {
          ElMessage.success('登录成功！')
          //将token缓存到浏览器
          localStorage.setItem('party_token', data.data.token)
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
  .phone-login-container {
    .form {
      position: absolute;
      top: 50%;
      left: 60%;
      margin-top: -150px;
      width: 350px;
      height: 300px;
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
