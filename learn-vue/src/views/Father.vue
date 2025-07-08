<script setup lang="ts">
import { ref } from 'vue'
import Son from '@/views/Son.vue'
defineExpose({
  name: 'Father',
})
const getSon = (ref: any) => {
  for (const key in ref) {
    ref[key].a++
  }
}
const son = ref(null)
</script>

<template>
  <h3 @click="getSon($refs)">父组件</h3>
  <Son ref="son" />
</template>

<style scoped></style>
