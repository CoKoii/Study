<script setup>
defineProps({
  count: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: String,
    default: '0.0'
  },
  totalScore: {
    type: String,
    default: '0.0'
  },
  passRate: {
    type: Number,
    default: 0
  },
  failingCount: {
    type: Number,
    default: 0
  },
  warningLoading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['showFailing'])
</script>

<template>
  <a-row :gutter="[24, 24]" align="stretch">
    <a-col :xs="24" :md="12" :xl="6">
      <a-card class="stats-card" variant="borderless">
        <a-statistic title="当前页学生数" :value="count" />
      </a-card>
    </a-col>
    <a-col :xs="24" :md="12" :xl="6">
      <a-card class="stats-card" variant="borderless">
        <a-statistic title="当前平均成绩" :value="averageScore" />
      </a-card>
    </a-col>
    <a-col :xs="24" :md="12" :xl="6">
      <a-card class="stats-card" variant="borderless">
        <a-statistic title="当前总成绩" :value="totalScore" />
      </a-card>
    </a-col>
    <a-col :xs="24" :md="12" :xl="6">
      <a-card class="stats-card" variant="borderless">
        <a-flex align="center" justify="space-between" gap="middle">
          <a-statistic title="合格率" :value="passRate" suffix="%" />
          <a-button type="primary" danger :loading="warningLoading" @click="$emit('showFailing')">
            查看不及格人数
          </a-button>
        </a-flex>
        <div class="warning-count">不及格 {{ failingCount }} 人</div>
      </a-card>
    </a-col>
  </a-row>
</template>

<style scoped>
.stats-card {
  height: 100%;
}

.stats-card :deep(.ant-card-body) {
  min-height: 140px;
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.warning-count {
  margin-top: 8px;
  color: #8c8c8c;
  font-size: 13px;
}
</style>
