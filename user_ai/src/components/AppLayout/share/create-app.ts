import type { InjectionKey } from 'vue'

export interface CreateAppController {
  requestCreateApp: () => void
}

export const createAppControllerKey: InjectionKey<CreateAppController> = Symbol('create-app-controller')
