<script setup lang="ts">
import AppIcon from '@/components/AppIcon/index.vue'
import { createAppControllerKey } from '@/components/AppLayout/share/create-app'
import brandIcon from '@/assets/icon.png'
import { exploreItems, navItems } from './menu'
import { inject } from 'vue'

const createAppController = inject(createAppControllerKey, {
  requestCreateApp: () => {},
})

function requestCreateApp() {
  createAppController.requestCreateApp()
}
</script>

<template>
  <aside class="app-sidebar">
    <div class="app-sidebar__panel">
      <label class="app-sidebar__close" for="appMenu" aria-label="关闭菜单">
        <AppIcon icon="lucide:x" size="20" />
      </label>

      <div class="app-sidebar__brand">
        <img class="app-sidebar__brand-icon" :src="brandIcon" alt="" />
        <span class="app-sidebar__brand-text">苏应智汇港</span>
      </div>

      <button class="app-sidebar__create" type="button" @click="requestCreateApp">
        <AppIcon icon="lucide:plus" size="18" />
        <span>创建 AI 应用</span>
      </button>

      <nav class="app-sidebar__nav" aria-label="主导航">
        <RouterLink
          v-for="item in navItems"
          :key="item.label"
          v-slot="{ isActive, navigate }"
          :to="item.to"
          custom
        >
          <button
            class="app-sidebar__item"
            :class="{ 'is-active': isActive }"
            type="button"
            @click="navigate"
          >
            <AppIcon :icon="item.icon" size="20" />
            <span>{{ item.label }}</span>
          </button>
        </RouterLink>
      </nav>

      <section class="app-sidebar__group" aria-label="探索">
        <div class="app-sidebar__title">探索</div>
        <button
          v-for="item in exploreItems"
          :key="item.label"
          class="app-sidebar__item"
          type="button"
        >
          <AppIcon :icon="item.icon" size="20" />
          <span>{{ item.label }}</span>
        </button>
      </section>

      <div class="app-sidebar__account">
        <div class="app-sidebar__avatar">慕</div>
        <div>
          <div class="app-sidebar__name">慕小课</div>
          <div class="app-sidebar__email">zehuiya@163.com</div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
