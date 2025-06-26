<script setup lang="ts">
import { ref } from 'vue'
defineExpose({
  name: 'Count',
})
const sum = ref(1)
const num = ref<number>(1)
const setNum = (type: string) => {
  if (type === '+') {
    sum.value += num.value
  } else {
    sum.value -= num.value
  }
}
</script>

<template>
  <div class="count">
    <h2>当前求和为：{{ sum }}</h2>
    <select v-model.number="num">
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
    </select>
    <button @click="setNum('+')">+</button>
    <button @click="setNum('-')">-</button>
  </div>
</template>

<style scoped>
.count {
  background-color: skyblue;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 0 10px;
}
select,
button {
  margin: 0 5px;
  height: 25;
}
</style>
