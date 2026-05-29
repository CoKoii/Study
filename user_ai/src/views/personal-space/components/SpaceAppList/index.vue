<script setup lang="ts">
import AppIcon from '@/components/AppIcon/index.vue'
import { createAppControllerKey } from '@/components/AppLayout/share/create-app'
import CreateAppModal from '@/views/personal-space/components/CreateAppModal/index.vue'
import { APP_ACTION, APP_DELETE_WARNING } from '@/views/personal-space/share/app'
import type { AppItem, CreateAppPayload } from '@/views/personal-space/share/app'
import { useAppListStore } from '@/stores/app-list'
import type { MenuItemType } from 'antdv-next'
import { Dropdown, message, Modal } from 'antdv-next'
import { storeToRefs } from 'pinia'
import { computed, inject, ref } from 'vue'

const tabs = ['AI应用', '插件', '工作流', '知识库']

const actionItems: MenuItemType[] = [
  { key: APP_ACTION.edit, label: '编辑' },
  { key: APP_ACTION.copy, label: '复制' },
  { key: APP_ACTION.publish, label: '发布' },
  { key: APP_ACTION.delete, label: '删除', danger: true },
]

const appListStore = useAppListStore()
const { appItems } = storeToRefs(appListStore)
const createAppController = inject(createAppControllerKey, {
  requestCreateApp: () => {},
})
const editModalOpen = ref(false)
const editingAppId = ref('')
const editingApp = computed(() => appItems.value.find(item => item.id === editingAppId.value) ?? null)

function openCreateModal() {
  createAppController.requestCreateApp()
}

function openEditModal(item: AppItem) {
  editingAppId.value = item.id
  editModalOpen.value = true
}

function handleSubmitApp(payload: CreateAppPayload) {
  if (appListStore.updateApp(editingAppId.value, payload)) {
    message.success('保存成功')
  }
}

function deleteApp(item: AppItem) {
  Modal.confirm({
    title: `删除应用「${item.name}」？`,
    content: APP_DELETE_WARNING,
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    onOk() {
      if (appListStore.deleteApp(item.id)) {
        message.success('删除成功')
      }
    },
  })
}

function handleActionClick(item: AppItem, event: { key: string | number }) {
  if (event.key === APP_ACTION.edit) {
    openEditModal(item)
    return
  }

  if (event.key === APP_ACTION.delete) {
    deleteApp(item)
  }
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
      <article v-for="item in appItems" :key="item.id" class="space-app-list__card">
        <div class="space-app-list__card-head">
          <div
            class="space-app-list__app-icon"
            :class="{ 'has-image': item.icon.startsWith('data:') }"
            :style="{ backgroundColor: item.accent }"
          >
            <img v-if="item.icon.startsWith('data:')" :src="item.icon" alt="" :draggable="false" />
            <AppIcon v-else :icon="item.icon" size="22" />
          </div>
          <div class="space-app-list__card-title">
            <h2>{{ item.name }}</h2>
            <span>{{ item.type }}</span>
          </div>
          <Dropdown
            :menu="{ items: actionItems, onClick: event => handleActionClick(item, event) }"
            :trigger="['click']"
            placement="bottomRight"
          >
            <button class="space-app-list__more" type="button" aria-label="更多操作">
              <AppIcon icon="lucide:ellipsis" size="20" />
            </button>
          </Dropdown>
        </div>

        <p>{{ item.description }}</p>

        <footer class="space-app-list__meta">
          <span class="space-app-list__status" :class="`is-${item.status}`">
            {{ item.status === 'published' ? '已发布' : '草稿' }}
          </span>
          <time>{{ item.updatedAt }}</time>
        </footer>
      </article>
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
