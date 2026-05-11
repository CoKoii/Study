<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { createStudent, deleteStudent, fetchStudent, fetchStudents, updateStudent } from './api/student'

const loading = ref(false)
const createSubmitting = ref(false)
const editSubmitting = ref(false)
const editVisible = ref(false)
const students = ref([])
const createForm = ref(createDefaultForm())
const editForm = ref(createDefaultForm())
const filters = ref({
  keyword: '',
  pageSize: 10
})
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
})
const feedback = ref({
  visible: false,
  type: 'success',
  text: ''
})
const studentFields = [
  { key: 'stuNo', label: '学号', type: 'text', placeholder: '请输入学号' },
  { key: 'stuName', label: '姓名', type: 'text', placeholder: '请输入姓名' },
  { key: 'gender', label: '性别', type: 'select', options: ['男', '女'] },
  { key: 'age', label: '年龄', type: 'number', min: 1 },
  { key: 'className', label: '班级', type: 'text', placeholder: '请输入班级' },
  { key: 'height', label: '身高(cm)', type: 'number', min: 1, step: 0.1 },
  { key: 'weight', label: '体重(kg)', type: 'number', min: 1, step: 0.1 },
  { key: 'score', label: '体测成绩', type: 'number', min: 0, step: 0.1 }
]

const averageScore = computed(() => {
  if (!students.value.length) {
    return '0.0'
  }
  const total = students.value.reduce((sum, item) => sum + Number(item.score || 0), 0)
  return (total / students.value.length).toFixed(1)
})

const totalScore = computed(() => {
  return students.value.reduce((sum, item) => sum + Number(item.score || 0), 0).toFixed(1)
})

const totalPages = computed(() => {
  if (!pagination.total) {
    return 1
  }
  return Math.ceil(pagination.total / pagination.pageSize)
})

onMounted(() => {
  loadStudents()
})

async function loadStudents(pageNum = pagination.pageNum) {
  loading.value = true
  pagination.pageNum = pageNum
  pagination.pageSize = filters.value.pageSize
  try {
    const result = await fetchStudents({
      keyword: filters.value.keyword,
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize
    })
    students.value = result.data.records || []
    pagination.total = result.data.total || 0
  } catch (error) {
    showFeedback('error', error.message || '学生数据加载失败')
  } finally {
    loading.value = false
  }
}

async function submitForm() {
  createSubmitting.value = true
  try {
    const payload = { ...createForm.value }
    await createStudent(payload)
    resetCreateForm()
    showFeedback('success', `学号 ${payload.stuNo} 已成功新增`)
    await loadStudents(1)
  } catch (error) {
    showFeedback('error', error.message || '新增学生失败')
  } finally {
    createSubmitting.value = false
  }
}

async function handleEdit(stuNo) {
  try {
    const result = await fetchStudent(stuNo)
    editForm.value = {
      ...createDefaultForm(),
      ...result.data
    }
    editVisible.value = true
  } catch (error) {
    showFeedback('error', error.message || '读取学生详情失败')
  }
}

async function submitEditForm() {
  editSubmitting.value = true
  try {
    const payload = { ...editForm.value }
    await updateStudent(payload.stuNo, payload)
    editVisible.value = false
    editForm.value = createDefaultForm()
    showFeedback('success', `学号 ${payload.stuNo} 的信息已更新`)
    await loadStudents(pagination.pageNum)
  } catch (error) {
    showFeedback('error', error.message || '修改学生信息失败')
  } finally {
    editSubmitting.value = false
  }
}

async function handleDelete(stuNo) {
  const confirmed = window.confirm(`确定删除学号 ${stuNo} 的学生信息吗？`)
  if (!confirmed) {
    return
  }

  try {
    await deleteStudent(stuNo)
    if (editVisible.value && editForm.value.stuNo === stuNo) {
      closeEditDialog()
    }
    showFeedback('success', `学号 ${stuNo} 已删除`)
    await loadStudents(1)
  } catch (error) {
    showFeedback('error', error.message || '删除学生失败')
  }
}

