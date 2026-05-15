<script setup>
import { ref, onMounted, computed } from 'vue'
import SearchBar from './SearchBar.vue'
import StudentForm from './StudentForm.vue'
import StudentTable from './StudentTable.vue'
import { fetchStudents, fetchStudent, createStudent, updateStudent, deleteStudent } from '../api/student'

const students = ref([])
const loading = ref(false)
const submitting = ref(false)
const keyword = ref('')
const mode = ref('create')
const form = ref(createDefaultForm())
const message = ref({ type: '', text: '' })

const averageScore = computed(() => {
  if (!students.value.length) return '0.0'
  const total = students.value.reduce((sum, item) => sum + Number(item.score || 0), 0)
  return (total / students.value.length).toFixed(1)
})

onMounted(() => loadStudents())

async function loadStudents(search = keyword.value) {
  loading.value = true
  keyword.value = search
  try {
    const result = await fetchStudents(search)
    students.value = result.data || []
  } catch (err) {
    showMessage('error', err.message)
  } finally {
    loading.value = false
  }
}

async function submitForm() {
  submitting.value = true
  try {
    const payload = { ...form.value }
    if (mode.value === 'edit') {
      await updateStudent(payload.stuNo, payload)
      showMessage('success', `学号 ${payload.stuNo} 的信息已更新`)
    } else {
      await createStudent(payload)
      showMessage('success', `学号 ${payload.stuNo} 已成功新增`)
    }
    resetForm()
    await loadStudents()
  } catch (err) {
    showMessage('error', err.message)
  } finally {
    submitting.value = false
  }
}

async function handleEdit(stuNo) {
  try {
    const result = await fetchStudent(stuNo)
    form.value = { ...createDefaultForm(), ...result.data }
    mode.value = 'edit'
    showMessage('success', `已载入学号 ${stuNo} 的信息`)
  } catch (err) {
    showMessage('error', err.message)
  }
}

async function handleDelete(stuNo) {
  if (!confirm(`确定删除学号 ${stuNo} 的学生信息吗？`)) return
  try {
    await deleteStudent(stuNo)
    showMessage('success', `学号 ${stuNo} 已删除`)
    if (mode.value === 'edit' && form.value.stuNo === stuNo) resetForm()
    await loadStudents(keyword.value)
  } catch (err) {
    showMessage('error', err.message)
  }
}

function handleSearch(value) {
  loadStudents(value)
}

function resetForm() {
  form.value = createDefaultForm()
  mode.value = 'create'
}

function showMessage(type, text) {
  message.value = { type, text }
  setTimeout(() => { message.value.text = '' }, 3000)
}

function createDefaultForm() {
  return {
    stuNo: '', stuName: '', gender: '男', age: 18,
    className: '', height: 170, weight: 60, score: 80
  }
}
</script>

<template>
  <div>
    <div v-if="message.text" :class="['message', `message-${message.type}`]">{{ message.text }}</div>
    <SearchBar :loading="loading" @search="handleSearch" @reset="loadStudents('')" />
    <div class="layout-grid">
      <StudentForm v-model="form" :mode="mode" :submitting="submitting" @submit="submitForm" @cancel="resetForm" />
      <StudentTable :students="students" :loading="loading" @edit="handleEdit" @delete="handleDelete" />
    </div>
  </div>
</template>