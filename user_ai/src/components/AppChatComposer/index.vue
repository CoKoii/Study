<script setup lang="ts">
import { CloudUploadOutlined, LinkOutlined } from '@ant-design/icons-vue'
import { Badge, Button } from 'antdv-next'
import { Attachments, Sender, type Attachment } from 'ant-design-x-vue'
import { h, onUnmounted, ref } from 'vue'

type AttachmentChangeInfo = {
  file: Attachment
  fileList: Attachment[]
}

withDefaults(
  defineProps<{
    placeholder?: string
  }>(),
  {
    placeholder: '发送消息...',
  },
)

const emit = defineEmits<{
  submit: [message: string]
}>()

const message = ref('')
const attachmentsOpen = ref(false)
const attachments = ref<Attachment[]>([])
const senderRef = ref<InstanceType<typeof Sender> | null>(null)
const attachmentsRef = ref<InstanceType<typeof Attachments> | null>(null)

const revokeObjectUrl = (url?: string) => {
  if (url?.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}

const clearAttachments = () => {
  attachments.value.forEach((item: Attachment) => revokeObjectUrl(item.url))
  attachments.value = []
}

onUnmounted(clearAttachments)

const attachmentPlaceholder = (type: 'inline' | 'drop') =>
  type === 'drop'
    ? { title: '拖拽文件到这里' }
    : {
        icon: h(CloudUploadOutlined),
        title: '上传文件',
        description: '点击或拖拽文件到这里',
      }

const handleAttachmentChange = ({ file, fileList }: AttachmentChangeInfo) => {
  if (file.status === 'removed') {
    revokeObjectUrl(file.url)
    attachments.value = fileList
    return
  }

  attachments.value = fileList.map((item) => {
    if (item.uid !== file.uid || !item.originFileObj) {
      return item
    }

    revokeObjectUrl(item.url)
    return {
      ...item,
      url: URL.createObjectURL(item.originFileObj),
    }
  })
}

const handleSubmit = (value: string) => {
  emit('submit', value)
  message.value = ''
  clearAttachments()
}

const toggleAttachments = () => {
  attachmentsOpen.value = !attachmentsOpen.value
}

const handlePasteFile = (_firstFile: File, files: FileList) => {
  attachmentsRef.value?.upload(files)
  attachmentsOpen.value = true
}
</script>

<template>
  <Sender
    ref="senderRef"
    v-model:value="message"
    class="app-chat-composer"
    :allow-speech="true"
    :auto-size="{ minRows: 1, maxRows: 6 }"
    :placeholder="placeholder"
    @paste-file="handlePasteFile"
    @submit="handleSubmit"
  >
    <template #header>
      <Sender.Header
        title="附件"
        :open="attachmentsOpen"
        force-render
        :styles="{ content: { padding: 0 } }"
        @open-change="attachmentsOpen = $event"
      >
        <Attachments
          ref="attachmentsRef"
          :before-upload="() => false"
          :items="attachments"
          overflow="wrap"
          :placeholder="attachmentPlaceholder"
          :get-drop-container="() => senderRef?.nativeElement"
          @change="handleAttachmentChange"
        />
      </Sender.Header>
    </template>

    <template #prefix>
      <Badge :dot="attachments.length > 0 && !attachmentsOpen">
        <Button type="text" shape="circle" @click="toggleAttachments">
          <template #icon>
            <LinkOutlined />
          </template>
        </Button>
      </Badge>
    </template>
  </Sender>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
