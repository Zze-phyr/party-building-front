<template>
  <div class="userDataBox">
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="info-item">
          <span class="lable">姓名</span>
          <span class="content">
            {{ userInfo.name }}
          </span>
        </div>
        <div class="info-item">
          <span class="lable">民族</span>
          <span class="content">
            {{ userInfo.ethnicity }}
          </span>
        </div>
        <div class="info-item">
          <span class="lable">籍贯</span>
          <span class="content">
            {{ userInfo.origin_place }}
          </span>
        </div>
        <div class="info-item">
          <span class="lable">政治面貌</span>
          <span class="content">
            {{ userInfo.political_status }}
          </span>
        </div>
        <div class="info-item">
          <span class="lable">学号</span>
          <span class="content">
            {{ userInfo.number }}
          </span>
        </div>
        <div class="info-item">
          <span class="lable">邮箱</span>
          <span class="content">
            {{ userInfo.email }}
          </span>
        </div>
        <div class="info-item">
          <span class="lable">性别</span>
          <span class="content">
            {{ userInfo.gender }}
          </span>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="info-item">
          <span class="lable">身份证号</span>
          <span class="content">
            {{ userInfo.id_card }}
          </span>
        </div>
        <div class="info-item">
          <span class="lable">文化程度</span>
          <span class="content">
            {{ userInfo.education_level }}
          </span>
        </div>
        <div class="info-item">
          <span class="lable">出生地</span>
          <span class="content">
            {{ userInfo.birthplace }}
          </span>
        </div>
        <div class="info-item">
          <span class="lable">入团时间</span>
          <span class="content">
            {{ userInfo.join_league_date }}
          </span>
        </div>
        <div class="info-item">
          <span class="lable">QQ</span>
          <span class="content">
            {{ userInfo.qq }}
          </span>
        </div>
        <div class="info-item">
          <span class="lable">电话</span>
          <span class="content">
            {{ userInfo.number }}
          </span>
        </div>
        <div class="info-item">
          <span class="lable">年龄</span>
          <span class="content">
            {{ userInfo.age }}
          </span>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <div class="info-item">
          <span class="lable">年级专业班级</span>
          <span class="content">
            {{ userInfo.grade + userInfo.major + userInfo.sclass }}
          </span>
        </div>
      </el-col>
    </el-row>
    <el-row class="table-box">
      <el-col>
        <div class="title">家庭主要成员情况/主要社会关系情况</div>
        <table class="table">
          <thead>
            <tr>
              <th>姓名</th>
              <th>关系</th>
              <th>政治面貌</th>
              <th>单位职务或职业</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in relationInfo" :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.relationship }}</td>
              <td>{{ item.visage }}</td>
              <td>{{ item.unit_occupation }}</td>
            </tr>
          </tbody>
        </table>
      </el-col>
    </el-row>
  </div>
</template>
reactive
<script setup>
import { reactive } from 'vue'

const userInfo = reactive({
  name: '赫俊涛',
  id_card: 120111200006294512,
  ethnicity: '汉',
  education_level: '高中',
  origin_place: '吉林省长春市',
  birthplace: '吉林省通化市辉南县',
  political_status: '共青团员',
  join_league_date: '2018.11.04',
  number: 1802030213,
  qq: 5372831762,
  email: '5372831762@qq.com',
  phone: 19091742754,
  gender: '女',
  age: 18,
  grade: '23级',
  major: '数据科学与大数据技术',
  sclass: '三班',
})

const relationInfo = reactive([
  {
    name: '赫祥城',
    relationship: '父子',
    visage: '群众',
    unit_occupation: '天津市西青区辛口镇',
  },
  {
    name: '蓟玉霞',
    relationship: '母女',
    visage: '群众',
    unit_occupation: '天津市西青区辛口镇',
  },
  {
    name: '赫祥城',
    relationship: '父子',
    visage: '群众',
    unit_occupation: '天津市西青区辛口镇',
  },
  {
    name: '蓟玉霞',
    relationship: '母女',
    visage: '群众',
    unit_occupation: '天津市西青区辛口镇',
  },
])
</script>

<style lang="less" scoped>
.userDataBox {
  padding: 15px 5px;
  .info-item {
    display: flex;
    margin-bottom: 15px;
    height: 30px;
    line-height: 30px;
    .lable {
      width: 100px;
      text-align: right;
      margin-right: 10px;
      color: #bc0000;
    }
    .content {
      padding: 0 20px;
      width: 65%;
      background-color: #fff;
      border-radius: 15px;
      color: #666;
    }
  }
  .table-box {
    margin-left: 5px;
    .title {
      margin-bottom: 10px;
      color: #bc0000;
    }
    .table {
      margin: 0 auto;
      background-color: rgba(255, 255, 255, 0.8);
      border-collapse: collapse;
      border-radius: 3px;
      th {
        padding: 10px 20px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        color: #666;
      }
      td {
        padding: 10px 40px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        text-align: center;
        color: #666;
      }
    }
  }
}
</style>
