<script setup>
import { reactive, ref } from 'vue'
import { message } from 'antdv-next'
import { login, register } from '../../api/auth'

const emit = defineEmits(['authenticated'])

const mode = ref('login')
const submitting = ref(false)
const form = reactive({
  username: 'admin',
  password: 'admin123',
  displayName: ''
})

async function submitAuth() {
  submitting.value = true
  try {
    const action = mode.value === 'login' ? login : register
    const payload = {
      username: form.username,
      password: form.password,
      displayName: form.displayName
    }
    const result = await action(payload)
    message.success(mode.value === 'login' ? '登录成功' : '注册成功')
    emit('authenticated', result.data.user)
  } catch (error) {
    message.error(error.message || (mode.value === 'login' ? '登录失败' : '注册失败'))
  } finally {
    submitting.value = false
  }
}

function switchMode(nextMode) {
  mode.value = nextMode
  if (nextMode === 'register') {
    form.password = ''
  }
}
</script>

<template>
  <a-layout :style="{ minHeight: '100vh' }">
    <a-layout-content>
      <a-row justify="center" align="middle" :style="{ minHeight: '100vh', padding: '32px' }">
        <a-col :xs="24" :sm="18" :md="12" :lg="8" :xl="6">
          <a-card :title="mode === 'login' ? '账号登录' : '注册账号'" variant="borderless">
            <a-form layout="vertical" :model="form" @finish="submitAuth">
              <a-form-item label="用户名" name="username" :rules="[{ required: true, message: '请输入用户名' }]">
                <a-input v-model:value="form.username" autocomplete="username" />
              </a-form-item>
              <a-form-item
                v-if="mode === 'register'"
                label="显示名称"
                name="displayName"
              >
                <a-input v-model:value="form.displayName" placeholder="默认使用用户名" />
              </a-form-item>
              <a-form-item label="密码" name="password" :rules="[{ required: true, message: '请输入密码' }]">
                <a-input-password v-model:value="form.password" autocomplete="current-password" />
              </a-form-item>
              <a-space direction="vertical" :size="16" :style="{ width: '100%' }">
                <a-button type="primary" html-type="submit" block :loading="submitting">
                  {{ mode === 'login' ? '登录' : '注册并登录' }}
                </a-button>
                <a-button
                  type="link"
                  block
                  @click="switchMode(mode === 'login' ? 'register' : 'login')"
                >
                  {{ mode === 'login' ? '没有账号？去注册' : '已有账号？去登录' }}
                </a-button>
              </a-space>
            </a-form>
          </a-card>
        </a-col>
      </a-row>
    </a-layout-content>
  </a-layout>
</template>
