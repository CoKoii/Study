<script setup lang="ts">
import AppChatComposer from '@/components/AppChatComposer/index.vue'
import AppIcon from '@/components/AppIcon/index.vue'
import { useAppListStore } from '@/stores/app-list'
import type { SpaceApp } from '@/stores/app-list'
import { Button, Input, Select, Switch, TabPane, Tabs, Tag, TextArea } from 'antdv-next'
import { Bubble, Prompts } from 'ant-design-x-vue'
import type { BubbleListProps, PromptsProps } from 'ant-design-x-vue'
import { storeToRefs } from 'pinia'
import { computed, h, ref } from 'vue'
import type { VNode } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface CapabilityItem {
  description: string
  icon: string
  key: string
  title: string
  tone: string
}

interface PluginMarketItem extends CapabilityItem {
  category: string
  provider: string
  source: 'custom' | 'builtin'
}

interface RelationItem {
  icon: string
  key: string
  title: string
  tone: string
}

interface SettingSection {
  description?: string
  enabled?: boolean
  title: string
  type?: 'textarea'
}

interface PreviewMessage {
  content: string
  footer?: VNode
  key: string
  role: 'assistant' | 'user'
  rootClassName: string
}

const route = useRoute()
const router = useRouter()
const appListStore = useAppListStore()
const { appItems } = storeToRefs(appListStore)
const activeTab = ref('edit')
const selectedModel = ref('gpt-4o')
const openingText = ref('')
const openingQuestion = ref('')
const promptsVisible = ref(true)
const pluginModalOpen = ref(false)
const relationModalOpen = ref(false)
const relationMode = ref<'knowledge' | 'workflow'>('knowledge')
const selectedPluginSource = ref<'custom' | 'builtin'>('builtin')
const selectedPluginCategory = ref('all')
const selectedKnowledgeKeys = ref<string[]>([])
const selectedWorkflowKeys = ref<string[]>([])
const linkedKnowledgeKeys = ref<string[]>([])
const linkedWorkflowKeys = ref<string[]>([])
const removeKey = (keys: string[], key: string) => keys.filter((item) => item !== key)
const createMessageFooter = (messageKey: string, text: string) =>
  h('div', { class: 'chat-message-footer' }, [
    h('span', text),
    h('div', { class: 'chat-message-footer__actions' }, [
      h(
        'button',
        {
          'aria-label': '复制消息',
          class: 'chat-message-footer__button',
          type: 'button',
          onClick: () => copyPreviewMessage(messageKey),
        },
        h(AppIcon, { icon: 'lucide:copy', size: '14' }),
      ),
      h(
        'button',
        {
          'aria-label': '删除消息',
          class: 'chat-message-footer__button',
          type: 'button',
          onClick: () => deletePreviewMessage(messageKey),
        },
        h(AppIcon, { icon: 'lucide:trash-2', size: '14' }),
      ),
    ]),
  ])
const previewMessages = ref<PreviewMessage[]>([
  {
    key: 'hello-user',
    rootClassName: 'chat-message-item',
    role: 'user',
    content: '你好，你是？',
  },
  {
    key: 'hello-assistant',
    rootClassName: 'chat-message-item',
    role: 'assistant',
    content: '你好呀，我是ChatGPT，很高兴和您交流！',
    footer: createMessageFooter('hello-assistant', '1.7s · 72 Tokens'),
  },
  {
    key: 'llm-user',
    rootClassName: 'chat-message-item',
    role: 'user',
    content: '能详细讲解下LLM是什么吗?',
  },
  {
    key: 'llm-assistant',
    rootClassName: 'chat-message-item',
    role: 'assistant',
    content:
      'LLM 即 Large Language Model，大语言模型，是一种基于深度学习的自然语言处理模型，具有很高的语言理解和生成能力，能够处理各式各样的自然语言任务。',
    footer: createMessageFooter('llm-assistant', '1.7s · 1,085 Tokens'),
  },
])

