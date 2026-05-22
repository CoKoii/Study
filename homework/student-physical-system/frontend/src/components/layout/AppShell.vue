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
  <a-layout class="app-shell">
    <a-layout-sider class="app-shell__sider" width="240" theme="dark">
      <a-flex vertical :gap="16" class="app-shell__sider-inner">
        <div class="app-shell__brand">
          学生体质信息管理系统
        </div>
        <a-menu theme="dark" mode="inline" :selected-keys="['students']">
          <a-menu-item key="students">学生体质信息</a-menu-item>
        </a-menu>

        <div class="app-shell__account">
          <a-button block @click="emit('logout')">退出登录</a-button>
        </div>
      </a-flex>
    </a-layout-sider>

    <a-layout class="app-shell__main">
      <a-layout-content class="app-shell__content">
        <slot />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
}

.app-shell__sider {
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 10;
  height: 100vh;
  overflow: auto;
}

.app-shell__sider-inner {
  height: 100%;
  padding: 28px 0 24px;
}

.app-shell__brand {
  margin: 0 24px 28px;
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: 0;
}

.app-shell__account {
  display: flex;
  flex-direction: column;
  margin-top: auto;
  padding: 0 24px;
}

.app-shell__account :deep(.ant-btn) {
  height: 40px;
}

.app-shell__main {
  min-height: 100vh;
  margin-left: 240px;
}

.app-shell__content {
  padding: 24px;
}
</style>
