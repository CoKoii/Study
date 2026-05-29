export interface AppItem {
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
