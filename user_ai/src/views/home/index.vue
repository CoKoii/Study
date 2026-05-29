<script setup lang="ts">
import HomeComposer from './components/HomeComposer/index.vue'
import HomeMobileHeader from './components/HomeMobileHeader/index.vue'
import HomeSidebar from './components/HomeSidebar/index.vue'
import HomeWelcome from './components/HomeWelcome/index.vue'
</script>

<template>
  <main class="home">
    <input id="homeMenu" class="home__menu-toggle" type="checkbox" />
    <HomeMobileHeader />
    <label class="home__scrim" for="homeMenu" aria-label="关闭菜单"></label>
    <HomeSidebar />

    <section class="home__workspace">
      <HomeWelcome />
      <HomeComposer />
    </section>
  </main>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
