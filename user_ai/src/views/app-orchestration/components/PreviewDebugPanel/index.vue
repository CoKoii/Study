<script setup lang="ts">
import AppChatComposer from '@/components/AppChatComposer/index.vue'
import AppIcon from '@/components/AppIcon/index.vue'
import type { BubbleListProps, PromptsProps } from 'ant-design-x-vue'
import { Bubble, Prompts } from 'ant-design-x-vue'
import { Button } from 'antdv-next'
import type { VNode } from 'vue'
import { computed, h, ref } from 'vue'
import { quickPrompts } from '../../share/constants'

interface PreviewMessage {
  content: string
  footer?: VNode
  key: string
  role: 'assistant' | 'user'
  rootClassName: string
}

const props = defineProps<{
  appName: string
}>()

const emit = defineEmits<{
  'open-long-memory': []
}>()

const userAvatar = h(
  'span',
  { class: 'chat-avatar chat-avatar--user' },
  '慕',
)
const assistantAvatar = h(
  'span',
  { class: 'chat-avatar chat-avatar--assistant' },
  h(AppIcon, { icon: 'lucide:bot', size: '16' }),
)
const promptsVisible = ref(true)
const createMessageFooter = (messageKey: string, text: string) =>
  h('div', { class: 'chat-message-footer' }, [
    h('span', text),
    h('div', { class: 'chat-message-footer__actions' }, [
      h(
        'button',
        {
          'aria-label': '复制消息',
          class: 'chat-message-footer__button',
          type: 'button',
          onClick: () => copyPreviewMessage(messageKey),
        },
        h(AppIcon, { icon: 'lucide:copy', size: '14' }),
      ),
      h(
        'button',
        {
          'aria-label': '删除消息',
          class: 'chat-message-footer__button',
          type: 'button',
          onClick: () => deletePreviewMessage(messageKey),
        },
        h(AppIcon, { icon: 'lucide:trash-2', size: '14' }),
      ),
    ]),
  ])
const previewMessages = ref<PreviewMessage[]>([
  {
    key: 'hello-user',
    rootClassName: 'chat-message-item',
    role: 'user',
    content: '你好，你是？',
  },
  {
    key: 'hello-assistant',
    rootClassName: 'chat-message-item',
    role: 'assistant',
    content: '你好呀，我是ChatGPT，很高兴和您交流！',
    footer: createMessageFooter('hello-assistant', '1.7s · 72 Tokens'),
  },
  {
    key: 'llm-user',
    rootClassName: 'chat-message-item',
    role: 'user',
    content: '能详细讲解下LLM是什么吗?',
  },
  {
    key: 'llm-assistant',
    rootClassName: 'chat-message-item',
    role: 'assistant',
    content:
      'LLM 即 Large Language Model，大语言模型，是一种基于深度学习的自然语言处理模型，具有很高的语言理解和生成能力，能够处理各式各样的自然语言任务。',
    footer: createMessageFooter('llm-assistant', '1.7s · 1,085 Tokens'),
  },
])

const chatRoles = computed<BubbleListProps['roles']>(() => ({
  assistant: {
    avatar: assistantAvatar,
    header: props.appName,
    placement: 'start',
    variant: 'filled',
  },
  user: {
    avatar: userAvatar,
    header: '慕小课',
    placement: 'end',
    variant: 'filled',
  },
}))
const bubbleMessages = computed<BubbleListProps['items']>(() => previewMessages.value)

function submitPreviewMessage(value: string) {
  const content = value.trim()

  if (!content) {
    return
  }

  previewMessages.value.push({
    key: `user-${Date.now()}`,
    rootClassName: 'chat-message-item',
    role: 'user',
    content,
  })
  promptsVisible.value = true
}

function clearPreviewMessages() {
  previewMessages.value = []
  promptsVisible.value = false
}

function deletePreviewMessage(key: string) {
  previewMessages.value = previewMessages.value.filter((message) => message.key !== key)
  promptsVisible.value = false
}

function copyPreviewMessage(key: string) {
  const content = previewMessages.value.find((message) => message.key === key)?.content

  if (typeof content === 'string') {
    void navigator.clipboard?.writeText(content)
  }
}

function submitPrompt(info: Parameters<NonNullable<PromptsProps['onItemClick']>>[0]) {
  if (typeof info.data.label === 'string') {
    submitPreviewMessage(info.data.label)
  }
}
</script>

<template>
  <section class="app-orchestration__preview orchestration-workspace-panel">
    <div class="orchestration-panel__header preview-header">
      <h2>预览与调试</h2>
      <div class="preview-header__actions">
        <Button type="text" size="small" @click="clearPreviewMessages">
          <template #icon>
            <AppIcon icon="lucide:trash-2" size="15" />
          </template>
          清空对话
        </Button>
        <Button type="link" size="small" @click="emit('open-long-memory')">
          <template #icon>
            <AppIcon icon="lucide:save" size="15" />
          </template>
          长期记忆
        </Button>
      </div>
    </div>

    <div class="chat-preview">
      <Bubble.List :items="bubbleMessages" :roles="chatRoles" />

      <Prompts
        v-if="promptsVisible"
        class="chat-preview__prompts"
        :items="quickPrompts"
        vertical
        @item-click="submitPrompt"
      />
    </div>

    <footer class="chat-composer">
      <AppChatComposer placeholder="输入调试消息..." @submit="submitPreviewMessage" />
      <p>内容由AI生成，无法确保真实准确，仅供参考。</p>
    </footer>
  </section>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
