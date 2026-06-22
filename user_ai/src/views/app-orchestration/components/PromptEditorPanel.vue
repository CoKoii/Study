<script setup lang="ts">
import AppIcon from '@/components/AppIcon/index.vue'
import { defaultModelSettings, modelOptions, modelSettingGroups } from '../share/orchestration-data'
import { Button, InputNumber, Popover, Select, Slider } from 'antdv-next'
import { computed, ref } from 'vue'

defineProps<{
  appDescription: string
}>()

const selectedModel = ref('gpt-4o')
const modelSettingsOpen = ref(false)
const modelSettings = ref({ ...defaultModelSettings })
const selectedModelLabel = computed(
  () => modelOptions.find((item) => item.value === selectedModel.value)?.label ?? 'GPT-4o',
)
</script>

<template>
  <section class="app-orchestration__prompt">
    <div class="orchestration-panel__header">
      <div class="app-orchestration__title-row">
        <h2>应用编排</h2>
        <Popover
          v-model:open="modelSettingsOpen"
          trigger="click"
          placement="bottomLeft"
          overlay-class-name="model-settings-popover"
        >
          <button class="app-orchestration__model-trigger" type="button">
            <AppIcon icon="lucide:brain-circuit" size="14" />
            <span>{{ selectedModelLabel }}</span>
            <AppIcon icon="lucide:chevron-down" size="14" />
          </button>

          <template #content>
            <section class="model-settings">
              <h3>模型设置</h3>

              <label class="model-settings__field">
                <span>模型</span>
                <Select v-model:value="selectedModel" :options="modelOptions" />
              </label>

              <div
                v-for="group in modelSettingGroups"
                :key="group.title"
                class="model-settings__group"
              >
                <span>{{ group.title }}</span>
                <label v-for="item in group.items" :key="item.key" class="model-settings__row">
                  <span>{{ item.label }}</span>
                  <Slider
                    v-model:value="modelSettings[item.key]"
                    :min="item.min"
                    :max="item.max"
                    :step="item.step"
                    :tooltip="{ formatter: null }"
                  />
                  <InputNumber
                    v-model:value="modelSettings[item.key]"
                    :min="item.min"
                    :max="item.max"
                    :step="item.step"
                  />
                </label>
              </div>
            </section>
          </template>
        </Popover>
      </div>
    </div>

    <div class="app-orchestration__prompt-content">
      <div class="app-orchestration__prompt-heading">
        <h3>人设与回复逻辑</h3>
        <Button type="text" size="small">
          <template #icon>
            <AppIcon icon="lucide:refresh-cw" size="15" />
          </template>
          优化
        </Button>
      </div>

      <div class="app-orchestration__prompt-text">
        <p># 角色</p>
        <p>{{ appDescription }}</p>
        <p>
          你是一个智能聊天机器人，能够与用户进行各种话题的交流，包括但不限于生活、工作、学习、娱乐等。
        </p>

        <p>## 技能</p>
        <p>### 技能 1: 日常交流</p>
        <p>1. 当用户分享日常生活经历时，给予积极的回应和适当的建议。</p>
        <p>2. 对于用户的心情表达，提供安慰和鼓励。</p>

        <p>### 技能 2: 知识解答</p>
        <p>1. 当用户提出问题，运用知识库和搜索工具提供准确、详细的答案。</p>
        <p>2. 对于复杂问题，分步骤进行解释。</p>

        <p>### 技能 3: 娱乐互动</p>
        <p>1. 能与用户玩文字游戏，如猜谜语、成语接龙等。</p>
        <p>2. 推荐有趣的娱乐活动和节目。</p>

        <p>## 限制:</p>
        <p>- 回答内容应积极、友善、文明，不得包含不当言论。</p>
        <p>- 所输出的内容必须按照给定的格式进行组织，不能偏离框架要求。</p>
        <p>- 对于不确定的问题，应明确告知用户并尽力提供获取准确信息的途径。</p>
      </div>
    </div>
  </section>
</template>
