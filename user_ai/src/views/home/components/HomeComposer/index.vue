<script setup lang="ts">
import { ref } from 'vue'

import AppIcon from '@/components/AppIcon/index.vue'

const message = ref('')
</script>

<template>
  <footer class="home-composer">
    <form class="home-composer__input" @submit.prevent>
      <AppIcon icon="lucide:message-square-text" size="20" />
      <textarea
        v-model="message"
        class="home-composer__textarea"
        rows="1"
        placeholder="发送消息或创建 AI 应用..."
        aria-label="发送消息或创建 AI 应用"
      ></textarea>
      <button class="home-composer__send" type="submit" aria-label="发送">
        <AppIcon icon="lucide:send-horizontal" size="20" />
      </button>
    </form>
  </footer>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
