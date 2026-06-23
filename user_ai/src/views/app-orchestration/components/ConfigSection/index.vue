<script setup lang="ts">
import AppIcon from '@/components/AppIcon/index.vue'
import { Button } from 'antdv-next'

defineProps<{
  actionLabel?: string
  title: string
}>()

const emit = defineEmits<{
  action: []
}>()
</script>

<template>
  <section class="config-section">
    <div class="config-section__head">
      <div>
        <AppIcon icon="lucide:chevron-down" size="16" />
        <h3>{{ title }}</h3>
      </div>
      <slot name="actions">
        <Button
          v-if="actionLabel"
          type="text"
          shape="circle"
          size="small"
          :aria-label="actionLabel"
          @click="emit('action')"
        >
          <template #icon>
            <AppIcon icon="lucide:plus" size="16" />
          </template>
        </Button>
      </slot>
    </div>

    <slot />
  </section>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
