/**
 * 树形数据管理工具类
 * 支持年级 -> 学院 -> 专业 -> 班级 四层结构
 */
class TreeDataManager {
  constructor() {
    // 树形数据存储
    this.treeData = []
    
    // 层级配置
    this.levelConfig = {
      grade: {
        level: 0,
        idKey: 'id',
        nameKey: 'name',
        childrenKey: 'colleges'
      },
      college: {
        level: 1,
        idKey: 'collegeId',
        nameKey: 'collegeName',
        relationIdKey: 'id',
        childrenKey: 'majors'
      },
      major: {
        level: 2,
        idKey: 'majorId',
        nameKey: 'majorName',
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
   * @param {String} type - 数据类型: 'grade' | 'college' | 'major' | 'class'
   * @param {Object|Array} data - 要添加的数据（单个对象或数组）
   * @param {Object} parent - 父节点信息 { gradeId?, collegeId?, majorId? }
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
        case 'college':
          addedCount = this._addColleges(dataArray, parent.gradeId)
          break
        case 'major':
          addedCount = this._addMajors(dataArray, parent.gradeId, parent.collegeId)
          break
        case 'class':
          addedCount = this._addClasses(dataArray, parent.gradeId, parent.collegeId, parent.majorId)
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
          colleges: [] // 初始化子节点数组
        })
        addedCount++
      }
    })

    return addedCount
  }

  /**
   * 添加学院数据
   */
  _addColleges(colleges, gradeId) {
    if (!gradeId) {
      throw new Error('添加学院数据时必须指定 gradeId')
    }

    const grade = this.treeData.find(g => g.id === gradeId)
    if (!grade) {
      throw new Error(`未找到年级 ID: ${gradeId}`)
    }

    if (!grade.colleges) {
      grade.colleges = []
    }

    let addedCount = 0
    
    colleges.forEach(college => {
      // 检查是否已存在（通过关联id判断）
      const exists = grade.colleges.some(c => c.id === college.id)
      
      if (!exists) {
        grade.colleges.push({
          ...college,
          majors: [] // 初始化子节点数组
        })
        addedCount++
      }
    })

    return addedCount
  }

  /**
   * 添加专业数据
   */
  _addMajors(majors, gradeId, collegeId) {
    if (!gradeId || !collegeId) {
      throw new Error('添加专业数据时必须指定 gradeId 和 collegeId')
    }

    const grade = this.treeData.find(g => g.id === gradeId)
    if (!grade) {
      throw new Error(`未找到年级 ID: ${gradeId}`)
    }

    const college = grade.colleges?.find(c => c.collegeId === collegeId)
    if (!college) {
      throw new Error(`未找到学院 ID: ${collegeId}`)
    }

    if (!college.majors) {
      college.majors = []
    }

    let addedCount = 0
    
    majors.forEach(major => {
      // 检查是否已存在（通过关联id判断）
      const exists = college.majors.some(m => m.id === major.id)
      
      if (!exists) {
        college.majors.push({
          ...major,
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
  _addClasses(classes, gradeId, collegeId, majorId) {
    if (!gradeId || !collegeId || !majorId) {
      throw new Error('添加班级数据时必须指定 gradeId、collegeId 和 majorId')
    }

    const grade = this.treeData.find(g => g.id === gradeId)
    if (!grade) {
      throw new Error(`未找到年级 ID: ${gradeId}`)
    }

    const college = grade.colleges?.find(c => c.collegeId === collegeId)
    if (!college) {
      throw new Error(`未找到学院 ID: ${collegeId}`)
    }

    const major = college.majors?.find(m => m.majorId === majorId)
    if (!major) {
      throw new Error(`未找到专业 ID: ${majorId}`)
    }

    if (!major.classes) {
      major.classes = []
    }

    let addedCount = 0
    
    classes.forEach(cls => {
      // 检查是否已存在（通过关联id判断）
      const exists = major.classes.some(c => c.id === cls.id)
      
      if (!exists) {
        major.classes.push(cls)
        addedCount++
      }
    })

    return addedCount
  }

  /**
   * 根据关联ID查询数据
   * @param {String} type - 查询类型: 'grade' | 'college' | 'major' | 'class'
   * @param {String} relationId - 关联ID（年级的id或其他层级的关联id）
   * @returns {Object|null} 找到的节点数据及其完整路径信息
   */
  find(type, relationId) {
    try {
      switch (type) {
        case 'grade':
          return this._findGrade(relationId)
        case 'college':
          return this._findCollege(relationId)
        case 'major':
          return this._findMajor(relationId)
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
   * 查找学院（通过年级学院关联id）
   */
  _findCollege(relationId) {
    for (const grade of this.treeData) {
      const college = grade.colleges?.find(c => c.id === relationId)
      if (college) {
        return {
          data: college,
          path: {
            grade: grade,
            college: college
          }
        }
      }
    }
    return null
  }

  /**
   * 查找专业（通过学院专业关联id）
   */
  _findMajor(relationId) {
    for (const grade of this.treeData) {
      for (const college of grade.colleges || []) {
        const major = college.majors?.find(m => m.id === relationId)
        if (major) {
          return {
            data: major,
            path: {
              grade: grade,
              college: college,
              major: major
            }
          }
        }
      }
    }
    return null
  }

  /**
   * 查找班级（通过专业班级关联id）
   */
  _findClass(relationId) {
    for (const grade of this.treeData) {
      for (const college of grade.colleges || []) {
        for (const major of college.majors || []) {
          const cls = major.classes?.find(c => c.id === relationId)
          if (cls) {
            return {
              data: cls,
              path: {
                grade: grade,
                college: college,
                major: major,
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
   * 根据业务ID查找（学院ID、专业ID、班级ID）
   * @param {String} type - 查询类型: 'college' | 'major' | 'class'
   * @param {String} businessId - 业务ID (collegeId | majorId | classId)
   * @returns {Array} 找到的所有匹配节点（因为同一个学院/专业/班级可能在多个年级/学院中）
   */
  findByBusinessId(type, businessId) {
    const results = []
    
    switch (type) {
      case 'college':
        for (const grade of this.treeData) {
          const colleges = grade.colleges?.filter(c => c.collegeId === businessId) || []
          colleges.forEach(college => {
            results.push({
              data: college,
              path: {
                grade: grade,
                college: college
              }
            })
          })
        }
        break
        
      case 'major':
        for (const grade of this.treeData) {
          for (const college of grade.colleges || []) {
            const majors = college.majors?.filter(m => m.majorId === businessId) || []
            majors.forEach(major => {
              results.push({
                data: major,
                path: {
                  grade: grade,
                  college: college,
                  major: major
                }
              })
            })
          }
        }
        break
        
      case 'class':
        for (const grade of this.treeData) {
          for (const college of grade.colleges || []) {
            for (const major of college.majors || []) {
              const classes = major.classes?.filter(c => c.classId === businessId) || []
              classes.forEach(cls => {
                results.push({
                  data: cls,
                  path: {
                    grade: grade,
                    college: college,
                    major: major,
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
      case 'college':
        if (!parent.gradeId) return null
        const grade = this.treeData.find(g => g.id === parent.gradeId)
        const college = grade?.colleges?.find(c => c.collegeId === businessId)
        return college ? {
          data: college,
          path: { grade, college }
        } : null
        
      case 'major':
        if (!parent.gradeId || !parent.collegeId) return null
        const g = this.treeData.find(g => g.id === parent.gradeId)
        const c = g?.colleges?.find(c => c.collegeId === parent.collegeId)
        const major = c?.majors?.find(m => m.majorId === businessId)
        return major ? {
          data: major,
          path: { grade: g, college: c, major }
        } : null
        
      case 'class':
        if (!parent.gradeId || !parent.collegeId || !parent.majorId) return null
        const gr = this.treeData.find(g => g.id === parent.gradeId)
        const co = gr?.colleges?.find(c => c.collegeId === parent.collegeId)
        const ma = co?.majors?.find(m => m.majorId === parent.majorId)
        const cls = ma?.classes?.find(c => c.classId === businessId)
        return cls ? {
          data: cls,
          path: { grade: gr, college: co, major: ma, class: cls }
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
      case 'college':
        // 获取指定年级下的所有学院
        const grade = this.treeData.find(g => g.id === parent.gradeId)
        return grade?.colleges || []
      case 'major':
        // 获取指定学院下的所有专业
        const g = this.treeData.find(g => g.id === parent.gradeId)
        const college = g?.colleges?.find(c => c.collegeId === parent.collegeId)
        return college?.majors || []
      case 'class':
        // 获取指定专业下的所有班级
        const gr = this.treeData.find(g => g.id === parent.gradeId)
        const co = gr?.colleges?.find(c => c.collegeId === parent.collegeId)
        const major = co?.majors?.find(m => m.majorId === parent.majorId)
        return major?.classes || []
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
      collegeCount: 0,
      majorCount: 0,
      classCount: 0
    }

    this.treeData.forEach(grade => {
      stats.collegeCount += grade.colleges?.length || 0
      grade.colleges?.forEach(college => {
        stats.majorCount += college.majors?.length || 0
        college.majors?.forEach(major => {
          stats.classCount += major.classes?.length || 0
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
      college: '学院',
      major: '专业',
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
export const treeManager = new TreeDataManager()

// 也可以导出类，允许创建多个实例
export default TreeDataManager