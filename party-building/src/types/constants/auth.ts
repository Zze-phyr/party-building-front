/**
 * @file src/types/auth.ts
 * @description 统一管理用户角色、权限及其相关类型和常量
 */

// 1. 定义角色枚举 (EUserRole)
// 为每个角色提供一个清晰、唯一的英文标识符
export enum EUserRole {
  // 学生侧角色
  APPLICANT = 'Applicant', // 申请入党
  // PARTY_ACTIVIST = 'PartyActivities', // 入党积极分子
  // DEVELOPMENT_TARGET = 'Development', // 发展对象
  // PROBATIONARY_MEMBER = 'ReservePartyMenbers', // 预备党员
  STUDENT = 'Student', // 学生
  TEACHER = 'Teacher', // 教师

  // 管理侧角色
  SYSTEM_ADMIN = 'SystemAdmin', // 系统管理员
  ORGANIZER = 'Organizer', // 组织员、副书记、书记
  BRANCH_SECRETARY = 'BranchSecretary', // 支部书记
  BRANCH_COMMITTEE = 'BranchCommittee', // 支委、支部副书记
}

// 2. 定义权限点枚举 (EPermission)
// 将所有权限字符串定义为枚举成员
export enum EPermission {
  // 通用权限
  COMMON = 'Common',
  STUDENT = 'Student',
  TEACHER = 'Teacher',
  ADMIN = 'Admin',

  // 学生侧流程权限
  APPLICANT = 'Applicant', // 申请入党
  PARTY_ACTIVIST = 'PartyActivities', // 入党积极分子
  DEVELOPMENT_TARGET = 'Development', // 发展对象
  PROBATIONARY_MEMBER = 'ReservePartyMenbers', // 预备党员

  // 管理侧管理权限
  ADMINISTRATOR = 'Administrator', // 系统管理员
  ORGANIZER = 'Organizers', // 组织员、副书记、书记
  BRANCH_SECRETARY = 'BranchSecretary', // 支部书记
  BRANCH_COMMITTEE = 'BranchCommittee', // 支委、支部副书记
}

// 3. 创建角色与权限的映射常量 (Role-Permission Mapping)
// 使用 Record<EUserRole, EPermission[]> 来确保类型安全
// 使用 Object.freeze() 使其在运行时不可变，防止意外修改
export const ROLE_PERMISSIONS_MAP: Record<EUserRole, EPermission[]> = Object.freeze({
  // 学生侧
  [EUserRole.APPLICANT]: [EPermission.COMMON, EPermission.STUDENT, EPermission.APPLICANT],
  [EUserRole.STUDENT]: [EPermission.COMMON, EPermission.STUDENT, EPermission.STUDENT], // 学生
  [EUserRole.TEACHER]: [EPermission.COMMON, EPermission.TEACHER, EPermission.TEACHER], // 教师

  // 管理侧
  [EUserRole.SYSTEM_ADMIN]: [EPermission.ADMIN, EPermission.ADMINISTRATOR, EPermission.ADMINISTRATOR], // 系统管理员
  [EUserRole.ORGANIZER]: [EPermission.ADMIN, EPermission.ORGANIZER, EPermission.ORGANIZER], // 组织员、副书记、书记
  [EUserRole.BRANCH_SECRETARY]: [EPermission.ADMIN, EPermission.BRANCH_SECRETARY, EPermission.BRANCH_SECRETARY], // 支部书记
  [EUserRole.BRANCH_COMMITTEE]: [EPermission.ADMIN, EPermission.BRANCH_COMMITTEE, EPermission.BRANCH_COMMITTEE], // 支委、支部副书记
});


// 4. (可选但推荐) 导出类型别名，方便使用
// TUserRole 将是 'Applicant' | 'SystemAdmin' | ... 等字符串字面量联合类型
export type TUserRole = `${EUserRole}`;
export type TPermission = `${EPermission}`;


// 5. 创建工具函数：根据角色获取权限列表
/**
 * 根据用户角色获取其对应的权限列表
 * @param role - 用户角色 (EUserRole)
 * @returns 该角色的权限数组 (EPermission[])，如果角色未定义则返回空数组
 */
export function getPermissionsByRole(role: EUserRole): EPermission[] {
  return ROLE_PERMISSIONS_MAP[role] || [];
}
