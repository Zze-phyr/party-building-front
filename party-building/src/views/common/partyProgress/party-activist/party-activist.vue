<template>
  <div class="party-active-container">
    <!-- 入党流程标题 -->
    <BigTitle>入党积极分子的确定和培养教育</BigTitle>
    <!-- 入党积极分子培养联系人 -->
    <cultivateContacts />
    <!-- 思想汇报 -->
    <thinkingReport />
    <!-- 结业证书&手册一 -->
    <div class="certificate-manual-box">
      <!-- 结业证书 -->
      <div class="certificate-box">
        <ContentBox>
          <template #title> 入党积极分子结业证书 </template>
          <div class="content">
            <div class="img-box">
              <img
                class="img"
                src="../../../../assets/images/partyProgress/certificate.png"
                alt=""
              />
            </div>
            <div class="time-box">结业时间：2025-02-01</div>
          </div>
        </ContentBox>
      </div>
      <!-- 手册一 -->
      <div class="manual-box">
        <ContentBox>
          <template #title> 手册一 </template>
          <div class="manual-content">
            <div class="content manual-download-box">
              <span class="download-title">手册一模板</span>
              <span class="download">点击下载模板到本地</span>
            </div>
            <div class="content manual-upload-box">
              <span class="upload">点击上传写好的手册一PDF扫描文件</span>
            </div>
          </div>
        </ContentBox>
      </div>
    </div>
  </div>
</template>

<script setup>
import BigTitle from '../components/BigTitle.vue'
import cultivateContacts from './cultivate-contacts/cultivate-contacts.vue'
import ContentBox from '../components/ContentBox.vue'
import thinkingReport from './thinking-report/thinking-report.vue'
</script>

<style lang="scss" scoped>
.party-active-container {
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
