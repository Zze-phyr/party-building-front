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
        <CompletionCertificate
          file-type="ActivitiesCertificateCompletion"
          name="入党积极分子结业证书"
        />
      </div>
      <!-- 手册一 -->
      <div class="manual-box">
        <HandBook name="手册一" :file-types="['HandbookFirstTemplate', 'HandbookFirst']"></HandBook>
      </div>
    </div>
  </div>
</template>

<script setup>
import BigTitle from '../components/BigTitle.vue'
import cultivateContacts from './cultivate-contacts/cultivate-contacts.vue'
import thinkingReport from './thinking-report/thinking-report.vue'
import HandBook from '../components/HandBook.vue'
import CompletionCertificate from '../components/CompletionCertificate.vue'
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
    }
    .manual-box {
      flex: 9;
    }
  }
}
</style>
