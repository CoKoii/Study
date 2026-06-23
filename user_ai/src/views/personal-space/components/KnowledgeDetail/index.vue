<script setup lang="ts">
import AppIcon from '@/components/AppIcon/index.vue'
import WorkspaceTopbar from '@/components/WorkspaceTopbar/index.vue'
import { useAppListStore } from '@/stores/app-list'
import type { KnowledgeDocument } from '@/stores/app-list'
import type { MenuItemType, TableProps } from 'antdv-next'
import { Button, Dropdown, Input, message, Modal, Switch, Table } from 'antdv-next'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const appListStore = useAppListStore()
const keyword = ref('')
const recallDrawerOpen = ref(false)
const deletingDocument = ref<KnowledgeDocument | null>(null)
const renamingDocument = ref<KnowledgeDocument | null>(null)
const renameName = ref('')

const knowledgeId = computed(() => String(route.params.knowledgeId ?? ''))
const knowledge = computed(() => {
  const item = appListStore.findAppById(knowledgeId.value)
  return item?.kind === 'knowledge' ? item : null
})
const documents = computed(() => appListStore.getKnowledgeDocuments(knowledgeId.value))
const filteredDocuments = computed(() => {
  const query = keyword.value.trim().toLowerCase()

  if (!query) {
    return documents.value
  }

  return documents.value.filter((item) => item.name.toLowerCase().includes(query))
})
const detailMeta = ['2 文档', '69,141 字符', '3 关联应用']

const documentActions: MenuItemType[] = [
  { key: 'rename', label: '重命名' },
  { key: 'delete', label: '删除', danger: true },
]
const documentColumns: TableProps['columns'] = [
  {
    title: '#',
    key: 'index',
    align: 'center',
    width: 64,
  },
  {
    title: '文档名',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
    width: 360,
    ellipsis: true,
  },
  {
    title: '字符数',
    dataIndex: 'wordCount',
    key: 'wordCount',
    align: 'center',
    width: 150,
  },
  {
    title: '召回次数',
    dataIndex: 'recallCount',
    key: 'recallCount',
    align: 'center',
    width: 150,
  },
  {
    title: '上传时间',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    align: 'center',
    width: 240,
  },
  {
    title: '状态',
    key: 'status',
    align: 'center',
    width: 160,
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 150,
  },
]

function goBack() {
  router.push({ name: 'personal-space-knowledge' })
}

function openRecallTest() {
  recallDrawerOpen.value = true
}

function addDocument() {
  router.push({ name: 'personal-space-knowledge-add-file', params: { knowledgeId: knowledgeId.value } })
}

function asKnowledgeDocument(record: unknown) {
  return record as KnowledgeDocument
}

function toggleDocumentStatus(document: KnowledgeDocument, checked: boolean) {
  appListStore.updateKnowledgeDocumentStatus(document.id, checked ? 'enabled' : 'disabled')
}

function handleDocumentAction(document: KnowledgeDocument, event: { key: string | number }) {
  if (event.key === 'rename') {
    renamingDocument.value = document
    renameName.value = document.name
    return
  }

  deletingDocument.value = document
}

function closeRenameModal() {
  renamingDocument.value = null
  renameName.value = ''
}

function confirmRename() {
  const document = renamingDocument.value
  const nextName = renameName.value.trim()

  if (!document) {
    return
  }

  if (!nextName) {
    message.warning('请输入新文档名')
    return
  }

  const hasSameName = documents.value.some((item) => item.id !== document.id && item.name === nextName)

  if (hasSameName) {
    message.warning('文档名不能和知识库内重复')
    return
  }

  if (appListStore.updateKnowledgeDocumentName(document.id, nextName)) {
    message.success('重命名成功')
    closeRenameModal()
  }
}

function closeDeleteModal() {
  deletingDocument.value = null
}

function confirmDelete() {
  const document = deletingDocument.value

  if (!document) {
    return
  }

  if (appListStore.deleteKnowledgeDocument(document.id)) {
    message.success('删除成功')
    closeDeleteModal()
  }
}

watch(
  knowledge,
  (item) => {
    if (item || !knowledgeId.value) {
      return
    }

    router.replace({ name: 'personal-space-knowledge' })
  },
  { immediate: true },
)
</script>

