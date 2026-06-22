<script setup lang="ts">
import AppIcon from '@/components/AppIcon/index.vue'
import { publishChannels } from '../../share/constants'
import { Button, Input, Tag } from 'antdv-next'
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
@use './index.scss';
</style>
