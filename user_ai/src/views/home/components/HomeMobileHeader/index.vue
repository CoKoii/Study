<script setup lang="ts">
import AppIcon from '@/components/AppIcon/index.vue'
</script>

<template>
  <header class="home-mobile-header">
    <label class="home-mobile-header__button" for="homeMenu" aria-label="打开菜单">
      <AppIcon icon="lucide:menu" size="22" />
    </label>
    <span>慕小课</span>
  </header>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
