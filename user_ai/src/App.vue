<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <Transition name="route-fade" mode="out-in">
      <component :is="Component" :key="route.matched[0]?.path ?? route.fullPath" />
    </Transition>
  </RouterView>
</template>

<style scoped lang="scss">
.route-fade-enter-active,
.route-fade-leave-active {
  transition: opacity 0.22s ease;
}

.route-fade-enter-from,
.route-fade-leave-to {
  opacity: 0;
}
</style>
