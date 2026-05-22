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

const emit = defineEmits(['update:open', 'submit', 'reset'])
</script>

<template>
  <a-drawer
    :open="open"
    title="新增学生信息"
    size="560"
    :styles="{ body: { paddingBottom: '80px' } }"
    @update:open="emit('update:open', $event)"
  >
    <a-form layout="vertical" :model="form" @finish="emit('submit')">
      <a-row :gutter="16">
        <a-col v-for="field in studentFields" :key="field.key" :span="12">
          <a-form-item :label="field.label" :name="field.key" :rules="[{ required: true, message: `请填写${field.label}` }]">
            <a-select
              v-if="field.input === 'select'"
              v-model:value="form[field.key]"
              :options="field.options"
            />
            <a-input-number
              v-else-if="field.input === 'number'"
              v-model:value="form[field.key]"
              :min="field.min"
              :step="field.step"
              :style="{ width: '100%' }"
            />
            <a-input v-else v-model:value="form[field.key]" :placeholder="field.placeholder" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-space>
        <a-button type="primary" html-type="submit" :loading="submitting">新增学生</a-button>
        <a-button @click="emit('reset')">清空</a-button>
      </a-space>
    </a-form>
  </a-drawer>
</template>
