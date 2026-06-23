import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getSpaceResourceByKind } from '@/views/personal-space/share/resources'
import type { SpaceResourceKind } from '@/views/personal-space/share/resources'

export type { SpaceResourceKind } from '@/views/personal-space/share/resources'

export interface SpaceApp {
  id: string
  name: string
  description: string
  icon: string
  accent: string
  updatedAt: string
  status: 'published' | 'draft'
  kind: SpaceResourceKind
  type: string
}

export interface SpaceAppForm {
  icon: string
  name: string
  description: string
}

export interface KnowledgeDocument {
  id: string
  knowledgeId: string
  name: string
  wordCount: string
  recallCount: number
  updatedAt: string
  status: 'enabled' | 'disabled'
  format: 'doc' | 'docx' | 'md' | 'pdf' | 'txt'
}

export interface KnowledgeDocumentFile {
  name: string
  size?: number
}

const appFixtures: SpaceApp[] = [
  {
    id: 'app-customer-service',
    name: '智能客服助手',
    description: '面向企业官网、公众号、小程序的 AI 客服应用，支持知识库问答和多轮会话。',
    icon: 'lucide:headphones',
    accent: '#2563eb',
    updatedAt: '2024-06-18 12:00',
    status: 'published',
    kind: 'app',
    type: '聊天助手',
  },
  {
    id: 'app-contract-review',
    name: '合同审阅专家',
    description: '快速识别合同关键条款、风险点和缺失内容，生成结构化审阅意见。',
    icon: 'lucide:file-search',
    accent: '#7c3aed',
    updatedAt: '2024-06-17 18:30',
    status: 'published',
    kind: 'app',
    type: '流程应用',
  },
  {
    id: 'app-sales-coach',
    name: '销售话术教练',
    description: '模拟客户沟通场景，帮助销售团队练习开场、异议处理和成交推进。',
    icon: 'lucide:messages-square',
    accent: '#0891b2',
    updatedAt: '2024-06-16 09:42',
    status: 'draft',
    kind: 'app',
    type: '智能体',
  },
  {
    id: 'app-course-qa',
    name: '课程答疑机器人',
    description: '基于课程资料回答学员问题，自动关联章节、知识点和推荐练习。',
    icon: 'lucide:graduation-cap',
    accent: '#16a34a',
    updatedAt: '2024-06-15 21:10',
    status: 'published',
    kind: 'app',
    type: '知识问答',
  },
  {
    id: 'app-weekly-report',
    name: '周报生成器',
    description: '汇总项目动态、任务进展和风险事项，一键生成规范化工作周报。',
    icon: 'lucide:calendar-check',
    accent: '#ea580c',
    updatedAt: '2024-06-14 15:26',
    status: 'published',
    kind: 'app',
    type: '文本生成',
  },
  {
    id: 'app-resume-screening',
    name: '简历筛选助手',
    description: '根据岗位要求提取候选人亮点，输出匹配度、疑问点和面试建议。',
    icon: 'lucide:user-check',
    accent: '#db2777',
    updatedAt: '2024-06-13 11:08',
    status: 'draft',
    kind: 'app',
    type: '招聘',
  },
  {
    id: 'app-data-analysis',
    name: '数据分析助理',
    description: '上传表格后自动解释指标趋势、异常波动和可执行的数据洞察。',
    icon: 'lucide:chart-column',
    accent: '#0d9488',
    updatedAt: '2024-06-12 19:54',
    status: 'published',
    kind: 'app',
    type: '数据分析',
  },
  {
    id: 'app-store-ops',
    name: '门店运营顾问',
    description: '围绕客流、转化、库存和人员排班，提供门店经营优化建议。',
    icon: 'lucide:store',
    accent: '#4f46e5',
    updatedAt: '2024-06-11 08:20',
    status: 'published',
    kind: 'app',
    type: '行业助手',
  },
  {
    id: 'app-public-opinion',
    name: '舆情摘要助手',
    description: '聚合多渠道信息并形成摘要、情绪判断、风险等级和处置建议。',
    icon: 'lucide:radar',
    accent: '#9333ea',
    updatedAt: '2024-06-10 17:36',
    status: 'draft',
    kind: 'app',
    type: '监测',
  },
  {
    id: 'app-product-requirements',
    name: '产品需求分析师',
    description: '整理用户反馈，拆解需求优先级，辅助生成 PRD 大纲和验收标准。',
    icon: 'lucide:clipboard-list',
    accent: '#ca8a04',
    updatedAt: '2024-06-09 13:15',
    status: 'published',
    kind: 'app',
    type: '产品',
  },
  {
    id: 'plugin-weather-search',
    name: '天气查询服务',
    description: '通过城市名称获取实时天气、未来预报和空气质量数据，适用于客服和出行场景。',
    icon: 'lucide:cloud-sun',
    accent: '#0284c7',
    updatedAt: '2024-06-18 10:16',
    status: 'published',
    kind: 'plugin',
    type: 'HTTP 插件',
  },
  {
    id: 'plugin-order-query',
    name: '订单查询插件',
    description: '连接业务订单系统，按手机号、订单号或用户 ID 查询订单状态和物流信息。',
    icon: 'lucide:package-search',
    accent: '#0d9488',
    updatedAt: '2024-06-16 16:25',
    status: 'draft',
    kind: 'plugin',
    type: '自定义插件',
  },
  {
    id: 'plugin-mcp-crm',
    name: 'CRM MCP 服务',
    description: '封装客户资料、商机阶段和跟进记录查询能力，支持在应用编排中直接调用。',
    icon: 'lucide:server-cog',
    accent: '#4f46e5',
    updatedAt: '2024-06-12 09:34',
    status: 'published',
    kind: 'plugin',
    type: 'MCP 服务',
  },
  {
    id: 'workflow-contract-review',
    name: '合同审阅流程',
    description: '上传合同后自动提取关键条款、识别风险项，并生成审阅摘要与修改建议。',
    icon: 'lucide:workflow',
    accent: '#7c3aed',
    updatedAt: '2024-06-18 14:50',
    status: 'published',
    kind: 'workflow',
    type: '审核流程',
  },
  {
    id: 'workflow-lead-followup',
    name: '线索跟进编排',
    description: '根据线索来源、意向等级和历史沟通记录，自动生成下一步跟进任务。',
    icon: 'lucide:route',
    accent: '#db2777',
    updatedAt: '2024-06-15 20:18',
    status: 'draft',
    kind: 'workflow',
    type: '销售流程',
  },
  {
    id: 'workflow-report-digest',
    name: '运营日报生成',
    description: '汇总多张报表指标，识别异常波动并输出日报正文、结论和待办事项。',
    icon: 'lucide:chart-no-axes-combined',
    accent: '#ea580c',
    updatedAt: '2024-06-11 18:07',
    status: 'published',
    kind: 'workflow',
    type: '数据流程',
  },
  {
    id: 'knowledge-product-manual',
    name: '春课LLMOps知识库',
    description: '沉淀 LLMOps 项目课程、代码库和 API 文档内容，支持应用精准检索引用。',
    icon: 'lucide:book-open',
    accent: '#16a34a',
    updatedAt: '2024-06-18 11:42',
    status: 'published',
    kind: 'knowledge',
    type: '产品资料',
  },
  {
    id: 'knowledge-policy-center',
    name: '企业制度知识库',
    description: '收录人事、财务、采购和行政制度文档，为内部员工问答提供标准依据。',
    icon: 'lucide:library-big',
    accent: '#0d9488',
    updatedAt: '2024-06-13 15:05',
    status: 'published',
    kind: 'knowledge',
    type: '内部资料',
  },
  {
    id: 'knowledge-course-content',
    name: '课程内容知识库',
    description: '管理课程讲义、案例素材和练习说明，支持教学答疑应用精准召回。',
    icon: 'lucide:files',
    accent: '#ca8a04',
    updatedAt: '2024-06-10 12:30',
    status: 'draft',
    kind: 'knowledge',
    type: '教学资料',
  },
]

