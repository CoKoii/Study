<script setup lang="ts">
import CapabilityConfigPanel from '../CapabilityConfigPanel/index.vue'
import PreviewDebugPanel from '../PreviewDebugPanel/index.vue'
import PromptEditorPanel from '../PromptEditorPanel/index.vue'

defineProps<{
  appDescription: string
  appName: string
}>()

const emit = defineEmits<{
  'open-long-memory': []
}>()
</script>

<template>
  <section class="app-orchestration__body">
    <PromptEditorPanel :app-description="appDescription" />
    <CapabilityConfigPanel />
    <PreviewDebugPanel :app-name="appName" @open-long-memory="emit('open-long-memory')" />
  </section>
</template>
