import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface SpaceApp {
  id: string
  name: string
  description: string
  icon: string
  accent: string
  updatedAt: string
  status: 'published' | 'draft'
  type: string
}

export interface SpaceAppForm {
  icon: string
  name: string
  description: string
}

const fallbackDescription = '暂无应用描述。'

const appFixtures: SpaceApp[] = [
  {
    id: 'app-customer-service',
    name: '智能客服助手',
    description: '面向企业官网、公众号、小程序的 AI 客服应用，支持知识库问答和多轮会话。',
    icon: 'lucide:headphones',
    accent: '#2563eb',
    updatedAt: '2024-06-18 12:00',
    status: 'published',
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
    type: '工作流',
  },
  {
    id: 'app-sales-coach',
    name: '销售话术教练',
    description: '模拟客户沟通场景，帮助销售团队练习开场、异议处理和成交推进。',
    icon: 'lucide:messages-square',
    accent: '#0891b2',
    updatedAt: '2024-06-16 09:42',
    status: 'draft',
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
    type: '知识库',
  },
  {
    id: 'app-weekly-report',
    name: '周报生成器',
    description: '汇总项目动态、任务进展和风险事项，一键生成规范化工作周报。',
    icon: 'lucide:calendar-check',
    accent: '#ea580c',
    updatedAt: '2024-06-14 15:26',
    status: 'published',
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
    type: '产品',
  },
]

export const useAppListStore = defineStore('app-list', () => {
  const appItems = ref<SpaceApp[]>([...appFixtures])

  function findAppIndex(id: string) {
    return appItems.value.findIndex((item) => item.id === id)
  }

  function createApp(form: SpaceAppForm) {
    appItems.value.unshift(createSpaceApp(form))
  }

  function updateApp(id: string, form: SpaceAppForm) {
    const targetIndex = findAppIndex(id)
    const targetItem = appItems.value[targetIndex]

    if (!targetItem) {
      return false
    }

    appItems.value[targetIndex] = {
      ...targetItem,
      ...normalizeAppForm(form),
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

function normalizeAppForm(form: SpaceAppForm) {
  return {
    icon: form.icon,
    name: form.name.trim(),
    description: form.description.trim() || fallbackDescription,
  }
}

function createSpaceApp(form: SpaceAppForm): SpaceApp {
  const normalizedForm = normalizeAppForm(form)

  return {
    id: crypto.randomUUID(),
    ...normalizedForm,
    accent: '#2563eb',
    updatedAt: formatUpdatedAt(),
    status: 'draft',
    type: 'AI应用',
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
