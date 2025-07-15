// 普通用户
export const userLayoutRoute = {
  name: 'UserLayout',
  path: '/user',
  component: () => import('@/views/layout/UserLayout.vue'),
  redirect: '/user/index',
  meta: {
    requiresAuth: true,
    roleType: 'user', // 标记为用户路由
  },
  children: [], // 动态添加子路由
}

// 基础路由（所有普通用户可见）
export const userBaseRoutes = [
  {
    name: 'UserIndex',
    path: 'index',
    component: () => import('@/views/user/index-page.vue'),
    meta: {
      title: '用户首页',
      icon: 'home',
      roles: ['Student', 'Teacher', 'Applicant'],
    },
  },
  {
    name: 'PartyProgress',
    path: 'party-progress',
    component: () => import('@/views/user/PartyProgress.vue'),
    meta: {
      title: '入党进度',
      icon: 'progress',
      roles: ['Student', 'Applicant'],
    },
  },
  {
    name: 'PersonalCenter',
    path: 'personal-center',
    component: () => import('@/views/user/PersonalCenter.vue'),
    meta: {
      title: '个人中心',
      icon: 'user',
      roles: ['Student', 'Teacher', 'Applicant'],
      hidden: true, // 不在主导航显示
    },
  },
]

// 学生专属路由
export const studentRoutes = [
  {
    name: 'StudyMaterials',
    path: 'study-materials',
    component: () => import('@/views/user/student/StudyMaterials.vue'),
    meta: {
      title: '学习资料',
      icon: 'book',
      roles: ['Student'],
    },
  },
]

// 教师专属路由
export const teacherRoutes = [
  {
    name: 'ClassManagement',
    path: 'class-management',
    component: () => import('@/views/user/teacher/ClassManagement.vue'),
    meta: {
      title: '班级管理',
      icon: 'team',
      roles: ['Teacher'],
    },
  },
  {
    name: 'TaskApproval',
    path: 'task-approval',
    component: () => import('@/views/user/teacher/TaskApproval.vue'),
    meta: {
      title: '任务审批',
      icon: 'check-circle',
      roles: ['Teacher'],
    },
  },
]

// 申请者专属路由
export const applicantRoutes = [
  {
    name: 'ApplicationStatus',
    path: 'application-status',
    component: () => import('@/views/user/applicant/ApplicationStatus.vue'),
    meta: {
      title: '申请状态',
      icon: 'form',
      roles: ['Applicant'],
    },
  },
]

// 获取普通用户完整路由
export const getUserRoutes = (secondaryRole) => {
  const routes = [...userBaseRoutes]

  switch (secondaryRole) {
    case 'Student':
      routes.push(...studentRoutes)
      break
    case 'Teacher':
      routes.push(...teacherRoutes)
      break
    case 'Applicant':
      routes.push(...applicantRoutes)
      break
    default:
      console.warn('未知的普通用户类型:', secondaryRole)
  }

  return routes
}
