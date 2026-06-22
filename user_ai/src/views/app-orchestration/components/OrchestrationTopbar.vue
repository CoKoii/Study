<script setup lang="ts">
import AppIcon from '@/components/AppIcon/index.vue'
import type { SpaceApp } from '@/stores/app-list'
import { publishActions, type OrchestrationTab } from '../share/orchestration-data'
import { Button, Dropdown, TabPane, Tabs, Tag } from 'antdv-next'

const activeTab = defineModel<OrchestrationTab>('activeTab', { required: true })

defineProps<{
  app?: SpaceApp
  appName: string
  isImageIcon: boolean
  statusText: string
}>()

const emit = defineEmits<{
  back: []
  'open-publish-history': []
  'publish-action': [event: { key: string | number }]
  'update-publish': []
}>()
</script>

<template>
  <header class="app-orchestration__topbar">
    <div class="app-orchestration__app">
      <button
        class="app-orchestration__back"
        type="button"
        aria-label="返回应用列表"
        @click="emit('back')"
      >
        <span aria-hidden="true"></span>
      </button>

      <div
        class="app-orchestration__logo"
        :class="{ 'has-image': isImageIcon }"
        :style="{ backgroundColor: app?.accent }"
      >
        <img v-if="isImageIcon" :src="app?.icon" alt="" :draggable="false" />
        <AppIcon v-else :icon="app?.icon ?? 'lucide:bot'" size="22" />
      </div>

      <div class="app-orchestration__identity">
        <div>
          <h1>{{ appName }}</h1>
          <AppIcon icon="lucide:copy" size="14" />
        </div>
        <p>
          <AppIcon icon="lucide:user" size="13" />
          <span>个人空间</span>
          <AppIcon icon="lucide:clock-3" size="13" />
          <span>{{ statusText }}</span>
          <Tag color="processing">已自动保存 23:18:15</Tag>
        </p>
      </div>
    </div>

    <Tabs v-model:active-key="activeTab" class="app-orchestration__tabs" centered>
      <TabPane key="edit" tab="编辑" />
      <TabPane key="publish" tab="发布配置" />
      <TabPane key="stats" tab="统计分析" />
    </Tabs>

    <div v-if="activeTab === 'edit'" class="app-orchestration__actions">
      <Button shape="circle" aria-label="发布历史" @click="emit('open-publish-history')">
        <template #icon>
          <AppIcon icon="lucide:history" size="18" />
        </template>
      </Button>
      <div class="publish-action">
        <Button class="publish-action__main" type="primary" @click="emit('update-publish')">
          更新发布
        </Button>
        <Dropdown
          :menu="{ items: publishActions, onClick: (event) => emit('publish-action', event) }"
          :trigger="['click']"
          placement="bottomRight"
        >
          <Button class="publish-action__toggle" type="primary" aria-label="发布操作">
            <AppIcon icon="lucide:chevron-down" size="14" />
          </Button>
        </Dropdown>
      </div>
    </div>
  </header>
</template>
