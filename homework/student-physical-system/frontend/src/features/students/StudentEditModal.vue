<script setup>
import { studentFields } from './studentFields'

defineProps({
  open: {
    type: Boolean,
    default: false
  },
  form: {
    type: Object,
    required: true
  },
  submitting: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:open', 'submit'])
</script>

<template>
  <a-modal
    :open="open"
    title="修改学生信息"
    ok-text="保存修改"
    cancel-text="取消"
    :confirm-loading="submitting"
    width="720px"
    @update:open="emit('update:open', $event)"
    @ok="emit('submit')"
  >
    <a-form layout="vertical" :model="form">
      <a-row :gutter="16">
        <a-col v-for="field in studentFields" :key="field.key" :span="12">
          <a-form-item :label="field.label" :name="field.key">
            <a-select
              v-if="field.input === 'select'"
              v-model:value="form[field.key]"
              :disabled="field.key === 'stuNo'"
              :options="field.options"
            />
            <a-input-number
              v-else-if="field.input === 'number'"
              v-model:value="form[field.key]"
              :min="field.min"
              :step="field.step"
              :disabled="field.key === 'stuNo'"
              :style="{ width: '100%' }"
            />
            <a-input
              v-else
              v-model:value="form[field.key]"
              :placeholder="field.placeholder"
              :disabled="field.key === 'stuNo'"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>
