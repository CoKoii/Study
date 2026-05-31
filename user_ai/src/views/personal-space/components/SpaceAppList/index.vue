<script setup lang="ts">
import AppIcon from '@/components/AppIcon/index.vue'
import CreateAppModal from '@/views/personal-space/components/CreateAppModal/index.vue'
import SpaceAppCard from '@/views/personal-space/components/SpaceAppCard/index.vue'
import { useAppListStore } from '@/stores/app-list'
import { useCreateAppStore } from '@/stores/create-app'
import type { SpaceApp, SpaceAppForm } from '@/stores/app-list'
import { getSpaceResourceByRouteName, spaceResources } from '@/views/personal-space/share/resources'
import { message, Modal } from 'antdv-next'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const appListStore = useAppListStore()
const createAppStore = useCreateAppStore()
const { appItems } = storeToRefs(appListStore)
const route = useRoute()
const router = useRouter()
const tabs = spaceResources
const editModalOpen = ref(false)
const editingAppId = ref('')
const query = ref('')
const activeResource = computed(() => getSpaceResourceByRouteName(route.name))
const filteredItems = computed(() => {
  const keyword = query.value.trim().toLowerCase()

  return appItems.value.filter((item) => {
    if (item.kind !== activeResource.value.kind) {
      return false
    }

    if (!keyword) {
      return true
    }

    return [item.name, item.description, item.type].some((field) =>
      field.toLowerCase().includes(keyword),
    )
  })
})
const editingApp = computed(
  () => appItems.value.find((item) => item.id === editingAppId.value) ?? null,
)

function openCreateModal() {
  createAppStore.requestCreateApp(activeResource.value.kind)
}

function switchTab(routeName: string) {
  if (routeName === route.name) {
    return
  }

  router.push({ name: routeName })
}

function openEditModal(app: SpaceApp) {
  editingAppId.value = app.id
  editModalOpen.value = true
}

function handleSubmitApp(form: SpaceAppForm) {
  if (appListStore.updateApp(editingAppId.value, form)) {
    message.success('保存成功')
  }
}

function deleteApp(app: SpaceApp) {
  Modal.confirm({
    title: `删除${activeResource.value.title}「${app.name}」？`,
    content: activeResource.value.deleteWarning,
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    onOk() {
      if (appListStore.deleteApp(app.id)) {
        message.success('删除成功')
      }
    },
  })
}
</script>

<template>
  <section class="space-app-list">
    <header class="space-app-list__header">
      <h1>{{ activeResource.title }}</h1>
      <button class="space-app-list__create" type="button" @click="openCreateModal">
        <AppIcon icon="lucide:plus" size="18" />
        <span>{{ activeResource.createText }}</span>
      </button>
    </header>

    <div class="space-app-list__toolbar">
      <div class="space-app-list__tabs" aria-label="应用筛选">
        <button
          v-for="tab in tabs"
          :key="tab.kind"
          class="space-app-list__tab"
          :class="{ 'is-active': tab.kind === activeResource.kind }"
          type="button"
          @click="switchTab(tab.routeName)"
        >
          {{ tab.label }}
        </button>
      </div>

      <label class="space-app-list__search">
        <AppIcon icon="lucide:search" size="16" />
        <input v-model="query" type="search" :placeholder="activeResource.searchPlaceholder" />
      </label>
    </div>

    <Transition name="route-fade" mode="out-in" appear>
      <div :key="activeResource.kind" class="space-app-list__content">
        <div v-if="filteredItems.length" class="space-app-list__grid">
          <SpaceAppCard
            v-for="item in filteredItems"
            :key="item.id"
            :app="item"
            @edit="openEditModal"
            @delete="deleteApp"
          />
        </div>

        <div v-else class="space-app-list__empty">
          <AppIcon icon="lucide:inbox" size="28" />
          <span>{{ activeResource.emptyText }}</span>
        </div>
      </div>
    </Transition>

    <CreateAppModal
      v-model:open="editModalOpen"
      mode="edit"
      :resource-kind="activeResource.kind"
      :initial-value="editingApp"
      @submit="handleSubmitApp"
    />
  </section>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
