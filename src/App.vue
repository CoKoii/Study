<script setup>
import Box1 from './views/Box-one.vue'
import Box2 from './views/Box-second.vue'
import { ref } from 'vue'

const current = ref('Box1')
const changeComponent = () => {
  current.value = current.value === 'Box1' ? 'Box2' : 'Box1'
}

const components = { Box1, Box2 }
</script>

<template>
  <component :is="components[current]" :key="current"></component>
  <button @click="changeComponent">change</button>
</template>