const modelOptions = [
  { label: 'GPT-4o', value: 'gpt-4o' },
  { label: 'GPT-4.1', value: 'gpt-4.1' },
  { label: 'Claude 3.5', value: 'claude-3.5' },
]

const capabilities = ref<CapabilityItem[]>([
  {
    key: 'img-understand',
    title: '图片理解 / imgUnderstand',
    description: '回答用户关于图像的问题',
    icon: 'lucide:image',
    tone: '#fff7ed',
  },
  {
    key: 'bing-web-search',
    title: '必应搜索 / bingWebSearch',
    description: '必应搜索引擎。当你需要搜索未知信息，比如天气、汇率、时事时使用。',
    icon: 'lucide:globe-2',
    tone: '#ecfeff',
  },
])

const pluginSources = [
  { key: 'custom', label: '自定义插件', icon: 'lucide:package' },
  { key: 'builtin', label: '内置', icon: 'lucide:blocks' },
] as const

const pluginCategories = [
  { key: 'all', label: '全部', icon: 'lucide:layout-grid' },
  { key: 'search', label: '搜索', icon: 'lucide:search' },
  { key: 'weather', label: '天气', icon: 'lucide:cloud-sun' },
  { key: 'travel', label: '旅行', icon: 'lucide:luggage' },
]

const pluginMarketItems: PluginMarketItem[] = [
  {
    key: 'google-search',
    title: '谷歌搜索',
    description: '使用 Google 搜索公开网页内容。',
    icon: 'lucide:search',
    tone: '#eef2ff',
    provider: 'Google',
    source: 'builtin',
    category: 'search',
  },
  {
    key: 'duckduckgo-chat',
    title: 'DuckDuckGo AI聊天',
    description: '调用 DuckDuckGo 的 AI 聊天能力。',
    icon: 'lucide:message-circle',
    tone: '#ecfeff',
    provider: 'DuckDuckGo',
    source: 'builtin',
    category: 'search',
  },
  {
    key: 'duckduckgo-image',
    title: 'DuckDuckGo 图片搜索',
    description: '按关键词检索图片结果。',
    icon: 'lucide:image',
    tone: '#fff7ed',
    provider: 'DuckDuckGo',
    source: 'builtin',
    category: 'search',
  },
  {
    key: 'duckduckgo-search',
    title: 'DuckDuckGo 搜索',
    description: '检索网页、新闻等公开信息。',
    icon: 'lucide:globe-2',
    tone: '#f0fdf4',
    provider: 'DuckDuckGo',
    source: 'builtin',
    category: 'search',
  },
  {
    key: 'serper-api',
    title: 'Google Serper API',
    description: '使用 Serper API 获取 Google 搜索结果。',
    icon: 'lucide:radar',
    tone: '#eff6ff',
    provider: 'SerperApi',
    source: 'builtin',
    category: 'search',
  },
  {
    key: 'maps-api',
    title: 'Google Jobs API',
    description: '查询职位相关信息。',
    icon: 'lucide:briefcase-business',
    tone: '#fdf2f8',
    provider: 'SerperApi',
    source: 'builtin',
    category: 'travel',
  },
  {
    key: 'weather-custom',
    title: '天气查询服务',
    description: '通过城市名称获取实时天气与预报。',
    icon: 'lucide:cloud-sun',
    tone: '#ecfeff',
    provider: '个人空间',
    source: 'custom',
    category: 'weather',
  },
]

