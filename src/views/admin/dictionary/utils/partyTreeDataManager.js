/**
 * 党组织树形数据管理工具类
 * 支持年级 -> 党委 -> 党支部 -> 班级 四层结构
 */
class PartyTreeDataManager {
  constructor() {
    // 树形数据存储
    this.treeData = []

    // 层级配置
    this.levelConfig = {
      grade: {
        level: 0,
        idKey: 'id',
        nameKey: 'name',
        childrenKey: 'committees'
      },
      committee: {
        level: 1,
        idKey: 'committeeId',
        nameKey: 'committeeName',
        relationIdKey: 'id',
        childrenKey: 'branches'
      },
      branch: {
        level: 2,
        idKey: 'branchId',
        nameKey: 'branchName',
        relationIdKey: 'id',
        childrenKey: 'classes'
      },
      class: {
        level: 3,
        idKey: 'classId',
        nameKey: 'className',
        relationIdKey: 'id'
      }
    }
  }

  /**
   * 添加数据到树中
   * @param {String} type - 数据类型: 'grade' | 'committee' | 'branch' | 'class'
   * @param {Object|Array} data - 要添加的数据（单个对象或数组）
   * @param {Object} parent - 父节点信息 { gradeId?, committeeId?, branchId? }
   * @returns {Object} { success: Boolean, message: String, addedCount: Number }
   */
  add(type, data, parent = {}) {
    try {
      // 统一处理为数组
      const dataArray = Array.isArray(data) ? data : [data]

      if (dataArray.length === 0) {
        return { success: false, message: '数据为空', addedCount: 0 }
      }

      let addedCount = 0

      switch (type) {
        case 'grade':
          addedCount = this._addGrades(dataArray)
          break
        case 'committee':
          addedCount = this._addCommittees(dataArray, parent.gradeId)
          break
        case 'branch':
          addedCount = this._addBranches(dataArray, parent.gradeId, parent.committeeId)
          break
        case 'class':
          addedCount = this._addClasses(dataArray, parent.gradeId, parent.committeeId, parent.branchId)
          break
        default:
          return { success: false, message: `未知的数据类型: ${type}`, addedCount: 0 }
      }

      return {
        success: true,
        message: `成功添加 ${addedCount} 条${this._getTypeName(type)}数据`,
        addedCount
      }
    } catch (error) {
      console.error('添加数据失败:', error)
      return { success: false, message: error.message, addedCount: 0 }
    }
  }

  /**
   * 添加年级数据
   */
  _addGrades(grades) {
    let addedCount = 0

    grades.forEach(grade => {
      // 检查是否已存在（通过年级id判断）
      const exists = this.treeData.some(g => g.id === grade.id)

      if (!exists) {
        this.treeData.push({
          ...grade,
          committees: [] // 初始化子节点数组
        })
        addedCount++
      }
    })

    return addedCount
  }

  /**
   * 添加党委数据
   */
  _addCommittees(committees, gradeId) {
    if (!gradeId) {
      throw new Error('添加党委数据时必须指定 gradeId')
    }

    const grade = this.treeData.find(g => g.id === gradeId)
    if (!grade) {
      throw new Error(`未找到年级 ID: ${gradeId}`)
    }

    if (!grade.committees) {
      grade.committees = []
    }

    let addedCount = 0

    committees.forEach(committee => {
      // 检查是否已存在（通过关联id判断）
      const exists = grade.committees.some(c => c.id === committee.id)

      if (!exists) {
        grade.committees.push({
          ...committee,
          branches: [] // 初始化子节点数组
        })
        addedCount++
      }
    })

    return addedCount
  }

  /**
   * 添加党支部数据
   */
  _addBranches(branches, gradeId, committeeId) {
    if (!gradeId || !committeeId) {
      throw new Error('添加党支部数据时必须指定 gradeId 和 committeeId')
    }

    const grade = this.treeData.find(g => g.id === gradeId)
    if (!grade) {
      throw new Error(`未找到年级 ID: ${gradeId}`)
    }

    const committee = grade.committees?.find(c => c.committeeId === committeeId)
    if (!committee) {
      throw new Error(`未找到党委 ID: ${committeeId}`)
    }

    if (!committee.branches) {
      committee.branches = []
    }

    let addedCount = 0

    branches.forEach(branch => {
      // 检查是否已存在（通过关联id判断）
      const exists = committee.branches.some(b => b.id === branch.id)

      if (!exists) {
        committee.branches.push({
          ...branch,
          classes: [] // 初始化子节点数组
        })
        addedCount++
      }
    })

    return addedCount
  }

