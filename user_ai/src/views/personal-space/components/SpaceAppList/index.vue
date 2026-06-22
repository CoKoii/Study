<script setup lang="ts">
import AppIcon from '@/components/AppIcon/index.vue'
import CreateAppModal from '@/views/personal-space/components/CreateAppModal/index.vue'
import { useAppIconUpload } from '@/views/personal-space/components/CreateAppModal/share/use-app-icon-upload'
import SpaceAppCard from '@/views/personal-space/components/SpaceAppCard/index.vue'
import { useAppListStore } from '@/stores/app-list'
import type { SpaceApp, SpaceAppForm } from '@/stores/app-list'
import { getSpaceResourceByRouteName, spaceResources } from '@/views/personal-space/share/resources'
import type { FormInstance } from 'antdv-next'
import { Button, Drawer, Form, FormItem, Input, message, Modal, TextArea, Upload } from 'antdv-next'
import { storeToRefs } from 'pinia'
import { computed, reactive, ref, shallowRef, toRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const appListStore = useAppListStore()
const { appItems } = storeToRefs(appListStore)
const route = useRoute()
const router = useRouter()
const tabs = spaceResources
const modalMode = ref<'create' | 'edit' | null>(null)
const editingApp = ref<SpaceApp | null>(null)
const pluginDetail = ref<SpaceApp | null>(null)
const pluginModalMode = ref<'create' | 'edit'>('create')
const pluginCreatorOpen = ref(false)
const pluginIconLoading = ref(false)
const pluginFormRef = shallowRef<FormInstance>()
const pluginForm = reactive({
  icon: '',
  name: '',
  schema: '',
  headers: [{ id: crypto.randomUUID(), key: '', value: '' }],
})
const query = ref('')
const activeResource = computed(() => getSpaceResourceByRouteName(route.name))
const isPluginResource = computed(() => activeResource.value.kind === 'plugin')
const pluginModalTitle = computed(() =>
  pluginModalMode.value === 'edit' ? '编辑插件' : '新建插件',
)
const hasPluginImageIcon = computed(() => /^(blob:|data:image\/|https?:\/\/)/.test(pluginForm.icon))
const modalOpen = computed({
  get: () => modalMode.value !== null,
  set: (open) => {
    if (!open) {
      closeModal()
    }
  },
})
const modalResourceKind = computed(() => editingApp.value?.kind ?? activeResource.value.kind)
const filteredItems = computed(() => {
  const keyword = query.value.trim().toLowerCase()

  return appItems.value.filter((item) => {
    if (item.kind !== activeResource.value.kind) {
      return false
    }

    if (!keyword) {
      return true
    }

    return [item.name, item.description, item.type].some((field) =>
      field.toLowerCase().includes(keyword),
    )
  })
})
const { beforeIconUpload: beforePluginIconUpload } = useAppIconUpload(
  toRef(pluginForm, 'icon'),
  pluginIconLoading,
  pluginFormRef,
)

function openCreateModal() {
  if (isPluginResource.value) {
    openPluginCreator()
    return
  }

  editingApp.value = null
  modalMode.value = 'create'
}

function switchTab(routeName: string) {
  if (routeName === route.name) {
    return
  }

  router.push({ name: routeName })
}

function openEditModal(app: SpaceApp) {
  if (app.kind === 'plugin') {
    openPluginCreator(app)
    return
  }

  editingApp.value = app
  modalMode.value = 'edit'
}

function openItem(app: SpaceApp) {
  if (app.kind === 'plugin') {
    pluginDetail.value = app
  }
}

function closeModal() {
  modalMode.value = null
  editingApp.value = null
}

function openPluginCreator(app?: SpaceApp) {
  pluginModalMode.value = app ? 'edit' : 'create'
  editingApp.value = app ?? null
  pluginForm.icon = app?.icon ?? ''
  pluginForm.name = app?.name ?? ''
  pluginForm.schema = ''
  pluginForm.headers = [{ id: crypto.randomUUID(), key: '', value: '' }]
  pluginIconLoading.value = false
  pluginCreatorOpen.value = true
}

function closePluginCreator() {
  pluginCreatorOpen.value = false
  editingApp.value = null
  pluginForm.icon = ''
  pluginForm.name = ''
  pluginForm.schema = ''
  pluginForm.headers = [{ id: crypto.randomUUID(), key: '', value: '' }]
  pluginIconLoading.value = false
}

function addPluginHeader() {
  pluginForm.headers.push({ id: crypto.randomUUID(), key: '', value: '' })
}

function removePluginHeader(headerId: string) {
  pluginForm.headers = pluginForm.headers.filter((header) => header.id !== headerId)

  if (!pluginForm.headers.length) {
    addPluginHeader()
  }
}

function submitPluginForm() {
  pluginFormRef.value?.submit()
}

function handleSubmitApp(form: SpaceAppForm) {
  if (modalMode.value === 'edit') {
    handleUpdateApp(form)
    return
  }

  appListStore.createApp(form, activeResource.value.kind)
  closeModal()
  message.success('创建成功')
}

function savePlugin() {
  const name = pluginForm.name.trim() || '自定义插件'
  const form = {
    icon: pluginForm.icon || 'lucide:plug-zap',
    name,
    description: editingApp.value?.description ?? '通过 OpenAPI Schema 创建的插件。',
  }

  if (pluginModalMode.value === 'edit' && editingApp.value) {
    appListStore.updateApp(editingApp.value.id, form)

    if (pluginDetail.value?.id === editingApp.value.id) {
      pluginDetail.value = {
        ...pluginDetail.value,
        ...form,
      }
    }

    closePluginCreator()
    message.success('保存成功')
    return
  }

  appListStore.createApp(form, 'plugin')

  closePluginCreator()
  message.success('创建成功')
}

function handleUpdateApp(form: SpaceAppForm) {
  if (editingApp.value && appListStore.updateApp(editingApp.value.id, form)) {
    message.success('保存成功')
  }
}

function deleteApp(app: SpaceApp) {
  Modal.confirm({
    title: `删除${activeResource.value.title}「${app.name}」？`,
    content: activeResource.value.deleteWarning,
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    onOk() {
      if (appListStore.deleteApp(app.id)) {
        message.success('删除成功')
      }
    },
  })
}

watch(
  () => route.query.create,
  (create) => {
    if (create !== '1') {
      return
    }

    openCreateModal()
    router.replace({ name: route.name ?? undefined, query: { ...route.query, create: undefined } })
  },
  { immediate: true },
)
</script>

<template>
  <section class="space-app-list">
    <header class="space-app-list__header">
      <h1>{{ activeResource.title }}</h1>
      <button class="space-app-list__create" type="button" @click="openCreateModal">
        <AppIcon icon="lucide:plus" size="18" />
        <span>{{ activeResource.createText }}</span>
      </button>
    </header>

    <div class="space-app-list__toolbar">
      <div class="space-app-list__tabs" aria-label="应用筛选">
        <button
          v-for="tab in tabs"
          :key="tab.kind"
          class="space-app-list__tab"
          :class="{ 'is-active': tab.kind === activeResource.kind }"
          type="button"
          @click="switchTab(tab.routeName)"
        >
          {{ tab.label }}
        </button>
      </div>

      <label class="space-app-list__search">
        <AppIcon icon="lucide:search" size="16" />
        <input v-model="query" type="search" :placeholder="activeResource.searchPlaceholder" />
      </label>
    </div>

    <Transition name="route-fade" mode="out-in" appear>
      <div :key="activeResource.kind" class="space-app-list__content">
        <div v-if="filteredItems.length" class="space-app-list__grid">
          <SpaceAppCard
            v-for="item in filteredItems"
            :key="item.id"
            :app="item"
            @open="openItem"
            @edit="openEditModal"
            @delete="deleteApp"
          />
        </div>

        <div v-else class="space-app-list__empty">
          <AppIcon icon="lucide:inbox" size="28" />
          <span>{{ activeResource.emptyText }}</span>
        </div>
      </div>
    </Transition>

    <CreateAppModal
      v-model:open="modalOpen"
      :mode="modalMode ?? 'create'"
      :resource-kind="modalResourceKind"
      :initial-value="editingApp"
      @submit="handleSubmitApp"
    />

    <Drawer
      :open="pluginDetail !== null"
      title="工具详情"
      placement="right"
      root-class="plugin-detail-drawer"
      :width="360"
      :closable="{ placement: 'end' }"
      destroy-on-hidden
      @update:open="(open) => !open && (pluginDetail = null)"
    >
      <section v-if="pluginDetail" class="plugin-detail">
        <div class="plugin-detail__summary">
          <div
            class="plugin-detail__icon"
            :class="{ 'has-image': pluginDetail.icon.startsWith('data:') }"
            :style="{ backgroundColor: pluginDetail.accent }"
          >
            <img
              v-if="pluginDetail.icon.startsWith('data:')"
              :src="pluginDetail.icon"
              alt=""
              :draggable="false"
            />
            <AppIcon v-else :icon="pluginDetail.icon" size="22" />
          </div>
          <div>
            <h2>{{ pluginDetail.name }}</h2>
            <span>作者 慕小课 · 1 插件</span>
          </div>
        </div>

        <p class="plugin-detail__description">{{ pluginDetail.description }}</p>

        <Button block @click="openPluginCreator(pluginDetail)">
          <template #icon>
            <AppIcon icon="lucide:settings" size="15" />
          </template>
          编辑
        </Button>

        <div class="plugin-detail__divider"></div>
        <span class="plugin-detail__count">包含 1 个工具</span>

        <article class="plugin-detail__tool">
          <h3>{{ pluginDetail.name }}搜索</h3>
          <p>一个用于执行搜索并提取结构化结果的工具。输入应是一个搜索查询。</p>
          <dl>
            <dt>提示词</dt>
            <dd>字符串 · 必填</dd>
          </dl>
        </article>
      </section>
    </Drawer>

    <Modal
      v-model:open="pluginCreatorOpen"
      :title="pluginModalTitle"
      centered
      width="680px"
      ok-text="保存"
      cancel-text="取消"
      wrap-class-name="plugin-creator-modal"
      destroy-on-hidden
      @ok="submitPluginForm"
      @cancel="closePluginCreator"
    >
      <Form
        ref="pluginFormRef"
        class="plugin-creator"
        layout="vertical"
        name="plugin_creator"
        :model="pluginForm"
        clear-on-destroy
        @finish="savePlugin"
      >
        <div class="plugin-creator__cover">
          <Upload
            name="plugin-icon"
            accept="image/jpeg,image/png"
            list-type="picture-card"
            :show-upload-list="false"
            :before-upload="beforePluginIconUpload"
          >
            <img
              v-if="hasPluginImageIcon"
              :src="pluginForm.icon"
              alt="插件图标"
              :draggable="false"
              class="plugin-creator__icon-preview"
            />
            <button v-else class="plugin-creator__upload-trigger" type="button">
              <AppIcon
                :icon="
                  pluginIconLoading ? 'lucide:loader-circle' : pluginForm.icon || 'lucide:plus'
                "
                size="22"
              />
              <span>上传图标</span>
            </button>
          </Upload>
        </div>

        <FormItem
          label="插件名称"
          name="name"
          :rules="[{ required: true, whitespace: true, message: '插件名称不能为空' }]"
        >
          <Input
            v-model:value="pluginForm.name"
            placeholder="请输入插件名称，请确保名称含义清晰"
            show-count
            :maxlength="60"
          />
        </FormItem>

        <FormItem
          label="OpenAPI Schema"
          name="schema"
          :rules="[{ required: true, whitespace: true, message: 'OpenAPI Schema不能为空' }]"
        >
          <TextArea
            v-model:value="pluginForm.schema"
            placeholder="在此处输入您的 OpenAPI Schema"
            show-count
            :maxlength="600"
            :auto-size="{ minRows: 4, maxRows: 4 }"
          />
        </FormItem>

        <section class="plugin-creator__tools">
          <h3>可用工具</h3>
          <div class="plugin-creator__table">
            <div class="plugin-creator__table-head">
              <span>名称</span>
              <span>描述</span>
              <span>方法</span>
              <span>路径</span>
            </div>
            <div class="plugin-creator__table-row">
              <span>GetCurrentWeather</span>
              <span>获取特定城市的天气预报</span>
              <span>get</span>
              <span>/location</span>
            </div>
          </div>
        </section>

        <section class="plugin-creator__headers">
          <h3>Headers</h3>
          <div class="plugin-creator__table">
            <div class="plugin-creator__table-head">
              <span>Key</span>
              <span>Value</span>
              <span>操作</span>
            </div>
            <div
              v-for="header in pluginForm.headers"
              :key="header.id"
              class="plugin-creator__table-row"
            >
              <Input v-model:value="header.key" placeholder="请输入请求头键名" />
              <Input v-model:value="header.value" placeholder="请输入请求头键值内容" />
              <Button
                type="text"
                shape="circle"
                size="small"
                aria-label="删除 Header"
                @click="removePluginHeader(header.id)"
              >
                <template #icon>
                  <AppIcon icon="lucide:trash-2" size="14" />
                </template>
              </Button>
            </div>
          </div>
          <Button class="plugin-creator__add-header" @click="addPluginHeader">
            <template #icon>
              <AppIcon icon="lucide:plus" size="14" />
            </template>
            新增参数
          </Button>
        </section>
      </Form>
    </Modal>
  </section>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