const llmopsDocumentTemplates = {
  api: {
    name: 'LLMOps 项目API文档.md',
    wordCount: '95.1k',
    recallCount: 154,
    updatedAt: '2024-01-07 12:18:04',
    status: 'enabled',
    format: 'md',
  },
  codebase: {
    name: '春课LLMOps代码库.txt',
    wordCount: '12.5k',
    recallCount: 13,
    updatedAt: '2024-05-14 14:35:27',
    status: 'disabled',
    format: 'txt',
  },
  prompt: {
    name: 'LLMOps 项目提示词.md',
    wordCount: '4.7k',
    recallCount: 18,
    updatedAt: '2024-06-11 23:31:47',
    status: 'disabled',
    format: 'md',
  },
  readme: {
    name: 'Readme.md',
    wordCount: '1.7k',
    recallCount: 12,
    updatedAt: '2024-01-08 13:20:10',
    status: 'enabled',
    format: 'md',
  },
  retrieval: {
    name: '课程Prompt提示词.txt',
    wordCount: '2.1k',
    recallCount: 0,
    updatedAt: '2024-04-07 09:22:00',
    status: 'enabled',
    format: 'txt',
  },
  toolCall: {
    name: '基于工具调用的智能体设计与实现.md',
    wordCount: '14.8k',
    recallCount: 42,
    updatedAt: '2024-02-01 21:16:25',
    status: 'enabled',
    format: 'md',
  },
} satisfies Record<string, Omit<KnowledgeDocument, 'id' | 'knowledgeId'>>

