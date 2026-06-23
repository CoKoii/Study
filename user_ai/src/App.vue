<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <Transition :name="route.meta.appTransition ?? 'app-shell'" mode="out-in">
      <component :is="Component" :key="route.matched[0]?.path ?? route.fullPath" />
    </Transition>
  </RouterView>
</template>

<style scoped lang="scss">
.app-shell-enter-active,
.app-shell-leave-active,
.page-forward-enter-active,
.page-forward-leave-active {
  transition: opacity 0.22s ease;
}

.page-forward-enter-active,
.page-forward-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}

.app-shell-enter-from,
.app-shell-leave-to,
.page-forward-enter-from,
.page-forward-leave-to {
  opacity: 0;
}

.page-forward-enter-from {
  transform: translateY(0.5rem);
}

.page-forward-leave-to {
  transform: translateY(-0.25rem);
}
</style>
