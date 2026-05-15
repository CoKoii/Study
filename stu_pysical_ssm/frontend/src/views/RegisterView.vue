<template>
  <div class="register-container">
    <div class="register-card">
      <h2>用户注册</h2>
      <form @submit.prevent="handleRegister">
        <label>用户名</label>
        <input type="text" v-model="form.username" required />

        <label>密码</label>
        <input type="password" v-model="form.password" required />

        <label>确认密码</label>
        <input type="password" v-model="form.confirmPassword" required />

        <button type="submit" :disabled="loading">注册</button>
        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
        <p class="login-link">
          已有账号？<router-link to="/login">立即登录</router-link>
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
const form = ref({ username: '', password: '', confirmPassword: '' })
const loading = ref(false)
const errorMsg = ref('')

const handleRegister = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    errorMsg.value = '两次输入的密码不一致'
    return
  }
  loading.value = true
  errorMsg.value = ''
  try {
    const res = await http.post('/auth/register', {
      username: form.value.username,
      password: form.value.password
    })
    if (res.code === 200) {
      router.push('/login')
    } else {
      errorMsg.value = res.message
    }
  } catch (err) {
    errorMsg.value = err.message || '注册失败'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at top left, rgba(251,191,36,0.28), transparent);
}
.register-card {
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(8px);
  padding: 2rem;
  border-radius: 32px;
  width: 340px;
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
.login-link {
  text-align: center;
  font-size: 0.9rem;
}
.login-link a {
  color: #b45309;
  text-decoration: none;
}
</style>