const llmopsDocumentOrder = [
  'prompt',
  'retrieval',
  'prompt',
  'retrieval',
  'readme',
  'codebase',
  'api',
  'toolCall',
  'prompt',
  'retrieval',
  'readme',
  'codebase',
  'api',
  'toolCall',
  'api',
  'toolCall',
  'prompt',
  'retrieval',
  'readme',
  'codebase',
  'api',
] as const

const knowledgeDocumentFixtures: KnowledgeDocument[] = [
  ...llmopsDocumentOrder.map((templateKey, index) => ({
    ...llmopsDocumentTemplates[templateKey],
    id: `doc-llmops-${index + 1}`,
    knowledgeId: 'knowledge-product-manual',
  })),
  {
    id: 'doc-hr-policy',
    knowledgeId: 'knowledge-policy-center',
    name: '员工手册与考勤制度.pdf',
    wordCount: '18.4k',
    recallCount: 36,
    updatedAt: '2024-05-22 10:12:30',
    status: 'enabled',
    format: 'pdf',
  },
  {
    id: 'doc-finance-policy',
    knowledgeId: 'knowledge-policy-center',
    name: '费用报销与采购规范.md',
    wordCount: '9.8k',
    recallCount: 27,
    updatedAt: '2024-05-17 17:45:12',
    status: 'enabled',
    format: 'md',
  },
  {
    id: 'doc-course-outline',
    knowledgeId: 'knowledge-course-content',
    name: 'AI 应用开发训练营讲义.md',
    wordCount: '21.6k',
    recallCount: 63,
    updatedAt: '2024-06-02 14:08:51',
    status: 'enabled',
    format: 'md',
  },
]

