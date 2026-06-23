<script setup lang="ts">
import AppIcon from '@/components/AppIcon/index.vue'
import WorkspaceBackButton from '@/components/WorkspaceBackButton/index.vue'
import { useAppListStore } from '@/stores/app-list'
import type { StepItem, UploadFile, UploadProps } from 'antdv-next'
import { Button, Checkbox, Input, message, Steps, UploadDragger } from 'antdv-next'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const MAX_FILE_COUNT = 10
const MAX_FILE_SIZE = 10 * 1024 * 1024
const ACCEPTED_EXTENSIONS = ['pdf', 'txt', 'doc', 'docx', 'md']

const route = useRoute()
const router = useRouter()
const appListStore = useAppListStore()
const currentStep = ref(0)
const segmentMode = ref<'auto' | 'custom'>('auto')
const segmentSeparators = ref('')
const segmentMaxLength = ref('')
const replaceWhitespace = ref(false)
const removeUrls = ref(false)
const fileList = ref<UploadFile[]>([
  createPresetFile('基于工具调用的智能体设计与实现.md', 15155),
  createPresetFile('课程Prompt提示词.txt', 2150),
  createPresetFile('LLMOps 项目API文档.md', 97382),
])

const knowledgeId = computed(() => String(route.params.knowledgeId ?? ''))
const knowledge = computed(() => {
  const item = appListStore.findAppById(knowledgeId.value)
  return item?.kind === 'knowledge' ? item : null
})
const stepItems: StepItem[] = [{ title: '上传' }, { title: '分段设置' }, { title: '数据处理' }]
const processingFiles = computed(() =>
  fileList.value.map((file, index) => ({
    ...file,
    percent: index === 0 ? 51 : 100,
    statusText: index === 0 ? '51%' : '处理完成',
  })),
)

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const extension = getFileExtension(file.name)

  if (!ACCEPTED_EXTENSIONS.includes(extension)) {
    message.warning('仅支持 PDF、TXT、DOC、DOCX、MD 文件')
    return false
  }

  if (file.size > MAX_FILE_SIZE) {
    message.warning('单个文件不能超过 10MB')
    return false
  }

  if (fileList.value.length >= MAX_FILE_COUNT) {
    message.warning('最多只能上传 10 个文件')
    return false
  }

  if (fileList.value.some((item) => item.name === file.name)) {
    message.warning('文件已存在')
    return false
  }

  fileList.value = [
    ...fileList.value,
    {
      uid: file.uid,
      name: file.name,
      size: file.size,
      status: 'done',
      type: file.type,
      originFileObj: file,
    },
  ]
  return false
}

function createPresetFile(name: string, size: number): UploadFile {
  return {
    uid: `preset-${name}`,
    name,
    size,
    status: 'done',
  }
}

function getFileExtension(fileName: string) {
  return fileName.split('.').pop()?.toLowerCase() ?? ''
}

function removeFile(uid: string) {
  fileList.value = fileList.value.filter((file) => file.uid !== uid)
}

function goBack() {
  router.push({ name: 'personal-space-knowledge-detail', params: { knowledgeId: knowledgeId.value } })
}

function goPreviousStep() {
  currentStep.value = Math.max(0, currentStep.value - 1)
}

function goNextStep() {
  if (!fileList.value.length) {
    message.warning('请先上传文件')
    return
  }

  if (currentStep.value === 1 && segmentMode.value === 'custom' && !validateCustomSegment()) {
    return
  }

  if (currentStep.value < stepItems.length - 1) {
    currentStep.value += 1
    return
  }

  submitFiles()
}

function validateCustomSegment() {
  const maxLength = Number(segmentMaxLength.value)

  if (!segmentSeparators.value.trim()) {
    message.warning('请输入分段标识符')
    return false
  }

  if (!Number.isInteger(maxLength) || maxLength < 100 || maxLength > 1000) {
    message.warning('分段最大长度需为 100 - 1000 的整数')
    return false
  }

  return true
}

function submitFiles() {
  appListStore.addKnowledgeDocuments(
    knowledgeId.value,
    fileList.value.map((file) => ({
      name: file.name,
      size: file.size,
    })),
  )
  message.success('文件添加成功')
  goBack()
}

