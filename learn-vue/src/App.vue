<script setup lang="ts">
import Father from './views/Father.vue'
import { ref } from 'vue'
defineExpose({
  name: 'App',
})
const a = ref(1)
const b = ref(2)
const c = ref(3)
const d = ref(4)
</script>

<template>
  <h1>爷组件-{{ a }}-{{ b }}-{{ c }}-{{ d }}</h1>
  <Father />
</template>

<style scoped></style>