export const useAppListStore = defineStore('app-list', () => {
  const appItems = ref<SpaceApp[]>([...appFixtures])
  const knowledgeDocuments = ref<KnowledgeDocument[]>([...knowledgeDocumentFixtures])

  function findAppIndex(id: string) {
    return appItems.value.findIndex((item) => item.id === id)
  }

  function createApp(form: SpaceAppForm, kind: SpaceResourceKind = 'app') {
    appItems.value.unshift(createSpaceApp(form, kind))
  }

  function updateApp(id: string, form: SpaceAppForm) {
    const targetIndex = findAppIndex(id)
    const targetItem = appItems.value[targetIndex]

    if (!targetItem) {
      return false
    }

    appItems.value[targetIndex] = {
      ...targetItem,
      ...normalizeAppForm(form, targetItem.kind),
      updatedAt: formatUpdatedAt(),
    }
    return true
  }

  function deleteApp(id: string) {
    const targetIndex = findAppIndex(id)

    if (targetIndex < 0) {
      return false
    }

    appItems.value.splice(targetIndex, 1)
    return true
  }

  function updateAppStatus(id: string, status: SpaceApp['status']) {
    const targetIndex = findAppIndex(id)
    const targetItem = appItems.value[targetIndex]

    if (!targetItem) {
      return false
    }

    appItems.value[targetIndex] = {
      ...targetItem,
      status,
      updatedAt: formatUpdatedAt(),
    }
    return true
  }

  function findAppById(id: string) {
    return appItems.value.find((item) => item.id === id)
  }

  function getKnowledgeDocuments(knowledgeId: string) {
    return knowledgeDocuments.value.filter((item) => item.knowledgeId === knowledgeId)
  }

  function addKnowledgeDocuments(knowledgeId: string, files: KnowledgeDocumentFile[]) {
    const documents = files.map((file) => createKnowledgeDocument(knowledgeId, file))
    knowledgeDocuments.value.unshift(...documents)
  }

  function updateKnowledgeDocumentStatus(id: string, status: KnowledgeDocument['status']) {
    const targetIndex = knowledgeDocuments.value.findIndex((item) => item.id === id)
    const targetItem = knowledgeDocuments.value[targetIndex]

    if (!targetItem) {
      return false
    }

    knowledgeDocuments.value[targetIndex] = {
      ...targetItem,
      status,
    }
    return true
  }

  function updateKnowledgeDocumentName(id: string, name: string) {
    const targetIndex = knowledgeDocuments.value.findIndex((item) => item.id === id)
    const targetItem = knowledgeDocuments.value[targetIndex]

    if (!targetItem) {
      return false
    }

    knowledgeDocuments.value[targetIndex] = {
      ...targetItem,
      name,
    }
    return true
  }

  function deleteKnowledgeDocument(id: string) {
    const targetIndex = knowledgeDocuments.value.findIndex((item) => item.id === id)

    if (targetIndex < 0) {
      return false
    }

    knowledgeDocuments.value.splice(targetIndex, 1)
    return true
  }

  return {
    appItems,
    addKnowledgeDocuments,
    createApp,
    deleteApp,
    deleteKnowledgeDocument,
    findAppById,
    getKnowledgeDocuments,
    updateApp,
    updateAppStatus,
    updateKnowledgeDocumentName,
    updateKnowledgeDocumentStatus,
  }
})

function normalizeAppForm(form: SpaceAppForm, kind: SpaceResourceKind = 'app') {
  const resource = getSpaceResourceByKind(kind)

  return {
    icon: form.icon,
    name: form.name.trim(),
    description: form.description.trim() || resource.fallbackDescription,
  }
}

function createSpaceApp(form: SpaceAppForm, kind: SpaceResourceKind): SpaceApp {
  const normalizedForm = normalizeAppForm(form, kind)
  const resource = getSpaceResourceByKind(kind)

  return {
    id: crypto.randomUUID(),
    ...normalizedForm,
    accent: resource.accent,
    updatedAt: formatUpdatedAt(),
    status: 'draft',
    kind,
    type: resource.type,
  }
}

function createKnowledgeDocument(
  knowledgeId: string,
  file: KnowledgeDocumentFile,
): KnowledgeDocument {
  return {
    id: crypto.randomUUID(),
    knowledgeId,
    name: file.name,
    wordCount: formatFileSize(file.size),
    recallCount: 0,
    updatedAt: formatUpdatedAt(true),
    status: 'enabled',
    format: getDocumentFormat(file.name),
  }
}

function getDocumentFormat(fileName: string): KnowledgeDocument['format'] {
  const extension = fileName.split('.').pop()?.toLowerCase()

  if (extension === 'doc' || extension === 'docx' || extension === 'md' || extension === 'pdf') {
    return extension
  }

  return 'txt'
}

function formatFileSize(size = 0) {
  if (!size) {
    return '0k'
  }

  return `${Math.max(0.1, size / 1024).toFixed(1)}k`
}

function formatUpdatedAt(includeSeconds = false) {
  return new Date().toLocaleString('zh-CN', {
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    ...(includeSeconds ? { second: '2-digit' as const } : {}),
  })
}
