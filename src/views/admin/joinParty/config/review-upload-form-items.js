// 任务数据
const taskData = [
  {
    label: '申请入党',
    children: [
      {
        value: '审核入党申请书',
      },
    ],
  },
  {
    label: '入党积极分子的确定和培养教育',
    children: [
      {
        value: '审核入党积极分子培养联系人',
      },
      {
        value: '审核手册一',
      },
      {
        value: '上传入党积极分子结业证书',
      },
    ],
  },
  {
    label: '发展对象的确定和考察',
    children: [
      {
        value: '审核自传',
      },
      {
        value: '审核入党志愿书（部分）',
      },
      {
        value: '审核手册二',
      },
      {
        value: '上传发展对象结业证书',
      },
    ],
  },
  {
    label: '预备党员的接收',
    children: [
      {
        value: '审核入党志愿书（部分）',
      },
      {
        value: '上传吸收大会会议记录',
      },
      {
        value: '上传与上级党委联系人谈话记录',
      },
      {
        value: '上传入党宣誓会议记录',
      },
    ],
  },
  {
    label: '预备党员的教育考察和转正',
    children: [
      {
        value: '上传支部大会会议记录',
      },
    ],
  },
]

// 表单配置项 - 定义要显示的表单项及其类型
export const getFormItems = (batchData) => [
  {
    id: '1',
    type: 'tree-select',
    label: '阶段任务',
    prop: 'task',
    data: taskData,
    placeholder: '请选择任务',
  },
  {
    id: '2',
    type: 'select',
    label: '批次',
    prop: 'batchId',
    options: batchData,
    placeholder: '请选择批次',
  },
]
