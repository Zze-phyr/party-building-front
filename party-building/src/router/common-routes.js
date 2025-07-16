// 普通用户

export const commonLayoutRoute = {
  name: 'CommonLayout',
  path: '/common',
  component: () => import('@/views/common/layout/layout-page.vue'),
  redirect: '/common/index',
  meta: {
    requiresAuth: true,
    roles: ['Student', 'Teacher', 'Applicant'],
  },
  children: [], // 动态添加子路由
}

// 基础路由（所有普通用户可见）
export const commonBaseRoutes = [
  {
    name: 'CommonIndex',
    path: 'index',
    component: () => import('@/views/common/indexPage/index-page.vue'),
    meta: {
      title: '首页',
      roles: ['Student', 'Teacher', 'Applicant'],
    },
  },
  {
    name: 'BranchConstruction',
    path: 'branchConstruction',
    component: () => import('@/views/common/branchConstruction/branch-construction.vue'),
    meta: {
      title: '支部建设',
      roles: ['Student', 'Teacher', 'Applicant'],
    },
  },
  {
    name: 'PartyBuildingStyle',
    path: 'partyBuildingStyle',
    component: () => import('@/views/common/partyBuildingStyle/party-building-style.vue'),
    meta: {
      title: '党建风采',
      roles: ['Student', 'Teacher', 'Applicant'],
    },
  },
  {
    name: 'NotificationCenter',
    path: 'notificationCenter',
    component: () => import('@/views/common/notificationCenter/notification-center.vue'),
    meta: {
      title: '通知中心',
      roles: ['Student', 'Teacher', 'Applicant'],
    },
  },
  {
    name: 'PersonalCenter',
    path: 'personalCenter',
    component: () => import('@/views/common/personalCenter/personal-center.vue'),
    meta: {
      title: '个人中心',
      roles: ['Student', 'Teacher', 'Applicant'],
      hidden: true, // 不在主导航显示
    },
  },
]

// 学生专属路由
export const studentRoutes = []

// 教师专属路由
export const teacherRoutes = []

// 申请者专属路由
export const applicantRoutes = [
  {
    name: 'PartyProgress',
    path: 'partyProgress',
    component: () => import('@/views/common/partyProgress/party-progress.vue'),
    meta: {
      title: '入党流程',
      roles: ['Applicant'],
    },
  },
]

// 获取普通用户完整路由
export const getCommonRoutes = (secondaryRole) => {
  const routes = [...commonBaseRoutes]

  switch (secondaryRole) {
    case 'Applicant':
      routes.push(...applicantRoutes)
      break
    case 'Student':
      routes.push(...studentRoutes)
      break
    case 'Teacher':
      routes.push(...teacherRoutes)
      break
    default:
      console.warn('未知的普通用户类型:', secondaryRole)
      return []
  }

  return routes
}
