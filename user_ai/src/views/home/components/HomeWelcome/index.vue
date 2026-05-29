<script setup lang="ts">
import AppIcon from '@/components/AppIcon/index.vue'
import { suggestions } from '../../share/content'
</script>

<template>
  <div class="home-welcome">
    <header class="home-welcome__hero">
      <h1>Hi, 我是慕课 AI 应用构建器</h1>
      <h2>你的专属 <strong>AI 原生应用</strong> 开发平台</h2>
      <p>说出你的创意，我可以快速帮你创建专属应用，一键轻松分享给朋友，发布到慕课 LLMOps 平台、微信等多个渠道。</p>
    </header>

    <section class="home-welcome__chat" aria-label="欢迎消息">
      <div class="home-welcome__bot">
        <div class="home-welcome__bot-icon">
          <AppIcon icon="lucide:layout-grid" size="20" />
        </div>
        <span>慕小课</span>
      </div>

      <article class="home-welcome__bubble">
        <h3>你好，欢迎来到慕课LLMOps</h3>
        <p>慕课LLMOps是新一代大模型 AI 应用开发平台。无论你是否有编程基础，都可以搭建出各种 AI 应用，并一键发布到各大社交平台，或者轻松部署到自己的网站。</p>
        <ul>
          <li>随时来 <strong>应用广场</strong> 逛逛，这里内置了许多超有趣的应用。</li>
          <li>你也可以直接发送 <b>“我想做一个应用”</b>，我可以帮你快速创建应用。</li>
          <li>你也可以向我提问有关课程的问题，我可以快速替你解答。</li>
        </ul>
        <p>如果你还有其他慕课LLMOps使用问题，也欢迎随时问我！</p>
      </article>

      <div class="home-welcome__suggestions">
        <button v-for="item in suggestions" :key="item" type="button">{{ item }}</button>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
