// 管理员接口
import request from '@/utils/network/request'

export const adminApi = {
  //查看批次
  getBatch: (data) => {
    return request.get(`/admin/batch/get?page=${data.page}&pageSize=${data.pageSize}&statusEnum=${data.statusEnum}&name=${data.name || ''}`);
  },

  // 添加批次
  addBatch: (data) => {
    return request.post(`/admin/batch/add?name=${data.name}`);
  },

  // 修改批次
  updateBatch: (data) => {
    return request.patch(`/admin/batch/update`, data);
  },

  // 删除批次
  deleteBatch: (data) => {
    return request.delete(`/admin/batch/delete?id=${data}`);
  },

  // 查看年级数据
  getGradeDictionaryList: (data) => {
    return request.get(`/admin/dictionary/grade/get?page=${data.page}&pageSize=${data.pageSize}&statusEnum=${data.statusEnum}&name=${data.name || ''}`);
  },

  // 添加年级数据
  addGrade: (data) => {
    console.log(data)
    return request.post(`/admin/dictionary/grade/add?grade=${data}`)
  },

  // 修改年级数据
  updateGrade: (data) => {
    return request.patch('/admin/dictionary/grade/update', data)
  },

  // 查看学院数据
  getCollegeDictionaryList: (data) => {
    return request.get(`/admin/dictionary/college/get?statusEnum=${data.statusEnum}${data.name ? `&name=${data.name}` : ''}`);
  },

  // 添加学院数据
  addCollege: (data) => {
    return request.post(`/admin/dictionary/college/add?name=${data}`)
  },

  // 修改学院数据
  updateCollege: (data) => {
    return request.patch('/admin/dictionary/college/update', data)
  },

  // 查看专业数据
  getMajorDictionaryList: (data) => {
    return request.get(`/admin/dictionary/major/get?page=${data.page}&pageSize=${data.pageSize}&statusEnum=${data.statusEnum}&name=${data.name || ''}`);
  },

  // 添加专业数据
  addMajor: (data) => {
    return request.post(`/admin/dictionary/major/add?name=${data}`)
  },

  // 修改专业数据
  updateMajor: (data) => {
    return request.patch('/admin/dictionary/major/update', data)
  },

  // 查看班级数据
  getClassDictionaryList: (data) => {
  return request.get(`/admin/dictionary/class/getClasses?statusEnum=${data.statusEnum}&name=${data.name || ''}`);
  },

  // 添加班级数据
  addClass: (data) => {
    return request.post(`/admin/dictionary/class/add?name=${data}`)
  },

  // 修改班级数据
  updateClass: (data) => {
    return request.patch('/admin/dictionary/class/update', data)
  },

  // 查看党委数据
  getPartyDictionaryList: (data) => {
    return request.get(`/admin/dictionary/partyCommittee/get?statusEnum=${data.statusEnum}&name=${data.name || ''}`);
  },

  // 添加党委数据
  addParty: (data) => {
    return request.post('/admin/dictionary/partyCommittee/add', data)
  },

  // 修改党委数据
  updateParty: (data) => {
    return request.patch('/admin/dictionary/partyCommittee/update', data)
  },

  // 查看党支部数据
  getPartyBranchDictionaryList: (data) => {
    return request.get(`/admin/dictionary/partyBranch/get?statusEnum=${data.statusEnum}&name=${data.name || ''}`);
  },

  // 添加党支部数据
  addPartyBranch: (data) => {
    return request.post('/admin/dictionary/partyBranch/add', data)
  },
  // 修改党支部数据
  updatePartyBranch: (data) => {
    return request.patch('/admin/dictionary/partyBranch/update', data)
  },

  // 查看年级学院关联数据
  getGradeCollege(gradeId) {
    return request.get(`/admin/dictionary/relations/grade-college/get/${gradeId}`);
  },

  // 添加年级学院关联数据
  addGradeCollege: (data) => {
    return request.post(`/admin/dictionary/relations/grade-college/add`, data)
  },

  // 修改年级学院关联数据
  updateGradeCollege(params) {
    return request.patch(`/admin/dictionary/relations/grade-college/update`, params);
  },

  // 查看学院专业关联数据
  getCollegeMajor(gradeCollegeId) {
    return request.get(`/admin/dictionary/relations/college-major/get/${gradeCollegeId}`);
  },

  // 添加学院专业关联数据
  addCollegeMajor(params) {
    return request.post(`/admin/dictionary/relations/college-major/add`, params);
  },

  // 修改学院专业关联数据
  updateCollegeMajor(params) {
    return request.patch(`/admin/dictionary/relations/college-major/update`, params);
  },

  // 查看专业班级关联数据
  getMajorClassByCollegeMajorId(collegeMajorId) {
    return request.get(`/admin/dictionary/relations/major-class/get/${collegeMajorId}`);
  },

  // 添加专业班级关联数据
  addMajorClass(params) {
    return request.post(`/admin/dictionary/relations/major-class/add`, params);
  },

  // 修改专业班级关联数据
  updateMajorClass(params) {
    return request.patch(`/admin/dictionary/relations/major-class/update`, params);
  },

  // 添加年级党委关联数据
  addGradeCommittee(params) {
    return request.post(`/admin/dictionary/grade-committee/add`, params);
  },

  // 修改年级党委关联数据
  updateGradeCommittee(params) {
    return request.patch(`/admin/dictionary/grade-committee/update`, params);
  },

  // 添加班级党支部关联数据
  addCommitteeBranch(params) {
    return request.post(`/admin/dictionary/committee-branch/add`, params);
  },

  // 修改班级党支部关联数据
  updateCommitteeBranch(params) {
    return request.post(`/admin/dictionary/committee-branch/update`, params);
  },

  // 添加党支部班级关联数据
  addBranchClass(params) {
    return request.post(`/admin/dictionary/branch-class/add`, params);
  },

  // 修改党支部班级关联数据
  updateBranchClass(params) {
    return request.post(`/admin/dictionary/branch-class/update`, params);
  },

  // 获取入党状态列表
  getJoinPartyStatusList() {
    return request.get(`/admin/joinPartyStatus/get`);
  },

  // 获得当前批次的用户列表
  getUsersByBatch(data) {
    return request.get(`/admin/batch/${data.batchId}/users?page=${data.page}&pageSize=${data.pageSize}`);
  },

  // 添加用户到当前批次
  addUsersToBatch(data) {
    return request.post(`/admin/batch/${data.batchId}/users`, data.params);
  },

  // 从当前批次移除用户
  removeUsersFromBatch(data) {
    return request.delete(`/admin/batch/${data.batchId}/users`, data.params);
  }

  
}
