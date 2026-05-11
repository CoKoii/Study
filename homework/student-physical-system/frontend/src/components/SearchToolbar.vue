<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'search', 'reset'])

const formState = reactive({
  keyword: '',
  pageSize: 10
})

watch(
  () => props.modelValue,
  (value) => {
    Object.assign(formState, { keyword: '', pageSize: 10 }, value || {})
  },
  { immediate: true, deep: true }
)

watch(
  formState,
  () => {
    emit('update:modelValue', { ...formState })
  },
  { deep: true }
)

function onSearch() {
  emit('search')
}

function onReset() {
  formState.keyword = ''
  formState.pageSize = 10
  emit('reset')
}
</script>

<template>
  <section class="panel">
    <div class="toolbar">
      <div>
        <p class="section-label">检索条件</p>
        <h2 class="section-title">按学号或姓名查询</h2>
      </div>
      <div class="toolbar-actions">
        <input
          v-model.trim="formState.keyword"
          class="form-control"
          type="text"
          placeholder="请输入学号或姓名"
          @keyup.enter="onSearch"
        />
        <select v-model.number="formState.pageSize" class="form-control">
          <option :value="10">10 条/页</option>
          <option :value="20">20 条/页</option>
          <option :value="50">50 条/页</option>
        </select>
        <button class="btn btn-primary" :disabled="props.loading" @click="onSearch">
          {{ props.loading ? '查询中' : '查询' }}
        </button>
        <button class="btn" :disabled="props.loading" @click="onReset">重置</button>
      </div>
    </div>
  </section>
</template>
