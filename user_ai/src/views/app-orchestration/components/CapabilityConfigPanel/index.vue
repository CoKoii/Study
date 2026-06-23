<script setup lang="ts">
import AppIcon from '@/components/AppIcon/index.vue'
import type {
  CapabilityItem,
  PluginCategory,
  PluginMarketItem,
  PluginSource,
  RelationMode,
} from '../../share/types'
import {
  initialCapabilities,
  knowledgeItems,
  pluginMarketItems,
  pluginSources,
  settingSections,
  workflowItems,
} from '../../share/constants'
import CapabilityItemCard from '../CapabilityItem/index.vue'
import ConfigSection from '../ConfigSection/index.vue'
import PluginPickerModal from '../PluginPickerModal/index.vue'
import RelationPickerModal from '../RelationPickerModal/index.vue'
import RelationItemCard from '../RelationItem/index.vue'
import { Input, Switch, TextArea } from 'antdv-next'
import { computed, ref } from 'vue'

const openingText = ref('')
const openingQuestion = ref('')
const pluginModalOpen = ref(false)
const relationModalOpen = ref(false)
const relationMode = ref<RelationMode>('knowledge')
const selectedPluginSource = ref<PluginSource>('builtin')
const selectedPluginCategory = ref<PluginCategory>('all')
const selectedKnowledgeKeys = ref<string[]>([])
const selectedWorkflowKeys = ref<string[]>([])
const linkedKnowledgeKeys = ref<string[]>([])
const linkedWorkflowKeys = ref<string[]>([])
const capabilities = ref<CapabilityItem[]>([...initialCapabilities])
const removeKey = (keys: string[], key: string) => keys.filter((item) => item !== key)

const filteredPluginItems = computed(() =>
  pluginMarketItems.filter(
    (plugin) =>
      plugin.source === selectedPluginSource.value &&
      (selectedPluginCategory.value === 'all' || plugin.category === selectedPluginCategory.value),
  ),
)
const capabilityKeys = computed(
  () => new Set(capabilities.value.map((capability) => capability.key)),
)
const selectedPluginSourceLabel = computed(
  () =>
    pluginSources.find((source) => source.key === selectedPluginSource.value)?.label ?? '内置插件',
)
const pluginGroups = computed(() => {
  const groups = new Map<string, PluginMarketItem[]>()

  filteredPluginItems.value.forEach((plugin) => {
    groups.set(plugin.provider, [...(groups.get(plugin.provider) ?? []), plugin])
  })

  return Array.from(groups, ([provider, items]) => ({ provider, items }))
})
const relationTitle = computed(() =>
  relationMode.value === 'knowledge' ? '选择引用知识库' : '选择关联工作流',
)
const relationItems = computed(() =>
  relationMode.value === 'knowledge' ? knowledgeItems : workflowItems,
)
const selectedRelationKeys = computed({
  get: () =>
    relationMode.value === 'knowledge' ? selectedKnowledgeKeys.value : selectedWorkflowKeys.value,
  set: (keys: string[]) => {
    if (relationMode.value === 'knowledge') {
      selectedKnowledgeKeys.value = keys
      return
    }

    selectedWorkflowKeys.value = keys
  },
})
const linkedKnowledgeItems = computed(() => {
  const linkedKeys = new Set(linkedKnowledgeKeys.value)

  return knowledgeItems.filter((item) => linkedKeys.has(item.key))
})
const linkedWorkflowItems = computed(() => {
  const linkedKeys = new Set(linkedWorkflowKeys.value)

  return workflowItems.filter((item) => linkedKeys.has(item.key))
})

function isPluginAdded(pluginKey: string) {
  return capabilityKeys.value.has(pluginKey)
}

function addPlugin(plugin: PluginMarketItem) {
  if (isPluginAdded(plugin.key)) {
    return
  }

  capabilities.value.push({
    key: plugin.key,
    title: plugin.title,
    description: plugin.description,
    icon: plugin.icon,
    tone: plugin.tone,
  })
}

function removePlugin(pluginKey: string) {
  capabilities.value = capabilities.value.filter((capability) => capability.key !== pluginKey)
}

function openRelationModal(mode: RelationMode) {
  relationMode.value = mode

  if (mode === 'knowledge') {
    selectedKnowledgeKeys.value = [...linkedKnowledgeKeys.value]
  } else {
    selectedWorkflowKeys.value = [...linkedWorkflowKeys.value]
  }

  relationModalOpen.value = true
}

