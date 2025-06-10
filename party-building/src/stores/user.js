import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'

export const useUserStore = defineStore(
  'user', //该 store 的唯一标识
  () => {
    // 用户信息
    const token = ref('111')
    const permission = ref(['Common', 'Applicant', 'DevelopmentOver'])
    const userId = ref(null)
    const hasAddedRoutes = ref(false) // 是否动态添加路由
    const dynamicRoutes = ref([]) // 存储动态路由信息
    const hasGetInfo = ref(false) // 是否已获取过个人信息

    //用户详细信息
    const userInfo = reactive({
      name: '赫俊涛', //姓名
      number: '2318160169', //学号
      idCard: '120111200006294512', //身份证号
      branch: '本科生第一党支部', //所属支部
      ethnicity: '汉', //民族
      educationLevel: '高中', //文化程度
      originPlace: '吉林省长春市', //籍贯
      birthplace: '吉林省通化市辉南县', //出生地
      politicalStatus: '共青团员', //政治面貌
      joinLeagueDate: '2018-11-04', //入团时间
      qq: '5372831762', //QQ
      email: '5372831762@qq.com', //电子邮箱
      phone: '19091742754', //手机号
      gender: 1, //性别0男1女
      age: 18, //年龄
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

    //家庭主要成员情况role1
    // const homeRelationInfo = reactive([
    //   {
    //     mainId: 0, //所属用户id
    //     name: '赫祥城', //姓名
    //     relationship: '父子', //关系
    //     visage: '群众', //政治面貌
    //     unitOccupation: '天津市西青区辛口镇', //单位职务或职业
    //     role: 1, //类别
    //   },
    // ])

    //主要社会关系情况role0
    // const societyRelationInfo = reactive([
    //   {
    //     mainId: 0,
    //     name: '蓟玉霞',
    //     relationship: '母女',
    //     visage: '群众',
    //     unitOccupation: '天津市西青区辛口镇',
    //     role: 0,
    //   },
    //   {
    //     mainId: 0,
    //     name: '蓟玉霞',
    //     relationship: '母女',
    //     visage: '群众',
    //     unitOccupation: '天津市西青区辛口镇',
    //     role: 0,
    //   },
    // ])

    // 操作
    //登录成功
    const login = (newToken, newPermission, newUserId, newName) => {
      token.value = newToken
      permission.value = newPermission
      userId.value = newUserId
      userInfo.name = newName
      hasAddedRoutes.value = false // 重置路由状态
    }

    //用户注销或 token 过期时，需要重置所有与认证相关的状态
    const logout = () => {
      token.value = ''
      permission.value = []
      userId.value = null
      hasAddedRoutes.value = false
      dynamicRoutes.value = []
      hasGetInfo.value = false
      window.location.reload() // 强制刷新重置路由
    }

    //响应式获取permission
    const getPermission = computed(() => {
      return permission.value
    })

    // 动态路由
    const setDynamicRoutes = (routes) => {
      dynamicRoutes.value = routes
    }

    const getDynamicRoutes = computed(() => {
      return dynamicRoutes.value
    })

    //获取用户信息
    // const getUserInfo = (data) => {}

    return {
      token,
      permission,
      userId,
      hasAddedRoutes,
      dynamicRoutes,
      login,
      logout,
      setDynamicRoutes,
      getDynamicRoutes,
      getPermission,
      hasGetInfo,
      userInfo,
      // getUserInfo,
      // homeRelationInfo,
      // societyRelationInfo,
    }
  },
  // {
  //   // 配置项，启用数据持久化功能
  //   persist: true, // 启用持久化
  // },
)
