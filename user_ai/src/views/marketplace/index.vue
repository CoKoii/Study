<script setup lang="ts">
import AppIcon from '@/components/AppIcon/index.vue'
import { marketResources } from './share/data'
import type { MarketItem } from './share/data'
import type { MenuItemType } from 'antdv-next'
import { Button, Dropdown, message } from 'antdv-next'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeCategory = ref('all')
const keyword = ref('')
const cardActions: MenuItemType[] = [{ key: 'add', label: '添加到工作区' }]
const resource = computed(() =>
  route.name === 'plugin-market' ? marketResources.plugin : marketResources.app,
)
const filteredItems = computed(() => {
  const query = keyword.value.trim().toLowerCase()

  return resource.value.items.filter((item) => {
    const matchesCategory = activeCategory.value === 'all' || item.category === activeCategory.value
    const matchesKeyword =
      !query ||
      [item.title, item.author, item.meta, item.description].some((field) =>
        field.toLowerCase().includes(query),
      )

    return matchesCategory && matchesKeyword
  })
})

function addToWorkspace(item: MarketItem) {
  message.success(`已将「${item.title}」添加到工作区`)
}

watch(
  resource,
  () => {
    activeCategory.value = 'all'
    keyword.value = ''
  },
  { flush: 'sync' },
)
</script>

<template>
  <section class="marketplace">
    <header class="marketplace__header">
      <h1>{{ resource.title }}</h1>
    </header>

    <div class="marketplace__toolbar">
      <div class="marketplace__tabs" aria-label="市场分类">
        <button
          v-for="category in resource.categories"
          :key="category.key"
          class="marketplace__tab"
          :class="{ 'is-active': activeCategory === category.key }"
          type="button"
          @click="activeCategory = category.key"
        >
          {{ category.label }}
        </button>
      </div>

      <label class="marketplace__search">
        <AppIcon icon="lucide:search" size="16" />
        <input v-model="keyword" type="search" :placeholder="resource.searchPlaceholder" />
      </label>
    </div>

    <Transition name="marketplace-switch" mode="out-in" appear>
      <div :key="`${String(route.name)}-${activeCategory}`" class="marketplace__content">
        <div v-if="filteredItems.length" class="marketplace__grid">
          <article v-for="item in filteredItems" :key="item.id" class="market-card">
            <div class="market-card__head">
              <div class="market-card__icon" :style="{ backgroundColor: item.tone }">
                <AppIcon :icon="item.icon" size="22" />
              </div>
              <div class="market-card__identity">
                <h2>
                  {{ item.title }}
                  <AppIcon v-if="item.verified" icon="lucide:badge-check" size="16" />
                </h2>
                <span>{{ item.author }} · {{ item.meta }}</span>
              </div>

              <Dropdown
                :menu="{ items: cardActions, onClick: () => addToWorkspace(item) }"
                :trigger="['click']"
                placement="bottomRight"
              >
                <button class="market-card__more" type="button" aria-label="更多操作">
                  <AppIcon icon="lucide:ellipsis" size="18" />
                </button>
              </Dropdown>
            </div>

            <p>{{ item.description }}</p>

            <footer class="market-card__meta">
              <span>
                <AppIcon icon="lucide:user-round" size="12" />
              </span>
              <time>慕小课 · 发布时间 {{ item.publishedAt }}</time>
            </footer>
          </article>
        </div>

        <div v-else class="marketplace__empty">
          <AppIcon icon="lucide:inbox" size="28" />
          <span>{{ resource.emptyText }}</span>
          <Button type="primary" @click="keyword = ''">清空搜索</Button>
        </div>
      </div>
    </Transition>
  </section>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
