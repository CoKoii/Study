<script setup lang="ts">
import AppIcon from '@/components/AppIcon/index.vue'
import { pluginCategories, pluginSources } from '../../share/constants'
import type { PluginCategory, PluginMarketItem, PluginSource } from '../../share/types'
import { Button } from 'antdv-next'

defineProps<{
  category: PluginCategory
  groups: Array<{ provider: string; items: PluginMarketItem[] }>
  isPluginAdded: (pluginKey: string) => boolean
  open: boolean
  source: PluginSource
  sourceLabel: string
}>()

const emit = defineEmits<{
  'add-plugin': [plugin: PluginMarketItem]
  'update:category': [category: PluginCategory]
  'update:open': [open: boolean]
  'update:source': [source: PluginSource]
}>()
</script>

<template>
  <Teleport to="body">
    <Transition name="side-modal">
      <div v-if="open" class="plugin-modal-mask" @click.self="emit('update:open', false)">
        <div
          class="plugin-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pluginModalTitle"
        >
          <aside class="plugin-modal__sidebar">
            <h2 id="pluginModalTitle">添加插件</h2>
            <Button type="primary" block>
              <template #icon>
                <AppIcon icon="lucide:plus" size="15" />
              </template>
              创建自定义插件
            </Button>

            <div class="plugin-modal__nav">
              <button
                v-for="item in pluginSources"
                :key="item.key"
                class="plugin-modal__nav-item"
                :class="{ 'is-active': source === item.key }"
                type="button"
                @click="emit('update:source', item.key)"
              >
                <AppIcon :icon="item.icon" size="15" />
                <span>{{ item.label }}</span>
              </button>
            </div>

            <div class="plugin-modal__category-title">类别</div>
            <div class="plugin-modal__nav">
              <button
                v-for="item in pluginCategories"
                :key="item.key"
                class="plugin-modal__nav-item"
                :class="{ 'is-active': category === item.key }"
                type="button"
                @click="emit('update:category', item.key)"
              >
                <AppIcon :icon="item.icon" size="15" />
                <span>{{ item.label }}</span>
              </button>
            </div>
          </aside>

          <section class="plugin-modal__content">
            <div class="plugin-modal__header">
              <h3>{{ sourceLabel }}</h3>
              <button
                class="side-modal__close"
                type="button"
                aria-label="关闭"
                @click="emit('update:open', false)"
              >
                <AppIcon icon="lucide:x" size="18" />
              </button>
            </div>

            <div class="plugin-modal__list">
              <section v-for="group in groups" :key="group.provider" class="plugin-modal__group">
                <h4>{{ group.provider }}</h4>
                <article v-for="plugin in group.items" :key="plugin.key" class="plugin-modal__item">
                  <div class="plugin-modal__item-icon" :style="{ background: plugin.tone }">
                    <AppIcon :icon="plugin.icon" size="18" />
                  </div>
                  <strong>{{ plugin.title }}</strong>
                  <Button
                    class="plugin-modal__add"
                    size="small"
                    :disabled="isPluginAdded(plugin.key)"
                    @click="emit('add-plugin', plugin)"
                  >
                    <template #icon>
                      <AppIcon
                        :icon="isPluginAdded(plugin.key) ? 'lucide:check' : 'lucide:plus'"
                        size="14"
                      />
                    </template>
                    {{ isPluginAdded(plugin.key) ? '已添加' : '添加' }}
                  </Button>
                </article>
              </section>
              <div v-if="!groups.length" class="plugin-modal__empty">暂无插件</div>
            </div>
          </section>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
