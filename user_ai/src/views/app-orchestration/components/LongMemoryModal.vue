<script setup lang="ts">
import { Modal, TextArea } from 'antdv-next'

const open = defineModel<boolean>('open', { required: true })
const content = defineModel<string>('content', { required: true })
</script>

<template>
  <Modal
    v-model:open="open"
    title="长期记忆"
    centered
    width="640px"
    ok-text="更新记忆"
    cancel-text="取消"
  >
    <TextArea
      v-model:value="content"
      class="long-memory-editor"
      :auto-size="{ minRows: 6, maxRows: 8 }"
    />
  </Modal>
</template>
