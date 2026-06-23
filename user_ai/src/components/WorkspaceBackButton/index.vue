<script setup lang="ts">
import AppIcon from '@/components/AppIcon/index.vue'

withDefaults(
  defineProps<{
    label?: string
  }>(),
  {
    label: '返回',
  },
)

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <button class="workspace-back-button" type="button" :aria-label="label" @click="emit('click')">
    <AppIcon icon="lucide:chevron-left" size="22" />
  </button>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
