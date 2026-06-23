<script setup lang="ts">
import AppIcon from '@/components/AppIcon/index.vue'
import WorkspaceBackButton from '@/components/WorkspaceBackButton/index.vue'
import { isImageIcon as getIsImageIcon } from '@/shared/icon'

withDefaults(
  defineProps<{
    accent?: string
    backLabel?: string
    bordered?: boolean
    fallbackIcon?: string
    icon?: string
    title: string
  }>(),
  {
    accent: undefined,
    backLabel: '返回',
    bordered: true,
    fallbackIcon: 'lucide:bot',
    icon: undefined,
  },
)

const emit = defineEmits<{
  back: []
}>()
</script>

<template>
  <header class="workspace-topbar" :class="{ 'is-borderless': !bordered }">
    <div class="workspace-topbar__entity">
      <WorkspaceBackButton :label="backLabel" @click="emit('back')" />

      <div
        class="workspace-topbar__logo"
        :class="{ 'has-image': getIsImageIcon(icon) }"
        :style="{ backgroundColor: accent }"
      >
        <img v-if="getIsImageIcon(icon)" :src="icon" alt="" :draggable="false" />
        <AppIcon v-else :icon="icon ?? fallbackIcon" size="22" />
      </div>

      <div class="workspace-topbar__identity">
        <div>
          <h1>{{ title }}</h1>
          <slot name="title-extra"></slot>
        </div>
        <p>
          <slot name="meta"></slot>
        </p>
      </div>
    </div>

    <div class="workspace-topbar__center">
      <slot name="center"></slot>
    </div>

    <div class="workspace-topbar__actions">
      <slot name="actions"></slot>
    </div>
  </header>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
