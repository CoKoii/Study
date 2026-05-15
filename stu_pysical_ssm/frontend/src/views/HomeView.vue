<template>
  <div class="page-shell">
    <header class="hero">
      <div class="hero__text">
        <div class="hero__headline">
          <p class="eyebrow">Vue 3 + Vite + Axios + Spring MVC REST API</p>
          <button @click="logout" class="button button-danger hero__logout">退出登录</button>
        </div>
        <div class="hero__content">
          <div class="hero__intro">
            <h1>学生体测信息管理系统</h1>
            <p class="hero__desc">
              管理学生基础信息、体测成绩和 BMI 指标，支持快速检索、录入和编辑。
            </p>
          </div>
          <div class="hero__highlights">
            <div class="hero-highlight">
              <span>当前筛选</span>
              <strong>{{ students.length }} 人</strong>
            </div>
            <div class="hero-highlight">
              <span>整体均分</span>
              <strong>{{ overallAverageScore }}</strong>
            </div>
            <div class="hero-highlight">
              <span>男生均分</span>
              <strong>{{ genderStats.male.averageScore }}</strong>
            </div>
            <div class="hero-highlight">
              <span>女生均分</span>
              <strong>{{ genderStats.female.averageScore }}</strong>
            </div>
          </div>
        </div>
      </div>
      <div class="hero__stats">
        <article class="stat-card">
          <span>学生总数</span>
          <strong>{{ students.length }}</strong>
        </article>
        <article class="stat-card">
          <span>男女平均成绩</span>
          <div class="stat-card__split">
            <span>男 {{ genderStats.male.averageScore }}</span>
            <span>女 {{ genderStats.female.averageScore }}</span>
          </div>
        </article>
        <article class="stat-card">
          <span>男女平均 BMI</span>
          <div class="stat-card__split">
            <span>男 {{ genderStats.male.averageBmi }}</span>
            <span>女 {{ genderStats.female.averageBmi }}</span>
          </div>
        </article>
        <article class="stat-card stat-card--alert">
          <span>不合格人数</span>
          <div class="stat-card__split">
            <span>男 {{ genderStats.male.failedCount }}</span>
            <span>女 {{ genderStats.female.failedCount }}</span>
          </div>
        </article>
      </div>
    </header>

    <p v-if="message.text" :class="['message', `message-${message.type}`]">
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

const genderStats = computed(() => {
  const createBucket = () => ({
    scoreTotal: 0,
    scoreCount: 0,
    bmiTotal: 0,
    bmiCount: 0,
    failedCount: 0
  })

  const buckets = {
    male: createBucket(),
    female: createBucket()
  }

  students.value.forEach((student) => {
    const bucket = getGenderBucket(student.gender, buckets)
    if (!bucket) return

    const score = Number(student.score)
    if (Number.isFinite(score)) {
      bucket.scoreTotal += score
      bucket.scoreCount += 1
      if (score < 60) {
        bucket.failedCount += 1
      }
    }

    const bmi = calculateBmi(student.height, student.weight)
    if (bmi !== null) {
      bucket.bmiTotal += bmi
      bucket.bmiCount += 1
    }
  })

  return {
    male: formatBucket(buckets.male),
    female: formatBucket(buckets.female)
  }
})

const overallAverageScore = computed(() => {
  if (!students.value.length) return '0.0'
  const total = students.value.reduce((sum, student) => sum + Number(student.score || 0), 0)
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

function getGenderBucket(gender, buckets) {
  if (gender === '男') return buckets.male
  if (gender === '女') return buckets.female
  return null
}

function calculateBmi(height, weight) {
  const heightNumber = Number(height)
  const weightNumber = Number(weight)
  if (!Number.isFinite(heightNumber) || !Number.isFinite(weightNumber) || heightNumber <= 0 || weightNumber <= 0) {
    return null
  }

  const heightMeter = heightNumber / 100
  return weightNumber / (heightMeter * heightMeter)
}

function formatBucket(bucket) {
  return {
    averageScore: bucket.scoreCount ? (bucket.scoreTotal / bucket.scoreCount).toFixed(1) : '0.0',
    averageBmi: bucket.bmiCount ? (bucket.bmiTotal / bucket.bmiCount).toFixed(1) : '0.0',
    failedCount: bucket.failedCount
  }
}
</script>

<style scoped>
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

.stat-card__split {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  font-size: 0.95rem;
}

.stat-card--alert {
  background: linear-gradient(135deg, #9f1239, #e11d48);
}
</style>
