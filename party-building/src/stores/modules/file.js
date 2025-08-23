// 文件状态
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

// -2 未提交
// 0  待审核
// 1  审核通过
// -1 审核不通过

export const useFileStore = defineStore('file', () => {
  //入党申请书
  const JoinPartyApplication = reactive({
    fileId: '12345',
    status: 0,
    attachText: '',
    attachTime: '',
    returnText:
      '111首次申请入党时间错误，正确时间应该修改为：2025/09/16，请在2025年11月26日前修改为正确的时间，如未修改，后果自负！2025/09/16，请在2025年11月26日前修改为正确的时间，2025/09/16，请在2025年11月26日前修改为正确的时间，2025/09/16，请在2025年11月26日前修改为正确的时间，首次申请入党时间错误，正确时间应该修改为：2025/09/16，请在2025年11月',
    fileName: '',
  })

  //第一次谈话
  const ConversationFirst = reactive({
    fileId: null,
    status: -2,
    attachText: '',
    attachTime: '',
    returnText: '',
    fileName: '',
  })

  //思想汇报
  const ThoughtDebriefing = reactive({
    fileId: null,
    status: -2,
    attachText: '',
    attachTime: '',
    returnText: '',
    fileName: '',
  })

  //考察报告
  const InvestigationReport = reactive({
    fileId: null,
    status: -2,
    attachText: '',
    attachTime: '',
    returnText: '',
    fileName: '',
  })

  //手册一
  const HandbookFirst = reactive({
    fileId: null,
    status: -2,
    attachText: '',
    attachTime: '',
    returnText: '',
    fileName: '',
  })

  //手册二
  const HandbookSecond = reactive({
    fileId: null,
    status: -2,
    attachText: '',
    attachTime: '',
    returnText: '',
    fileName: '',
  })

  //入党志愿书
  const VolunteerLetter = reactive({
    fileId: null,
    status: -2,
    attachText: '',
    attachTime: '',
    returnText: '',
    fileName: '',
  })

  // 培养联系人
  const NurtureContacts = ref([
    {
      id: 0,
      name: '张三老师',
      partyAge: 8,
      visage: '中共党员',
      unitOccupation: '教授',
      number: 1,
      confirm: -2,
      attachText: '请修改',
    },
    {
      id: 1,
      name: '李四老师',
      partyAge: 10,
      visage: '中共党员',
      unitOccupation: '副教授',
      number: 2,
      confirm: -2,
      attachText: '请修改',
    },
  ])

  // 替换培养联系人信息
  const replaceNurtureContacts = (newNurtureContacts) => {
    NurtureContacts.value = newNurtureContacts
  }

  // 更新培养联系人信息
  const updateNurtureContacts = (data) => {
    NurtureContacts.value.forEach((item, index) => {
      item.name = data[index].name
      item.number = data[index].number
      item.partyAge = data[index].partyAge
      item.visage = data[index].visage
      item.unitOccupation = data[index].unitOccupation
    })
  }

  //修改文件信息
  const modifyFileInfo = (fileType, newData) => {
    fileType.fileId = newData.fileId
    fileType.status = newData.status
    fileType.attachText = newData.achText
    fileType.attachTime = newData.achTime
    fileType.returnText = newData.returnText
    fileType.fileName = newData.fileName
  }

  const modifyFileId = (fileType, data) => {
    fileType.fileId = data
  }

  const modifyFileStatus = (fileType, data) => {
    fileType.status = data
  }

  return {
    JoinPartyApplication,
    ConversationFirst,
    ThoughtDebriefing,
    InvestigationReport,
    HandbookFirst,
    HandbookSecond,
    VolunteerLetter,
    NurtureContacts,
    modifyFileInfo,
    modifyFileId,
    modifyFileStatus,
    replaceNurtureContacts,
    updateNurtureContacts,
  }
})
