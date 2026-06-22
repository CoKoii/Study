<script setup lang="ts">
import AppIcon from '@/components/AppIcon/index.vue'
import type { CapabilityItem } from '../../share/types'
import { Button } from 'antdv-next'

defineProps<{
  item: CapabilityItem
}>()

const emit = defineEmits<{
  remove: [key: string]
}>()
</script>

<template>
  <article class="capability-item">
    <div class="capability-item__icon" :style="{ background: item.tone }">
      <AppIcon :icon="item.icon" size="22" />
    </div>
    <div>
      <h4>{{ item.title }}</h4>
      <p>{{ item.description }}</p>
    </div>
    <div class="capability-item__actions">
      <Button type="text" shape="circle" size="small" aria-label="插件设置">
        <template #icon>
          <AppIcon icon="lucide:settings" size="15" />
        </template>
      </Button>
      <Button
        type="text"
        shape="circle"
        size="small"
        aria-label="删除插件"
        @click="emit('remove', item.key)"
      >
        <template #icon>
          <AppIcon icon="lucide:trash-2" size="15" />
        </template>
      </Button>
    </div>
  </article>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
