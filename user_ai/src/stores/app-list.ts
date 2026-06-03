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
    name: '产品手册知识库',
    description: '沉淀产品功能说明、配置指南和常见问题，供客服与售前助手检索引用。',
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

export const useAppListStore = defineStore('app-list', () => {
  const appItems = ref<SpaceApp[]>([...appFixtures])

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

  return {
    appItems,
    createApp,
    deleteApp,
    updateApp,
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

function formatUpdatedAt() {
  return new Date().toLocaleString('zh-CN', {
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
