<template>
  <div class="full-party-member-box">
    <!-- 入党流程标题 -->
    <div class="big-title">预备党员的教育考察和转正</div>
    <!-- 支部大会会议记录 -->
    <div class="branch-general-assembly-record-box content-box">
      <div class="title">支部大会会议记录</div>
      <!-- 内容 -->
      <div class="branch-content">
        <div class="record-content">
          <div class="record-item">
            <span class="record-item-title">当事人</span>
            <span class="record-item-content">张三</span>
          </div>
          <div class="record-item">
            <span class="record-item-title">时间</span>
            <span class="record-item-content">2025-3-8</span>
          </div>
          <div class="record-item">
            <span class="record-item-title">主持人</span>
            <span class="record-item-content">李四</span>
          </div>
          <div class="record-item">
            <span class="record-item-title">会议地点</span>
            <span class="record-item-content">一教101</span>
          </div>
          <div class="record-item">
            <span class="record-item-title">参加人员</span>
            <span class="record-item-content">王五、李六、赵三...</span>
          </div>
          <div class="download-box">
            <div class="img-box">
              <img class="img" src="../../../assets/images/icons/photo.png" alt="" />
            </div>
            <div class="download">点击下载查看吸收大会佐证材料</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.full-party-member-box {
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
    // 记录
    .record-content {
      padding: 20px 30px;
      .record-item {
        display: flex;
        font-size: 14px;
        margin-bottom: 15px;
        .record-item-title {
          flex: 1;
          font-size: 15px;
        }
        .record-item-content {
          flex: 9;
          color: #222;
        }
        &::before {
          display: block;
          margin-right: 10px;
          content: '';
          width: 3px;
          height: 25px;
          background-color: #bc0000c0;
        }
        &:last-child {
          margin-bottom: 0;
        }
      }
      //右下角下载
      .download-box {
        display: flex;
        justify-content: flex-end;
        .img-box {
          .img {
            width: 22px;
            height: 22px;
          }
        }
        .download {
          margin-left: 5px;
          font-size: 14px;
          color: #333;
        }
      }
    }
  }
}
</style>
