export interface MarketCategory {
  key: string
  label: string
}

export interface MarketItem {
  author: string
  category: string
  description: string
  icon: string
  id: string
  meta: string
  publishedAt: string
  title: string
  tone: string
  verified?: boolean
}

export interface MarketResource {
  actionText: string
  categories: MarketCategory[]
  emptyText: string
  items: MarketItem[]
  searchPlaceholder: string
  title: string
}

const appCategories: MarketCategory[] = [
  { key: 'all', label: '全部' },
  { key: 'assistant', label: '助手' },
  { key: 'hr', label: '人力资源' },
  { key: 'writing', label: '写作' },
  { key: 'marketing', label: '电商营销' },
]

const pluginCategories: MarketCategory[] = [
  { key: 'all', label: '全部' },
  { key: 'search', label: '搜索' },
  { key: 'weather', label: '天气' },
  { key: 'travel', label: '旅行' },
  { key: 'business', label: '企业服务' },
]

const appItems: MarketItem[] = [
  {
    id: 'ecommerce-service',
    title: '电商智能客服',
    author: '月之暗面',
    meta: 'Moonshot（128K）',
    category: 'marketing',
    icon: 'lucide:headphones',
    tone: '#4f46e5',
    publishedAt: '05-15 16:05',
    description:
      '## 任务 您的主要使命是通过 DALL-E 工具赋能用户，激发他们的创造力。通过询问设计目标和使用场景，引导用户分享他们想要创造的设计核心。',
  },
  {
    id: 'delivery-helper',
    title: '快递小助手',
    author: 'OpenAI',
    meta: 'gpt-3-turbo-16k',
    category: 'assistant',
    icon: 'lucide:package-search',
    tone: '#0891b2',
    publishedAt: '05-03 11:21',
    description: '一个能帮你查询快递信息的小助手',
  },
  {
    id: 'travel-planner',
    title: '旅游规划助手',
    author: 'OpenAI',
    meta: 'gpt-4o',
    category: 'assistant',
    icon: 'lucide:map',
    tone: '#64748b',
    publishedAt: '05-20 10:14',
    description:
      '## 角色：旅行顾问 ### 技能：精通使用工具提供有关当地条件、住宿等的全面信息，能够使用 Markdown 语法生成结构化文本。',
  },
  {
    id: 'emoji-translator',
    title: 'Emoji翻译器',
    author: 'OpenAI',
    meta: 'gpt-3-turbo-16k',
    category: 'writing',
    icon: 'lucide:smile-plus',
    tone: '#4f46e5',
    publishedAt: '05-15 16:05',
    description:
      '我是一个表情符号翻译机器人，会把你发过来的语句用表情符号翻译给你，也可以玩表情符号猜题游戏。',
  },
  {
    id: 'prompt-cat',
    title: '提示工程猫',
    author: 'OpenAI',
    meta: 'gpt-3-turbo-16k',
    category: 'writing',
    icon: 'lucide:wand-sparkles',
    tone: '#9ca3af',
    publishedAt: '05-03 11:21',
    description: '专门磨提示词的 bot，输入你的创意，自动生成好用的提示词，并提供各类功能建议。',
  },
  {
    id: 'exam-guide',
    title: '高考专业指南',
    author: 'OpenAI',
    meta: 'gpt-4o',
    category: 'assistant',
    icon: 'lucide:graduation-cap',
    tone: '#2563eb',
    publishedAt: '05-20 10:14',
    description:
      '通过十道有趣的问题探索你的兴趣和潜力，找出最适合你的专业，并说明高校选择和未来就业前景。',
  },
  {
    id: 'xiaohongshu',
    title: '小红书文案输出大师',
    author: '月之暗面',
    meta: 'Moonshot（128K）',
    category: 'marketing',
    icon: 'lucide:notebook-pen',
    tone: '#0f766e',
    publishedAt: '05-15 16:05',
    description: '专注于小红书爆款创造。',
  },
  {
    id: 'ai-code-helper',
    title: 'AI编程助手',
    author: '阿里',
    meta: '通义千问Max',
    category: 'assistant',
    icon: 'lucide:code-2',
    tone: '#1f2937',
    publishedAt: '05-15 16:05',
    description:
      '采用智能大模型，自动化 AI 编程。熟悉 Java、C、C++、Python、Rust、Go 等编程语言，能够回答复杂的编程问题。',
    verified: true,
  },
  {
    id: 'painting-master',
    title: '小画匠',
    author: '月之暗面',
    meta: 'Moonshot（128K）',
    category: 'writing',
    icon: 'lucide:palette',
    tone: '#f59e0b',
    publishedAt: '05-15 16:05',
    description:
      '一个能根据文字生成图片的机器人，支持风格、光线、材质、渲染、色彩、构图、视角等调教。',
  },
  {
    id: 'hr-interview',
    title: '面试问题生成器',
    author: '慕小课',
    meta: 'gpt-4o',
    category: 'hr',
    icon: 'lucide:user-check',
    tone: '#db2777',
    publishedAt: '05-12 09:30',
    description: '根据岗位职责、候选人简历和能力模型生成结构化面试问题，帮助招聘团队统一评估口径。',
  },
  {
    id: 'job-description',
    title: '岗位 JD 助手',
    author: '慕小课',
    meta: 'gpt-4o',
    category: 'hr',
    icon: 'lucide:file-user',
    tone: '#16a34a',
    publishedAt: '05-10 18:20',
    description: '输入岗位目标、团队阶段和核心能力要求，快速生成清晰、可发布的招聘 JD。',
  },
  {
    id: 'product-copy',
    title: '商品卖点提炼',
    author: '慕小课',
    meta: 'Moonshot（128K）',
    category: 'marketing',
    icon: 'lucide:badge-percent',
    tone: '#ea580c',
    publishedAt: '05-08 14:42',
    description: '从商品参数、用户评价和竞品信息中提炼核心卖点，生成电商标题、短描述和直播口播。',
  },
]

