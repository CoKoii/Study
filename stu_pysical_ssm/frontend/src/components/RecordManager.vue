<script setup>
import { ref, onMounted } from 'vue'
import RecordForm from './RecordForm.vue'
import RecordTable from './RecordTable.vue'
import { fetchTestRecords, createTestRecord, updateTestRecord, deleteTestRecord } from '../api/testRecord'

const records = ref([])
const loading = ref(false)
const submitting = ref(false)
const form = ref({ stuNo: '', term: '', height: null, weight: null, scoreTotal: null })
const editKey = ref('')
const message = ref({ type: '', text: '' })

onMounted(() => loadRecords())

async function loadRecords(params = {}) {
  loading.value = true
  try {
    const res = await fetchTestRecords(params)
    records.value = res.data || []
  } catch (err) {
    showMessage('error', err.message)
  } finally {
    loading.value = false
  }
}

async function submitForm() {
  if (!form.value.stuNo || !form.value.term) {
    showMessage('error', '学号和学期不能为空')
    return
  }
  submitting.value = true
  try {
    if (editKey.value) {
      await updateTestRecord(form.value)
      showMessage('success', '更新成功')
    } else {
      await createTestRecord(form.value)
      showMessage('success', '新增成功')
    }
    resetForm()
    await loadRecords()
  } catch (err) {
    showMessage('error', err.message)
  } finally {
    submitting.value = false
  }
}

function handleEdit(record) {
  form.value = { ...record }
  editKey.value = `${record.stuNo}_${record.term}`
}

async function handleDelete(stuNo, term) {
  if (!confirm(`确定删除学号 ${stuNo} 学期 ${term} 的记录吗？`)) return
  try {
    await deleteTestRecord(stuNo, term)
    showMessage('success', '删除成功')
    if (editKey.value === `${stuNo}_${term}`) resetForm()
    await loadRecords()
  } catch (err) {
    showMessage('error', err.message)
  }
}

function resetForm() {
  form.value = { stuNo: '', term: '', height: null, weight: null, scoreTotal: null }
  editKey.value = ''
}

function showMessage(type, text) {
  message.value = { type, text }
  setTimeout(() => { message.value.text = '' }, 3000)
}
</script>

<template>
  <div>
    <div v-if="message.text" :class="['message', `message-${message.type}`]">{{ message.text }}</div>
    <div class="layout-grid">
      <RecordForm v-model="form" :submitting="submitting" @submit="submitForm" @cancel="resetForm" />
      <RecordTable :records="records" :loading="loading" @edit="handleEdit" @delete="handleDelete" />
    </div>
  </div>
</template>