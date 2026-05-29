import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { AppItem, CreateAppPayload } from '@/views/personal-space/share/app'
import { createAppItem, formatUpdatedAt, initialAppItems } from '@/views/personal-space/share/app-list'

export const useAppListStore = defineStore('app-list', () => {
  const appItems = ref<AppItem[]>([...initialAppItems])

  function findAppIndex(id: string) {
    return appItems.value.findIndex(item => item.id === id)
  }

  function createApp(payload: CreateAppPayload) {
    appItems.value.unshift(createAppItem(payload))
  }

  function updateApp(id: string, payload: CreateAppPayload) {
    const targetIndex = findAppIndex(id)
    const targetItem = appItems.value[targetIndex]

    if (!targetItem) {
      return false
    }

    appItems.value[targetIndex] = {
      ...targetItem,
      name: payload.name,
      description: payload.description || '暂无应用描述。',
      icon: payload.icon,
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
