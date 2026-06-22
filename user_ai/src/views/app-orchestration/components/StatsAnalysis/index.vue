<script setup lang="ts">
import AppIcon from '@/components/AppIcon/index.vue'

interface OverviewMetric {
  change: string
  icon: string
  key: string
  label: string
  unit: string
  value: string
}

interface DetailMetric {
  key: string
  title: string
}

const chartRange = '过去7天'
const chartDescription = '展示最近7天的会话数'

const overviewMetrics: OverviewMetric[] = [
  {
    key: 'sessions',
    label: '全部会话数',
    value: '1,354',
    unit: '次',
    change: '0%',
    icon: 'lucide:bot-message-square',
  },
  {
    key: 'active-users',
    label: '活跃用户数',
    value: '1,012',
    unit: '人',
    change: '17.5%',
    icon: 'lucide:users-round',
  },
  {
    key: 'interactions',
    label: '平均会话互动数',
    value: '12',
    unit: '次',
    change: '34.1%',
    icon: 'lucide:hourglass',
  },
  {
    key: 'token-speed',
    label: 'Token输出速度',
    value: '14.7',
    unit: '次',
    change: '34.1%',
    icon: 'lucide:calculator',
  },
  {
    key: 'cost',
    label: '费用消耗',
    value: '14.78',
    unit: '元',
    change: '34.1%',
    icon: 'lucide:badge-dollar-sign',
  },
]

const detailMetrics: DetailMetric[] = [
  {
    key: 'sessions',
    title: '全部会话数',
  },
  {
    key: 'active-users',
    title: '活跃用户数',
  },
  {
    key: 'interactions',
    title: '平均会话互动数',
  },
  {
    key: 'cost',
    title: '费用消耗',
  },
]
</script>

<template>
  <section class="stats-analysis">
    <section class="stats-analysis__section">
      <h2>概览指标 <span>(过去7天)</span></h2>

      <div class="stats-overview">
        <article v-for="metric in overviewMetrics" :key="metric.key" class="stats-card">
          <div class="stats-card__title">
            <span class="stats-card__icon">
              <AppIcon :icon="metric.icon" size="16" />
            </span>
            <span>{{ metric.label }}</span>
            <AppIcon icon="lucide:circle-help" size="14" />
          </div>

          <div class="stats-card__value">
            <strong>{{ metric.value }}</strong>
            <span>{{ metric.unit }}</span>
            <em>环比</em>
            <span class="stats-card__change">
              <AppIcon icon="lucide:circle-equal" size="13" />
              {{ metric.change }}
            </span>
          </div>
        </article>
      </div>
    </section>

    <section class="stats-analysis__section">
      <h2>详细指标</h2>

      <div class="stats-detail">
        <article v-for="metric in detailMetrics" :key="metric.key" class="stats-chart">
          <header>
            <h3>
              {{ metric.title }}
              <AppIcon icon="lucide:circle-help" size="14" />
            </h3>
            <span>{{ chartRange }}</span>
          </header>

          <div class="stats-chart__placeholder">
            <span>折线图图表</span>
            <span>{{ chartDescription }}</span>
          </div>
        </article>
      </div>
    </section>
  </section>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
