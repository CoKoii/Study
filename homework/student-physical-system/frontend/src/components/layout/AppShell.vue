<script setup>
defineProps({
  currentUser: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['logout'])
</script>

<template>
  <a-layout :style="{ minHeight: '100vh' }">
    <a-layout-sider width="240" theme="dark">
      <a-flex vertical :gap="16" :style="{ height: '100%', padding: '24px 0' }">
        <a-typography-title :level="4" :style="{ color: '#fff', margin: '0 24px 12px' }">
          体测管理
        </a-typography-title>
        <a-menu theme="dark" mode="inline" :selected-keys="['students']">
          <a-menu-item key="students">学生体质信息</a-menu-item>
        </a-menu>
      </a-flex>
    </a-layout-sider>

    <a-layout>
      <a-layout-header :style="{ height: '72px', padding: '0 24px', background: '#fff' }">
        <a-flex justify="space-between" align="center" :style="{ height: '72px' }">
          <a-typography-title :level="4" :style="{ margin: 0 }">
            学生体质信息管理系统
          </a-typography-title>
          <a-space>
            <a-tag color="blue">{{ currentUser?.displayName || currentUser?.username }}</a-tag>
            <a-button @click="emit('logout')">退出登录</a-button>
          </a-space>
        </a-flex>
      </a-layout-header>

      <a-layout-content :style="{ padding: '24px', overflow: 'auto' }">
        <slot />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
