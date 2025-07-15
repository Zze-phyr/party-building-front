<template>
  <div class="probation-member-box">
    <!-- 入党流程标题 -->
    <div class="big-title">预备党员的接收</div>
    <!-- 吸收大会会议记录 -->
    <div class="absorb-general-assembly-record-box content-box">
      <div class="title">吸收大会会议记录</div>
      <!-- 内容 -->
      <div class="absorb-content">
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
    <!-- 与上级党委联系人谈话记录（后续写入 入党志愿书） -->
    <div class="contact-conversation-record-box content-box">
      <div class="title">与上级党委联系人谈话记录</div>
      <!-- 内容 -->
      <div class="absorb-content">
        <div class="record-content">
          <div class="record-item">
            <span class="record-item-title">被谈话人</span>
            <span class="record-item-content">张三</span>
          </div>
          <div class="record-item">
            <span class="record-item-title">谈话人：</span>
            <span class="record-item-content">李四</span>
          </div>
          <div class="record-item">
            <span class="record-item-title">谈话地点</span>
            <span class="record-item-content">一教101</span>
          </div>
          <div class="record-item">
            <span class="record-item-title">主要内容</span>
            <span class="record-item-content upload">
              我们党是根据自己的纲领和章程，按照民主集中制的原则，将全体党员组织起来的统一整体。党的组织自上而下分为三个层次：党的中央组织、党的地方组织和党的基层组织。
            </span>
          </div>
          <div class="download-box">
            <div class="img-box">
              <img class="img" src="../../../assets/images/icons/photo.png" alt="" />
            </div>
            <div class="download">点击下载查看联系人谈话记录</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 入党宣誓会议记录 -->
    <div class="join-party-oath-record-box content-box">
      <div class="title">入党宣誓会议记录</div>
      <!-- 内容 -->
      <div class="join-party-oath-content">
        <div class="record-content">
          <div class="record-item">
            <span class="record-item-title">宣誓人</span>
            <span class="record-item-content">张三</span>
          </div>
          <div class="record-item">
            <span class="record-item-title">记录人</span>
            <span class="record-item-content">李四</span>
          </div>
          <div class="record-item">
            <span class="record-item-title">宣誓地点</span>
            <span class="record-item-content">逸夫楼101</span>
          </div>
          <div class="record-item">
            <span class="record-item-content">点击上传宣誓会议照片(需上传PDF扫描版)</span>
          </div>
          <div class="download-box">
            <div class="img-box">
              <img class="img" src="../../../assets/images/icons/photo.png" alt="" />
            </div>
            <div class="download">点击下载查看入党宣誓会议记录</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 上传入党志愿书（全部） -->
    <div class="party-application-box content-box">
      <div class="title">上传入党志愿书（部分）</div>
      <div class="content">
        <div class="load-box">
          <div class="img-box">
            <img class="img" src="../../../assets/images/partyProgress/word-pic.png" alt="" />
          </div>
          <div class="load">点击下载入党志愿书填写模板</div>
        </div>
        <div class="load-box">
          <div class="img-box">
            <img class="img" src="../../../assets/images/partyProgress/pdf.png" alt="" />
          </div>
          <div class="load">点击上传我的入党志愿书（需上传PDF扫描版）</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.probation-member-box {
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

  // 入党志愿书
  .party-application-box {
    .content {
      padding: 20px 30px;
      .load-box {
        display: flex;
        height: 60px;
        align-items: center;
        .img-box {
          .img {
            width: 35px;
            height: 35px;
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
    }
  }
}
</style>
