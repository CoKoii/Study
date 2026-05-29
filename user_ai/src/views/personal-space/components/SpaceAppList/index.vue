<script setup lang="ts">
import AppIcon from '@/components/AppIcon/index.vue'
import { createAppControllerKey } from '@/components/AppLayout/share/create-app'
import CreateAppModal from '@/views/personal-space/components/CreateAppModal/index.vue'
import SpaceAppCard from '@/views/personal-space/components/SpaceAppCard/index.vue'
import { useAppListStore } from '@/stores/app-list'
import type { SpaceApp, SpaceAppForm } from '@/stores/app-list'
import { message, Modal } from 'antdv-next'
import { storeToRefs } from 'pinia'
import { computed, inject, ref } from 'vue'

const tabs = ['AI应用', '插件', '工作流', '知识库']
const deleteWarning =
  '删除应用后，发布的WebApp、开放API以及关联的社交媒体平台均无法使用该Agent应用，如果需要暂停应用，可使用取消发布功能。'

const appListStore = useAppListStore()
const { appItems } = storeToRefs(appListStore)
const createAppController = inject(createAppControllerKey, {
  requestCreateApp: () => {},
})
const editModalOpen = ref(false)
const editingAppId = ref('')
const editingApp = computed(
  () => appItems.value.find((item) => item.id === editingAppId.value) ?? null,
)

function openCreateModal() {
  createAppController.requestCreateApp()
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
    title: `删除应用「${app.name}」？`,
    content: deleteWarning,
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
      <h1>应用</h1>
      <button class="space-app-list__create" type="button" @click="openCreateModal">
        <AppIcon icon="lucide:plus" size="18" />
        <span>创建AI应用</span>
      </button>
    </header>

    <div class="space-app-list__toolbar">
      <div class="space-app-list__tabs" aria-label="应用筛选">
        <button
          v-for="(tab, index) in tabs"
          :key="tab"
          class="space-app-list__tab"
          :class="{ 'is-active': index === 0 }"
          type="button"
        >
          {{ tab }}
        </button>
      </div>

      <label class="space-app-list__search">
        <AppIcon icon="lucide:search" size="16" />
        <input type="search" placeholder="搜索应用" />
      </label>
    </div>

    <div class="space-app-list__grid">
      <SpaceAppCard
        v-for="item in appItems"
        :key="item.id"
        :app="item"
        @edit="openEditModal"
        @delete="deleteApp"
      />
    </div>

    <CreateAppModal
      v-model:open="editModalOpen"
      mode="edit"
      :initial-value="editingApp"
      @submit="handleSubmitApp"
    />
  </section>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
