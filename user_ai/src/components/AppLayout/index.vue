<script setup lang="ts">
import { RouterView } from 'vue-router'

import AppMobileHeader from '@/components/AppMobileHeader/index.vue'
import AppSidebar from '@/components/AppSidebar/index.vue'
</script>

<template>
  <main class="app-layout">
    <input id="appMenu" class="app-layout__menu-toggle" type="checkbox" />
    <AppMobileHeader />
    <label class="app-layout__scrim" for="appMenu" aria-label="关闭菜单"></label>
    <AppSidebar />
    <section class="app-layout__workspace">
      <RouterView v-slot="{ Component, route }">
        <Transition :name="route.meta.pageTransition ?? 'workspace-fade'" mode="out-in" appear>
          <component :is="Component" :key="route.meta.workspaceKey ?? route.fullPath" />
        </Transition>
      </RouterView>
    </section>
  </main>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
