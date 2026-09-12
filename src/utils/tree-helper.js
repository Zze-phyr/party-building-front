/**
 * 构建树节点
 * @param {Object} data - 节点数据
 * @returns {Object} 树节点对象
 */
export function buildTreeNode(data) {
  return {
    id: data.id,
    label: data.label,
    level: data.level,
    type: data.type,
    originId: data.originId, // 原始数据ID（如 collegeId, majorId, classId）
    relationId: data.relationId, // 关联表ID（用于加载子级）
    parentId: data.parentId,
    status: data.status,
    isLeaf: data.isLeaf || false,
    childCount: data.childCount || 0,
    children: data.children || []
  }
}

/**
 * 防抖函数
 * @param {Function} func - 需要防抖的函数
 * @param {Number} delay - 延迟时间(ms)
 * @returns {Function} 防抖后的函数
 */
export function debounce(func, delay = 300) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

/**
 * 节流函数
 * @param {Function} func - 需要节流的函数
 * @param {Number} delay - 延迟时间(ms)
 * @returns {Function} 节流后的函数
 */
export function throttle(func, delay = 300) {
  let timer = null
  return function (...args) {
    if (timer) return
    timer = setTimeout(() => {
      func.apply(this, args)
      timer = null
    }, delay)
  }
}

/**
 * 扁平化树结构
 * @param {Array} tree - 树形数据
 * @param {String} childrenKey - 子节点key
 * @returns {Array} 扁平化数组
 */
export function flattenTree(tree, childrenKey = 'children') {
  const result = []
  
  function traverse(nodes, parent = null) {
    nodes.forEach(node => {
      result.push({ ...node, parent })
      if (node[childrenKey] && node[childrenKey].length > 0) {
        traverse(node[childrenKey], node)
      }
    })
  }
  
  traverse(tree)
  return result
}

/**
 * 查找树节点
 * @param {Array} tree - 树形数据
 * @param {Function} predicate - 查找条件
 * @param {String} childrenKey - 子节点key
 * @returns {Object|null} 找到的节点
 */
export function findTreeNode(tree, predicate, childrenKey = 'children') {
  for (const node of tree) {
    if (predicate(node)) {
      return node
    }
    if (node[childrenKey] && node[childrenKey].length > 0) {
      const found = findTreeNode(node[childrenKey], predicate, childrenKey)
      if (found) return found
    }
  }
  return null
}

/**
 * 过滤树节点
 * @param {Array} tree - 树形数据
 * @param {Function} predicate - 过滤条件
 * @param {String} childrenKey - 子节点key
 * @returns {Array} 过滤后的树
 */
export function filterTree(tree, predicate, childrenKey = 'children') {
  return tree.reduce((acc, node) => {
    if (predicate(node)) {
      const newNode = { ...node }
      if (node[childrenKey] && node[childrenKey].length > 0) {
        newNode[childrenKey] = filterTree(node[childrenKey], predicate, childrenKey)
      }
      acc.push(newNode)
    } else if (node[childrenKey] && node[childrenKey].length > 0) {
      const filtered = filterTree(node[childrenKey], predicate, childrenKey)
      if (filtered.length > 0) {
        acc.push({ ...node, [childrenKey]: filtered })
      }
    }
    return acc
  }, [])
}

/**
 * 获取节点路径
 * @param {Array} tree - 树形数据
 * @param {String} targetId - 目标节点ID
 * @param {String} childrenKey - 子节点key
 * @returns {Array} 节点路径
 */
export function getNodePath(tree, targetId, childrenKey = 'children') {
  const path = []
  
  function traverse(nodes, currentPath) {
    for (const node of nodes) {
      const newPath = [...currentPath, node]
      if (node.id === targetId) {
        path.push(...newPath)
        return true
      }
      if (node[childrenKey] && node[childrenKey].length > 0) {
        if (traverse(node[childrenKey], newPath)) {
          return true
        }
      }
    }
    return false
  }
  
  traverse(tree, [])
  return path
}