<script setup>
const props = defineProps({
  students: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})
const emit = defineEmits(['edit', 'delete'])
</script>

<template>
  <section class="panel">
    <div class="panel__header">
      <div>
        <p class="eyebrow">数据视图</p>
        <h2>学生体测数据列表</h2>
      </div>
      <span class="badge">共 {{ props.students.length }} 条</span>
    </div>

    <div v-if="props.loading" class="empty-state">正在加载数据...</div>
    <div v-else-if="!props.students.length" class="empty-state">暂无数据，先新增一条学生记录吧。</div>
    <div v-else class="table-wrap">
      <table class="table">
        <thead>
        <tr><th>学号</th><th>姓名</th><th>性别</th><th>年龄</th><th>班级</th><th>身高</th><th>体重</th><th>成绩</th><th>操作</th></tr>
        </thead>
        <tbody>
        <tr v-for="student in props.students" :key="student.stuNo">
          <td>{{ student.stuNo }}</td>
          <td>{{ student.stuName }}</td>
          <td>{{ student.gender }}</td>
          <td>{{ student.age }}</td>
          <td>{{ student.className }}</td>
          <td>{{ student.height }}</td>
          <td>{{ student.weight }}</td>
          <td>{{ student.score }}</td>
          <td class="actions">
            <button class="button button-small button-ghost" @click="emit('edit', student.stuNo)">编辑</button>
            <button class="button button-small button-danger" @click="emit('delete', student.stuNo)">删除</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>