const pluginItems: MarketItem[] = [
  {
    id: 'google-search',
    title: '谷歌搜索',
    author: 'Google',
    meta: '内置插件',
    category: 'search',
    icon: 'lucide:search',
    tone: '#2563eb',
    publishedAt: '05-21 10:18',
    description: '检索公开网页内容，适用于问答、资料收集、事实核验和市场信息查询。',
  },
  {
    id: 'duckduckgo-chat',
    title: 'DuckDuckGo AI聊天',
    author: 'DuckDuckGo',
    meta: '内置插件',
    category: 'search',
    icon: 'lucide:message-circle',
    tone: '#0d9488',
    publishedAt: '05-18 16:42',
    description: '调用 DuckDuckGo 的 AI 聊天能力，快速获取搜索增强后的回答。',
  },
  {
    id: 'duckduckgo-image',
    title: 'DuckDuckGo 图片搜索',
    author: 'DuckDuckGo',
    meta: '内置插件',
    category: 'search',
    icon: 'lucide:image',
    tone: '#ea580c',
    publishedAt: '05-17 11:20',
    description: '按关键词检索图片结果，适合素材发现、视觉参考和内容创作场景。',
  },
  {
    id: 'weather-custom',
    title: '天气查询服务',
    author: '个人空间',
    meta: 'HTTP 插件',
    category: 'weather',
    icon: 'lucide:cloud-sun',
    tone: '#0284c7',
    publishedAt: '05-16 09:35',
    description: '通过城市名称获取实时天气、未来预报和空气质量数据，适用于客服和出行场景。',
  },
  {
    id: 'maps-api',
    title: '地图地点查询',
    author: 'SerperApi',
    meta: '内置插件',
    category: 'travel',
    icon: 'lucide:map-pin',
    tone: '#7c3aed',
    publishedAt: '05-14 15:08',
    description: '查询地点、路线和周边服务信息，帮助旅行、门店和本地生活应用完成信息补全。',
  },
  {
    id: 'crm-mcp',
    title: 'CRM MCP 服务',
    author: '慕小课',
    meta: 'MCP 服务',
    category: 'business',
    icon: 'lucide:server-cog',
    tone: '#4f46e5',
    publishedAt: '05-12 13:45',
    description: '封装客户资料、商机阶段和跟进记录查询能力，支持在应用编排中直接调用。',
  },
  {
    id: 'order-query',
    title: '订单查询插件',
    author: '慕小课',
    meta: '自定义插件',
    category: 'business',
    icon: 'lucide:package-search',
    tone: '#0f766e',
    publishedAt: '05-10 19:12',
    description: '连接业务订单系统，按手机号、订单号或用户 ID 查询订单状态和物流信息。',
  },
  {
    id: 'flight-helper',
    title: '航班动态查询',
    author: 'TravelHub',
    meta: 'HTTP 插件',
    category: 'travel',
    icon: 'lucide:plane',
    tone: '#0891b2',
    publishedAt: '05-08 08:30',
    description: '按航班号或城市查询航班动态、起降时间和航站楼信息。',
  },
]

export const marketResources = {
  app: {
    actionText: '添加到工作区',
    categories: appCategories,
    emptyText: '暂无匹配应用',
    items: appItems,
    searchPlaceholder: '搜索应用',
    title: '应用广场',
  },
  plugin: {
    actionText: '添加到工作区',
    categories: pluginCategories,
    emptyText: '暂无匹配插件',
    items: pluginItems,
    searchPlaceholder: '搜索插件',
    title: '插件广场',
  },
} satisfies Record<'app' | 'plugin', MarketResource>
