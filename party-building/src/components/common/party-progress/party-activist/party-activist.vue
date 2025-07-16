<template>
  <div class="party-active-container">
    <!-- 入党流程标题 -->
    <div class="big-title">入党积极分子的确定和培养教育</div>
    <!-- 入党积极分子培养联系人 -->
    <div class="cultivate-contacts-box content-box">
      <div class="title">入党积极分子培养联系人信息填写</div>
      <el-row class="form-box" :gutter="40">
        <el-col class="form-one" :span="12">
          <el-form
            style="max-width: 600px"
            :model="cultivateContactForm"
            label-width="auto"
            label-position="left"
            size="small"
            ref="cultivateContactFormRef"
            :rules="cultivateContactRules"
          >
            <el-form-item label="培养联系人姓名" prop="name">
              <el-input v-model="cultivateContactForm.name" />
            </el-form-item>
            <el-form-item label="培养联系人" prop="number">
              <el-radio-group v-model="cultivateContactForm.number">
                <el-radio border value="1">培养联系人1</el-radio>
                <el-radio border value="2">培养联系人2</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="党龄" prop="paryAge">
              <el-input-number
                v-model="cultivateContactForm.paryAge"
                :min="1"
                :max="150"
                size="small"
                controls-position="right"
              />
            </el-form-item>
            <el-form-item label="政治面貌" prop="visage">
              <el-select v-model="cultivateContactForm.visage" placeholder="请选择">
                <el-option label="群众" value="群众" />
                <el-option label="共青团员" value="共青团员" />
                <el-option label="中共党员" value="中共党员" />
              </el-select>
            </el-form-item>
            <el-form-item label="单位及职务" prop="unitOccupation">
              <el-input v-model="cultivateContactForm.unitOccupation" />
            </el-form-item>
            <div class="btn-box">
              <el-button @click="cultivateContactSubmnit(cultivateContactFormRef)"
                >确定保存</el-button
              >
            </div>
          </el-form>
        </el-col>
        <el-col class="form-two" :span="12">
          <el-form
            style="max-width: 600px"
            :model="cultivateContactForm"
            label-width="auto"
            label-position="left"
            size="small"
          >
            <el-form-item label="培养联系人姓名">
              <el-input v-model="cultivateContactForm.name" />
            </el-form-item>
            <el-form-item label="培养联系人">
              <el-radio-group v-model="cultivateContactForm.number">
                <el-radio border value="1">培养联系人1</el-radio>
                <el-radio border value="2">培养联系人2</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="党龄">
              <el-input-number
                v-model="cultivateContactForm.paryAge"
                :min="1"
                :max="150"
                size="small"
                controls-position="right"
              />
            </el-form-item>
            <el-form-item label="政治面貌">
              <el-select v-model="cultivateContactForm.visage" placeholder="请选择">
                <el-option label="群众" value="群众" />
                <el-option label="共青团员" value="共青团员" />
                <el-option label="中共党员" value="中共党员" />
              </el-select>
            </el-form-item>
            <el-form-item label="单位及职务">
              <el-input v-model="cultivateContactForm.unitOccupation" />
            </el-form-item>
            <div class="btn-box">
              <el-button @click="cultivateContactSubmnit()">确定保存</el-button>
            </div>
          </el-form></el-col
        >
      </el-row>
    </div>
    <!-- 思想汇报 -->
    <div class="thinking-report-box content-box">
      <div class="title">每三月一次思想汇报</div>
      <el-row class="report-content-box">
        <el-col class="upload-box content" :span="12">
          <div class="img-box">
            <img
              class="img"
              src="../../../assets/images/partyProgress/thought-report-1.png"
              alt=""
            />
          </div>
          <div class="upload load">点击提交思想汇报</div>
        </el-col>
        <el-col class="download-box content" :span="12">
          <div class="img-box">
            <img
              class="img"
              src="../../../assets/images/partyProgress/thought-report-2.png"
              alt=""
            />
          </div>
          <div class="download load">点击查看思想汇报</div>
        </el-col>
      </el-row>
    </div>
    <!-- 结业证书&手册一 -->
    <div class="certificate-manual-box">
      <!-- 结业证书 -->
      <div class="certificate-box content-box">
        <div class="title">入党积极分子结业证书</div>
        <div class="content">
          <div class="img-box">
            <img class="img" src="../../../assets/images/partyProgress/certificate.png" alt="" />
          </div>
          <div class="time-box">结业时间：2025-02-01</div>
        </div>
      </div>
      <!-- 手册一 -->
      <div class="manual-box content-box">
        <div class="title">手册一</div>
        <div class="manual-content">
          <div class="content manual-download-box">
            <span class="download-title">手册一模板</span>
            <span class="download">点击下载模板到本地</span>
          </div>
          <div class="content manual-upload-box">
            <span class="upload">点击上传写好的手册一PDF扫描文件</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { addNurtureContacts } from '@/api/common'

