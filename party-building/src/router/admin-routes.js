// TODO:这里的代码有点冗余，一些重复的代码
// 1、代码路由配置过于重复，比如meta.roles, icon, title
// 2、 真正的动态路由是通过函数动态添加的，而不是简单的复制原有定义
export const adminLayoutRoute = {
  name: 'AdminLayout',
  path: '/admin',
  component: () => import('@/views/admin/layout/layout-page.vue'),
  redirect: '/admin/joinParty',
  meta: {
    roles: ['Administrator', 'Organizers', 'BranchSecretary', 'BranchCommittee'], // 管理员角色
  },
  children: [], // 动态添加子路由
}

// 基础路由（所有管理员可见）
export const adminBaseRoutes = [
  {
    name: 'JoinParty',
    path: 'joinParty',
    meta: {
      icon: '&#xe63a;',
      title: '学生入党',
      roles: ['Administrator', 'Organizers', 'BranchSecretary', 'BranchCommittee'],
    },
    children: [
      {
        name: 'ReviewUpload',
        path: 'reviewUpload',
        component: () => import('@/views/admin/joinParty/review-upload.vue'),
        meta: {
          icon: '&#xe600;',
          title: '审核上传',
          roles: ['Administrator', 'Organizers', 'BranchSecretary', 'BranchCommittee'],
        },
      },
      {
        name: 'StateModification',
        path: 'stateModification',
        component: () => import('@/views/admin/joinParty/state-modification.vue'),
        meta: {
          icon: '&#xe644;',
          title: '状态修改',
          roles: ['Administrator', 'Organizers', 'BranchSecretary', 'BranchCommittee'],
        },
      },
    ],
  },
  {
    name: 'FileManage',
    path: 'fileManage',
    meta: {
      icon: '&#xe68f;',
      title: '文件管理',
      roles: ['Administrator', 'Organizers', 'BranchSecretary', 'BranchCommittee'],
    },
    children: [
      {
        name: 'UploadFileTemplate',
        path: 'uploadFileTemplate',
        component: () => import('@/views/admin/fileManage/upload-file-template.vue'),
        meta: {
          icon: '&#xea25;',
          title: '上传文件模板',
          roles: ['Administrator', 'Organizers', 'BranchSecretary', 'BranchCommittee'],
        },
      },
      {
        name: 'CheckFile',
        path: 'checkFile',
        component: () => import('@/views/admin/fileManage/check-file.vue'),
        meta: {
          icon: '&#xe642;',
          title: '查看文件模板',
          roles: ['Administrator', 'Organizers', 'BranchSecretary', 'BranchCommittee'],
        },
      },
    ],
  },
  {
    name: 'BranchConstruction',
    path: 'branchConstruction',
    meta: {
      icon: '&#xe603;',
      title: '支部建设',
      roles: ['Administrator', 'Organizers', 'BranchSecretary', 'BranchCommittee'],
    },
    children: [
      {
        name: 'BasicInformatione',
        path: 'basicInformatione',
        component: () => import('@/views/admin/branchConstruction/basic-information.vue'),
        meta: {
          icon: '&#xe616;',
          title: '基本信息',
          roles: ['Administrator', 'Organizers', 'BranchSecretary', 'BranchCommittee'],
        },
      },
      {
        name: 'OrganizationLifeMeeting',
        path: 'organizationLifeMeeting',
        component: () => import('@/views/admin/branchConstruction/organization-life-meeting.vue'),
        meta: {
          icon: '&#xea26;',
          title: '组织生活会',
          roles: ['Administrator', 'Organizers', 'BranchSecretary', 'BranchCommittee'],
        },
      },
      {
        name: 'Talks',
        path: 'talks',
        component: () => import('@/views/admin/branchConstruction/talks-talks.vue'),
        meta: {
          icon: '&#xe63b;',
          title: '谈心谈话',
          roles: ['Administrator', 'Organizers', 'BranchSecretary', 'BranchCommittee'],
        },
      },
      {
        name: 'MonthlySummary',
        path: 'monthlySummary',
        component: () => import('@/views/admin/branchConstruction/monthly-summary.vue'),
        meta: {
          icon: '&#xe652;',
          title: '每月总结',
          roles: ['Administrator', 'Organizers', 'BranchSecretary', 'BranchCommittee'],
        },
      },
      {
        name: 'PartyBuildingStyle',
        path: 'partyBuildingStyle',
        component: () => import('@/views/admin/branchConstruction/party-building-style.vue'),
        meta: {
          icon: '&#xe7b7;',
          title: '党建风采',
          roles: ['Administrator', 'Organizers', 'BranchSecretary', 'BranchCommittee'],
        },
      },
    ],
  },
  {
    name: 'MessageNotification',
    path: 'messageNotification',
    meta: {
      icon: '&#xe604;',
      title: '消息通知',
      roles: ['Administrator', 'Organizers', 'BranchSecretary', 'BranchCommittee'],
    },
    children: [
      {
        name: 'CheckHistoryNotices',
        path: 'checkHistoryNotices',
        component: () => import('@/views/admin/messageNotification/check-history-notices.vue'),
        meta: {
          icon: '&#xe61a;',
          title: '查看历史通知',
          roles: ['Administrator', 'Organizers', 'BranchSecretary', 'BranchCommittee'],
        },
      },
      {
        name: 'SendNotices',
        path: 'sendNotices',
        component: () => import('@/views/admin/messageNotification/send-notices.vue'),
        meta: {
          icon: '&#xe893;',
          title: '发送通知',
          roles: ['Administrator', 'Organizers', 'BranchSecretary', 'BranchCommittee'],
        },
      },
    ],
  },
  {
    name: 'ChatInformation',
    path: 'chatInformation',
    component: () => import('@/views/admin/chatInformation/chat-information.vue'),
    meta: {
      title: '消息（聊天室）',
      roles: ['Administrator', 'Organizers', 'BranchSecretary', 'BranchCommittee'],
      hidden: true, // 不在导航栏显示
    },
  },
  {
    name: 'PersonalCenter',
    path: 'personalCenter',
    component: () => import('@/views/admin/personalCenter/personal-center.vue'),
    meta: {
      title: '管理员个人中心',
      roles: ['Administrator', 'Organizers', 'BranchSecretary', 'BranchCommittee'],
      hidden: true, // 不在导航栏显示
    },
  },
  {
    // 字典配置
    name: 'Dictionary',
    path: 'dictionary',
    meta: {
      icon: '&#xe607;',
      title: '字典配置',
      roles: ['Administrator', 'Organizers', 'BranchSecretary', 'BranchCommittee'], // 角色权限 管理员 组织员 支部书记
    },
    children: [
      {
        name: 'DictionaryManagement',
        path: 'DictionaryManagement',
        component: () => import('@/views/admin/dictionary/dictionary-management.vue'),
        meta: {
          icon: '&#xe61a;',
          title: '字典管理',
          roles: ['Administrator', 'Organizers', 'BranchSecretary', 'BranchCommittee'],
        },
      },
    ]
  }
];

