<script setup lang="ts">
import AppIcon from '@/components/AppIcon/index.vue'
import CreateAppModal from '@/views/personal-space/components/CreateAppModal/index.vue'
import type { AppItem, CreateAppPayload } from '@/views/personal-space/share/app'
import type { MenuItemType } from 'antdv-next'
import { Dropdown, message } from 'antdv-next'
import { ref } from 'vue'

const tabs = ['AI应用', '插件', '工作流', '知识库']

const actionItems: MenuItemType[] = [
  { key: 'edit', label: '编辑' },
  { key: 'copy', label: '复制' },
  { key: 'publish', label: '发布' },
  { key: 'delete', label: '删除', danger: true },
]

const appItems = ref<AppItem[]>([
  {
    name: '智能客服助手',
    description: '面向企业官网、公众号、小程序的 AI 客服应用，支持知识库问答和多轮会话。',
    icon: 'lucide:headphones',
    accent: '#2563eb',
    updatedAt: '2024-06-18 12:00',
    status: 'published',
    type: '聊天助手',
  },
  {
    name: '合同审阅专家',
    description: '快速识别合同关键条款、风险点和缺失内容，生成结构化审阅意见。',
    icon: 'lucide:file-search',
    accent: '#7c3aed',
    updatedAt: '2024-06-17 18:30',
    status: 'published',
    type: '工作流',
  },
  {
    name: '销售话术教练',
    description: '模拟客户沟通场景，帮助销售团队练习开场、异议处理和成交推进。',
    icon: 'lucide:messages-square',
    accent: '#0891b2',
    updatedAt: '2024-06-16 09:42',
    status: 'draft',
    type: '智能体',
  },
  {
    name: '课程答疑机器人',
    description: '基于课程资料回答学员问题，自动关联章节、知识点和推荐练习。',
    icon: 'lucide:graduation-cap',
    accent: '#16a34a',
    updatedAt: '2024-06-15 21:10',
    status: 'published',
    type: '知识库',
  },
  {
    name: '周报生成器',
    description: '汇总项目动态、任务进展和风险事项，一键生成规范化工作周报。',
    icon: 'lucide:calendar-check',
    accent: '#ea580c',
    updatedAt: '2024-06-14 15:26',
    status: 'published',
    type: '文本生成',
  },
  {
    name: '简历筛选助手',
    description: '根据岗位要求提取候选人亮点，输出匹配度、疑问点和面试建议。',
    icon: 'lucide:user-check',
    accent: '#db2777',
    updatedAt: '2024-06-13 11:08',
    status: 'draft',
    type: '招聘',
  },
  {
    name: '数据分析助理',
    description: '上传表格后自动解释指标趋势、异常波动和可执行的数据洞察。',
    icon: 'lucide:chart-column',
    accent: '#0d9488',
    updatedAt: '2024-06-12 19:54',
    status: 'published',
    type: '数据分析',
  },
  {
    name: '门店运营顾问',
    description: '围绕客流、转化、库存和人员排班，提供门店经营优化建议。',
    icon: 'lucide:store',
    accent: '#4f46e5',
    updatedAt: '2024-06-11 08:20',
    status: 'published',
    type: '行业助手',
  },
  {
    name: '舆情摘要助手',
    description: '聚合多渠道信息并形成摘要、情绪判断、风险等级和处置建议。',
    icon: 'lucide:radar',
    accent: '#9333ea',
    updatedAt: '2024-06-10 17:36',
    status: 'draft',
    type: '监测',
  },
  {
    name: '产品需求分析师',
    description: '整理用户反馈，拆解需求优先级，辅助生成 PRD 大纲和验收标准。',
    icon: 'lucide:clipboard-list',
    accent: '#ca8a04',
    updatedAt: '2024-06-09 13:15',
    status: 'published',
    type: '产品',
  },
])

const createModalOpen = ref(false)

function openCreateModal() {
  createModalOpen.value = true
}

function handleCreateApp(payload: CreateAppPayload) {
  appItems.value.unshift({
    name: payload.name,
    description: payload.description || '暂无应用描述。',
    icon: payload.icon,
    accent: '#2563eb',
    updatedAt: new Date().toLocaleString('zh-CN', {
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }),
    status: 'draft',
    type: 'AI应用',
  })
  message.success('创建成功')
}
</script>

<template>
  <section class="space-app-list">
    <header class="space-app-list__header">
      <h1>应用</h1>
      <button class="space-app-list__create" type="button" @click="openCreateModal">
        <AppIcon icon="lucide:plus" size="18" />
        <span>创建AI应用</span>
      </button>
    </header>

    <div class="space-app-list__toolbar">
      <div class="space-app-list__tabs" aria-label="应用筛选">
        <button
          v-for="(tab, index) in tabs"
          :key="tab"
          class="space-app-list__tab"
          :class="{ 'is-active': index === 0 }"
          type="button"
        >
          {{ tab }}
        </button>
      </div>

      <label class="space-app-list__search">
        <AppIcon icon="lucide:search" size="16" />
        <input type="search" placeholder="搜索应用" />
      </label>
    </div>

    <div class="space-app-list__grid">
      <article v-for="item in appItems" :key="item.name" class="space-app-list__card">
        <div class="space-app-list__card-head">
          <div
            class="space-app-list__app-icon"
            :class="{ 'has-image': item.icon.startsWith('data:') }"
            :style="{ backgroundColor: item.accent }"
          >
            <img v-if="item.icon.startsWith('data:')" :src="item.icon" alt="" :draggable="false" />
            <AppIcon v-else :icon="item.icon" size="22" />
          </div>
          <div class="space-app-list__card-title">
            <h2>{{ item.name }}</h2>
            <span>{{ item.type }}</span>
          </div>
          <Dropdown :menu="{ items: actionItems }" :trigger="['click']" placement="bottomRight">
            <button class="space-app-list__more" type="button" aria-label="更多操作">
              <AppIcon icon="lucide:ellipsis" size="20" />
            </button>
          </Dropdown>
        </div>

        <p>{{ item.description }}</p>

        <footer class="space-app-list__meta">
          <span class="space-app-list__status" :class="`is-${item.status}`">
            {{ item.status === 'published' ? '已发布' : '草稿' }}
          </span>
          <time>{{ item.updatedAt }}</time>
        </footer>
      </article>
    </div>

    <CreateAppModal v-model:open="createModalOpen" @create="handleCreateApp" />
  </section>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
