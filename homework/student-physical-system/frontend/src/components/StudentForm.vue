<script setup>
import { computed, reactive, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  mode: {
    type: String,
    default: 'create'
  },
  submitting: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'submit', 'cancel'])

const localForm = reactive(createDefaultForm())

watch(
  () => props.modelValue,
  (value) => {
    Object.assign(localForm, createDefaultForm(), value || {})
  },
  { immediate: true, deep: true }
)

watch(
  localForm,
  () => {
    emit('update:modelValue', { ...localForm })
  },
  { deep: true }
)

const title = computed(() => (props.mode === 'edit' ? '编辑学生信息' : '新增学生信息'))
const submitText = computed(() => {
  if (props.submitting) {
    return props.mode === 'edit' ? '保存中' : '提交中'
  }
  return props.mode === 'edit' ? '保存修改' : '新增学生'
})

function createDefaultForm() {
  return {
    stuNo: '',
    stuName: '',
    gender: '男',
    age: 18,
    className: '',
    height: 170,
    weight: 60,
    score: 80
  }
}
</script>

<template>
  <section class="panel">
    <div class="panel-header">
      <div>
        <p class="section-label">{{ props.mode === 'edit' ? '编辑模式' : '录入模式' }}</p>
        <h2 class="section-title">{{ title }}</h2>
      </div>
      <button v-if="props.mode === 'edit'" class="btn" :disabled="props.submitting" @click="emit('cancel')">
        取消编辑
      </button>
    </div>

    <div class="form-grid">
      <label class="field">
        <span>学号</span>
        <input v-model.trim="localForm.stuNo" class="form-control" type="text" :disabled="props.mode === 'edit'" />
      </label>
      <label class="field">
        <span>姓名</span>
        <input v-model.trim="localForm.stuName" class="form-control" type="text" />
      </label>
      <label class="field">
        <span>性别</span>
        <select v-model="localForm.gender" class="form-control">
          <option value="男">男</option>
          <option value="女">女</option>
        </select>
      </label>
      <label class="field">
        <span>年龄</span>
        <input v-model.number="localForm.age" class="form-control" type="number" min="1" />
      </label>
      <label class="field">
        <span>班级</span>
        <input v-model.trim="localForm.className" class="form-control" type="text" />
      </label>
      <label class="field">
        <span>身高(cm)</span>
        <input v-model.number="localForm.height" class="form-control" type="number" min="1" step="0.1" />
      </label>
      <label class="field">
        <span>体重(kg)</span>
        <input v-model.number="localForm.weight" class="form-control" type="number" min="1" step="0.1" />
      </label>
      <label class="field">
        <span>体测成绩</span>
        <input v-model.number="localForm.score" class="form-control" type="number" min="0" step="0.1" />
      </label>
    </div>

    <button class="btn btn-primary btn-block" :disabled="props.submitting" @click="emit('submit')">
      {{ submitText }}
    </button>
  </section>
</template>
