<script setup lang="ts">
import AppChatComposer from '@/components/AppChatComposer/index.vue'
</script>

<template>
  <footer class="home-composer">
    <AppChatComposer placeholder="发送消息或创建 AI 应用..." />
  </footer>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
