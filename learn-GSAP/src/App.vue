<template>
  <div class="list">
    <div class="item" v-for="i in 5" :key="i">Item {{ i }}</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { gsap } from 'gsap'

onMounted(() => {
  gsap.from('.item', {
    y: 50,
    opacity: 0,
    duration: 0.5,
    stagger: 0.2, // 每个元素依次入场
    repeatDelay: 10,
    repeat: -1,
    ease: 'bounce.out',
  })
})
</script>

<style scoped>
.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.item {
  background-color: #4fd1c5;
  padding: 10px;
  border-radius: 6px;
  color: white;
}
</style>