// 人员管理路由生成函数
const createPersonManageRoutes = (roles, includeAppointLeaderTeam) => {
  const children = [
    {
      name: 'PersonCheck',
      path: 'personCheck',
      component: () => import('@/views/admin/personManage/person-check.vue'),
      meta: {
        icon: '&#xe621;',
        title: '人员查看',
        roles: roles,
      },
    },
    {
      name: 'HistoryLeaderTeam',
      path: 'historyLeaderTeam',
      component: () =>
        import('@/views/admin/personManage/administrator/history-leader-team.vue'),
      meta: {
        icon: '&#xe61a;',
        title: '查看历史领导班子',
        roles: roles,
      },
    },
  ];

  if (includeAppointLeaderTeam) {
    children.push({
      name: 'AppointLeaderTeam',
      path: 'appointLeaderTeam',
      component: () =>
        import('@/views/admin/personManage/administrator/appoint-leader-team.vue'),
      meta: {
        icon: '&#xe9d6;',
        title: '任命新的领导班子',
        roles: ['Administrator', 'Organizers', 'BranchSecretary'],
      },
    });
  }

  return {
    name: 'PersonManage',
    path: 'personManage',
    meta: {
      icon: '&#xe606;',
      title: '人员管理',
      roles: roles,
    },
    children: children,
  };
};

// 一级管理员路由（系统管理员）
export const administratorRoutes = [
  createPersonManageRoutes(['Administrator', 'Organizers', 'BranchSecretary', 'BranchCommittee'], true),
];

// 二级管理员路由（书记，副书记，组织员）
export const organizersRoutes = [
  createPersonManageRoutes(['Administrator', 'Organizers', 'BranchSecretary', 'BranchCommittee'], true),
];

// 三级管理员路由（支部书记）
export const branchSecretaryRoutes = [
  createPersonManageRoutes(['Administrator', 'Organizers', 'BranchSecretary', 'BranchCommittee'], true),
];

// 四级管理员路由（支委，支部副书记）
export const branchCommitteeRoutes = [
  createPersonManageRoutes(['Administrator', 'Organizers', 'BranchSecretary', 'BranchCommittee'], false),
];

// 获取管理员完整路由
export const getAdminRoutes = (thirdRole) => {
  const routes = [...adminBaseRoutes];
  switch (thirdRole) {
    case 'BranchCommittee':
      routes.push(...branchCommitteeRoutes);
      break;
    case 'BranchSecretary':
      routes.push(...branchSecretaryRoutes);
      break;
    case 'Organizers':
      routes.push(...organizersRoutes);
      break;
    case 'Administrator':
      routes.push(...administratorRoutes);
      break;
    default:
      console.log('未知的普通用户类型:', thirdRole);
      return [];
  }
  return routes;
};
