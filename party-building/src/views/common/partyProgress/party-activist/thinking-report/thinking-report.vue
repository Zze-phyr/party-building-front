<template>
  <div class="thinking-report-box">
    <ContentBox>
      <template #title> 每三月一次思想汇报 </template>
      <el-row class="report-content-box">
        <el-col class="upload-box content" :span="12">
          <div class="img-box">
            <img
              class="img"
              src="../../../../../assets/images/partyProgress/thought-report-1.png"
              alt=""
            />
          </div>
          <div class="upload load">点击提交思想汇报</div>
        </el-col>
        <el-col class="download-box content" :span="12">
          <div class="img-box">
            <img
              class="img"
              src="../../../../../assets/images/partyProgress/thought-report-2.png"
              alt=""
            />
          </div>
          <div class="download load">点击查看思想汇报</div>
        </el-col>
      </el-row>
    </ContentBox>
  </div>
</template>

<script setup>
import ContentBox from '../../components/ContentBox.vue'
</script>

<style lang="scss" scoped>
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
        color: #bc00009e;
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
</style>
