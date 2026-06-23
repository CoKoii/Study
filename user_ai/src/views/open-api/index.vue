<script setup lang="ts">
import AppIcon from '@/components/AppIcon/index.vue'
import type { MenuItemType } from 'antdv-next'
import { Dropdown, message, Modal, Switch, TextArea } from 'antdv-next'
import { computed, reactive, ref } from 'vue'

interface ApiKeyItem {
  createdAt: string
  id: string
  note: string
  status: 'enabled' | 'disabled'
  secret: string
}

const activeTab = ref<'quickstart' | 'keys'>('quickstart')
const keyModalOpen = ref(false)
const editingKeyId = ref<string | null>(null)
const keyForm = reactive({
  note: '',
  status: 'enabled' as ApiKeyItem['status'],
})
const keyActions: MenuItemType[] = [
  { key: 'edit', label: '编辑' },
  { key: 'delete', label: '删除', danger: true },
]
const apiKeys = ref<ApiKeyItem[]>(createApiKeyFixtures())
const keyModalTitle = computed(() => (editingKeyId.value ? '编辑秘钥' : '新增秘钥'))

const requestCode = `curl --location --request POST 'https://localhost:5000/openapi/chat' \\
--header 'Authorization: Bearer pat_OYDacMzM3WyOWV3Dtj2bHRMymzb*****' \\
--header 'Content-Type: application/json' \\
--data-raw '{
  "app_id": "734829333445931****",
  "end_user_id": "123456789",
  "conversation_id": "123456789",
  "stream": false,
  "query": "广州今天的天气怎样"
}'`

const responseCode = `{
  "data": {
    "id": "123",
    "conversation_id": "123456",
    "bot_id": "222",
    "created_at": 1710348675,
    "completed_at": 1710348675,
    "answer": "广州今天多云，气温 23-28 摄氏度，适合外出。",
    "usage": {
      "prompt_tokens": 326,
      "completion_tokens": 98,
      "total_tokens": 424
    }
  }
}`

const codeSamples = [
  {
    key: 'request',
    title: '请求 curl',
    language: 'shell',
    code: requestCode,
  },
  {
    key: 'response',
    title: '返回结果示例',
    language: 'json',
    code: responseCode,
  },
]

const tabs = [
  { key: 'quickstart', label: '快速开始' },
  { key: 'keys', label: '秘钥' },
] as const

async function copyCode(code: string) {
  try {
    await navigator.clipboard?.writeText(code)
    message.success('已复制')
  } catch {
    message.warning('复制失败，请手动复制')
  }
}

function toggleKeyStatus(keyId: string) {
  apiKeys.value = apiKeys.value.map((item) =>
    item.id === keyId
      ? {
          ...item,
          status: item.status === 'enabled' ? 'disabled' : 'enabled',
        }
      : item,
  )
}

function openCreateKeyModal() {
  editingKeyId.value = null
  resetKeyForm()
  keyModalOpen.value = true
}

function openEditKeyModal(apiKey: ApiKeyItem) {
  editingKeyId.value = apiKey.id
  keyForm.note = apiKey.note
  keyForm.status = apiKey.status
  keyModalOpen.value = true
}

function closeKeyModal() {
  keyModalOpen.value = false
  editingKeyId.value = null
  resetKeyForm()
}

function resetKeyForm() {
  keyForm.note = ''
  keyForm.status = 'enabled'
}

function setKeyFormStatus(checked: boolean) {
  keyForm.status = checked ? 'enabled' : 'disabled'
}

function saveApiKey() {
  const note = keyForm.note.trim()

  if (editingKeyId.value) {
    const keyId = editingKeyId.value

    apiKeys.value = apiKeys.value.map((item) =>
      item.id === keyId
        ? {
            ...item,
            note,
            status: keyForm.status,
          }
        : item,
    )
    message.success('保存成功')
    closeKeyModal()
    return
  }

  apiKeys.value.unshift({
    id: crypto.randomUUID(),
    secret: 'llmops-v1/new-key/8c4f2a9e...',
    status: keyForm.status,
    createdAt: '2024-06-23 14:35:27',
    note,
  })
  message.success('新增秘钥成功')
  closeKeyModal()
}

function handleKeyAction(keyId: string, event: { key: string | number }) {
  const target = apiKeys.value.find((item) => item.id === keyId)

  if (!target) {
    return
  }

  if (event.key === 'edit') {
    openEditKeyModal(target)
    return
  }

  Modal.confirm({
    title: '删除该秘钥？',
    content: '删除后，该秘钥将无法继续访问开放 API，请确认业务侧已经完成替换。',
    centered: true,
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    onOk() {
      apiKeys.value = apiKeys.value.filter((item) => item.id !== keyId)
      message.success('删除成功')
    },
  })
}

