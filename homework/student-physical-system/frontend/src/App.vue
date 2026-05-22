<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { message } from 'antdv-next'
import { isLoggedIn, logout } from './api/auth'
import { getCurrentUser } from './api/http'
import AuthPage from './components/auth/AuthPage.vue'
import AppShell from './components/layout/AppShell.vue'
import StudentsPage from './features/students/StudentsPage.vue'

const authenticated = ref(isLoggedIn())
const currentUser = ref(getCurrentUser())

onMounted(() => {
  window.addEventListener('auth-expired', handleAuthExpired)
})

onBeforeUnmount(() => {
  window.removeEventListener('auth-expired', handleAuthExpired)
})

function handleAuthenticated(user) {
  authenticated.value = true
  currentUser.value = user
}

async function handleLogout() {
  try {
    await logout()
  } catch (error) {
    // 本地退出优先，服务端撤销失败不影响用户回到登录页。
  }
  authenticated.value = false
  currentUser.value = null
  message.success('已退出登录')
}

function handleAuthExpired() {
  authenticated.value = false
  currentUser.value = null
  message.error('登录状态已失效，请重新登录')
}
</script>

<template>
  <a-config-provider component-size="large">
    <AuthPage v-if="!authenticated" @authenticated="handleAuthenticated" />
    <AppShell v-else :current-user="currentUser" @logout="handleLogout">
      <StudentsPage />
    </AppShell>
  </a-config-provider>
</template>
