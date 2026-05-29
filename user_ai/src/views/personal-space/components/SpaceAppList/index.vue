<script setup lang="ts">
import AppIcon from '@/components/AppIcon/index.vue'
import { createAppControllerKey } from '@/components/AppLayout/share/create-app'
import CreateAppModal from '@/views/personal-space/components/CreateAppModal/index.vue'
import type { AppItem, CreateAppPayload } from '@/views/personal-space/share/app'
import { useAppListStore } from '@/stores/app-list'
import type { MenuItemType } from 'antdv-next'
import { Dropdown, message } from 'antdv-next'
import { storeToRefs } from 'pinia'
import { computed, inject, ref } from 'vue'

const tabs = ['AI应用', '插件', '工作流', '知识库']

const actionItems: MenuItemType[] = [
  { key: 'edit', label: '编辑' },
  { key: 'copy', label: '复制' },
  { key: 'publish', label: '发布' },
  { key: 'delete', label: '删除', danger: true },
]

const appListStore = useAppListStore()
const { appItems } = storeToRefs(appListStore)
const createAppController = inject(createAppControllerKey, {
  requestCreateApp: () => {},
})
const editModalOpen = ref(false)
const editingAppName = ref('')
const editingApp = computed(() => appItems.value.find(item => item.name === editingAppName.value) ?? null)

function openCreateModal() {
  createAppController.requestCreateApp()
}

function openEditModal(item: AppItem) {
  editingAppName.value = item.name
  editModalOpen.value = true
}

function handleSubmitApp(payload: CreateAppPayload) {
  if (appListStore.updateApp(editingAppName.value, payload)) {
    message.success('保存成功')
  }
}

function handleActionClick(item: AppItem, event: { key: string | number }) {
  if (event.key === 'edit') {
    openEditModal(item)
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
      <article v-for="item in appItems" :key="item.name" class="space-app-list__card">
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
