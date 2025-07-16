<template>
  <div class="userDataBox">
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="info-item">
          <span class="lable">姓名</span>
          <span class="content">
            {{ userStore.userInfo.name }}
          </span>
        </div>
        <div class="info-item">
          <span class="lable">民族</span>
          <span class="content">
            {{ userStore.userInfo.ethnicity }}
          </span>
        </div>
        <div class="info-item">
          <span class="lable">籍贯</span>
          <span class="content">
            {{ userStore.userInfo.originPlace }}
          </span>
        </div>
        <div class="info-item">
          <span class="lable">政治面貌</span>
          <span class="content">
            {{ userStore.userInfo.politicalStatus }}
          </span>
        </div>
        <div class="info-item">
          <span class="lable">学号</span>
          <span class="content">
            {{ userStore.userInfo.number }}
          </span>
        </div>
        <div class="info-item">
          <span class="lable">邮箱</span>
          <span class="content">
            {{ userStore.userInfo.email }}
          </span>
        </div>
        <div class="info-item">
          <span class="lable">性别</span>
          <span class="content">
            {{ userStore.userInfo.gender === 1 ? '女' : '男' }}
          </span>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="info-item">
          <span class="lable">身份证号</span>
          <span class="content">
            {{ userStore.userInfo.idCard }}
          </span>
        </div>
        <div class="info-item">
          <span class="lable">文化程度</span>
          <span class="content">
            {{ userStore.userInfo.educationLevel }}
          </span>
        </div>
        <div class="info-item">
          <span class="lable">出生地</span>
          <span class="content">
            {{ userStore.userInfo.birthplace }}
          </span>
        </div>
        <div class="info-item">
          <span class="lable">入团时间</span>
          <span class="content">
            {{ userStore.userInfo.joinLeagueDate }}
          </span>
        </div>
        <div class="info-item">
          <span class="lable">QQ</span>
          <span class="content">
            {{ userStore.userInfo.qq }}
          </span>
        </div>
        <div class="info-item">
          <span class="lable">电话</span>
          <span class="content">
            {{ userStore.userInfo.phone }}
          </span>
        </div>
        <div class="info-item">
          <span class="lable">年龄</span>
          <span class="content">
            {{ userStore.userInfo.age }}
          </span>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <div class="info-item">
          <span class="lable">年级专业班级</span>
          <span class="content">
            {{ userStore.userInfo.grade + userStore.userInfo.major + userStore.userInfo.sclass }}
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
            <tr v-for="item in userStore.userInfo.mainRelationships" :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.relationship }}</td>
              <td>{{ item.visage }}</td>
              <td>{{ item.unitOccupation }}</td>
            </tr>
          </tbody>
        </table>
      </el-col>
    </el-row>
  </div>
</template>
reactive
<script setup>
import { useUserStore } from '@/stores'

const userStore = useUserStore()
</script>

<style lang="scss" scoped>
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