function createApiKeyFixtures(): ApiKeyItem[] {
  return Array.from({ length: 16 }, (_, index) => {
    const enabled = index % 2 === 1

    return {
      id: `open-key-${index + 1}`,
      secret: enabled
        ? 'llmops-v1/C0T5qh5h/9bbd6ee3...'
        : 'llmops-v1/k6FINx4S/7d52f03d...',
      status: enabled ? 'enabled' : 'disabled',
      createdAt: enabled ? '2024-05-14 14:35:27' : '2024-06-11 23:31:47',
      note: enabled ? '微信公众号' : '',
    }
  })
}
</script>

<template>
  <section class="open-api">
    <header class="open-api__header">
      <div>
        <h1>开放API</h1>
        <p>利用开放 API 快速与企业现有业务对接</p>
      </div>
    </header>

    <div class="open-api__tabs-row">
      <div class="open-api__tabs" aria-label="开放 API 页面">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="open-api__tab"
          :class="{ 'is-active': activeTab === tab.key }"
          type="button"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <button
        v-if="activeTab === 'keys'"
        class="open-api__create-key"
        type="button"
        @click="openCreateKeyModal"
      >
        新增秘钥
      </button>
    </div>

    <section v-if="activeTab === 'quickstart'" class="open-api__panel">
      <article class="open-api__section">
        <h2>概览</h2>
        <p>
          LLMOps API 是慕课 LLMOps 平台面向开发者提供的专业技术交互能力，致力于通过 API
          实现开发者更高效更全面的需求，不仅如此，扣子 API
          将提供更加灵活和高精度的模型、工作流、知识库和拓展插件等能力的扩展，让定制化 Agent
          更加的精确、高效和智能。
        </p>
      </article>

      <article class="open-api__section">
        <h2>准备工作</h2>
        <p>在开始之前，您需要创建个人访问令牌，其次需要在 LLMOps 上完成 Agent 的创建与发布。</p>
      </article>

      <article class="open-api__section">
        <h2>基础使用</h2>
        <div class="open-api__mode">
          <button class="is-active" type="button">非流式 Chat</button>
          <button type="button">流式 Chat</button>
        </div>
      </article>

      <article v-for="sample in codeSamples" :key="sample.key" class="open-api__code-section">
        <h3>{{ sample.title }}</h3>
        <div class="code-block">
          <header>
            <span>{{ sample.language }}</span>
            <button type="button" @click="copyCode(sample.code)">
              <AppIcon icon="lucide:copy" size="14" />
              Copy
            </button>
          </header>
          <pre><code>{{ sample.code }}</code></pre>
        </div>
      </article>
    </section>

    <section v-else class="open-api__keys">
      <div class="api-key-table" role="table" aria-label="开放 API 秘钥">
        <div class="api-key-table__head" role="row">
          <span role="columnheader">秘钥</span>
          <span role="columnheader">状态</span>
          <span role="columnheader">创建时间</span>
          <span role="columnheader">备注</span>
          <span role="columnheader">操作</span>
        </div>

        <div v-for="apiKey in apiKeys" :key="apiKey.id" class="api-key-table__row" role="row">
          <span class="api-key-table__secret" role="cell">{{ apiKey.secret }}</span>
          <span class="api-key-table__status" role="cell">
            <i :class="`is-${apiKey.status}`" aria-hidden="true"></i>
            {{ apiKey.status === 'enabled' ? '可用' : '已禁用' }}
          </span>
          <span role="cell">{{ apiKey.createdAt }}</span>
          <span role="cell">{{ apiKey.note || '-' }}</span>
          <span class="api-key-table__actions" role="cell">
            <Switch
              :checked="apiKey.status === 'enabled'"
              @change="() => toggleKeyStatus(apiKey.id)"
            />

            <Dropdown
              :menu="{ items: keyActions, onClick: (event) => handleKeyAction(apiKey.id, event) }"
              :trigger="['click']"
              placement="bottomRight"
            >
              <button type="button" aria-label="更多操作">
                <AppIcon icon="lucide:ellipsis" size="16" />
              </button>
            </Dropdown>
          </span>
        </div>
      </div>
    </section>

    <Modal
      :open="keyModalOpen"
      :title="keyModalTitle"
      centered
      ok-text="保存"
      cancel-text="取消"
      width="520px"
      destroy-on-hidden
      @ok="saveApiKey"
      @cancel="closeKeyModal"
      @update:open="(open) => !open && closeKeyModal()"
    >
      <div class="api-key-form">
        <label class="api-key-form__field api-key-form__field--counted">
          <span class="api-key-form__label">秘钥状态 <b>*</b></span>
          <span class="api-key-form__status">
            <Switch :checked="keyForm.status === 'enabled'" @change="setKeyFormStatus" />
          </span>
        </label>

        <label class="api-key-form__field">
          <span class="api-key-form__label">秘钥备注</span>
          <TextArea
            v-model:value="keyForm.note"
            placeholder="请输入秘钥备注，用于描述秘钥基础信息"
            :maxlength="2000"
            :auto-size="{ minRows: 3, maxRows: 3 }"
          />
          <span class="api-key-form__count">{{ keyForm.note.length }}/2000</span>
        </label>
      </div>
    </Modal>
  </section>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
