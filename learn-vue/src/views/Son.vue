<script setup lang="ts">
import { ref } from 'vue'
const a = ref(1)

defineExpose({
  name: 'Son',
  a,
})
</script>

<template>
  <div>{{ a }}</div>
</template>

<style scoped></style>
