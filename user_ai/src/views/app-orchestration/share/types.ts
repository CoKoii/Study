export interface CapabilityItem {
  description: string
  icon: string
  key: string
  title: string
  tone: string
}

export interface PluginMarketItem extends CapabilityItem {
  category: string
  provider: string
  source: PluginSource
}

export interface RelationItem {
  icon: string
  key: string
  title: string
  tone: string
}

export interface SettingSection {
  description?: string
  enabled?: boolean
  title: string
  type?: 'textarea'
}

export type OrchestrationTab = 'edit' | 'publish' | 'stats'

export type PluginCategory = 'all' | 'search' | 'weather' | 'travel'

export type PluginSource = 'custom' | 'builtin'

export type RelationMode = 'knowledge' | 'workflow'

export interface PublishHistoryItem {
  current?: boolean
  key: string
  publishedAt: string
}

export interface PublishChannel {
  action: 'configure' | 'visit'
  description: string
  icon: string
  key: string
  link?: string
  status: 'configured' | 'unconfigured'
  title: string
  tone: string
}