const knowledgeItems: RelationItem[] = [
  {
    key: 'langchain-translation',
    title: 'LangChain翻译文档',
    icon: 'lucide:languages',
    tone: '#dbeafe',
  },
  {
    key: 'llmops-api',
    title: '慕课LLMOps项目API文档',
    icon: 'lucide:book-open',
    tone: '#ede9fe',
  },
  {
    key: 'llmops-prompt',
    title: 'LLMOps项目提示词文档',
    icon: 'lucide:file-text',
    tone: '#e0f2fe',
  },
  {
    key: 'llmops-source',
    title: '慕课LLMOps项目当前源码',
    icon: 'lucide:archive',
    tone: '#dcfce7',
  },
  {
    key: 'ecommerce',
    title: '合虎电商数据合集',
    icon: 'lucide:database',
    tone: '#d1fae5',
  },
]

const workflowItems: RelationItem[] = [
  {
    key: 'translation-workflow',
    title: '深度翻译工作流',
    icon: 'lucide:languages',
    tone: '#dbeafe',
  },
  {
    key: 'copywriter-workflow',
    title: '小红书文案自动生成器',
    icon: 'lucide:notebook-pen',
    tone: '#ede9fe',
  },
  {
    key: 'podcast-workflow',
    title: '数字人口播文案生成工作流',
    icon: 'lucide:radio',
    tone: '#e0f2fe',
  },
  {
    key: 'test-workflow',
    title: '慕课测试工作流',
    icon: 'lucide:workflow',
    tone: '#dcfce7',
  },
  {
    key: 'llm-roundtable',
    title: '多LLM回复内容整合工作流',
    icon: 'lucide:combine',
    tone: '#d1fae5',
  },
]

const settingSections: SettingSection[] = [
  {
    title: '长期记忆',
    description: '总结聊天对话的内容，并用于更好的响应用户的消息。',
    enabled: true,
  },
  {
    title: '对话开场白',
    type: 'textarea',
  },
  {
    title: '用户问题建议',
    description: '在应用回复后，自动根据对话内容提供 3 条用户提问建议。',
    enabled: true,
  },
  {
    title: '语音输入',
    description: '启用后，您可以使用语音输入。',
    enabled: true,
  },
  {
    title: '语音输出',
    description: '启用后，应用会将文本回复转换为语音输出。',
    enabled: false,
  },
]

const quickPrompts = [
  { key: 'scenario', label: 'LLM 大语言模型有什么应用场景？' },
  { key: 'open-source', label: '有哪些开源的LLM模型？' },
  { key: 'agent', label: 'LLM与Agent之间的关系是什么？' },
]

const avatarStyle = {
  alignItems: 'center',
  borderRadius: '50%',
  color: '#fff',
  display: 'inline-flex',
  fontSize: '12px',
  height: '28px',
  justifyContent: 'center',
  width: '28px',
}
const userAvatar = h(
  'span',
  {
    style: {
      ...avatarStyle,
      background: '#d1d5db',
    },
  },
  '慕',
)
const assistantAvatar = h(
  'span',
  {
    style: {
      ...avatarStyle,
      background: '#0f766e',
    },
  },
  h(AppIcon, { icon: 'lucide:bot', size: '16' }),
)

const currentApp = computed<SpaceApp | undefined>(() => {
  const appId = route.params.appId

  return (
    appItems.value.find((item) => item.kind === 'app' && item.id === appId) ??
    appItems.value.find((item) => item.kind === 'app')
  )
})

