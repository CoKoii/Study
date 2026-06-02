<script setup lang="ts">
import AppIcon from '@/components/AppIcon/index.vue'
import CreateAppModal from '@/views/personal-space/components/CreateAppModal/index.vue'
import SpaceAppCard from '@/views/personal-space/components/SpaceAppCard/index.vue'
import { useAppListStore } from '@/stores/app-list'
import type { SpaceApp, SpaceAppForm } from '@/stores/app-list'
import { getSpaceResourceByRouteName, spaceResources } from '@/views/personal-space/share/resources'
import { message, Modal } from 'antdv-next'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const appListStore = useAppListStore()
const { appItems } = storeToRefs(appListStore)
const route = useRoute()
const router = useRouter()
const tabs = spaceResources
const modalMode = ref<'create' | 'edit' | null>(null)
const editingApp = ref<SpaceApp | null>(null)
const query = ref('')
const activeResource = computed(() => getSpaceResourceByRouteName(route.name))
const modalOpen = computed({
  get: () => modalMode.value !== null,
  set: (open) => {
    if (!open) {
      closeModal()
    }
  },
})
const modalResourceKind = computed(() => editingApp.value?.kind ?? activeResource.value.kind)
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

function openCreateModal() {
  editingApp.value = null
  modalMode.value = 'create'
}

function switchTab(routeName: string) {
  if (routeName === route.name) {
    return
  }

  router.push({ name: routeName })
}

function openEditModal(app: SpaceApp) {
  editingApp.value = app
  modalMode.value = 'edit'
}

function closeModal() {
  modalMode.value = null
  editingApp.value = null
}

function handleSubmitApp(form: SpaceAppForm) {
  if (modalMode.value === 'edit') {
    handleUpdateApp(form)
    return
  }

  appListStore.createApp(form, activeResource.value.kind)
  closeModal()
  message.success('创建成功')
}

function handleUpdateApp(form: SpaceAppForm) {
  if (editingApp.value && appListStore.updateApp(editingApp.value.id, form)) {
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

watch(
  () => route.query.create,
  (create) => {
    if (create !== '1') {
      return
    }

    openCreateModal()
    router.replace({ name: route.name ?? undefined, query: { ...route.query, create: undefined } })
  },
  { immediate: true },
)
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
      v-model:open="modalOpen"
      :mode="modalMode ?? 'create'"
      :resource-kind="modalResourceKind"
      :initial-value="editingApp"
      @submit="handleSubmitApp"
    />
  </section>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