  /**
   * 添加班级数据
   */
  _addClasses(classes, gradeId, committeeId, branchId) {
    if (!gradeId || !committeeId || !branchId) {
      throw new Error('添加班级数据时必须指定 gradeId、committeeId 和 branchId')
    }

    const grade = this.treeData.find(g => g.id === gradeId)
    if (!grade) {
      throw new Error(`未找到年级 ID: ${gradeId}`)
    }

    const committee = grade.committees?.find(c => c.committeeId === committeeId)
    if (!committee) {
      throw new Error(`未找到党委 ID: ${committeeId}`)
    }

    const branch = committee.branches?.find(b => b.branchId === branchId)
    if (!branch) {
      throw new Error(`未找到党支部 ID: ${branchId}`)
    }

    if (!branch.classes) {
      branch.classes = []
    }

    let addedCount = 0

    classes.forEach(cls => {
      // 检查是否已存在（通过关联id判断）
      const exists = branch.classes.some(c => c.id === cls.id)

      if (!exists) {
        branch.classes.push(cls)
        addedCount++
      }
    })

    return addedCount
  }

  /**
   * 根据关联ID查询数据
   * @param {String} type - 查询类型: 'grade' | 'committee' | 'branch' | 'class'
   * @param {String} relationId - 关联ID（年级的id或其他层级的关联id）
   * @returns {Object|null} 找到的节点数据及其完整路径信息
   */
  find(type, relationId) {
    try {
      switch (type) {
        case 'grade':
          return this._findGrade(relationId)
        case 'committee':
          return this._findCommittee(relationId)
        case 'branch':
          return this._findBranch(relationId)
        case 'class':
          return this._findClass(relationId)
        default:
          console.warn(`未知的查询类型: ${type}`)
          return null
      }
    } catch (error) {
      console.error('查询数据失败:', error)
      return null
    }
  }

  /**
   * 查找年级（通过年级id）
   */
  _findGrade(gradeId) {
    const grade = this.treeData.find(g => g.id === gradeId)
    if (!grade) return null

    return {
      data: grade,
      path: {
        grade: grade
      }
    }
  }

  /**
   * 查找党委（通过年级党委关联id）
   */
  _findCommittee(relationId) {
    for (const grade of this.treeData) {
      const committee = grade.committees?.find(c => c.id === relationId)
      if (committee) {
        return {
          data: committee,
          path: {
            grade: grade,
            committee: committee
          }
        }
      }
    }
    return null
  }

  /**
   * 查找党支部（通过党委党支部关联id）
   */
  _findBranch(relationId) {
    for (const grade of this.treeData) {
      for (const committee of grade.committees || []) {
        const branch = committee.branches?.find(b => b.id === relationId)
        if (branch) {
          return {
            data: branch,
            path: {
              grade: grade,
              committee: committee,
              branch: branch
            }
          }
        }
      }
    }
    return null
  }

  /**
   * 查找班级（通过党支部班级关联id）
   */
  _findClass(relationId) {
    for (const grade of this.treeData) {
      for (const committee of grade.committees || []) {
        for (const branch of committee.branches || []) {
          const cls = branch.classes?.find(c => c.id === relationId)
          if (cls) {
            return {
              data: cls,
              path: {
                grade: grade,
                committee: committee,
                branch: branch,
                class: cls
              }
            }
          }
        }
      }
    }
    return null
  }

  /**
   * 检查是否存在（通过关联ID）
   * @param {String} type - 类型
   * @param {String} relationId - 关联ID
   * @returns {Boolean}
   */
  exists(type, relationId) {
    return this.find(type, relationId) !== null
  }

  /**
   * 根据业务ID查找（党委ID、党支部ID、班级ID）
   * @param {String} type - 查询类型: 'committee' | 'branch' | 'class'
   * @param {String} businessId - 业务ID (committeeId | branchId | classId)
   * @returns {Array} 找到的所有匹配节点（因为同一个党委/党支部/班级可能在多个年级/党委中）
   */
  findByBusinessId(type, businessId) {
    const results = []

    switch (type) {
      case 'committee':
        for (const grade of this.treeData) {
          const committees = grade.committees?.filter(c => c.committeeId === businessId) || []
          committees.forEach(committee => {
            results.push({
              data: committee,
              path: {
                grade: grade,
                committee: committee
              }
            })
          })
        }
        break

      case 'branch':
        for (const grade of this.treeData) {
          for (const committee of grade.committees || []) {
            const branches = committee.branches?.filter(b => b.branchId === businessId) || []
            branches.forEach(branch => {
              results.push({
                data: branch,
                path: {
                  grade: grade,
                  committee: committee,
                  branch: branch
                }
              })
            })
          }
        }
        break

      case 'class':
        for (const grade of this.treeData) {
          for (const committee of grade.committees || []) {
            for (const branch of committee.branches || []) {
              const classes = branch.classes?.filter(c => c.classId === businessId) || []
              classes.forEach(cls => {
                results.push({
                  data: cls,
                  path: {
                    grade: grade,
                    committee: committee,
                    branch: branch,
                    class: cls
                  }
                })
              })
            }
          }
        }
        break
    }

    return results
  }

