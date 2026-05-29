<script setup lang="ts">
import AppIcon from '@/components/AppIcon/index.vue'
</script>

<template>
  <footer class="home-composer">
    <div class="home-composer__input">
      <AppIcon icon="lucide:message-square-text" size="20" />
      <span>发送消息或创建 AI 应用...</span>
      <AppIcon icon="lucide:send-horizontal" size="20" />
    </div>
  </footer>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
