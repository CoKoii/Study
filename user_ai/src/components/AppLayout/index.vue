<script setup lang="ts">
import CreateAppModal from '@/views/personal-space/components/CreateAppModal/index.vue'
import { useAppListStore } from '@/stores/app-list'
import { useCreateAppStore } from '@/stores/create-app'
import type { SpaceAppForm } from '@/stores/app-list'
import { getSpaceResourceByKind } from '@/views/personal-space/share/resources'
import type { SpaceResourceKind } from '@/views/personal-space/share/resources'
import { message } from 'antdv-next'
import { computed, ref, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'

import AppMobileHeader from '@/components/AppMobileHeader/index.vue'
import AppSidebar from '@/components/AppSidebar/index.vue'

const appListStore = useAppListStore()
const createAppStore = useCreateAppStore()
const route = useRoute()
const router = useRouter()
const createModalOpen = ref(false)
const creatingKind = ref<SpaceResourceKind>('app')
const requestedRouteName = computed(() => getSpaceResourceByKind(createAppStore.requestedKind).routeName)
const handledRequestId = ref(0)

function openCreateModal() {
  createModalOpen.value = true
}

function syncCreateRequest() {
  if (handledRequestId.value === createAppStore.requestId) {
    return
  }

  if (route.name !== requestedRouteName.value) {
    router.push({ name: requestedRouteName.value })
    return
  }

  creatingKind.value = createAppStore.requestedKind
  createModalOpen.value = true
  handledRequestId.value = createAppStore.requestId
}

watch(() => createAppStore.requestId, syncCreateRequest)
watch(() => route.name, syncCreateRequest)

function handleCreateApp(form: SpaceAppForm) {
  appListStore.createApp(form, creatingKind.value)
  createModalOpen.value = false
  message.success('创建成功')
}
</script>

<template>
  <main class="app-layout">
    <input id="appMenu" class="app-layout__menu-toggle" type="checkbox" />
    <AppMobileHeader />
    <label class="app-layout__scrim" for="appMenu" aria-label="关闭菜单"></label>
    <AppSidebar />
    <section class="app-layout__workspace">
      <RouterView v-slot="{ Component, route }">
        <Transition name="route-fade" mode="out-in" appear>
          <component :is="Component" :key="route.meta.workspaceKey ?? route.fullPath" />
        </Transition>
      </RouterView>
    </section>
    <CreateAppModal
      v-model:open="createModalOpen"
      mode="create"
      :resource-kind="creatingKind"
      @submit="handleCreateApp"
    />
  </main>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
