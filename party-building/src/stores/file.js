import { defineStore } from 'pinia'
import { reactive } from 'vue'

// -2 未提交
// 0  待审核
// 1  审核通过
// -1 审核不通过

export const useFileStore = defineStore('file', () => {
  //入党申请书
  const JoinPartyApplication = reactive({
    status: 1,
    fileId: '12345',
    attachText:
      '111首次申请入党时间错误，正确时间应该修改为：2025/09/16，请在2025年11月26日前修改为正确的时间，如未修改，后果自负！2025/09/16，请在2025年11月26日前修改为正确的时间，2025/09/16，请在2025年11月26日前修改为正确的时间，2025/09/16，请在2025年11月26日前修改为正确的时间，首次申请入党时间错误，正确时间应该修改为：2025/09/16，请在2025年11月',
    attachTime: null,
  })

  //第一次谈话
  const ConversationFirst = reactive({
    status: -2,
    fileId: null,
    attachText: null,
    attachTime: null,
  })

  //思想汇报
  const ThoughtDebriefing = reactive({
    status: -2,
    fileId: null,
    attachText: null,
    attachTime: null,
  })

  //考察报告
  const InvestigationReport = reactive({
    status: -2,
    fileId: null,
    attachText: null,
    attachTime: null,
  })

  //手册一
  const HandbookFirst = reactive({
    status: -2,
    fileId: null,
    attachText: null,
    attachTime: null,
  })

  //手册二
  const HandbookSecond = reactive({
    status: -2,
    fileId: null,
    attachText: null,
    attachTime: null,
  })

  //入党志愿书
  const VolunteerLetter = reactive({
    status: -2,
    fileId: null,
    attachText: null,
    attachTime: null,
  })

  // //修改文件信息
  // const modifyFileInfo = (fileType, newStatus, newFileId, newattAchText, newattAchTime) => {
  //   fileType.status = newStatus
  //   fileType.fileId = newFileId
  //   fileType.attachText = newattAchText
  //   fileType.attachTime = newattAchTime
  // }

  return {
    JoinPartyApplication,
    ConversationFirst,
    ThoughtDebriefing,
    InvestigationReport,
    HandbookFirst,
    HandbookSecond,
    VolunteerLetter,
    // modifyFileInfo,
  }
})
