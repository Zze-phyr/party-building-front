<template>
  <div class="develop-candidate-container">
    <!-- 入党流程标题 -->
    <BigTitle>发展对象的确定和考察</BigTitle>
    <!-- 确定发展对象会议记录 -->
    <MeetingRecord name="确定发展对象会议记录" file-type="DevConfirmation" />
    <!-- 手册二 -->
    <HandBook
      name="手册二（一）"
      :file-types="['HandbookSecondTemplateDev', 'HandbookSecondDev']"
    />
    <!-- 入党志愿书&结业证书 -->
    <div class="autobiography-certificate-box">
      <!-- 结业证书 -->
      <div class="certificate-box">
        <CompletionCertificate
          name="发展对象结业证书"
          file-type="DevelopmentCertificateCompletion"
        />
      </div>
      <!-- 入党志愿书（一） -->
      <div class="volunteer-letter-box">
        <HandBook
          name="入党志愿书（一）"
          :is-pic-show="true"
          :file-types="['VolunteerLetterTemplateDev', 'VolunteerLetterDev']"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import BigTitle from '../components/BigTitle.vue'
import HandBook from '../components/HandBook.vue'
import CompletionCertificate from '../components/CompletionCertificate.vue'
import MeetingRecord from '../components/MeetingRecord.vue'
</script>

<style lang="scss" scoped>
.develop-candidate-container {
  // 入党志愿书&结业证书
  .autobiography-certificate-box {
    display: flex;
    // 入党志愿书
    .volunteer-letter-box {
      flex: 5;
    }
    // 结业证书
    .certificate-box {
      flex: 3;
      margin-right: 20px;
    }
  }
}
</style>
