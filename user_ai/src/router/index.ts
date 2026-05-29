import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import Home from '@/views/home/index.vue'
import PersonalSpace from '@/views/personal-space/index.vue'

declare module 'vue-router' {
  interface RouteMeta {
    sidebar?: {
      group: 'main' | 'explore'
      icon: string
      label: string
    }
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      sidebar: {
        group: 'main',
        icon: 'lucide:house',
        label: '主页',
      },
    },
  },
  {
    path: '/personal-space',
    name: 'personal-space',
    component: PersonalSpace,
    meta: {
      sidebar: {
        group: 'main',
        icon: 'lucide:user-round',
        label: '个人空间',
      },
    },
  },
  {
    path: '/app-market',
    name: 'app-market',
    redirect: '/',
    meta: {
      sidebar: {
        group: 'explore',
        icon: 'lucide:bot',
        label: '应用广场',
      },
    },
  },
  {
    path: '/plugin-market',
    name: 'plugin-market',
    redirect: '/',
    meta: {
      sidebar: {
        group: 'explore',
        icon: 'lucide:box',
        label: '插件广场',
      },
    },
  },
  {
    path: '/open-api',
    name: 'open-api',
    redirect: '/',
    meta: {
      sidebar: {
        group: 'explore',
        icon: 'lucide:link',
        label: '开放 API',
      },
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
