<template>
  <div class="login-container">
    <div class="login-card">
      <h2>学生体质信息管理系统</h2>
      <form @submit.prevent="handleLogin">
        <label>用户名</label>
        <input type="text" v-model="form.username" required />

        <label>密码</label>
        <input type="password" v-model="form.password" required />

        <button type="submit" :disabled="loading">登录</button>
        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
        <p class="register-link">
          没有账号？<router-link to="/register">立即注册</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import http from '../api/http'

const router = useRouter()
const form = ref({ username: '', password: '' })
const loading = ref(false)
const errorMsg = ref('')

const handleLogin = async () => {
  loading.value = true
  errorMsg.value = ''
  try {
    const res = await http.post('/auth/login', form.value)
    if (res.code === 200) {
      localStorage.setItem('loggedIn', 'true')
      router.push('/')
    } else {
      errorMsg.value = res.message
    }
  } catch (err) {
    errorMsg.value = err.message || '登录失败'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at top left, rgba(251,191,36,0.28), transparent);
}
.login-card {
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(8px);
  padding: 2rem;
  border-radius: 32px;
  width: 320px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}
input, button {
  width: 100%;
  margin-top: 8px;
  margin-bottom: 16px;
  padding: 10px;
  border-radius: 16px;
  border: 1px solid #ccc;
}
button {
  background: #16324f;
  color: white;
  font-weight: bold;
  cursor: pointer;
}
.error {
  color: #b91c1c;
  font-size: 0.85rem;
  margin: 8px 0;
}
.register-link {
  text-align: center;
  font-size: 0.9rem;
}
.register-link a {
  color: #b45309;
  text-decoration: none;
}
</style>