import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { SpaceResourceKind } from '@/views/personal-space/share/resources'

export const useCreateAppStore = defineStore('create-app', () => {
  const requestId = ref(0)
  const requestedKind = ref<SpaceResourceKind>('app')

  function requestCreateApp(kind: SpaceResourceKind = 'app') {
    requestedKind.value = kind
    requestId.value += 1
  }

  return {
    requestCreateApp,
    requestId,
    requestedKind,
  }
})
