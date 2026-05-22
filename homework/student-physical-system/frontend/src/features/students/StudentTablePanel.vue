<script setup>
import { computed } from 'vue'
import { genderOptions } from './studentFields'

const props = defineProps({
  students: {
    type: Array,
    default: () => []
  },
  filters: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  pagination: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['search', 'reset', 'create', 'edit', 'delete', 'tableChange', 'export'])

const tableColumns = computed(() => [
  { title: '学号', dataIndex: 'stuNo', width: 130 },
  { title: '姓名', dataIndex: 'stuName', width: 110 },
  { title: '性别', dataIndex: 'gender', width: 80 },
  { title: '年龄', dataIndex: 'age', width: 80 },
  { title: '班级', dataIndex: 'className', width: 140 },
  { title: '身高(cm)', dataIndex: 'height', width: 120 },
  { title: '体重(kg)', dataIndex: 'weight', width: 120 },
  { title: 'BMI', dataIndex: 'bmi', width: 100 },
  {
    title: '体测成绩',
    dataIndex: 'score',
    width: 120,
    sorter: true,
    sortOrder: props.filters.sortField === 'score' ? props.filters.sortOrder : null
  },
  { title: '操作', dataIndex: 'actions', width: 150, fixed: 'right' }
])

const tablePagination = computed(() => ({
  current: props.pagination.pageNum,
  pageSize: props.pagination.pageSize,
  total: props.pagination.total,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50'],
  showTotal: (total) => `共 ${total} 条`,
  size: 'small'
}))

function handleTableChange(nextPagination, tableFilters, sorter) {
  emit('tableChange', nextPagination, {
    field: sorter?.field || sorter?.columnKey,
    order: sorter?.order || ''
  })
}
</script>

<template>
  <a-card variant="borderless" :styles="{ body: { padding: '24px 32px 32px' } }">
    <template #title>学生体质信息</template>

    <a-flex vertical :gap="24">
      <a-form layout="inline" :model="filters" @finish="emit('search')">
        <a-form-item label="关键词">
          <a-input
            v-model:value="filters.keyword"
            allow-clear
            placeholder="请输入学号或姓名"
            :style="{ width: '320px' }"
          />
        </a-form-item>
        <a-form-item label="性别">
          <a-select
            v-model:value="filters.gender"
            allow-clear
            :options="genderOptions"
            placeholder="全部"
            :style="{ width: '120px' }"
          />
        </a-form-item>
        <a-form-item label="班级">
          <a-input
            v-model:value="filters.className"
            allow-clear
            placeholder="请输入班级"
            :style="{ width: '160px' }"
          />
        </a-form-item>
        <a-form-item label="成绩">
          <a-space compact>
            <a-input-number v-model:value="filters.minScore" :min="0" placeholder="最低" :style="{ width: '96px' }" />
            <a-input-number v-model:value="filters.maxScore" :min="0" placeholder="最高" :style="{ width: '96px' }" />
          </a-space>
        </a-form-item>
        <a-form-item>
          <a-space size="middle">
            <a-button type="primary" html-type="submit" :loading="loading">查询</a-button>
            <a-button @click="emit('reset')">重置</a-button>
            <a-button type="primary" ghost @click="emit('create')">新增学生</a-button>
            <a-button @click="emit('export')">导出当前页</a-button>
          </a-space>
        </a-form-item>
      </a-form>

      <a-table
        row-key="stuNo"
        :columns="tableColumns"
        :data-source="students"
        :loading="loading"
        :pagination="tablePagination"
        :scroll="{ x: 1080 }"
        size="large"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'bmi'">
            {{ Number(record.bmi || 0).toFixed(1) }}
          </template>
          <template v-if="column.dataIndex === 'score'">
            <a-tag :color="Number(record.score || 0) <= 60 ? 'red' : 'green'">
              {{ Number(record.score || 0).toFixed(1) }}
            </a-tag>
          </template>
          <template v-if="column.dataIndex === 'actions'">
            <a-space>
              <a-button @click="emit('edit', record.stuNo)">编辑</a-button>
              <a-button danger @click="emit('delete', record.stuNo)">删除</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-flex>
  </a-card>
</template>
