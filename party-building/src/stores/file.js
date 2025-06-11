import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useFileStore = defineStore('file', () => {
  //入党申请书
  const JoinPartyApplication = reactive({
    status: -1,
    fileId: null,
  })

  //第一次谈话
  const ConversationFirst = reactive({
    status: -1,
    fileId: null,
  })

  //思想汇报
  const ThoughtDebriefing = reactive({
    status: -1,
    fileId: null,
  })

  //考察报告
  const InvestigationReport = reactive({
    status: -1,
    fileId: null,
  })

  //手册一
  const HandbookFirst = reactive({
    status: -1,
    fileId: null,
  })

  //手册二
  const HandbookSecond = reactive({
    status: -1,
    fileId: null,
  })

  //入党志愿书
  const VolunteerLetter = reactive({
    status: -1,
    fileId: null,
  })

  return {
    JoinPartyApplication,
    ConversationFirst,
    ThoughtDebriefing,
    InvestigationReport,
    HandbookFirst,
    HandbookSecond,
    VolunteerLetter,
  }
})
