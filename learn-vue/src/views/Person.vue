<script setup lang="ts">
import type { Person } from '@/types/index'
let person: Person = {
  id: 1,
  name: 'zhangsan',
  age: 18,
}
</script>

<template>
  <div>{{ person.name }}</div>
</template>

<style scoped></style>
