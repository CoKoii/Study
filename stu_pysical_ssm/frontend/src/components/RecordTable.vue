<script setup>
const props = defineProps({
  records: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})
const emit = defineEmits(['edit', 'delete'])
</script>

<template>
  <section class="panel">
    <div class="panel__header">
      <h2>体测记录列表</h2>
      <span class="badge">共 {{ props.records.length }} 条</span>
    </div>
    <div v-if="loading" class="empty-state">加载中...</div>
    <div v-else-if="!records.length" class="empty-state">暂无体测记录</div>
    <div v-else class="table-wrap">
      <table class="table">
        <thead><tr><th>学号</th><th>学期</th><th>身高</th><th>体重</th><th>BMI</th><th>总分</th><th>预警</th><th>操作</th></tr></thead>
        <tbody>
        <tr v-for="r in records" :key="`${r.stuNo}_${r.term}`">
          <td>{{ r.stuNo }}</td><td>{{ r.term }}</td><td>{{ r.height }}</td><td>{{ r.weight }}</td>
          <td>{{ r.bmi }}</td><td>{{ r.scoreTotal }}</td><td>{{ r.warningTag }}</td>
          <td class="actions">
            <button class="button button-small button-ghost" @click="emit('edit', r)">编辑</button>
            <button class="button button-small button-danger" @click="emit('delete', r.stuNo, r.term)">删除</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>