// 管理员

export const adminLayoutRoute = {
  name: 'AdminLayout',
  path: '/admin',
  component: () => import('@/views/admin/layout/layout-page.vue'),
  redirect: '/admin/joinParty',
  meta: {
    roles: ['Administrator', 'Organizers', 'BranchSecretary', 'BranchCommittee'],
  },
  children: [], // 动态添加子路由
}

// 基础路由（所有管理员可见）
export const adminBaseRoutes = [
  {
    name: 'JoinParty',
    path: 'joinParty',
    meta: {
      title: '学生入党',
      roles: ['Administrator', 'Organizers', 'BranchSecretary', 'BranchCommittee'],
    },
    children: [
      {
        name: 'ReviewUpload',
        path: 'reviewUpload',
        component: () => import('@/views/admin/joinParty/review-upload.vue'),
        meta: {
          title: '审核上传',
          roles: ['Administrator', 'Organizers', 'BranchSecretary', 'BranchCommittee'],
        },
      },
      {
        name: 'StateModification',
        path: 'stateModification',
        component: () => import('@/views/admin/joinParty/state-modification.vue'),
        meta: {
          title: '状态修改',
          roles: ['Administrator', 'Organizers', 'BranchSecretary', 'BranchCommittee'],
        },
      },
    ],
  },
]

// 一级管理员路由
export const branchCommitteeRoutes = []

// 二级管理员路由
export const branchSecretaryRoutes = []

// 三级管理员路由
export const organizersRoutes = []

// 四级管理员路由
export const administratorRoutes = []

// 获取管理员完整路由
export const getAdminRoutes = (secondaryRole) => {
  const routes = [...adminBaseRoutes]
  switch (secondaryRole) {
    case 'BranchCommittee':
      routes.push(...branchCommitteeRoutes)
      break
    case 'BranchSecretary':
      routes.push(...branchSecretaryRoutes)
      break
    case 'Organizers':
      routes.push(...organizersRoutes)
      break
    case 'Administrator':
      routes.push(...administratorRoutes)
      break
    default:
      console.warn('未知的普通用户类型:', secondaryRole)
      return []
  }
  return routes
}