function formatUploadSize(size = 0) {
  if (!size) {
    return '0 KB'
  }

  return `${(size / 1024).toFixed(2)} KB`
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
  <section v-if="knowledge" class="knowledge-add-file">
    <header class="knowledge-add-file__header">
      <WorkspaceBackButton label="返回知识库详情" @click="goBack" />
      <h1>添加文件</h1>
    </header>

    <Steps class="knowledge-add-file__steps" size="small" :current="currentStep" :items="stepItems" />

    <main class="knowledge-add-file__main">
      <template v-if="currentStep === 0">
        <UploadDragger
          accept=".pdf,.txt,.doc,.docx,.md"
          :before-upload="beforeUpload"
          :file-list="fileList"
          :max-count="MAX_FILE_COUNT"
          :multiple="true"
          :show-upload-list="false"
        >
          <div class="knowledge-add-file__drop">
            <AppIcon icon="lucide:upload" size="18" />
            <span>点击或拖拽文件到此处上传</span>
            <p>支持PDF、TXT、DOC、DOCX、MD，最多可上传10个文件，每个文件不超过10MB</p>
          </div>
        </UploadDragger>

        <div class="knowledge-add-file__list" aria-label="待上传文件">
          <div v-for="file in fileList" :key="file.uid" class="knowledge-add-file__item">
            <span>
              <AppIcon icon="lucide:file-text" size="14" />
              {{ file.name }}
            </span>
            <button type="button" aria-label="删除文件" @click="removeFile(file.uid)">
              <AppIcon icon="lucide:trash-2" size="14" />
            </button>
          </div>
        </div>
      </template>

      <div v-else-if="currentStep === 1" class="knowledge-add-file__segment">
        <button
          class="knowledge-add-file__segment-card"
          :class="{ 'is-active': segmentMode === 'auto' }"
          type="button"
          @click="segmentMode = 'auto'"
        >
          <strong>自动分段与清洗</strong>
          <span>自动分段与预处理规则</span>
        </button>

        <section
          class="knowledge-add-file__segment-card knowledge-add-file__segment-card--custom"
          :class="{ 'is-active': segmentMode === 'custom' }"
        >
          <button type="button" @click="segmentMode = 'custom'">
            <strong>自定义</strong>
            <span>自定义分段规则、分段长度与预处理规则</span>
          </button>

          <div v-if="segmentMode === 'custom'" class="knowledge-add-file__segment-form">
            <label class="knowledge-add-file__field">
              <span>分段标识符 <b>*</b></span>
              <Input
                v-model:value="segmentSeparators"
                placeholder="请输入分段标识符，如果有多个标识符，请使用英文逗号进行分割"
              />
            </label>

            <label class="knowledge-add-file__field">
              <span>分段最大长度 <b>*</b></span>
              <Input v-model:value="segmentMaxLength" placeholder="请输入100 - 1000的数值" />
            </label>

            <div class="knowledge-add-file__checks">
              <span>文本预处理规则</span>
              <label class="knowledge-add-file__check">
                <Checkbox v-model:checked="replaceWhitespace" />
                <span>替换掉连续的空格、换行符和制表符</span>
              </label>
              <label class="knowledge-add-file__check">
                <Checkbox v-model:checked="removeUrls" />
                <span>删除所有 URL 和电子邮件地址</span>
              </label>
            </div>
          </div>
        </section>
      </div>

      <section v-else class="knowledge-add-file__processing">
        <h2>服务端处理中</h2>
        <div class="knowledge-add-file__process-list">
          <article
            v-for="file in processingFiles"
            :key="file.uid"
            class="knowledge-add-file__process-item"
          >
            <div class="knowledge-add-file__process-info">
              <AppIcon icon="lucide:file-text" size="16" />
              <div>
                <strong>{{ file.name }}</strong>
                <span>{{ formatUploadSize(file.size) }}</span>
              </div>
            </div>
            <span class="knowledge-add-file__process-state">{{ file.statusText }}</span>
          </article>
        </div>
      </section>
    </main>

    <footer class="knowledge-add-file__footer">
      <template v-if="currentStep < stepItems.length - 1">
        <Button v-if="currentStep > 0" @click="goPreviousStep">上一步</Button>
        <Button
          class="knowledge-add-file__next"
          type="primary"
          :disabled="!fileList.length"
          @click="goNextStep"
        >
          下一步
        </Button>
      </template>
      <template v-else>
        <span class="knowledge-add-file__hint">
          点击确认不影响数据处理，处理完毕后可进行引用
        </span>
        <Button class="knowledge-add-file__next" type="primary" @click="submitFiles">确定</Button>
      </template>
    </footer>
  </section>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
