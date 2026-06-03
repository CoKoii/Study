<script setup lang="ts">
import HomeComposer from './components/HomeComposer/index.vue'
import HomeWelcome from './components/HomeWelcome/index.vue'
</script>

<template>
  <div class="home">
    <HomeWelcome />
    <HomeComposer />
  </div>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
