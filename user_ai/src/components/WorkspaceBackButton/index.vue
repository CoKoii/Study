<script setup lang="ts">
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
    <span aria-hidden="true"></span>
  </button>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
