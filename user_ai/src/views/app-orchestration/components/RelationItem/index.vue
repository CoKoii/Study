<script setup lang="ts">
import AppIcon from '@/components/AppIcon/index.vue'
import type { RelationItem } from '../../share/types'
import { Button } from 'antdv-next'

defineProps<{
  item: RelationItem
  removeLabel: string
}>()

const emit = defineEmits<{
  remove: [key: string]
}>()
</script>

<template>
  <article class="relation-item">
    <div class="relation-item__icon" :style="{ background: item.tone }">
      <AppIcon :icon="item.icon" size="18" />
    </div>
    <span>{{ item.title }}</span>
    <Button
      type="text"
      shape="circle"
      size="small"
      :aria-label="removeLabel"
      @click="emit('remove', item.key)"
    >
      <template #icon>
        <AppIcon icon="lucide:trash-2" size="14" />
      </template>
    </Button>
  </article>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
