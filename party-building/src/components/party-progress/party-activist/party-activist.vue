<template>
  <div class="party-active-container">
    <!-- 入党积极分子培养联系人 -->
    <div class="cultivate-contacts-box content-box">
      <div class="title">入党积极分子培养联系人信息填写</div>
      <el-row class="form-box" :gutter="40">
        <el-col class="form-one" :span="12">
          <el-form
            style="max-width: 600px"
            :model="formOne"
            label-width="auto"
            label-position="left"
            size="small"
          >
            <el-form-item label="培养联系人姓名">
              <el-input v-model="formOne.name" />
            </el-form-item>
            <el-form-item label="培养联系人">
              <el-radio-group v-model="formOne.order">
                <el-radio border value="1">培养联系人1</el-radio>
                <el-radio border value="2">培养联系人2</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="党龄">
              <el-input-number
                v-model="formOne.pary_age"
                :min="1"
                :max="150"
                size="small"
                controls-position="right"
                @change="handleChange"
              />
            </el-form-item>
            <el-form-item label="政治面貌">
              <el-select v-model="formOne.visage" placeholder="请选择">
                <el-option label="群众" value="群众" />
                <el-option label="共青团员" value="共青团员" />
                <el-option label="中共党员" value="中共党员" />
              </el-select>
            </el-form-item>
            <el-form-item label="单位及职务">
              <el-input v-model="formOne.unit_occupation" />
            </el-form-item>
            <div class="btn-box">
              <el-button>确定保存</el-button>
            </div>
          </el-form>
        </el-col>
        <el-col class="form-two" :span="12">
          <el-form
            style="max-width: 600px"
            :model="formOne"
            label-width="auto"
            label-position="left"
            size="small"
          >
            <el-form-item label="培养联系人姓名">
              <el-input v-model="formOne.name" />
            </el-form-item>
            <el-form-item label="培养联系人">
              <el-radio-group v-model="formOne.order">
                <el-radio border value="1">培养联系人1</el-radio>
                <el-radio border value="2">培养联系人2</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="党龄">
              <el-input-number
                v-model="formOne.pary_age"
                :min="1"
                :max="150"
                size="small"
                controls-position="right"
                @change="handleChange"
              />
            </el-form-item>
            <el-form-item label="政治面貌">
              <el-select v-model="formOne.visage" placeholder="请选择">
                <el-option label="群众" value="群众" />
                <el-option label="共青团员" value="共青团员" />
                <el-option label="中共党员" value="中共党员" />
              </el-select>
            </el-form-item>
            <el-form-item label="单位及职务">
              <el-input v-model="formOne.unit_occupation" />
            </el-form-item>
            <div class="btn-box">
              <el-button>确定保存</el-button>
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
import { reactive } from 'vue'

// 入党积极分子培养联系人

const formOne = reactive({
  userId: '',
  name: '',
  order: '',
  pary_age: '',
  visage: '',
  unit_occupation: '',
})

const handleChange = (value) => {
  console.log(typeof value, value) // Element UI 会自动转为数字
  formOne.name.value = String(value) // 手动转回字符串
}
</script>

<style lang="less" scoped>
.party-active-container {
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
        margin-bottom: 8px;
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
