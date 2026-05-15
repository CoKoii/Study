<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  loading: { type: Boolean, default: false }
})
const emit = defineEmits(['search', 'reset'])
const keyword = ref('')

watch(keyword, (value) => {
  if (!value) {
    emit('search', '')
  }
})

function onSearch() {
  emit('search', keyword.value.trim())
}
function onReset() {
  keyword.value = ''
  emit('reset')
}
</script>

<template>
  <section class="panel toolbar">
    <div class="toolbar__content">
      <div>
        <p class="eyebrow">检索操作</p>
        <h2>按学号或姓名查询学生</h2>
      </div>
      <div class="toolbar_form">
        <input v-model="keyword" id="student-keyword" class="input" type="text"
               placeholder="输入学号或姓名关键字" @keyup.enter="onSearch" />
        <button class="button button-primary" :disabled="props.loading" @click="onSearch">
          {{ props.loading ? '查询中...' : '查询' }}
        </button>
        <button class="button button-ghost" :disabled="props.loading" @click="onReset">重置</button>
      </div>
    </div>
  </section>
</template>