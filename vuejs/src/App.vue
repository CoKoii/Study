<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
console.log(router, route)
</script>

<template>
  <p>{{ $router }}</p>
  <hr />
  <p>{{ $route }}</p>
  <router-view></router-view>
</template>

<style scoped></style>
