import { adminApi } from '@/api/admin'
import { buildTreeNode } from './tree-helper'

/**
 * 创建学院体系数据加载器
 */
export function createAcademicLoader() {
  return {
    // 加载年级数据
    async loadGrades() {
      try {
        const response = await adminApi.getGradeDictionaryList()
        console.log('年级数据原始响应:', response)
        
        // 根据接口格式，数据在 response.data.data.records 中
        const records = response?.data?.data?.records || response?.data?.records || response?.data?.data || []
        
        if (!Array.isArray(records)) {
          console.error('年级数据不是数组:', records)
          return []
        }
        
        console.log('年级数据records:', records)
        
        const result = records
          .filter(grade => grade.status === 1) // 只显示启用的年级
          .map(grade => buildTreeNode({
            id: `grade-${grade.id}`,
            label: grade.name || `${grade.grade}级`,
            level: 0,
            type: 'grade',
            originId: grade.id,
            status: grade.status,
            isLeaf: false,
            childCount: 0 // 初始为0，会在加载子节点后更新
          }))
        
        console.log('年级数据处理结果:', result)
        return result
      } catch (error) {
        console.error('加载年级数据失败:', error)
        throw error
      }
    },

    // 加载年级-学院关联数据
    async loadGradeCollege(gradeNode) {
      try {
        console.log('加载学院数据，年级节点:', gradeNode)
        console.log('年级originId:', gradeNode.originId)
        
        const response = await adminApi.getGradeCollege(gradeNode.originId)
        console.log('学院数据原始响应:', response)
        
        // 数据在 response.data.data 中，是数组
        const colleges = response?.data?.data || response?.data || []
        
        if (!Array.isArray(colleges)) {
          console.error('学院数据不是数组:', colleges)
          return []
        }
        
        console.log('学院原始数据:', colleges)
        
        // 过滤启用的学院
        const result = colleges
          .filter(item => item.status === 1)
          .map(item => buildTreeNode({
            id: `college-${item.id}`,
            label: item.collegeName || item.name,
            level: 1,
            type: 'college',
            originId: item.collegeId,
            relationId: item.id, // 关联表ID，用于加载下级数据
            parentId: gradeNode.id,
            status: item.status,
            isLeaf: false,
            childCount: 0
          }))
        
        console.log('学院数据处理结果:', result)
        return result
        
      } catch (error) {
        console.error('加载学院数据失败:', error)
        throw error
      }
    },

    // 加载学院-专业关联数据
    async loadCollegeMajor(collegeNode) {
      try {
        console.log('加载专业数据，学院节点:', collegeNode)
        console.log('学院relationId:', collegeNode.relationId)
        
        const response = await adminApi.getCollegeMajor(collegeNode.relationId)
        console.log('专业数据原始响应:', response)
        
        const majors = response?.data?.data || response?.data || []
        
        if (!Array.isArray(majors)) {
          console.error('专业数据不是数组:', majors)
          return []
        }
        
        console.log('专业原始数据:', majors)
        
        const result = majors
          .filter(item => item.status === 1)
          .map(item => buildTreeNode({
            id: `major-${item.id}`,
            label: item.majorName || item.name,
            level: 2,
            type: 'major',
            originId: item.majorId,
            relationId: item.id,
            parentId: collegeNode.id,
            status: item.status,
            isLeaf: false,
            childCount: 0
          }))
        
        console.log('专业数据处理结果:', result)
        return result
        
      } catch (error) {
        console.error('加载专业数据失败:', error)
        throw error
      }
    },

    // 加载专业-班级关联数据
    async loadMajorClass(majorNode) {
      try {
        console.log('加载班级数据，专业节点:', majorNode)
        console.log('专业relationId:', majorNode.relationId)
        
        const response = await adminApi.getMajorClassByCollegeMajorId(majorNode.relationId)
        console.log('班级数据原始响应:', response)
        
        const classes = response?.data?.data || response?.data || []
        
        if (!Array.isArray(classes)) {
          console.error('班级数据不是数组:', classes)
          return []
        }
        
        console.log('班级原始数据:', classes)
        
        const result = classes
          .filter(item => item.status === 1)
          .map(item => buildTreeNode({
            id: `class-${item.id}`,
            label: item.className || item.name,
            level: 3,
            type: 'class',
            originId: item.classId,
            relationId: item.id,
            parentId: majorNode.id,
            status: item.status,
            isLeaf: true,
            childCount: 0
          }))
        
        console.log('班级数据处理结果:', result)
        return result
        
      } catch (error) {
        console.error('加载班级数据失败:', error)
        throw error
      }
    }
  }
}

/**
 * 创建党组织体系数据加载器
 */
export function createPartyLoader() {
  return {
    // 加载年级数据
    async loadGrades() {
      try {
        const response = await adminApi.getGradeDictionaryList()
        console.log('党组织-年级数据原始响应:', response)
        
        const records = response?.data?.data?.records || response?.data?.records || response?.data?.data || []
        
        if (!Array.isArray(records)) {
          console.error('年级数据不是数组:', records)
          return []
        }
        
        console.log('党组织-年级原始数据:', records)
        
        const result = records
          .filter(grade => grade.status === 1) // 只显示启用的年级
          .map(grade => buildTreeNode({
            id: `grade-party-${grade.id}`,
            label: grade.name || `${grade.grade}级`,
            level: 0,
            type: 'grade',
            originId: grade.id,
            status: grade.status,
            isLeaf: false,
            childCount: 0
          }))
        
        console.log('党组织-年级数据处理结果:', result)
        return result
          
      } catch (error) {
        console.error('加载年级数据失败:', error)
        throw error
      }
    },

    // 加载年级-党委关联数据
    async loadGradeCommittee(gradeNode) {
      try {
        console.log('loadGradeCommittee - 待实现', gradeNode)
        // TODO: 调用实际接口
        // const response = await adminApi.getGradeCommittee(gradeNode.originId)
        // const committees = response?.data?.data || response?.data || []
        // return committees.filter(item => item.status === 1).map(...)
        return []
      } catch (error) {
        console.error('加载党委数据失败:', error)
        throw error
      }
    },

    // 加载党委-党支部关联数据
    async loadCommitteeBranch(committeeNode) {
      try {
        console.log('loadCommitteeBranch - 待实现', committeeNode)
        // TODO: 调用实际接口
        // const response = await adminApi.getCommitteeBranch(committeeNode.relationId)
        // const branches = response?.data?.data || response?.data || []
        // return branches.filter(item => item.status === 1).map(...)
        return []
      } catch (error) {
        console.error('加载党支部数据失败:', error)
        throw error
      }
    },

    // 加载党支部-班级关联数据
    async loadBranchClass(branchNode) {
      try {
        console.log('loadBranchClass - 待实现', branchNode)
        // TODO: 调用实际接口
        // const response = await adminApi.getBranchClass(branchNode.relationId)
        // const classes = response?.data?.data || response?.data || []
        // return classes.filter(item => item.status === 1).map(...)
        return []
      } catch (error) {
        console.error('加载班级数据失败:', error)
        throw error
      }
    }
  }
}