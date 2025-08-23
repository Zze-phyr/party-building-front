// 用户资料
import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

export const useInfoStore = defineStore('info', () => {
  const hasGetInfo = ref(false) // 是否已获取过个人信息

  //用户详细信息
  const userInfo = reactive({
    name: '赫俊涛', //姓名
    number: '2318160169', //学号
    idCard: '120111200006294512', //身份证号
    branch: '本科生第一党支部', //所属支部
    ethnicity: '汉', //民族
    educationLevel: '', //文化程度
    originPlace: '吉林省长春市', //籍贯
    birthplace: '吉林省通化市辉南县', //出生地
    politicalStatus: '', //政治面貌
    joinLeagueDate: '2018-11-04', //入团时间
    qq: '5372831762', //QQ
    email: '5372831762@qq.com', //电子邮箱
    phone: '19091742754', //手机号
    gender: 1, //性别0男1女
    age: null, //年龄
    grade: '23级', //年级
    major: '数据科学与大数据技术', //专业
    sclass: '三班', //班级
    status: 0, //状态，-1为政审不通过
    mainRelationships: [
      {
        mainId: 0, //所属用户id
        name: '赫祥城', //姓名
        relationship: '父子', //关系
        visage: '群众', //政治面貌
        unitOccupation: '天津市西青区辛口镇', //单位职务或职业
        role: 1, //类别,1家庭主要成员,0主要社会关系
      },
      {
        mainId: 0,
        name: '蓟玉霞',
        relationship: '母女',
        visage: '群众',
        unitOccupation: '天津市西青区辛口镇',
        role: 1,
      },
      {
        mainId: 0, //所属用户id
        name: '赫祥城', //姓名
        relationship: '父子', //关系
        visage: '群众', //政治面貌
        unitOccupation: '天津市西青区辛口镇', //单位职务或职业
        role: 0, //类别,1家庭主要成员,0主要社会关系
      },
      {
        mainId: 0,
        name: '蓟玉霞',
        relationship: '母女',
        visage: '群众',
        unitOccupation: '天津市西青区辛口镇',
        role: 0,
      },
    ],
  })

  //获取用户信息
  // const getUserInfo = (data) => {}

  //用户登录登出infoStore需要做的相关操作
  const loginInfo = (data) => {
    userInfo.name = data
    hasGetInfo.value = false
  }
  const logoutInfo = () => {
    hasGetInfo.value = false
  }

  return {
    hasGetInfo,
    userInfo,
    // getUserInfo,
    loginInfo,
    logoutInfo,
  }
})
