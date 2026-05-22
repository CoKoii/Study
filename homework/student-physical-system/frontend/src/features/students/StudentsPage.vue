<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { message, Modal } from 'antdv-next'
import {
  createStudent,
  deleteStudent,
  fetchFailingWarning,
  fetchStudent,
  fetchStudents,
  updateStudent
} from '../../api/student'
import { exportStudentsCsv } from '../../utils/exportCsv'
import AiAssistant from '../ai/AiAssistant.vue'
import StudentEditModal from './StudentEditModal.vue'
import StudentFormDrawer from './StudentFormDrawer.vue'
import StudentStats from './StudentStats.vue'
import StudentTablePanel from './StudentTablePanel.vue'
import { createDefaultStudent, resetStudentForm } from './studentFields'

const loading = ref(false)
const createSubmitting = ref(false)
const editSubmitting = ref(false)
const createVisible = ref(false)
const editVisible = ref(false)
const students = ref([])
const warningLoading = ref(false)
const failingWarning = ref({
  totalCount: 0,
  failingCount: 0,
  passingCount: 0,
  passRate: 0
})

const filters = reactive({
  keyword: '',
  gender: '',
  className: '',
  minScore: null,
  maxScore: null,
  pageSize: 10,
  sortField: '',
  sortOrder: ''
})
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
})
const createForm = reactive(createDefaultStudent())
const editForm = reactive(createDefaultStudent())

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

onMounted(() => {
  loadStudents()
  loadFailingWarning()
})

async function loadStudents(pageNum = pagination.pageNum, pageSize = pagination.pageSize) {
  loading.value = true
  pagination.pageNum = pageNum
  pagination.pageSize = pageSize
  filters.pageSize = pageSize
  try {
    const result = await fetchStudents(buildStudentQuery())
    students.value = result.data.records || []
    pagination.total = result.data.total || 0
  } catch (error) {
    message.error(error.message || '学生数据加载失败')
  } finally {
    loading.value = false
  }
}

async function loadFailingWarning() {
  warningLoading.value = true
  try {
    const result = await fetchFailingWarning()
    failingWarning.value = result.data || failingWarning.value
  } catch (error) {
    message.error(error.message || '不及格预警加载失败')
  } finally {
    warningLoading.value = false
  }
}

function buildStudentQuery() {
  return {
    keyword: filters.keyword || undefined,
    gender: filters.gender || undefined,
    className: filters.className || undefined,
    minScore: filters.minScore ?? undefined,
    maxScore: filters.maxScore ?? undefined,
    sortField: filters.sortField || undefined,
    sortOrder: filters.sortOrder || undefined,
    pageNum: pagination.pageNum,
    pageSize: pagination.pageSize
  }
}

async function submitCreateForm() {
  createSubmitting.value = true
  try {
    const payload = { ...createForm }
    await createStudent(payload)
    resetStudentForm(createForm)
    createVisible.value = false
    message.success(`学号 ${payload.stuNo} 已成功新增`)
    await loadStudents(1)
    await loadFailingWarning()
  } catch (error) {
    message.error(error.message || '新增学生失败')
  } finally {
    createSubmitting.value = false
  }
}

async function openEditDialog(stuNo) {
  try {
    const result = await fetchStudent(stuNo)
    Object.assign(editForm, createDefaultStudent(), result.data)
    editVisible.value = true
  } catch (error) {
    message.error(error.message || '读取学生详情失败')
  }
}

async function submitEditForm() {
  editSubmitting.value = true
  try {
    const payload = { ...editForm }
    await updateStudent(payload.stuNo, payload)
    editVisible.value = false
    resetStudentForm(editForm)
    message.success(`学号 ${payload.stuNo} 的信息已更新`)
    await loadStudents(pagination.pageNum, pagination.pageSize)
    await loadFailingWarning()
  } catch (error) {
    message.error(error.message || '修改学生信息失败')
  } finally {
    editSubmitting.value = false
  }
}

function confirmDelete(stuNo) {
  Modal.confirm({
    title: '确认删除',
    content: `确定删除学号 ${stuNo} 的学生信息吗？`,
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    async onOk() {
      try {
        await deleteStudent(stuNo)
        if (editVisible.value && editForm.stuNo === stuNo) {
          editVisible.value = false
        }
        message.success(`学号 ${stuNo} 已删除`)
        await loadStudents(1, pagination.pageSize)
        await loadFailingWarning()
      } catch (error) {
        message.error(error.message || '删除学生失败')
      }
    }
  })
}

function resetSearch() {
  Object.assign(filters, {
    keyword: '',
    gender: '',
    className: '',
    minScore: null,
    maxScore: null,
    pageSize: pagination.pageSize,
    sortField: '',
    sortOrder: ''
  })
  loadStudents(1, pagination.pageSize)
}

function handleTableChange(nextPagination, sorter) {
  filters.sortField = sorter.order && sorter.field === 'score' ? 'score' : ''
  filters.sortOrder = sorter.order || ''
  loadStudents(nextPagination.current, nextPagination.pageSize)
}

function exportCurrentPage() {
  exportStudentsCsv(students.value, 'students-current-page.csv')
  message.success('已导出当前页数据')
}

async function showFailingStudents() {
  await loadFailingWarning()
  filters.minScore = 0
  filters.maxScore = 60
  filters.sortField = 'score'
  filters.sortOrder = 'ascend'
  message.warning(`当前不及格人数：${failingWarning.value.failingCount} 人`)
  loadStudents(1, pagination.pageSize)
}

function handleAiChanged() {
  loadStudents(pagination.pageNum, pagination.pageSize)
  loadFailingWarning()
}
</script>

<template>
  <a-flex vertical :gap="24">
    <StudentStats
      :count="students.length"
      :average-score="averageScore"
      :total-score="totalScore"
      :pass-rate="failingWarning.passRate"
      :failing-count="failingWarning.failingCount"
      :warning-loading="warningLoading"
      @show-failing="showFailingStudents"
    />

    <StudentTablePanel
      :students="students"
      :filters="filters"
      :loading="loading"
      :pagination="pagination"
      @search="loadStudents(1, pagination.pageSize)"
      @reset="resetSearch"
      @create="createVisible = true"
      @edit="openEditDialog"
      @delete="confirmDelete"
      @table-change="handleTableChange"
      @export="exportCurrentPage"
    />

    <StudentFormDrawer
      v-model:open="createVisible"
      :form="createForm"
      :submitting="createSubmitting"
      @submit="submitCreateForm"
      @reset="resetStudentForm(createForm)"
    />

    <StudentEditModal
      v-model:open="editVisible"
      :form="editForm"
      :submitting="editSubmitting"
      @submit="submitEditForm"
    />

    <AiAssistant @changed="handleAiChanged" />
  </a-flex>
</template>
