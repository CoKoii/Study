<script setup lang="ts">
import AppIcon from '@/components/AppIcon/index.vue'
import { isImageIcon } from '@/shared/icon'
import type { SpaceApp } from '@/stores/app-list'
import type { MenuItemType } from 'antdv-next'
import { Dropdown } from 'antdv-next'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  app: SpaceApp
}>()
const router = useRouter()

const emit = defineEmits<{
  open: [app: SpaceApp]
  edit: [app: SpaceApp]
  delete: [app: SpaceApp]
}>()

const actions: MenuItemType[] = [
  { key: 'edit', label: '编辑' },
  { key: 'delete', label: '删除', danger: true },
]

const hasImageIcon = computed(() => isImageIcon(props.app.icon))
const isClickable = computed(() =>
  ['app', 'plugin', 'knowledge'].includes(props.app.kind),
)
const statusText = computed(() => (props.app.status === 'published' ? '已发布' : '草稿'))

function openCard() {
  if (props.app.kind === 'plugin') {
    emit('open', props.app)
    return
  }

  if (props.app.kind === 'knowledge') {
    router.push({ name: 'personal-space-knowledge-detail', params: { knowledgeId: props.app.id } })
    return
  }

  if (props.app.kind !== 'app') {
    return
  }

  router.push({ name: 'app-orchestration', params: { appId: props.app.id } })
}

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
  <article
    class="space-app-card"
    :class="{ 'is-clickable': isClickable }"
    :tabindex="isClickable ? 0 : undefined"
    :role="isClickable ? 'button' : undefined"
    @click="openCard"
    @keydown.enter.prevent="openCard"
    @keydown.space.prevent="openCard"
  >
    <div class="space-app-card__head">
      <div
        class="space-app-card__icon"
        :class="{ 'has-image': hasImageIcon }"
        :style="{ backgroundColor: app.accent }"
      >
        <img v-if="hasImageIcon" :src="app.icon" alt="" :draggable="false" />
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
        <button
          class="space-app-card__more"
          type="button"
          aria-label="更多操作"
          @click.stop
          @keydown.stop
        >
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
