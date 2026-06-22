import type {
  CapabilityItem,
  PluginCategory,
  PluginMarketItem,
  PluginSource,
  PublishChannel,
  PublishHistoryItem,
  RelationItem,
  SettingSection,
} from './types'

export const defaultModelSettings = {
  contextMessages: 10,
  frequencyPenalty: 0.1,
  maxTokens: 8192,
  presencePenalty: 0.1,
  temperature: 1,
  topP: 0.48,
}

export type ModelSettingKey = keyof typeof defaultModelSettings

export interface ModelSettingItem {
  key: ModelSettingKey
  label: string
  max: number
  min: number
  step: number
}

export interface ModelSettingGroup {
  items: ModelSettingItem[]
  title: string
}

export const modelOptions = [
  { label: 'GPT-4o', value: 'gpt-4o' },
  { label: 'GPT-4.1', value: 'gpt-4.1' },
  { label: 'Claude 3.5', value: 'claude-3.5' },
]

export const modelSettingGroups: ModelSettingGroup[] = [
  {
    title: '参数',
    items: [
      { key: 'temperature', label: '温度', min: 0, max: 2, step: 0.01 },
      { key: 'topP', label: 'Top P', min: 0, max: 1, step: 0.01 },
      { key: 'presencePenalty', label: '存在惩罚', min: 0, max: 2, step: 0.01 },
      { key: 'frequencyPenalty', label: '频率惩罚', min: 0, max: 2, step: 0.01 },
    ],
  },
  {
    title: '输入及输出设置',
    items: [
      { key: 'contextMessages', label: '携带上下文轮数', min: 0, max: 20, step: 1 },
      { key: 'maxTokens', label: '最大回复长度', min: 1024, max: 8192, step: 1 },
    ],
  },
]

export const publishHistoryItems: PublishHistoryItem[] = [
  { key: '009', publishedAt: '2024-08-15 17:54', current: true },
  { key: '008', publishedAt: '2024-08-14 11:41' },
  { key: '007', publishedAt: '2024-08-14 08:34' },
  { key: '006', publishedAt: '2024-08-11 23:11' },
]

export const publishActions = [
  {
    key: 'unpublish',
    label: '取消发布',
    danger: true,
  },
]

export const publishChannels: PublishChannel[] = [
  {
    key: 'web',
    title: '网页版',
    description: '可通过访问PC网页立即开始对话。',
    icon: 'lucide:panel-top',
    tone: '#e0f2fe',
    status: 'configured',
    action: 'visit',
    link: 'https://www.llmops-imooc.com/web-app/WNFEKnzu',
  },
  {
    key: 'wechat',
    title: '微信公众号（订阅号、服务号）',
    description: '接入微信公众号，自动回复用户消息，助力高效私域运营',
    icon: 'lucide:messages-square',
    tone: '#dcfce7',
    status: 'unconfigured',
    action: 'configure',
  },
  {
    key: 'feishu',
    title: '飞书（Bot群聊机器人）',
    description: '在飞书中直接 @Bot 对话，提高工作生产力',
    icon: 'lucide:send',
    tone: '#e0f2fe',
    status: 'unconfigured',
    action: 'configure',
  },
]

export const initialCapabilities: CapabilityItem[] = [
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
]

export const pluginSources: Array<{ icon: string; key: PluginSource; label: string }> = [
  { key: 'custom', label: '自定义插件', icon: 'lucide:package' },
  { key: 'builtin', label: '内置', icon: 'lucide:blocks' },
]

export const pluginCategories: Array<{ icon: string; key: PluginCategory; label: string }> = [
  { key: 'all', label: '全部', icon: 'lucide:layout-grid' },
  { key: 'search', label: '搜索', icon: 'lucide:search' },
  { key: 'weather', label: '天气', icon: 'lucide:cloud-sun' },
  { key: 'travel', label: '旅行', icon: 'lucide:luggage' },
]

export const pluginMarketItems: PluginMarketItem[] = [
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

export const knowledgeItems: RelationItem[] = [
  {
    key: 'langchain-translation',
    title: 'LangChain翻译文档',
    icon: 'lucide:languages',
    tone: '#dbeafe',
  },
  { key: 'llmops-api', title: '慕课LLMOps项目API文档', icon: 'lucide:book-open', tone: '#ede9fe' },
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
  { key: 'ecommerce', title: '合虎电商数据合集', icon: 'lucide:database', tone: '#d1fae5' },
]

export const workflowItems: RelationItem[] = [
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
  { key: 'test-workflow', title: '慕课测试工作流', icon: 'lucide:workflow', tone: '#dcfce7' },
  {
    key: 'llm-roundtable',
    title: '多LLM回复内容整合工作流',
    icon: 'lucide:combine',
    tone: '#d1fae5',
  },
]

export const settingSections: SettingSection[] = [
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

export const quickPrompts = [
  { key: 'scenario', label: 'LLM 大语言模型有什么应用场景？' },
  { key: 'open-source', label: '有哪些开源的LLM模型？' },
  { key: 'agent', label: 'LLM与Agent之间的关系是什么？' },
]
