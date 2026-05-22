<script setup>
import MarkdownIt from 'markdown-it'
import { nextTick, ref } from 'vue'
import { streamAiChat } from '../../api/ai'

const emit = defineEmits(['changed'])

const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true
})

const open = ref(false)
const input = ref('')
const thinking = ref(false)
const chatBodyRef = ref(null)
const messages = ref([])
const memoryMessages = ref([])
let scrollFrame = 0

function renderMarkdown(content) {
  return md.render(content || '')
}

function appendMessage(role, content = '') {
  return messages.value.push({ role, content, toolCalls: [] }) - 1
}

function updateAssistant(index, patch) {
  Object.assign(messages.value[index], patch)
}

async function sendMessage() {
  const content = input.value.trim()
  if (!content || thinking.value) {
    return
  }

  appendMessage('user', content)
  const assistantIndex = appendMessage('assistant')
  input.value = ''
  thinking.value = true
  await scrollToBottom()

  try {
    const history = await streamAiChat({
      messages: [
        ...memoryMessages.value,
        { role: 'user', content }
      ],
      onDelta(delta) {
        updateAssistant(assistantIndex, {
          content: messages.value[assistantIndex].content + delta
        })
        requestScrollToBottom()
      },
      onToolCall(toolCall) {
        updateToolCall(assistantIndex, toolCall)
        requestScrollToBottom()
      },
      onChanged() {
        emit('changed')
      }
    })
    memoryMessages.value = history
  } catch (error) {
    updateAssistant(assistantIndex, {
      content: error.message || 'AI 服务暂时不可用，请稍后再试。'
    })
  } finally {
    thinking.value = false
    await scrollToBottom()
  }
}

function updateToolCall(index, toolCall) {
  const toolCalls = messages.value[index].toolCalls || []
  const nextCalls = toolCalls.filter((item) => item.name !== toolCall.name)
  nextCalls.push(toolCall)
  updateAssistant(index, { toolCalls: nextCalls })
}

async function scrollToBottom() {
  await nextTick()
  const element = chatBodyRef.value
  if (element) {
    element.scrollTop = element.scrollHeight
  }
}

function requestScrollToBottom() {
  if (scrollFrame) {
    return
  }
  scrollFrame = requestAnimationFrame(async () => {
    scrollFrame = 0
    await scrollToBottom()
  })
}
</script>

<template>
  <a-float-button :style="{ right: '32px', bottom: '32px' }" tooltip="AI 数据分析" @click="open = true">
    <template #icon>AI</template>
  </a-float-button>

  <a-modal
    v-model:open="open"
    title="AI 数据分析"
    width="780px"
    :footer="null"
    :styles="{ body: { padding: 0 } }"
  >
    <section class="ai-chat">
      <div ref="chatBodyRef" class="ai-chat__body">
        <a-empty v-if="!messages.length" description="开始提问" :image="null" class="ai-chat__empty" />
        <div v-else class="ai-chat__messages">
          <div
            v-for="(item, index) in messages"
            :key="index"
            class="ai-chat__row"
            :class="{ 'ai-chat__row--user': item.role === 'user' }"
          >
            <span v-if="item.role === 'assistant'" class="ai-chat__avatar">AI</span>
            <div class="ai-chat__bubble" :class="{ 'ai-chat__bubble--user': item.role === 'user' }">
              <div
                v-if="item.role === 'assistant'"
                class="ai-chat__markdown"
                :class="{ 'ai-chat__markdown--empty': !item.content }"
                v-html="renderMarkdown(item.content)"
              />
              <span v-else>{{ item.content }}</span>
              <div v-if="item.toolCalls?.length" class="ai-chat__tools">
                <a-tag v-for="toolCall in item.toolCalls" :key="toolCall.name" color="blue">
                  {{ toolCall.summary }}
                </a-tag>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="ai-chat__composer">
        <a-textarea
          v-model:value="input"
          :auto-size="{ minRows: 3, maxRows: 6 }"
          placeholder="输入你的数据分析需求"
          @keydown.enter.exact.prevent="sendMessage"
        />
        <a-flex justify="end">
          <a-button type="primary" :loading="thinking" @click="sendMessage">
            发送
          </a-button>
        </a-flex>
      </div>
    </section>
  </a-modal>
</template>

<style scoped>
.ai-chat {
  display: flex;
  height: 640px;
  flex-direction: column;
  background: #f7f8fa;
}

.ai-chat__body {
  flex: 1;
  overflow: auto;
  padding: 20px 24px 16px;
}

.ai-chat__empty {
  margin-top: 150px;
}

.ai-chat__messages {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ai-chat__row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  justify-content: flex-start;
}

.ai-chat__row--user {
  justify-content: flex-end;
}

.ai-chat__avatar {
  width: 28px;
  height: 28px;
  flex: 0 0 28px;
  border-radius: 50%;
  background: #ffffff;
  color: #1677ff;
  font-size: 12px;
  font-weight: 600;
  line-height: 28px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
}

.ai-chat__bubble {
  max-width: 70%;
  min-height: 28px;
  padding: 10px 14px;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.06);
  line-height: 1.65;
  white-space: pre-wrap;
  word-break: break-word;
}

.ai-chat__bubble--user {
  color: #ffffff;
  background: #1677ff;
}

.ai-chat__markdown :deep(p) {
  margin: 0 0 8px;
}

.ai-chat__markdown :deep(p:last-child) {
  margin-bottom: 0;
}

.ai-chat__markdown--empty::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #8c8c8c;
  box-shadow: 10px 0 0 #c7c7c7, 20px 0 0 #e0e0e0;
}

.ai-chat__markdown :deep(ul),
.ai-chat__markdown :deep(ol) {
  margin: 0;
  padding-left: 20px;
}

.ai-chat__tools {
  margin-top: 8px;
}

.ai-chat__composer {
  padding: 14px 24px 18px;
  border-top: 1px solid #edf0f5;
  background: #ffffff;
}

.ai-chat__composer :deep(.ant-input) {
  border-radius: 8px;
  resize: none;
}
</style>
