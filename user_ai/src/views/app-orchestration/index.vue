<script setup lang="ts">
import type { SpaceApp } from '@/stores/app-list'
import { useAppListStore } from '@/stores/app-list'
import AppEditWorkspace from './components/AppEditWorkspace/index.vue'
import LongMemoryModal from './components/LongMemoryModal/index.vue'
import OrchestrationTopbar from './components/OrchestrationTopbar/index.vue'
import PublishHistoryDrawer from './components/PublishHistoryDrawer/index.vue'
import type { OrchestrationTab } from './share/types'
import { Modal } from 'antdv-next'
import { storeToRefs } from 'pinia'
import { computed, defineAsyncComponent, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const PublishConfig = defineAsyncComponent(() => import('./components/PublishConfig/index.vue'))
const StatsAnalysis = defineAsyncComponent(() => import('./components/StatsAnalysis/index.vue'))

const route = useRoute()
const router = useRouter()
const appListStore = useAppListStore()
const { appItems } = storeToRefs(appListStore)
const activeTab = ref<OrchestrationTab>('edit')
const publishHistoryOpen = ref(false)
const longMemoryOpen = ref(false)
const longMemoryContent = ref(
  '从角色身份已知为慕小课，并要求人工智能解释LLM（大型语言模型）的概念。人已掌握将LLM描述为一种基于深度学习的模型，通常建立在Transformer架构上，用于自然语言处理任务。LLM经历了一个预训练阶段，在那里他们从大量的文本数据中学习语言结构，比如维基百科的文章和书籍。它们利用自我注意机制将有效地处理长程依赖关系。经过预训练后，LLM可以针对特定的应用程序进行微调，使其功能适应文本生成、理解和分类等任务。LLM由于其多功能性和强大的语言理解和生成能力，被广泛应用于虚拟助理、翻译、情绪分析、医疗保健、金融等领域，代表了自然语言处理的前沿技术。',
)

const currentApp = computed<SpaceApp | undefined>(() => {
  const appId = route.params.appId

  return (
    appItems.value.find((item) => item.kind === 'app' && item.id === appId) ??
    appItems.value.find((item) => item.kind === 'app')
  )
})

const appName = computed(() => currentApp.value?.name ?? '聊天机器人')
const appDescription = computed(
  () => currentApp.value?.description ?? '配置 AI 应用的人设、能力和调试对话。',
)
const statusText = computed(() => (currentApp.value?.status === 'published' ? '已发布' : '草稿'))

function goBack() {
  router.push({ name: 'personal-space-apps' })
}

function updatePublishStatus(status: SpaceApp['status']) {
  if (currentApp.value) {
    appListStore.updateAppStatus(currentApp.value.id, status)
  }
}

function updatePublish() {
  updatePublishStatus('published')
}

function handlePublishAction(event: { key: string | number }) {
  if (event.key === 'unpublish' && currentApp.value?.status === 'published') {
    confirmUnpublish()
  }
}

function confirmUnpublish() {
  Modal.confirm({
    title: '要取消发布该Agent应用吗?',
    content:
      '取消发布后，WebApp以及发布的社交媒体平台均无法使用该Agent，如需更新WebApp地址，请使用地址重生成功能。',
    centered: true,
    width: 500,
    okText: '确认',
    cancelText: '取消',
    onOk() {
      updatePublishStatus('draft')
    },
  })
}
</script>

<template>
  <main class="app-orchestration">
    <OrchestrationTopbar
      v-model:active-tab="activeTab"
      :app="currentApp"
      :app-name="appName"
      :status-text="statusText"
      @back="goBack"
      @open-publish-history="publishHistoryOpen = true"
      @publish-action="handlePublishAction"
      @update-publish="updatePublish"
    />

    <Transition name="orchestration-tab" mode="out-in">
      <AppEditWorkspace
        v-if="activeTab === 'edit'"
        :key="activeTab"
        :app-name="appName"
        :app-description="appDescription"
        @open-long-memory="longMemoryOpen = true"
      />

      <PublishConfig v-else-if="activeTab === 'publish'" :key="activeTab" />

      <StatsAnalysis v-else-if="activeTab === 'stats'" :key="activeTab" />
    </Transition>

    <PublishHistoryDrawer
      v-model:open="publishHistoryOpen"
      :app="currentApp"
      :app-name="appName"
    />

    <LongMemoryModal v-model:open="longMemoryOpen" v-model:content="longMemoryContent" />
  </main>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
