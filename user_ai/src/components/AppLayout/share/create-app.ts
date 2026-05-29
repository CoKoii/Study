import type { InjectionKey } from 'vue'

export const createAppControllerKey: InjectionKey<{
  requestCreateApp: () => void
}> = Symbol('create-app-controller')