// 入党积极分子培养联系人
const cultivateContactForm = reactive({
  commonUserId: '', //用户id
  name: '', //培养联系人姓名
  number: '1', //培养联系人顺序
  paryAge: 2, //党龄
  visage: '', //政治面貌
  unitOccupation: '', //单位及职务
})

const cultivateContactFormRef = ref(null)

//表单校验
const cultivateContactRules = reactive({
  name: [{ required: true, message: '请填写', trigger: 'blur' }],
  number: [{ required: true, message: '请填写', trigger: 'blur' }],
  paryAge: [{ required: true, message: '请填写', trigger: 'blur' }],
  visage: [{ required: true, message: '请填写', trigger: 'blur' }],
  unitOccupation: [{ required: true, message: '请填写', trigger: 'blur' }],
})

// 提交入党积极分子培养联系人表单
const cultivateContactSubmnit = async (formEl) => {
  if (!formEl) return
  try {
    await formEl.validate()
    cultivateContactForm.number = parseInt(cultivateContactForm.number)
    const { data: cultivateContactData } = await addNurtureContacts(cultivateContactForm)
    if (cultivateContactData.code === 1) {
      ElMessage.success('提交成功')
    } else {
      ElMessage.error(cultivateContactData.msg)
    }
  } catch (error) {
    console.log(error)
    ElMessage.error('提交失败，请重试')
  }
}
</script>

<style lang="scss" scoped>
.party-active-container {
  .big-title {
    margin-bottom: 20px;
    width: 100%;
    background-color: #f2c3b2;
    border-radius: 8px;
    height: 40px;
    font-size: 20px;
    line-height: 40px;
    text-align: center;
    color: #bc0000da;
  }
  .content-box {
    width: 100%;
    background-color: #fff;
    margin-bottom: 10px;
    border-radius: 8px;
    overflow: hidden;
    .title {
      padding-left: 20px;
      height: 40px;
      font-size: 18px;
      line-height: 40px;
      background-color: #fbfbfb;
    }
  }
  // 入党积极分子培养联系人
  .cultivate-contacts-box {
    .form-box {
      padding: 30px 50px 20px;
      .el-form-item {
        :deep(.el-input) {
          --el-input-focus-border-color: #bc000062;
        }
        .el-radio.is-bordered.is-checked {
          border-color: #bc000062;
        }
        :deep(.el-radio__input.is-checked .el-radio__inner) {
          background: #bc0000a8;
          border-color: #bc0000a8;
        }
        :deep(.el-radio__input.is-checked + .el-radio__label) {
          color: #bc0000a8;
        }
        :deep(.el-input-number__decrease:hover) {
          color: #bc0000a8;
        }
        :deep(.el-input-number__increase:hover) {
          color: #bc0000a8;
        }
        :deep(.el-select__wrapper.is-focused) {
          box-shadow: 0 0 0 1px #bc000062 inset;
        }
      }
      .el-form-item--small {
        margin-bottom: 20px;
      }
      .btn-box {
        // margin-bottom: 12px;
        text-align: center;
        :deep(.el-button) {
          background-color: #bc0000;
          color: #fff;
          &:active {
            background-color: #bc0000a8;
          }
          &:hover {
            background-color: #bc0000a8;
          }
        }
      }
    }
  }
  // 思想汇报
  .thinking-report-box {
    .report-content-box {
      margin: 10px 0;
      .content {
        display: flex;
        height: 60px;
        justify-content: center;
        align-items: center;
        .img-box {
          .img {
            width: 55px;
            height: 55px;
          }
        }
        .load {
          margin-left: 30px;
          font-size: 14px;
        }
        .load:hover {
          color: #bc0000a8;
        }
      }
      .upload-box {
        border-right: 1px #eee solid;
      }
      .download-box {
        border-left: 1px #eee solid;
      }
    }
  }
  // 结业证书&手册一
  .certificate-manual-box {
    display: flex;
    // 结业证书
    .certificate-box {
      flex: 7;
      margin-right: 20px;
      .content {
        .img-box {
          margin: 10px 20px;
          .img {
            width: 100%;
            aspect-ratio: 3/2; /* 宽:高 = 3:2 */
            object-fit: cover; /* 图片填充方式 */
          }
        }
        .time-box {
          margin-bottom: 10px;
          height: 20px;
          line-height: 20px;
          text-align: center;
          font-size: 12px;
          color: #333;
        }
      }
    }
    // 手册一
    .manual-box {
      flex: 9;
      .manual-content {
        padding: 30px;
        .content {
          display: flex;
          font-size: 14px;
          &::before {
            display: block;
            margin-right: 10px;
            content: '';
            width: 3px;
            height: 25px;
            background-color: #bc0000c0;
          }
        }
        .manual-download-box {
          margin-bottom: 15px;
          .download {
            margin-left: 5px;
            color: #999;
          }
          .download:hover {
            color: #bc0000c0;
          }
        }
        .manual-upload-box .upload:hover {
          color: #bc0000c0;
        }
      }
    }
  }
}
</style>