const isImageIcon = computed(() => currentApp.value?.icon.startsWith('data:') ?? false)
const appName = computed(() => currentApp.value?.name ?? '聊天机器人')
const appDescription = computed(() => currentApp.value?.description ?? '配置 AI 应用的人设、能力和调试对话。')
const statusText = computed(() => (currentApp.value?.status === 'published' ? '已发布' : '草稿'))
const chatRoles = computed<BubbleListProps['roles']>(() => ({
  assistant: {
    avatar: assistantAvatar,
    header: appName.value,
    placement: 'start',
    variant: 'filled',
  },
  user: {
    avatar: userAvatar,
    header: '慕小课',
    placement: 'end',
    variant: 'filled',
  },
}))
const bubbleMessages = computed<BubbleListProps['items']>(() => previewMessages.value)
const filteredPluginItems = computed(() =>
  pluginMarketItems.filter(
    (plugin) =>
      plugin.source === selectedPluginSource.value &&
      (selectedPluginCategory.value === 'all' || plugin.category === selectedPluginCategory.value),
  ),
)
const capabilityKeys = computed(() => new Set(capabilities.value.map((capability) => capability.key)))
const selectedPluginSourceLabel = computed(
  () =>
    pluginSources.find((source) => source.key === selectedPluginSource.value)?.label ??
    '内置插件',
)
const pluginGroups = computed(() => {
  const groups = new Map<string, PluginMarketItem[]>()

  filteredPluginItems.value.forEach((plugin) => {
    groups.set(plugin.provider, [...(groups.get(plugin.provider) ?? []), plugin])
  })

  return Array.from(groups, ([provider, items]) => ({ provider, items }))
})
const relationTitle = computed(() =>
  relationMode.value === 'knowledge' ? '选择引用知识库' : '选择关联工作流',
)
const relationItems = computed(() =>
  relationMode.value === 'knowledge' ? knowledgeItems : workflowItems,
)
const selectedRelationKeys = computed({
  get: () =>
    relationMode.value === 'knowledge' ? selectedKnowledgeKeys.value : selectedWorkflowKeys.value,
  set: (keys: string[]) => {
    if (relationMode.value === 'knowledge') {
      selectedKnowledgeKeys.value = keys
      return
    }

    selectedWorkflowKeys.value = keys
  },
})
const linkedKnowledgeItems = computed(() =>
  knowledgeItems.filter((item) => linkedKnowledgeKeys.value.includes(item.key)),
)
const linkedWorkflowItems = computed(() =>
  workflowItems.filter((item) => linkedWorkflowKeys.value.includes(item.key)),
)

function goBack() {
  router.push({ name: 'personal-space-apps' })
}

function submitPreviewMessage(value: string) {
  const content = value.trim()

  if (!content) {
    return
  }

  previewMessages.value.push({
    key: `user-${Date.now()}`,
    rootClassName: 'chat-message-item',
    role: 'user',
    content,
  })
  promptsVisible.value = true
}

function clearPreviewMessages() {
  previewMessages.value = []
  promptsVisible.value = false
}

function deletePreviewMessage(key: string) {
  previewMessages.value = previewMessages.value.filter((message) => message.key !== key)
  promptsVisible.value = false
}

function copyPreviewMessage(key: string) {
  const content = previewMessages.value.find((message) => message.key === key)?.content

  if (typeof content === 'string') {
    void navigator.clipboard?.writeText(content)
  }
}

function submitPrompt(info: Parameters<NonNullable<PromptsProps['onItemClick']>>[0]) {
  if (typeof info.data.label === 'string') {
    submitPreviewMessage(info.data.label)
  }
}

function isPluginAdded(pluginKey: string) {
  return capabilityKeys.value.has(pluginKey)
}

function addPlugin(plugin: PluginMarketItem) {
  if (isPluginAdded(plugin.key)) {
    return
  }

  capabilities.value.push({
    key: plugin.key,
    title: plugin.title,
    description: plugin.description,
    icon: plugin.icon,
    tone: plugin.tone,
  })
}

function removePlugin(pluginKey: string) {
  capabilities.value = capabilities.value.filter((capability) => capability.key !== pluginKey)
}

function openRelationModal(mode: 'knowledge' | 'workflow') {
  relationMode.value = mode

  if (mode === 'knowledge') {
    selectedKnowledgeKeys.value = [...linkedKnowledgeKeys.value]
  } else {
    selectedWorkflowKeys.value = [...linkedWorkflowKeys.value]
  }

  relationModalOpen.value = true
}

function toggleRelationItem(key: string) {
  selectedRelationKeys.value = selectedRelationKeys.value.includes(key)
    ? selectedRelationKeys.value.filter((item) => item !== key)
    : [...selectedRelationKeys.value, key]
}

