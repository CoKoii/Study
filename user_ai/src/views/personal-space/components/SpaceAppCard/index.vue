<script setup lang="ts">
import AppIcon from '@/components/AppIcon/index.vue'
import type { SpaceApp } from '@/stores/app-list'
import type { MenuItemType } from 'antdv-next'
import { Dropdown } from 'antdv-next'
import { computed } from 'vue'

const props = defineProps<{
  app: SpaceApp
}>()

const emit = defineEmits<{
  edit: [app: SpaceApp]
  delete: [app: SpaceApp]
}>()

const actions: MenuItemType[] = [
  { key: 'edit', label: '编辑' },
  { key: 'delete', label: '删除', danger: true },
]

const isImageIcon = computed(() => props.app.icon.startsWith('data:'))
const statusText = computed(() => (props.app.status === 'published' ? '已发布' : '草稿'))

function handleActionClick(event: { key: string | number }) {
  switch (event.key) {
    case 'edit':
      emit('edit', props.app)
      break
    case 'delete':
      emit('delete', props.app)
      break
  }
}
</script>

<template>
  <article class="space-app-card">
    <div class="space-app-card__head">
      <div
        class="space-app-card__icon"
        :class="{ 'has-image': isImageIcon }"
        :style="{ backgroundColor: app.accent }"
      >
        <img v-if="isImageIcon" :src="app.icon" alt="" :draggable="false" />
        <AppIcon v-else :icon="app.icon" size="22" />
      </div>

      <div class="space-app-card__title">
        <h2>{{ app.name }}</h2>
        <span>{{ app.type }}</span>
      </div>

      <Dropdown
        :menu="{ items: actions, onClick: handleActionClick }"
        :trigger="['click']"
        placement="bottomRight"
      >
        <button class="space-app-card__more" type="button" aria-label="更多操作">
          <AppIcon icon="lucide:ellipsis" size="20" />
        </button>
      </Dropdown>
    </div>

    <p>{{ app.description }}</p>

    <footer class="space-app-card__meta">
      <span class="space-app-card__status" :class="`is-${app.status}`">
        {{ statusText }}
      </span>
      <time>{{ app.updatedAt }}</time>
    </footer>
  </article>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
