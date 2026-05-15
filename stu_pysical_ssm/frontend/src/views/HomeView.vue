<template>
  <div class="page-shell">
    <header class="hero">
      <div class="hero_text">
        <p class="eyebrow">vue 3 + vite + Axios + Spring MVC REST API</p>
        <h1>学生体测信息管理系统</h1>
      </div>
      <div class="hero_stats">
        <article class="stat_card">
          <span>学生总数</span>
          <strong>{{ students.length }}</strong>
        </article>
        <article class="stat_card">
          <span>平均体测成绩</span>
          <strong>{{ averageScore }}</strong>
        </article>
      </div>
      <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
        <button @click="logout" class="button button-danger">退出登录</button>
      </div>
    </header>

    <p v-if="message.text" :class="['message', `message--${message.type}`]">
      {{ message.text }}
    </p>

    <SearchBar :loading="loading" @search="handleSearch" @reset="loadStudents('')" />

    <main class="layout-grid">
      <StudentForm
          v-model="form"
          :mode="mode"
          :submitting="submitting"
          @submit="submitForm"
          @cancel="resetForm"
      />
      <StudentTable
          :students="students"
          :loading="loading"
          @edit="handleEdit"
          @delete="handleDelete"
      />
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import SearchBar from '../components/SearchBar.vue'
import StudentForm from '../components/StudentForm.vue'
import StudentTable from '../components/StudentTable.vue'
import {
  createStudent,
  deleteStudent,
  fetchStudent,
  fetchStudents,
  updateStudent
} from '../api/student'
import http from '../api/http'

const router = useRouter()
const students = ref([])
const loading = ref(false)
const submitting = ref(false)
const keyword = ref('')
const mode = ref('create')
const message = reactive({ type: 'success', text: '' })
const form = ref(createDefaultForm())

const averageScore = computed(() => {
  if (!students.value.length) return '0.0'
  const total = students.value.reduce((sum, item) => sum + Number(item.score || 0), 0)
  return (total / students.value.length).toFixed(1)
})

onMounted(() => {
  loadStudents()
  localStorage.setItem('loggedIn', 'true')
})

async function loadStudents(search = keyword.value) {
  loading.value = true
  keyword.value = search
  try {
    const result = await fetchStudents(search)
    students.value = result.data || []
  } catch (error) {
    showMessage('error', error.message)
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
  } catch (error) {
    showMessage('error', error.message)
  } finally {
    submitting.value = false
  }
}

async function handleEdit(stuNo) {
  try {
    const result = await fetchStudent(stuNo)
    form.value = {
      ...createDefaultForm(),
      ...result.data
    }
    mode.value = 'edit'
    showMessage('success', `已载入学号 ${stuNo} 的信息，可以开始编辑`)
  } catch (error) {
    showMessage('error', error.message)
  }
}

async function handleDelete(stuNo) {
  const confirmed = window.confirm(`确定删除学号 ${stuNo} 的学生信息吗？`)
  if (!confirmed) return
  try {
    await deleteStudent(stuNo)
    showMessage('success', `学号 ${stuNo} 已删除`)
    if (mode.value === 'edit' && form.value.stuNo === stuNo) {
      resetForm()
    }
    await loadStudents(keyword.value)
  } catch (error) {
    showMessage('error', error.message)
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
  message.type = type
  message.text = text
  setTimeout(() => {
    message.text = ''
  }, 3000)
}

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

async function logout() {
  try {
    await http.post('/auth/logout')
  } catch (e) {
    console.error(e)
  } finally {
    localStorage.removeItem('loggedIn')
    router.push('/login')
  }
}
</script>

<style scoped>
/* 原 style.css 中的全局样式已移至全局，此处仅保留组件特有样式（如果需要） */
.button-danger {
  background: #dc2626;
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
}
.button-danger:hover {
  background: #b91c1c;
}
</style>