<template>
  <section v-if="knowledge" class="knowledge-detail">
    <WorkspaceTopbar
      :accent="knowledge.accent"
      :bordered="false"
      :icon="knowledge.icon"
      :is-image-icon="knowledge.icon.startsWith('data:')"
      :title="`知识库 / ${knowledge.name}`"
      back-label="返回知识库列表"
      fallback-icon="lucide:book-open"
      @back="goBack"
    >
      <template #meta>
        <span v-for="item in detailMeta" :key="item" class="knowledge-detail__meta-tag">
          {{ item }}
        </span>
      </template>
    </WorkspaceTopbar>

    <div class="knowledge-detail__toolbar">
      <Input v-model:value="keyword" class="knowledge-detail__search" placeholder="输入关键词搜索文档">
        <template #prefix>
          <AppIcon icon="lucide:search" size="15" />
        </template>
      </Input>

      <div class="knowledge-detail__actions">
        <Button @click="openRecallTest">
          <template #icon>
            <AppIcon icon="lucide:scan-search" size="15" />
          </template>
          召回测试
        </Button>
        <Button type="primary" @click="addDocument">
          <template #icon>
            <AppIcon icon="lucide:plus" size="15" />
          </template>
          添加文件
        </Button>
      </div>
    </div>

    <section class="knowledge-detail__panel">
      <Table
        class="knowledge-detail__table"
        aria-label="知识库文档"
        row-key="id"
        size="small"
        table-layout="fixed"
        :columns="documentColumns"
        :data-source="filteredDocuments"
        :pagination="false"
        :row-hoverable="false"
        :scroll="{ x: 1274 }"
      >
        <template #bodyCell="{ column, text, record, index }">
          <template v-if="column.key === 'index'">
            {{ filteredDocuments.length - index }}
          </template>
          <template v-else-if="column.key === 'name'">
            <span class="knowledge-detail__file">{{ text }}</span>
          </template>
          <template v-else-if="column.key === 'status'">
            <span class="knowledge-detail__status">
              <i
                class="knowledge-detail__status-dot"
                :class="`is-${record.status}`"
                aria-hidden="true"
              ></i>
              {{ record.status === 'enabled' ? '可用' : '已禁用' }}
            </span>
          </template>
          <template v-else-if="column.key === 'action'">
            <span class="knowledge-detail__ops">
              <Switch
                :checked="record.status === 'enabled'"
                size="small"
                @click.stop
                @change="(checked) => toggleDocumentStatus(asKnowledgeDocument(record), checked)"
              />

              <Dropdown
                :menu="{ items: documentActions, onClick: (event) => handleDocumentAction(asKnowledgeDocument(record), event) }"
                :trigger="['click']"
                placement="bottomRight"
              >
                <button
                  class="knowledge-detail__more"
                  type="button"
                  aria-label="更多操作"
                  @click.stop
                  @keydown.stop
                >
                  <AppIcon icon="lucide:ellipsis" size="18" />
                </button>
              </Dropdown>
            </span>
          </template>
        </template>
        <template #emptyText>
          <div class="knowledge-detail__empty">
            <AppIcon icon="lucide:inbox" size="28" />
            <span>暂无匹配文档</span>
          </div>
        </template>
      </Table>
    </section>
    <div class="knowledge-detail__loaded">数据已加载完成</div>

    <Transition name="knowledge-detail-panel">
      <aside v-if="recallDrawerOpen" class="knowledge-detail__drawer">
        <div class="knowledge-detail__drawer-head">
          <h2>召回测试</h2>
          <button type="button" aria-label="关闭召回测试" @click="recallDrawerOpen = false">
            <AppIcon icon="lucide:x" size="18" />
          </button>
        </div>
        <Input placeholder="输入测试问题" />
        <div class="knowledge-detail__result">
          <span>命中片段</span>
          <p>选择问题后，这里会展示匹配到的文档片段与相似度结果。</p>
        </div>
      </aside>
    </Transition>

    <Modal
      :open="renamingDocument !== null"
      title="重命名"
      centered
      ok-text="确认"
      cancel-text="取消"
      width="520px"
      destroy-on-hidden
      @ok="confirmRename"
      @cancel="closeRenameModal"
      @update:open="(open) => !open && closeRenameModal()"
    >
      <label class="knowledge-detail__rename-field">
        <span>名称 <b>*</b></span>
        <Input
          v-model:value="renameName"
          placeholder="请输入新文档名，文档名不能和知识库内重复"
          @press-enter="confirmRename"
        />
      </label>
    </Modal>

    <Modal
      :open="deletingDocument !== null"
      title="要删除该文档吗？"
      centered
      ok-text="确认"
      ok-type="danger"
      cancel-text="取消"
      width="520px"
      destroy-on-hidden
      @ok="confirmDelete"
      @cancel="closeDeleteModal"
      @update:open="(open) => !open && closeDeleteModal()"
    >
      <p class="knowledge-detail__delete-tip">
        删除文档后，知识库/向量数据库将无法检索到该文档，如果暂时关闭该文档的检索，可以选择禁用功能。
      </p>
    </Modal>
  </section>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