  /**
   * 在指定父节点下根据业务ID查找
   * @param {String} type - 查询类型
   * @param {String} businessId - 业务ID
   * @param {Object} parent - 父节点信息
   * @returns {Object|null}
   */
  findByBusinessIdInParent(type, businessId, parent = {}) {
    switch (type) {
      case 'committee':
        if (!parent.gradeId) return null
        const grade = this.treeData.find(g => g.id === parent.gradeId)
        const committee = grade?.committees?.find(c => c.committeeId === businessId)
        return committee ? {
          data: committee,
          path: { grade, committee }
        } : null

      case 'branch':
        if (!parent.gradeId || !parent.committeeId) return null
        const g = this.treeData.find(g => g.id === parent.gradeId)
        const c = g?.committees?.find(c => c.committeeId === parent.committeeId)
        const branch = c?.branches?.find(b => b.branchId === businessId)
        return branch ? {
          data: branch,
          path: { grade: g, committee: c, branch }
        } : null

      case 'class':
        if (!parent.gradeId || !parent.committeeId || !parent.branchId) return null
        const gr = this.treeData.find(g => g.id === parent.gradeId)
        const co = gr?.committees?.find(c => c.committeeId === parent.committeeId)
        const br = co?.branches?.find(b => b.branchId === parent.branchId)
        const cls = br?.classes?.find(c => c.classId === businessId)
        return cls ? {
          data: cls,
          path: { grade: gr, committee: co, branch: br, class: cls }
        } : null
    }

    return null
  }

  /**
   * 获取子节点列表
   * @param {String} type - 父节点类型
   * @param {Object} parent - 父节点信息
   * @returns {Array}
   */
  getChildren(type, parent = {}) {
    switch (type) {
      case 'grade':
        // 获取所有年级
        return this.treeData
      case 'committee':
        // 获取指定年级下的所有党委
        const grade = this.treeData.find(g => g.id === parent.gradeId)
        return grade?.committees || []
      case 'branch':
        // 获取指定党委下的所有党支部
        const g = this.treeData.find(g => g.id === parent.gradeId)
        const committee = g?.committees?.find(c => c.committeeId === parent.committeeId)
        return committee?.branches || []
      case 'class':
        // 获取指定党支部下的所有班级
        const gr = this.treeData.find(g => g.id === parent.gradeId)
        const co = gr?.committees?.find(c => c.committeeId === parent.committeeId)
        const branch = co?.branches?.find(b => b.branchId === parent.branchId)
        return branch?.classes || []
      default:
        return []
    }
  }

  /**
   * 获取树形数据
   * @returns {Array}
   */
  getTreeData() {
    return this.treeData
  }

  /**
   * 设置树形数据
   * @param {Array} data
   */
  setTreeData(data) {
    this.treeData = data || []
  }

  /**
   * 清空树形数据
   */
  clear() {
    this.treeData = []
  }

  /**
   * 获取统计信息
   */
  getStatistics() {
    const stats = {
      gradeCount: this.treeData.length,
      committeeCount: 0,
      branchCount: 0,
      classCount: 0
    }

    this.treeData.forEach(grade => {
      stats.committeeCount += grade.committees?.length || 0
      grade.committees?.forEach(committee => {
        stats.branchCount += committee.branches?.length || 0
        committee.branches?.forEach(branch => {
          stats.classCount += branch.classes?.length || 0
        })
      })
    })

    return stats
  }

  /**
   * 获取类型名称（用于提示信息）
   */
  _getTypeName(type) {
    const nameMap = {
      grade: '年级',
      committee: '党委',
      branch: '党支部',
      class: '班级'
    }
    return nameMap[type] || type
  }

  /**
   * 导出为 JSON
   */
  toJSON() {
    return JSON.stringify(this.treeData, null, 2)
  }

  /**
   * 从 JSON 导入
   */
  fromJSON(json) {
    try {
      this.treeData = JSON.parse(json)
      return { success: true, message: '导入成功' }
    } catch (error) {
      return { success: false, message: '导入失败: ' + error.message }
    }
  }
}

// 导出单例
export const partyTreeManager = new PartyTreeDataManager()

// 也可以导出类，允许创建多个实例
export default PartyTreeDataManager