function confirmRelationSelection() {
  if (relationMode.value === 'knowledge') {
    linkedKnowledgeKeys.value = [...selectedKnowledgeKeys.value]
  } else {
    linkedWorkflowKeys.value = [...selectedWorkflowKeys.value]
  }

  relationModalOpen.value = false
}

function removeRelationItem(mode: 'knowledge' | 'workflow', key: string) {
  if (mode === 'knowledge') {
    linkedKnowledgeKeys.value = removeKey(linkedKnowledgeKeys.value, key)
    selectedKnowledgeKeys.value = removeKey(selectedKnowledgeKeys.value, key)
    return
  }

  linkedWorkflowKeys.value = removeKey(linkedWorkflowKeys.value, key)
  selectedWorkflowKeys.value = removeKey(selectedWorkflowKeys.value, key)
}
</script>

<template>
  <main class="app-orchestration">
    <header class="app-orchestration__topbar">
      <div class="app-orchestration__app">
        <button
          class="app-orchestration__back"
          type="button"
          aria-label="返回应用列表"
          @click="goBack"
        >
          <span aria-hidden="true"></span>
        </button>

        <div
          class="app-orchestration__logo"
          :class="{ 'has-image': isImageIcon }"
          :style="{ backgroundColor: currentApp?.accent }"
        >
          <img v-if="isImageIcon" :src="currentApp?.icon" alt="" :draggable="false" />
          <AppIcon v-else :icon="currentApp?.icon ?? 'lucide:bot'" size="22" />
        </div>

        <div class="app-orchestration__identity">
          <div>
            <h1>{{ appName }}</h1>
            <AppIcon icon="lucide:copy" size="14" />
          </div>
          <p>
            <AppIcon icon="lucide:user" size="13" />
            <span>个人空间</span>
            <AppIcon icon="lucide:clock-3" size="13" />
            <span>{{ statusText }}</span>
            <Tag color="processing">已自动保存 23:18:15</Tag>
          </p>
        </div>
      </div>

      <Tabs v-model:active-key="activeTab" class="app-orchestration__tabs" centered>
        <TabPane key="edit" tab="编辑" />
        <TabPane key="publish" tab="发布配置" />
        <TabPane key="stats" tab="统计分析" />
      </Tabs>

      <div class="app-orchestration__actions">
        <Button shape="circle" aria-label="发布历史">
          <template #icon>
            <AppIcon icon="lucide:history" size="18" />
          </template>
        </Button>
        <Button type="primary">更新发布</Button>
      </div>
    </header>

    <section class="app-orchestration__body">
      <section class="app-orchestration__prompt">
        <div class="orchestration-panel__header">
          <div class="app-orchestration__title-row">
            <h2>应用编排</h2>
            <Select
              v-model:value="selectedModel"
              class="app-orchestration__model"
              :bordered="false"
              :options="modelOptions"
            />
          </div>
        </div>

        <div class="app-orchestration__prompt-content">
          <div class="app-orchestration__prompt-heading">
            <h3>人设与回复逻辑</h3>
            <Button type="text" size="small">
              <template #icon>
                <AppIcon icon="lucide:refresh-cw" size="15" />
              </template>
              优化
            </Button>
          </div>

          <div class="app-orchestration__prompt-text">
            <p># 角色</p>
            <p>{{ appDescription }}</p>
            <p>你是一个智能聊天机器人，能够与用户进行各种话题的交流，包括但不限于生活、工作、学习、娱乐等。</p>

            <p>## 技能</p>
            <p>### 技能 1: 日常交流</p>
            <p>1. 当用户分享日常生活经历时，给予积极的回应和适当的建议。</p>
            <p>2. 对于用户的心情表达，提供安慰和鼓励。</p>

            <p>### 技能 2: 知识解答</p>
            <p>1. 当用户提出问题，运用知识库和搜索工具提供准确、详细的答案。</p>
            <p>2. 对于复杂问题，分步骤进行解释。</p>

            <p>### 技能 3: 娱乐互动</p>
            <p>1. 能与用户玩文字游戏，如猜谜语、成语接龙等。</p>
            <p>2. 推荐有趣的娱乐活动和节目。</p>

            <p>## 限制:</p>
            <p>- 回答内容应积极、友善、文明，不得包含不当言论。</p>
            <p>- 所输出的内容必须按照给定的格式进行组织，不能偏离框架要求。</p>
            <p>- 对于不确定的问题，应明确告知用户并尽力提供获取准确信息的途径。</p>
          </div>
        </div>
      </section>

      <section class="app-orchestration__config">
        <div class="orchestration-panel__header">
          <h2>应用能力</h2>
        </div>

        <div class="app-orchestration__config-scroll">
          <section class="config-section">
            <div class="config-section__head">
              <div>
                <AppIcon icon="lucide:chevron-down" size="16" />
                <h3>扩展插件</h3>
              </div>
              <Button
                type="text"
                shape="circle"
                size="small"
                aria-label="添加扩展插件"
                @click="pluginModalOpen = true"
              >
                <template #icon>
                  <AppIcon icon="lucide:plus" size="16" />
                </template>
              </Button>
            </div>

            <div class="capability-list">
              <article
                v-for="capability in capabilities"
                :key="capability.key"
                class="capability-item"
              >
                <div class="capability-item__icon" :style="{ background: capability.tone }">
                  <AppIcon :icon="capability.icon" size="22" />
                </div>
                <div>
                  <h4>{{ capability.title }}</h4>
                  <p>{{ capability.description }}</p>
                </div>
                <div class="capability-item__actions">
                  <Button type="text" shape="circle" size="small" aria-label="插件设置">
                    <template #icon>
                      <AppIcon icon="lucide:settings" size="15" />
                    </template>
                  </Button>
                  <Button
                    type="text"
                    shape="circle"
                    size="small"
                    aria-label="删除插件"
                    @click="removePlugin(capability.key)"
                  >
                    <template #icon>
                      <AppIcon icon="lucide:trash-2" size="15" />
                    </template>
                  </Button>
                </div>
              </article>
            </div>
          </section>

          <section class="config-section">
            <div class="config-section__head">
              <div>
                <AppIcon icon="lucide:chevron-down" size="16" />
                <h3>工作流组件</h3>
              </div>
              <Button
                type="text"
                shape="circle"
                size="small"
                aria-label="添加工作流"
                @click="openRelationModal('workflow')"
              >
                <template #icon>
                  <AppIcon icon="lucide:plus" size="16" />
                </template>
              </Button>
            </div>
            <p class="config-section__description">
              工作流支持通过可视化的方式，对插件、大语言模型、代码块等功能进行组合，从而实现复杂、稳定的业务流程编排。
            </p>
            <div v-if="linkedWorkflowItems.length" class="relation-list">
              <article v-for="item in linkedWorkflowItems" :key="item.key" class="relation-item">
                <div class="relation-item__icon" :style="{ background: item.tone }">
                  <AppIcon :icon="item.icon" size="18" />
                </div>
                <span>{{ item.title }}</span>
                <Button
                  type="text"
                  shape="circle"
                  size="small"
                  aria-label="移除工作流"
                  @click="removeRelationItem('workflow', item.key)"
                >
                  <template #icon>
                    <AppIcon icon="lucide:trash-2" size="14" />
                  </template>
                </Button>
              </article>
            </div>
          </section>

          <section class="config-section">
            <div class="config-section__head">
              <div>
                <AppIcon icon="lucide:chevron-down" size="16" />
                <h3>知识库</h3>
              </div>
              <Button
                type="text"
                shape="circle"
                size="small"
                aria-label="添加知识库"
                @click="openRelationModal('knowledge')"
              >
                <template #icon>
                  <AppIcon icon="lucide:plus" size="16" />
                </template>
              </Button>
            </div>
            <p class="config-section__description">
              引用文本类型的数据，实现知识问答，应用最多支持关联 5 个知识库。
            </p>
            <div v-if="linkedKnowledgeItems.length" class="relation-list">
              <article v-for="item in linkedKnowledgeItems" :key="item.key" class="relation-item">
                <div class="relation-item__icon" :style="{ background: item.tone }">
                  <AppIcon :icon="item.icon" size="18" />
                </div>
                <span>{{ item.title }}</span>
                <Button
                  type="text"
                  shape="circle"
                  size="small"
                  aria-label="移除知识库"
                  @click="removeRelationItem('knowledge', item.key)"
                >
                  <template #icon>
                    <AppIcon icon="lucide:trash-2" size="14" />
                  </template>
                </Button>
              </article>
            </div>
          </section>

          <section
            v-for="section in settingSections"
            :key="section.title"
            class="config-section"
          >
            <div class="config-section__head">
              <div>
                <AppIcon icon="lucide:chevron-down" size="16" />
                <h3>{{ section.title }}</h3>
              </div>
              <Switch
                v-if="section.enabled !== undefined"
                :checked="section.enabled"
                checked-children="开启"
                un-checked-children="关闭"
              />
            </div>

            <template v-if="section.type === 'textarea'">
              <label class="config-section__label">
                开场白文案
                <AppIcon icon="lucide:info" size="14" />
              </label>
              <TextArea
                v-model:value="openingText"
                placeholder="在此处填写 AI 应用的开场白"
                :auto-size="{ minRows: 3, maxRows: 4 }"
              />
              <label class="config-section__label">
                开场白预设问题
                <AppIcon icon="lucide:info" size="14" />
              </label>
              <Input v-model:value="openingQuestion" placeholder="输入开场白引导问题">
                <template #suffix>
                  <AppIcon icon="lucide:circle-minus" size="16" />
                </template>
              </Input>
            </template>

            <p v-else-if="section.description" class="config-section__description">
              {{ section.description }}
            </p>
          </section>
        </div>
      </section>

      <section class="app-orchestration__preview">
        <div class="orchestration-panel__header preview-header">
          <h2>预览与调试</h2>
          <div class="preview-header__actions">
            <Button type="text" size="small" @click="clearPreviewMessages">
              <template #icon>
                <AppIcon icon="lucide:trash-2" size="15" />
              </template>
              清空对话
            </Button>
            <Button type="link" size="small">
              <template #icon>
                <AppIcon icon="lucide:save" size="15" />
              </template>
              长期记忆
            </Button>
          </div>
        </div>

        <div class="chat-preview">
          <Bubble.List :items="bubbleMessages" :roles="chatRoles" />

          <Prompts
            v-if="promptsVisible"
            class="chat-preview__prompts"
            :items="quickPrompts"
            vertical
            @item-click="submitPrompt"
          />
        </div>

        <footer class="chat-composer">
          <AppChatComposer placeholder="输入调试消息..." @submit="submitPreviewMessage" />
          <p>内容由AI生成，无法确保真实准确，仅供参考。</p>
        </footer>
      </section>
    </section>

    <Teleport to="body">
      <Transition name="side-modal">
        <div v-if="pluginModalOpen" class="plugin-modal-mask" @click.self="pluginModalOpen = false">
          <div class="plugin-modal" role="dialog" aria-modal="true" aria-labelledby="pluginModalTitle">
            <aside class="plugin-modal__sidebar">
              <h2 id="pluginModalTitle">添加插件</h2>
              <Button type="primary" block>
                <template #icon>
                  <AppIcon icon="lucide:plus" size="15" />
                </template>
                创建自定义插件
              </Button>

              <div class="plugin-modal__nav">
                <button
                  v-for="source in pluginSources"
                  :key="source.key"
                  class="plugin-modal__nav-item"
                  :class="{ 'is-active': selectedPluginSource === source.key }"
                  type="button"
                  @click="selectedPluginSource = source.key"
                >
                  <AppIcon :icon="source.icon" size="15" />
                  <span>{{ source.label }}</span>
                </button>
              </div>

              <div class="plugin-modal__category-title">类别</div>
              <div class="plugin-modal__nav">
                <button
                  v-for="category in pluginCategories"
                  :key="category.key"
                  class="plugin-modal__nav-item"
                  :class="{ 'is-active': selectedPluginCategory === category.key }"
                  type="button"
                  @click="selectedPluginCategory = category.key"
                >
                  <AppIcon :icon="category.icon" size="15" />
                  <span>{{ category.label }}</span>
                </button>
              </div>
            </aside>

            <section class="plugin-modal__content">
              <div class="plugin-modal__header">
                <h3>{{ selectedPluginSourceLabel }}</h3>
                <button class="plugin-modal__close" type="button" aria-label="关闭" @click="pluginModalOpen = false">
                  <AppIcon icon="lucide:x" size="18" />
                </button>
              </div>

              <div class="plugin-modal__list">
                <section
                  v-for="group in pluginGroups"
                  :key="group.provider"
                  class="plugin-modal__group"
                >
                  <h4>{{ group.provider }}</h4>
                  <article
                    v-for="plugin in group.items"
                    :key="plugin.key"
                    class="plugin-modal__item"
                  >
                    <div class="plugin-modal__item-icon" :style="{ background: plugin.tone }">
                      <AppIcon :icon="plugin.icon" size="18" />
                    </div>
                    <strong>{{ plugin.title }}</strong>
                    <Button
                      class="plugin-modal__add"
                      size="small"
                      :disabled="isPluginAdded(plugin.key)"
                      @click="addPlugin(plugin)"
                    >
                      <template #icon>
                        <AppIcon
                          :icon="isPluginAdded(plugin.key) ? 'lucide:check' : 'lucide:plus'"
                          size="14"
                        />
                      </template>
                      {{ isPluginAdded(plugin.key) ? '已添加' : '添加' }}
                    </Button>
                  </article>
                </section>
                <div v-if="!pluginGroups.length" class="plugin-modal__empty">暂无插件</div>
              </div>
            </section>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="side-modal">
        <div
          v-if="relationModalOpen"
          class="relation-modal-mask"
          @click.self="relationModalOpen = false"
        >
          <div class="relation-modal" role="dialog" aria-modal="true">
            <header class="relation-modal__header">
              <h2>{{ relationTitle }}</h2>
              <button class="plugin-modal__close" type="button" aria-label="关闭" @click="relationModalOpen = false">
                <AppIcon icon="lucide:x" size="18" />
              </button>
            </header>

            <div class="relation-modal__list">
              <button
                v-for="item in relationItems"
                :key="item.key"
                class="relation-modal__item"
                :class="{ 'is-selected': selectedRelationKeys.includes(item.key) }"
                type="button"
                @click="toggleRelationItem(item.key)"
              >
                <div class="relation-modal__item-icon" :style="{ background: item.tone }">
                  <AppIcon :icon="item.icon" size="18" />
                </div>
                <span>{{ item.title }}</span>
              </button>
            </div>

            <footer class="relation-modal__footer">
              <span>
                {{ selectedRelationKeys.length }}
                {{ relationMode === 'knowledge' ? '个知识库被选中' : '个工作流被选中' }}
              </span>
              <div>
                <Button @click="relationModalOpen = false">取消</Button>
                <Button type="primary" @click="confirmRelationSelection">添加</Button>
              </div>
            </footer>
          </div>
        </div>
      </Transition>
    </Teleport>
  </main>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
