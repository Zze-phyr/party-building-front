<template>
  <div class="probation-member-box">
    <!-- 入党流程标题 -->
    <BigTitle>预备党员的接收、教育考察和转正</BigTitle>
    <!-- 吸收大会会议记录 -->
    <MeetingRecord name="吸收大会会议记录" file-type="AbsorptionMeetingMinutes" />
    <!-- 预备党员转正支部会议记录 -->
    <meetingRecord name="预备党员转正支部会议记录" file-type="FullMemberConversionMinutes" />
    <!-- 入党志愿书（二） -->
    <HandBook
      name="入党志愿书（二）"
      :is-pic-show="true"
      :file-types="['VolunteerLetterTemplateFull', 'VolunteerLetterFull']"
    />
    <!-- 手册二（二） -->
    <HandBook
      name="手册二（二）"
      :file-types="['HandbookSecondTemplateFull', 'HandbookSecondFull']"
    />
  </div>
</template>

<script setup>
import BigTitle from '../components/BigTitle.vue'
import HandBook from '../components/HandBook.vue'
import MeetingRecord from '../components/MeetingRecord.vue'
</script>

<style lang="scss" scoped></style>
