<script setup lang="ts">
import AppIcon from '@/components/AppIcon/index.vue'
import type { SpaceApp } from '@/stores/app-list'
import { publishHistoryItems } from '../share/orchestration-data'
import { Button, Drawer, Tag } from 'antdv-next'

const open = defineModel<boolean>('open', { required: true })

defineProps<{
  app?: SpaceApp
  appName: string
  isImageIcon: boolean
}>()
</script>

<template>
  <Drawer
    v-model:open="open"
    title="发布历史"
    placement="right"
    :width="420"
    :closable="{ placement: 'end' }"
  >
    <section class="publish-history">
      <div class="publish-history__app">
        <div
          class="publish-history__icon"
          :class="{ 'has-image': isImageIcon }"
          :style="{ backgroundColor: app?.accent }"
        >
          <img v-if="isImageIcon" :src="app?.icon" alt="" :draggable="false" />
          <AppIcon v-else :icon="app?.icon ?? 'lucide:bot'" size="22" />
        </div>
        <div>
          <strong>{{ appName }}</strong>
          <span>最近编辑 · 2024-08-15 17:54</span>
        </div>
      </div>

      <p class="publish-history__description">
        采用最智能的大模型，自动化 AI 编程。精通
        Java、C、C++、Python、Rust、Go等编程语言，有很深的造诣，能帮回答各种复杂的与编程相关的问题。
      </p>

      <p class="publish-history__count">共计 26 条发布记录</p>

      <div class="publish-history__list">
        <article v-for="item in publishHistoryItems" :key="item.key" class="publish-history__item">
          <div class="publish-history__item-main">
            <div>
              <strong>版本</strong>
              <Tag># {{ item.key }}</Tag>
              <Tag v-if="item.current">当前版本</Tag>
            </div>
            <span>发布时间: {{ item.publishedAt }}</span>
          </div>
          <Button size="small">回退</Button>
        </article>
      </div>
    </section>
  </Drawer>
</template>
