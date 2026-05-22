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
    width="760px"
    :footer="null"
    :styles="{ body: { padding: 0, overflow: 'hidden' } }"
  >
    <template #title>
      <a-flex vertical :gap="2">
        <span>AI 数据分析</span>
        <a-typography-text type="secondary" class="ai-chat__subtitle">
          学生体质数据助手
        </a-typography-text>
      </a-flex>
    </template>

    <section class="ai-chat">
      <div ref="chatBodyRef" class="ai-chat__body">
        <div v-if="!messages.length" class="ai-chat__welcome">
          <div class="ai-chat__welcome-icon">AI</div>
          <div class="ai-chat__welcome-title">可以开始分析了</div>
          <div class="ai-chat__welcome-text">例如：谁的 BMI 最高、成绩最低的是谁、导出不及格学生。</div>
        </div>
        <div v-else class="ai-chat__messages">
          <div
            v-for="(item, index) in messages"
            :key="index"
            class="ai-chat__row"
            :class="{ 'ai-chat__row--user': item.role === 'user' }"
          >
            <span v-if="item.role === 'assistant'" class="ai-chat__avatar">AI</span>
            <div
              class="ai-chat__bubble"
              :class="{
                'ai-chat__bubble--user': item.role === 'user',
                'ai-chat__bubble--loading': item.role === 'assistant' && !item.content && !item.toolCalls?.length
              }"
            >
              <div
                v-if="item.role === 'assistant' && !item.content && !item.toolCalls?.length"
                class="ai-chat__loading"
                aria-label="AI 正在思考"
              >
                <span />
                <span />
                <span />
              </div>
              <div
                v-else-if="item.role === 'assistant'"
                class="ai-chat__markdown"
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
        <a-flex align="flex-end" :gap="12" class="ai-chat__input-group">
          <a-textarea
            v-model:value="input"
            :auto-size="{ minRows: 1, maxRows: 4 }"
            placeholder="输入你的数据分析需求"
            @keydown.enter.exact.prevent="sendMessage"
          />
          <a-button type="primary" :loading="thinking" :disabled="!input.trim()" @click="sendMessage">
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
  height: 600px;
  flex-direction: column;
  overflow: hidden;
}

.ai-chat__subtitle {
  font-size: 12px;
}

.ai-chat__body {
  flex: 1;
  overflow: auto;
  margin: 0 24px;
  padding: 24px 0;
  background: #ffffff;
}

.ai-chat__welcome {
  display: flex;
  height: 100%;
  min-height: 360px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8c8c8c;
  text-align: center;
}

.ai-chat__welcome-icon {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: #1677ff;
  color: #fff;
  font-weight: 700;
  line-height: 48px;
  box-shadow: 0 10px 24px rgba(22, 119, 255, 0.22);
}

.ai-chat__welcome-title {
  margin-top: 16px;
  color: #1f2937;
  font-size: 16px;
  font-weight: 600;
}

.ai-chat__welcome-text {
  max-width: 360px;
  margin-top: 8px;
  font-size: 13px;
  line-height: 1.6;
}

.ai-chat__messages {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 100%;
  justify-content: flex-end;
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
  max-width: min(74%, 520px);
  min-height: 0;
  padding: 11px 14px;
  border: 1px solid #edf0f5;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.05);
  line-height: 1.65;
  word-break: break-word;
}

.ai-chat__bubble--loading {
  display: flex;
  min-width: 64px;
  align-items: center;
  justify-content: center;
  padding: 12px 14px;
}

.ai-chat__bubble--user {
  border-color: #1677ff;
  color: #ffffff;
  background: #1677ff;
  box-shadow: 0 8px 18px rgba(22, 119, 255, 0.18);
}

.ai-chat__markdown :deep(p) {
  margin: 0 0 6px;
}

.ai-chat__markdown :deep(p:last-child) {
  margin-bottom: 0;
}

.ai-chat__loading {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 16px;
}

.ai-chat__loading span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #9ca3af;
  animation: ai-loading-bounce 1s infinite ease-in-out;
}

.ai-chat__loading span:nth-child(2) {
  animation-delay: 0.15s;
}

.ai-chat__loading span:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes ai-loading-bounce {
  0%,
  80%,
  100% {
    opacity: 0.35;
    transform: translateY(0);
  }

  40% {
    opacity: 1;
    transform: translateY(-3px);
  }
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
  flex: 0 0 auto;
  padding: 14px 24px 18px;
  background: #ffffff;
}

.ai-chat__input-group {
  padding: 10px;
  border: 1px solid #d9d9d9;
  border-radius: 12px;
  background: #ffffff;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.ai-chat__input-group:focus-within {
  border-color: #1677ff;
  box-shadow: 0 0 0 3px rgba(22, 119, 255, 0.08);
}

.ai-chat__composer :deep(.ant-input) {
  width: 100%;
  min-height: 32px;
  padding: 5px 2px;
  border: 0;
  line-height: 22px;
  box-shadow: none;
  resize: none;
}

.ai-chat__composer :deep(.ant-input:focus) {
  box-shadow: none;
}

.ai-chat__composer :deep(.ant-btn) {
  flex: 0 0 auto;
  height: 36px;
  padding: 0 18px;
  border-radius: 8px;
}
</style>