function handleSearch() {
  loadStudents(1)
}

function handleReset() {
  filters.value = {
    keyword: '',
    pageSize: 10
  }
  loadStudents(1)
}

function changePage(nextPage) {
  if (nextPage < 1 || nextPage > totalPages.value || nextPage === pagination.pageNum) {
    return
  }
  loadStudents(nextPage)
}

function resetCreateForm() {
  createForm.value = createDefaultForm()
}

function closeEditDialog() {
  editVisible.value = false
  editForm.value = createDefaultForm()
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

function showFeedback(type, text) {
  feedback.value = {
    visible: true,
    type,
    text
  }

  window.clearTimeout(showFeedback.timer)
  showFeedback.timer = window.setTimeout(() => {
    feedback.value.visible = false
  }, 2400)
}

function isFieldDisabled(fieldKey, mode) {
  return mode === 'edit' && fieldKey === 'stuNo'
}
</script>

<template>
  <div class="page-shell">
    <div v-if="feedback.visible" :class="['feedback-banner', `feedback-${feedback.type}`]">
      <span>{{ feedback.text }}</span>
      <button type="button" class="feedback-close" @click="feedback.visible = false">关闭</button>
    </div>

    <section class="hero-panel">
      <div class="hero-copy">
        <p class="page-tag">VUE 3 / SPRING BOOT / MYBATIS / MYSQL</p>
        <h1>学生体质信息管理系统</h1>
        <p class="page-desc">按作业文档完成学生信息的新增、查询、修改、删除，界面简约清晰，便于展示。</p>
      </div>
      <div class="hero-stats">
        <div class="stat-card">
          <span class="stat-label">当前页学生数</span>
          <strong class="stat-value">{{ students.length }}</strong>
        </div>
        <div class="stat-card">
          <span class="stat-label">当前平均成绩</span>
          <strong class="stat-value">{{ averageScore }}</strong>
        </div>
        <div class="stat-card">
          <span class="stat-label">当前总成绩</span>
          <strong class="stat-value">{{ totalScore }}</strong>
        </div>
      </div>
    </section>

    <section class="toolbar-card">
      <div class="toolbar-head">
        <div class="card-title-wrap">
          <div class="card-caption">检索条件</div>
          <div class="card-title">按学号或姓名查询</div>
        </div>
      </div>
      <div class="toolbar-grid">
        <label class="field-block field-keyword">
          <span>关键词</span>
          <input
            v-model="filters.keyword"
            type="text"
            placeholder="请输入学号或姓名"
            @keyup.enter="handleSearch"
          >
        </label>

        <label class="field-block field-page-size">
          <span>每页数量</span>
          <select v-model.number="filters.pageSize">
            <option :value="10">10 条/页</option>
            <option :value="20">20 条/页</option>
            <option :value="50">50 条/页</option>
          </select>
        </label>

        <div class="toolbar-actions">
          <button type="button" class="primary-btn" :disabled="loading" @click="handleSearch">
            {{ loading ? '查询中...' : '查询' }}
          </button>
          <button type="button" class="secondary-btn" @click="handleReset">重置</button>
        </div>
      </div>
    </section>

    <section class="main-grid">
      <article class="content-card form-card">
        <div class="card-title-wrap">
          <div class="card-caption">录入模式</div>
          <div class="card-title">新增学生信息</div>
        </div>

        <div class="form-grid">
          <label v-for="field in studentFields" :key="field.key" class="field-block">
            <span>{{ field.label }}</span>
            <select v-if="field.type === 'select'" v-model="createForm[field.key]">
              <option v-for="option in field.options" :key="option" :value="option">{{ option }}</option>
            </select>
            <input
              v-else
              v-model="createForm[field.key]"
              :type="field.type"
              :min="field.min"
              :step="field.step"
              :placeholder="field.placeholder"
            >
          </label>
        </div>

        <div class="form-actions compact-actions create-actions">
          <button type="button" class="primary-btn" :disabled="createSubmitting" @click="submitForm">
            {{ createSubmitting ? '提交中...' : '新增学生' }}
          </button>
          <button type="button" class="secondary-btn create-reset-btn" @click="resetCreateForm">清空</button>
        </div>
      </article>

      <article class="content-card table-card">
        <div class="table-head">
          <div class="card-title-wrap">
            <div class="card-caption">数据列表</div>
            <div class="card-title">学生体质信息</div>
          </div>
          <div class="table-meta">
            <span>当前 {{ students.length }} 条</span>
            <span>共 {{ pagination.total }} 条</span>
            <span>第 {{ pagination.pageNum }} / {{ totalPages }} 页</span>
          </div>
        </div>

        <div class="table-wrap">
          <table class="student-table">
            <thead>
              <tr>
                <th>学号</th>
                <th>姓名</th>
                <th>性别</th>
                <th>年龄</th>
                <th>班级</th>
                <th>身高(cm)</th>
                <th>体重(kg)</th>
                <th>体测成绩</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="9" class="empty-cell">正在加载数据...</td>
              </tr>
              <tr v-else-if="!students.length">
                <td colspan="9" class="empty-cell">暂无数据</td>
              </tr>
              <tr v-for="student in students" :key="student.stuNo">
                <td>{{ student.stuNo }}</td>
                <td>{{ student.stuName }}</td>
                <td>{{ student.gender }}</td>
                <td>{{ student.age }}</td>
                <td>{{ student.className }}</td>
                <td>{{ student.height }}</td>
                <td>{{ student.weight }}</td>
                <td>
                  <span class="score-pill">{{ Number(student.score || 0).toFixed(1) }}</span>
                </td>
                <td>
                  <div class="row-actions compact-actions">
                    <button type="button" class="tiny-btn" @click="handleEdit(student.stuNo)">编辑</button>
                    <button type="button" class="tiny-btn danger-btn" @click="handleDelete(student.stuNo)">删除</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pagination-bar">
          <span>共 {{ pagination.total }} 条记录</span>
          <div class="pagination-actions compact-actions">
            <button type="button" class="secondary-btn" :disabled="pagination.pageNum <= 1" @click="changePage(pagination.pageNum - 1)">
              上一页
            </button>
            <button type="button" class="secondary-btn" :disabled="pagination.pageNum >= totalPages" @click="changePage(pagination.pageNum + 1)">
              下一页
            </button>
          </div>
        </div>
      </article>
    </section>

    <div v-if="editVisible" class="modal-mask" @click.self="closeEditDialog">
      <div class="modal-panel">
        <div class="modal-head">
          <div class="card-title-wrap">
            <div class="card-caption">编辑窗口</div>
            <div class="card-title">修改学生信息</div>
          </div>
          <button type="button" class="icon-close" @click="closeEditDialog">关闭</button>
        </div>

        <div class="form-grid modal-form-grid">
          <label v-for="field in studentFields" :key="field.key" class="field-block">
            <span>{{ field.label }}</span>
            <select v-if="field.type === 'select'" v-model="editForm[field.key]" :disabled="isFieldDisabled(field.key, 'edit')">
              <option v-for="option in field.options" :key="option" :value="option">{{ option }}</option>
            </select>
            <input
              v-else
              v-model="editForm[field.key]"
              :type="field.type"
              :min="field.min"
              :step="field.step"
              :placeholder="field.placeholder"
              :disabled="isFieldDisabled(field.key, 'edit')"
            >
          </label>
        </div>

        <div class="form-actions compact-actions modal-actions">
          <button type="button" class="primary-btn" :disabled="editSubmitting" @click="submitEditForm">
            {{ editSubmitting ? '保存中...' : '保存修改' }}
          </button>
          <button type="button" class="secondary-btn" @click="closeEditDialog">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>