function toggleRelationItem(key: string) {
  selectedRelationKeys.value = selectedRelationKeys.value.includes(key)
    ? selectedRelationKeys.value.filter((item) => item !== key)
    : [...selectedRelationKeys.value, key]
}

function confirmRelationSelection() {
  if (relationMode.value === 'knowledge') {
    linkedKnowledgeKeys.value = [...selectedKnowledgeKeys.value]
  } else {
    linkedWorkflowKeys.value = [...selectedWorkflowKeys.value]
  }

  relationModalOpen.value = false
}

function removeRelationItem(mode: RelationMode, key: string) {
  if (mode === 'knowledge') {
    linkedKnowledgeKeys.value = removeKey(linkedKnowledgeKeys.value, key)
    selectedKnowledgeKeys.value = removeKey(selectedKnowledgeKeys.value, key)
    return
  }

  linkedWorkflowKeys.value = removeKey(linkedWorkflowKeys.value, key)
  selectedWorkflowKeys.value = removeKey(selectedWorkflowKeys.value, key)
}
</script>

<template>
  <section class="app-orchestration__config orchestration-workspace-panel">
    <div class="orchestration-panel__header">
      <h2>应用能力</h2>
    </div>

    <div class="app-orchestration__config-scroll">
      <ConfigSection title="扩展插件" action-label="添加扩展插件" @action="pluginModalOpen = true">
        <div class="capability-list">
          <CapabilityItemCard
            v-for="capability in capabilities"
            :key="capability.key"
            :item="capability"
            @remove="removePlugin"
          />
        </div>
      </ConfigSection>

      <ConfigSection
        title="工作流组件"
        action-label="添加工作流"
        @action="openRelationModal('workflow')"
      >
        <p class="config-section__description">
          工作流支持通过可视化的方式，对插件、大语言模型、代码块等功能进行组合，从而实现复杂、稳定的业务流程编排。
        </p>
        <div v-if="linkedWorkflowItems.length" class="relation-list">
          <RelationItemCard
            v-for="item in linkedWorkflowItems"
            :key="item.key"
            :item="item"
            remove-label="移除工作流"
            @remove="removeRelationItem('workflow', $event)"
          />
        </div>
      </ConfigSection>

      <ConfigSection
        title="知识库"
        action-label="添加知识库"
        @action="openRelationModal('knowledge')"
      >
        <p class="config-section__description">
          引用文本类型的数据，实现知识问答，应用最多支持关联 5 个知识库。
        </p>
        <div v-if="linkedKnowledgeItems.length" class="relation-list">
          <RelationItemCard
            v-for="item in linkedKnowledgeItems"
            :key="item.key"
            :item="item"
            remove-label="移除知识库"
            @remove="removeRelationItem('knowledge', $event)"
          />
        </div>
      </ConfigSection>

      <ConfigSection v-for="section in settingSections" :key="section.title" :title="section.title">
        <template #actions>
          <Switch
            v-if="section.enabled !== undefined"
            :checked="section.enabled"
            checked-children="开启"
            un-checked-children="关闭"
          />
        </template>

        <template v-if="section.type === 'textarea'">
          <label class="config-section__label">
            开场白文案
            <AppIcon icon="lucide:info" size="14" />
          </label>
          <TextArea
            v-model:value="openingText"
            placeholder="在此处填写 AI 应用的开场白"
            :auto-size="{ minRows: 3, maxRows: 4 }"
          />
          <label class="config-section__label">
            开场白预设问题
            <AppIcon icon="lucide:info" size="14" />
          </label>
          <Input v-model:value="openingQuestion" placeholder="输入开场白引导问题">
            <template #suffix>
              <AppIcon icon="lucide:circle-minus" size="16" />
            </template>
          </Input>
        </template>

        <p v-else-if="section.description" class="config-section__description">
          {{ section.description }}
        </p>
      </ConfigSection>
    </div>
  </section>

  <PluginPickerModal
    v-model:open="pluginModalOpen"
    v-model:source="selectedPluginSource"
    v-model:category="selectedPluginCategory"
    :groups="pluginGroups"
    :source-label="selectedPluginSourceLabel"
    :is-plugin-added="isPluginAdded"
    @add-plugin="addPlugin"
  />

  <RelationPickerModal
    v-model:open="relationModalOpen"
    :title="relationTitle"
    :mode="relationMode"
    :items="relationItems"
    :selected-keys="selectedRelationKeys"
    @toggle-item="toggleRelationItem"
    @confirm="confirmRelationSelection"
  />
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
