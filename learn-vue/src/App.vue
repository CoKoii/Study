<script setup lang="ts">
import { ref, watch } from 'vue'
const num = ref(0)
const add = () => {
  num.value++
}
const desc = () => {
  num.value--
}
const stopWatch = watch(num, (n, o) => {
  if (n > 5) {
    console.log('大于5了')
    stopWatch()
  }
})
</script>

<template>
  <button @click="desc">-</button>
  {{ num }}
  <button @click="add">+</button>
</template>

<style scoped></style>
