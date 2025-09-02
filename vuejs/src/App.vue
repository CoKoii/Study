<script setup lang="ts">
import { ref } from 'vue'

defineOptions({
  name: 'App',
})
const count = ref(0)
setInterval(() => {
  count.value++
}, 1000)
</script>

<template>
  <div class="App" v-once>{{ count }}</div>
</template>

<style scoped lang="scss"></style>
