import { defineStore } from 'pinia'
import { reactive } from 'vue'

// -2 未提交
// 0  待审核
// 1  审核通过
// -1 审核不通过

export const useFileStore = defineStore('file', () => {
  //入党申请书
  const JoinPartyApplication = reactive({
    status: -2,
    fileId: null,
    attachText: null,
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
