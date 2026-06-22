<script setup lang="ts">
import AppIcon from '@/components/AppIcon/index.vue'
import { Button, Input, Tag } from 'antdv-next'

interface PublishChannel {
  action: 'configure' | 'visit'
  description: string
  icon: string
  key: string
  link?: string
  status: 'configured' | 'unconfigured'
  title: string
  tone: string
}

const publishChannels: PublishChannel[] = [
  {
    key: 'web',
    title: '网页版',
    description: '可通过访问PC网页立即开始对话。',
    icon: 'lucide:panel-top',
    tone: '#e0f2fe',
    status: 'configured',
    action: 'visit',
    link: 'https://www.llmops-imooc.com/web-app/WNFEKnzu',
  },
  {
    key: 'wechat',
    title: '微信公众号（订阅号、服务号）',
    description: '接入微信公众号，自动回复用户消息，助力高效私域运营',
    icon: 'lucide:messages-square',
    tone: '#dcfce7',
    status: 'unconfigured',
    action: 'configure',
  },
  {
    key: 'feishu',
    title: '飞书（Bot群聊机器人）',
    description: '在飞书中直接 @Bot 对话，提高工作生产力',
    icon: 'lucide:send',
    tone: '#e0f2fe',
    status: 'unconfigured',
    action: 'configure',
  },
]
</script>

<template>
  <section class="publish-config">
    <div class="publish-config__notice">
      如应用访问链接或二维码意外泄露，请及时重新生成或进行停止分发，避免资源出现异常消耗
    </div>

    <div class="publish-config__table" role="table" aria-label="发布配置">
      <div class="publish-config__head" role="row">
        <span role="columnheader">发布渠道</span>
        <span role="columnheader">状态</span>
        <span role="columnheader">操作</span>
      </div>

      <article
        v-for="channel in publishChannels"
        :key="channel.key"
        class="publish-config__row"
        role="row"
      >
        <div class="publish-config__channel" role="cell">
          <div class="publish-config__icon" :style="{ background: channel.tone }">
            <AppIcon :icon="channel.icon" size="18" />
          </div>
          <div>
            <strong>{{ channel.title }}</strong>
            <span>{{ channel.description }}</span>
          </div>
        </div>

        <div class="publish-config__status" role="cell">
          <Tag v-if="channel.status === 'configured'" color="processing">
            <template #icon>
              <AppIcon icon="lucide:circle-check" size="13" />
            </template>
            已发布
          </Tag>
          <Tag v-else>
            <template #icon>
              <AppIcon icon="lucide:circle-x" size="13" />
            </template>
            未配置
          </Tag>
        </div>

        <div class="publish-config__operation" role="cell">
          <template v-if="channel.action === 'visit'">
            <Input class="publish-config__link" :value="channel.link" readonly />
            <Button type="primary">重新生成</Button>
            <Button>立即访问</Button>
          </template>
          <Button v-else type="primary">
            <template #icon>
              <AppIcon icon="lucide:circle-dot" size="15" />
            </template>
            立即配置
          </Button>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped lang="scss">
.publish-config {
  flex: 1;
  min-height: 0;
  padding: 1.5rem;
  overflow-y: auto;
}

.publish-config__notice {
  min-height: 2.25rem;
  padding: 0.5625rem var(--space-4);
  color: #334155;
  font-size: 0.875rem;
  line-height: 1.125rem;
  background: #bfdbfe;
  border-radius: var(--radius-md);
}

.publish-config__table {
  display: grid;
  margin-top: 1.25rem;
}

.publish-config__head,
.publish-config__row {
  display: grid;
  grid-template-columns: minmax(24rem, 46%) minmax(8rem, 12%) minmax(24rem, 1fr);
  align-items: center;
}

.publish-config__head {
  min-height: 2.875rem;
  color: var(--color-text);
  font-size: 0.875rem;
  line-height: 1.25rem;
  background: var(--color-bg-soft);
}

.publish-config__head span {
  padding: 0 var(--space-4);
}

.publish-config__row {
  min-height: 4rem;
  border-bottom: 1px solid var(--color-border-light);
}

.publish-config__channel,
.publish-config__operation {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: var(--space-3);
  padding: 0 var(--space-4);
}

.publish-config__icon {
  display: grid;
  width: 2.25rem;
  height: 2.25rem;
  flex: 0 0 auto;
  place-items: center;
  color: var(--color-primary);
  border-radius: var(--radius-md);
}

.publish-config__channel strong {
  display: block;
  color: var(--color-text-strong);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25rem;
}

.publish-config__channel span {
  display: block;
  overflow: hidden;
  color: var(--color-text-muted);
  font-size: 0.8125rem;
  line-height: 1.125rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.publish-config__status {
  padding: 0 var(--space-4);
}

.publish-config__operation {
  justify-content: flex-start;
}

.publish-config__link {
  min-width: 16rem;
}
</style>
