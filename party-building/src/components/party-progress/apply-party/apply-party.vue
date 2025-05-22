<template>
  <div class="apply-party-box">
    <div class="party-application-box content-box">
      <div class="title">入党申请书上传</div>
    </div>
    <div class="talk-materials-box content-box">
      <div class="title">谈话佐证材料记录</div>
    </div>
  </div>
</template>

<script setup></script>

<style lang="less" scoped>
.apply-party-box {
  .content-box {
    width: 100%;
    height: 310px;
    background-color: #fdfdfd;
    // background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    .title {
      padding-left: 20px;
      height: 40px;
      font-size: 18px;
      line-height: 40px;
      background-color: #f5f5f5;
    }
  }
  .party-application-box {
    margin-bottom: 20px;
  }
}
</style>
