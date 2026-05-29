<script setup lang="ts">
import AppIcon from '@/components/AppIcon/index.vue'
import brandIcon from '@/assets/icon.png'
import { exploreItems, navItems } from '../../share/menu'
</script>

<template>
  <aside class="home-sidebar">
    <div class="home-sidebar__panel">
      <label class="home-sidebar__close" for="homeMenu" aria-label="关闭菜单">
        <AppIcon icon="lucide:x" size="20" />
      </label>

      <div class="home-sidebar__brand">
        <img class="home-sidebar__brand-icon" :src="brandIcon" alt="" />
        <span class="home-sidebar__brand-text">苏应智汇港</span>
      </div>

      <button class="home-sidebar__create" type="button">
        <AppIcon icon="lucide:plus" size="18" />
        <span>创建 AI 应用</span>
      </button>

      <nav class="home-sidebar__nav" aria-label="主导航">
        <button
          v-for="item in navItems"
          :key="item.label"
          class="home-sidebar__item"
          :class="{ 'is-active': item.active }"
          type="button"
        >
          <AppIcon :icon="item.icon" size="20" />
          <span>{{ item.label }}</span>
        </button>
      </nav>

      <section class="home-sidebar__group" aria-label="探索">
        <div class="home-sidebar__title">探索</div>
        <button
          v-for="item in exploreItems"
          :key="item.label"
          class="home-sidebar__item"
          type="button"
        >
          <AppIcon :icon="item.icon" size="20" />
          <span>{{ item.label }}</span>
        </button>
      </section>

      <div class="home-sidebar__account">
        <div class="home-sidebar__avatar">慕</div>
        <div>
          <div class="home-sidebar__name">慕小课</div>
          <div class="home-sidebar__email">zehuiya@163.com</div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
