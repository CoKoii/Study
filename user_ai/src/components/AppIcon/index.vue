<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  icon: string
  size?: string
}

withDefaults(defineProps<Props>(), {
  size: '1em',
})
</script>

<template>
  <Icon class="app-icon" :icon="icon" :width="size" :height="size" />
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
