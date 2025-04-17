<template>
  <div class="bg-container">
    <div class="number-login-container">
      <!-- 账号密码登录表单 -->
      <div class="form-box">
        <el-form
          class="form"
          style="max-width: 600px"
          label-width="auto"
          label-position="top"
          size="small"
          :model="numberLoginForm"
          ref="numberLoginFormRef"
          :rules="rules"
        >
          <h2>账号密码登录</h2>
          <el-form-item label="账号" prop="number">
            <el-input v-model="numberLoginForm.phone" placeholder="请输入您的学号/工号" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="numberLoginForm.password"
              type="password"
              placeholder="请输入账号密码"
            />
          </el-form-item>
          <el-form-item class="btn-box">
            <el-button class="btn" @click="submitNumberLogin(numberLoginFormRef)"
              >确认登录</el-button
            >
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
import { userNumberLogin } from '../../api/user'
import { ElMessage } from 'element-plus'

//创建表单实例
const numberLoginFormRef = ref(null)

const numberLoginForm = reactive({
  number: '',
  password: '',
})

//表单校验
const rules = reactive({
  number: [{ required: true, message: '请填写账号', trigger: 'blur' }],
  password: [{ required: true, message: '请填写密码', trigger: 'blur' }],
})

//提交表单
const submitNumberLogin = async (formEl) => {
  if (!formEl) return
  //手动触发校验
  await formEl.validate((valid, fields) => {
    if (valid) {
      userNumberLogin(numberLoginForm).then(({ data }) => {
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

<style scoped>
.bg-container {
  background-color: #d24529;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  .number-login-container {
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
