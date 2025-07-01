<template>
  <div class="develop-candidate-container">
    <!-- 入党流程标题 -->
    <div class="big-title">发展对象的确定和考察</div>
    <!-- 自传&结业证书 -->
    <!-- 自传 -->
    <div class="autobiography-certificate-box">
      <div class="autobiography-box content-box">
        <div class="title">上传自传</div>
        <div class="content">
          <div class="load-box">
            <div class="img-box">
              <img class="img" src="../../../assets/images/partyProgress/pdf.png" alt="" />
            </div>
            <div class="load">点击下载自传填写要求</div>
          </div>
          <div class="load-box">
            <div class="img-box">
              <img class="img" src="../../../assets/images/partyProgress/pdf.png" alt="" />
            </div>
            <div class="load">点击上传我的自传（需上传PDF扫描版）</div>
          </div>
        </div>
      </div>
      <!-- 结业证书 -->
      <div class="certificate-box content-box">
        <div class="title">发展对象结业证书</div>
        <div class="content">
          <div class="img-box">
            <img class="img" src="../../../assets/images/partyProgress/certificate.png" alt="" />
          </div>
          <div class="time-box">结业时间：2025-02-01</div>
        </div>
      </div>
    </div>
    <!-- 入党志愿书 -->
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
    <!-- 手册二 -->
    <div class="manual-box content-box">
      <div class="title">手册二</div>
      <div class="manual-content">
        <div class="content manual-download-box">
          <span class="download-title">手册二模板</span>
          <span class="download">点击下载模板到本地</span>
        </div>
        <div class="content manual-upload-box">
          <span class="upload">点击上传写好的手册二PDF扫描文件</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style lang="less" scoped>
.develop-candidate-container {
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
  // 自传&结业证书
  .autobiography-certificate-box {
    display: flex;
    // 自传
    .autobiography-box {
      flex: 5;
      margin-right: 20px;
      .content {
        padding: 30px;
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
    // 结业证书
    .certificate-box {
      flex: 3;
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
  // 手册二
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
</style>
