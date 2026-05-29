<script setup lang="ts">
import CreateAppModal from '@/views/personal-space/components/CreateAppModal/index.vue'
import type { CreateAppPayload } from '@/views/personal-space/share/app'
import { createAppControllerKey } from '@/components/AppLayout/share/create-app'
import { useAppListStore } from '@/stores/app-list'
import { message } from 'antdv-next'
import { provide, ref } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'

import AppMobileHeader from '@/components/AppMobileHeader/index.vue'
import AppSidebar from '@/components/AppSidebar/index.vue'

const appListStore = useAppListStore()
const route = useRoute()
const router = useRouter()
const createModalOpen = ref(false)
const pendingCreateApp = ref(false)

function openCreateModal() {
  createModalOpen.value = true
}

async function requestCreateApp() {
  pendingCreateApp.value = true

  if (route.name !== 'personal-space') {
    await router.push({ name: 'personal-space' })
    return
  }

  openCreateModal()
  pendingCreateApp.value = false
}

function handleRouteReady() {
  if (pendingCreateApp.value && route.name === 'personal-space') {
    openCreateModal()
    pendingCreateApp.value = false
  }
}

function handleCreateApp(payload: CreateAppPayload) {
  appListStore.createApp(payload)
  message.success('创建成功')
}

provide(createAppControllerKey, {
  requestCreateApp,
})
</script>

<template>
  <main class="app-layout">
    <input id="appMenu" class="app-layout__menu-toggle" type="checkbox" />
    <AppMobileHeader />
    <label class="app-layout__scrim" for="appMenu" aria-label="关闭菜单"></label>
    <AppSidebar />
    <section class="app-layout__workspace">
      <RouterView v-slot="{ Component, route }">
        <Transition name="route-fade" mode="out-in" appear @after-enter="handleRouteReady">
          <component :is="Component" :key="route.fullPath" />
        </Transition>
      </RouterView>
    </section>
    <CreateAppModal v-model:open="createModalOpen" mode="create" @submit="handleCreateApp" />
  </main>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
