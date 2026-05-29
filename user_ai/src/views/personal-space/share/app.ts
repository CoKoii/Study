export interface AppItem {
  id: string
  name: string
  description: string
  icon: string
  accent: string
  updatedAt: string
  status: 'published' | 'draft'
  type: string
}

export interface CreateAppPayload {
  icon: string
  name: string
  description: string
}

export type AppFormMode = 'create' | 'edit'

export const APP_DELETE_WARNING =
  '删除应用后，发布的WebApp、开放API以及关联的社交媒体平台均无法使用该Agent应用，如果需要暂停应用，可使用取消发布功能。'

export const APP_ACTION = {
  edit: 'edit',
  copy: 'copy',
  publish: 'publish',
  delete: 'delete',
} as const
