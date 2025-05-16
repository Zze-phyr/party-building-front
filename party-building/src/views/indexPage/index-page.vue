<template>
  <div class="index-container">
    <!-- 轮播图 -->
    <el-row class="slider-box">
      <el-col :span="24">
        <el-carousel class="slider" height="150px" :interval="3000" :duration="1000" :ease="'ease'">
          <el-carousel-item v-for="item in 2" :key="item">
            <div class="img-box">
              <img class="img" src="../../assets/images/common/slider1.png" alt="" />
            </div>
          </el-carousel-item>
        </el-carousel>
      </el-col>
    </el-row>
    <!-- 资讯栏 -->
    <div class="information-box">
      <el-row :gutter="20">
        <!-- 党建新闻 -->
        <el-col class="column partyNews" :span="12">
          <el-row class="title-box">
            <div class="top">
              <div class="yellow"></div>
              <div class="title">党建新闻</div>
              <div class="more">更多</div>
            </div>
            <div class="line"></div>
          </el-row>
          <el-row class="content-box" :gutter="10">
            <el-col v-for="item in 2" :key="item.index" :span="12">
              <div class="img-box">
                <img class="img" src="../../assets/images/common/news1.png" alt="" />
              </div>
              <div class="news-box" v-for="item in 3" :key="item.index">
                <div class="line"></div>
                <div class="text-box">
                  <div class="text">
                    奋力开创党的建设和组织工作新局面——学习《习近平总书记关于党的建设的重要思想概论》
                  </div>
                  <div class="date">2025.03.28</div>
                </div>
              </div>
            </el-col>
            <!-- <el-col :span="12"> </el-col> -->
          </el-row>
        </el-col>
        <!-- 通知公式 -->
        <el-col class="column publicNotice" :span="12">
          <el-row class="title-box">
            <div class="top">
              <div class="yellow"></div>
              <div class="title">通知公示</div>
              <div class="more">更多</div>
            </div>
            <div class="line"></div>
          </el-row>
          <el-row class="content-box" v-for="item in 6" :key="item.index">
            <div class="time-box">
              <div class="date">13</div>
              <div class="line"></div>
              <div class="month">April</div>
            </div>
            <div class="text">湖南科技大学计算机科学与工程学院2025年3月拟确定发展对象名单公示</div>
          </el-row>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-col class="column peopleDaily" :span="6"> </el-col>
        <el-col class="column nationalNews" :span="6"> </el-col>
        <el-col class="column studentStyle" :span="12"> </el-col>
      </el-row> -->
    </div>
  </div>
</template>

<script setup></script>

<style lang="less" scoped>
.index-container {
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 40px;
  .slider-box {
    margin-bottom: 20px;
    .slider {
      .img-box {
        max-width: 1200px;
        height: 150px;
        .img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .information-box {
    .column {
      .title-box {
        display: block;
        margin-bottom: 10px;
        .top {
          display: flex;
          color: #bc0000;
          height: 35px;
          .yellow {
            width: 5px;
            height: 35px;
            background-color: #ffc763;
          }
          .title {
            margin-left: 10px;
            font-weight: bold;
            font-size: 20px;
            line-height: 35px;
          }
          .more {
            margin-left: auto;
            font-size: 13px;
            line-height: 35px;
          }
        }
        .line {
          margin-top: 5px;
          height: 0.5px;
          background-color: #bc0000;
        }
      }
    }
    // 党建新闻
    .partyNews {
      .content-box {
        .img-box {
          max-width: 2900px;
          height: 190px;
          .img {
            width: 100%;
            height: 100%;
          }
        }
        .news-box {
          display: flex;
          margin-top: 10px;
          .line {
            margin-right: 8px;
            width: 2px;
            height: 80px;
            background-color: #bc0000;
          }
          .text-box {
            .text {
              color: #333;
              font-size: 16px;
            }
            .text:hover {
              color: #bc0000;
            }
            .date {
              margin-top: 3px;
              font-size: 12px;
              color: #888;
            }
          }
        }
      }
    }
    // 通知公式
    .publicNotice {
      .content-box {
        display: flex;
        margin-bottom: 8px;
        .time-box {
          margin: 0 15px 5px 0;
          width: 65px;
          height: 65px;
          background-color: #b63434;
          color: #ffc763;
          .date {
            height: 32px;
            line-height: 38px;
            text-align: center;
            font-family: 'Lora', serif;
            font-size: 18px;
            font-weight: bold;
          }
          .month {
            height: 32px;
            line-height: 25px;
            text-align: center;
            font-family: 'Lora', serif;
            font-size: 16px;
            font-weight: bold;
          }
          .line {
            margin: 0px 7px;
            height: 1px;
            width: 51px;
            background-color: #ffc763;
          }
        }
        .text {
          margin: 5px 0;
          font-size: 16px;
          color: #333;
          white-space: normal; /* 确保空格和换行符正常处理 */
          /* 限制宽度，避免内容溢出 */
          max-width: calc(90% - 80px); /* 减去时间盒子的宽度+margin */
        }
        .text:hover {
          color: #bc0000;
        }
      }
    }
  }
}
</style>
