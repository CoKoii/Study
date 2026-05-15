<script setup>
import { reactive, watch, computed } from 'vue'

const props = defineProps({
  modelValue: { type: Object, required: true },
  submitting: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue', 'submit', 'cancel'])

const localForm = reactive({ ...props.modelValue })
watch(localForm, () => emit('update:modelValue', { ...localForm }), { deep: true })

const title = computed(() => localForm.stuNo && localForm.term ? '编辑体测记录' : '新增体测记录')

function handleSubmit() {
  emit('submit')
}
</script>

<template>
  <section class="panel form-panel">
    <div class="panel__header">
      <h2>{{ title }}</h2>
      <button class="button button-ghost" @click="emit('cancel')">取消</button>
    </div>
    <div class="form-grid">
      <label class="field"><span>学号</span><input v-model="localForm.stuNo" class="input" :disabled="!!localForm.stuNo && !!localForm.term" /></label>
      <label class="field"><span>学期</span><input v-model="localForm.term" class="input" :disabled="!!localForm.stuNo && !!localForm.term" /></label>
      <label class="field"><span>身高(cm)</span><input v-model.number="localForm.height" type="number" step="0.1" class="input" /></label>
      <label class="field"><span>体重(kg)</span><input v-model.number="localForm.weight" type="number" step="0.1" class="input" /></label>
      <label class="field"><span>体测总分</span><input v-model.number="localForm.scoreTotal" type="number" step="0.1" class="input" /></label>
    </div>
    <button class="button button-primary button-block" :disabled="submitting" @click="handleSubmit">{{ submitting ? '保存中' : '保存' }}</button>
  </section>
</template>