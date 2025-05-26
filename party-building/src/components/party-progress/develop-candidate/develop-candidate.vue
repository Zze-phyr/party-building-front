<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>文件上传</span>
        </div>
      </template>
      <el-form :model="form" lable-wedth="120px">
        <!-- 文件名称 -->
        <el-form-item lable="文件名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <!-- 上传文件 -->
        <el-form-item lable="上传文件">
          <el-upload
            v-model:file-list="fileList"
            class="upload-demo"
            action="#"
            :http-request="uploadFile"
          >
            <el-button type="primary">Click to upload</el-button>
            <template #tip>
              <div class="el-upload__tip">jpg/png files with a size less than 500KB.</div>
            </template>
          </el-upload>
        </el-form-item>
        <!-- 提交 -->
        <el-form-item lable="提交">
          <el-button type="primary" @click="submit()">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const form = reactive({
  name: '',
  file: '',
})

const fileList = ref([])
</script>

<style lang="less" scoped></style>
