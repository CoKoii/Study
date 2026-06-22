<script setup lang="ts">
import AppIcon from '@/components/AppIcon/index.vue'
import type { RelationItem } from '../share/orchestration-data'
import { Button } from 'antdv-next'

defineProps<{
  items: RelationItem[]
  mode: 'knowledge' | 'workflow'
  open: boolean
  selectedKeys: string[]
  title: string
}>()

const emit = defineEmits<{
  confirm: []
  'toggle-item': [key: string]
  'update:open': [open: boolean]
}>()
</script>

<template>
  <Teleport to="body">
    <Transition name="side-modal">
      <div v-if="open" class="relation-modal-mask" @click.self="emit('update:open', false)">
        <div class="relation-modal" role="dialog" aria-modal="true">
          <header class="relation-modal__header">
            <h2>{{ title }}</h2>
            <button
              class="plugin-modal__close"
              type="button"
              aria-label="关闭"
              @click="emit('update:open', false)"
            >
              <AppIcon icon="lucide:x" size="18" />
            </button>
          </header>

          <div class="relation-modal__list">
            <button
              v-for="item in items"
              :key="item.key"
              class="relation-modal__item"
              :class="{ 'is-selected': selectedKeys.includes(item.key) }"
              type="button"
              @click="emit('toggle-item', item.key)"
            >
              <div class="relation-modal__item-icon" :style="{ background: item.tone }">
                <AppIcon :icon="item.icon" size="18" />
              </div>
              <span>{{ item.title }}</span>
            </button>
          </div>

          <footer class="relation-modal__footer">
            <span>
              {{ selectedKeys.length }}
              {{ mode === 'knowledge' ? '个知识库被选中' : '个工作流被选中' }}
            </span>
            <div>
              <Button @click="emit('update:open', false)">取消</Button>
              <Button type="primary" @click="emit('confirm')">添加</Button>
            </div>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
