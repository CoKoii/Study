<script setup>
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  records: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['edit', 'delete'])
</script>

<template>
  <section class="panel">
    <div class="panel-header">
      <div>
        <p class="section-label">数据列表</p>
        <h2 class="section-title">学生体质信息</h2>
      </div>
      <span class="table-meta">当前 {{ props.records.length }} 条</span>
    </div>

    <div v-if="props.loading" class="empty-state">正在加载数据...</div>
    <div v-else-if="!props.records.length" class="empty-state">暂无数据</div>
    <div v-else class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>学号</th>
            <th>姓名</th>
            <th>性别</th>
            <th>年龄</th>
            <th>班级</th>
            <th>身高</th>
            <th>体重</th>
            <th>成绩</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in props.records" :key="item.stuNo">
            <td>{{ item.stuNo }}</td>
            <td>{{ item.stuName }}</td>
            <td>{{ item.gender }}</td>
            <td>{{ item.age }}</td>
            <td>{{ item.className }}</td>
            <td>{{ item.height }}</td>
            <td>{{ item.weight }}</td>
            <td>{{ item.score }}</td>
            <td class="action-group">
              <button class="btn btn-sm" @click="emit('edit', item.stuNo)">编辑</button>
              <button class="btn btn-sm btn-danger" @click="emit('delete', item.stuNo)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
