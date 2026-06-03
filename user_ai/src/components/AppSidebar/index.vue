<script setup lang="ts">
import AppIcon from '@/components/AppIcon/index.vue'
import brandIcon from '@/assets/icon.png'
import { appResource } from '@/views/personal-space/share/resources'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const sidebarItems = router
  .getRoutes()
  .filter((route) => route.meta.sidebar)
  .map((route) => ({
    to: route.path,
    ...route.meta.sidebar!,
  }))
const navItems = sidebarItems.filter((item) => item.group === 'main')
const exploreItems = sidebarItems.filter((item) => item.group === 'explore')

function requestCreateApp() {
  router.push({ name: appResource.routeName, query: { create: '1' } })
  closeMenu()
}

function isActivePath(path: string) {
  if (path === '/') {
    return route.path === path
  }

  return route.path === path || route.path.startsWith(`${path}/`)
}

function getMenuIcon(item: (typeof sidebarItems)[number]) {
  return isActivePath(item.to) ? item.activeIcon || item.icon : item.icon
}

function closeMenu() {
  const menuToggle = document.getElementById('appMenu') as HTMLInputElement | null
  if (menuToggle) {
    menuToggle.checked = false
  }
}

function navigateAndClose(navigate: () => void) {
  navigate()
  closeMenu()
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
          v-slot="{ navigate }"
          :to="item.to"
          custom
        >
          <button
            class="app-sidebar__item"
            :class="{ 'is-active': isActivePath(item.to) }"
            type="button"
            @click="navigateAndClose(navigate)"
          >
            <AppIcon :icon="getMenuIcon(item)" size="20" />
            <span>{{ item.label }}</span>
          </button>
        </RouterLink>
      </nav>

      <section class="app-sidebar__group" aria-label="探索">
        <div class="app-sidebar__title">探索</div>
        <RouterLink
          v-for="item in exploreItems"
          :key="item.label"
          v-slot="{ navigate }"
          :to="item.to"
          custom
        >
          <button
            class="app-sidebar__item"
            :class="{ 'is-active': isActivePath(item.to) }"
            type="button"
            @click="navigateAndClose(navigate)"
          >
            <AppIcon :icon="getMenuIcon(item)" size="20" />
            <span>{{ item.label }}</span>
          </button>
        </RouterLink>
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
