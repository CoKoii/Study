import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

import { appResource } from '@/views/personal-space/share/resources'

const AppLayout = () => import('@/components/AppLayout/index.vue')
const Home = () => import('@/views/home/index.vue')
const PersonalSpace = () => import('@/views/personal-space/index.vue')
const AppOrchestration = () => import('@/views/app-orchestration/index.vue')

declare module 'vue-router' {
  interface RouteMeta {
    workspaceKey?: string
    sidebar?: {
      activeIcon?: string
      group: 'main' | 'explore'
      icon: string
      label: string
    }
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: Home,
        meta: {
          sidebar: {
            activeIcon: 'material-symbols:home-rounded',
            group: 'main',
            icon: 'lucide:house',
            label: '主页',
          },
        },
      },
      {
        path: 'personal-space',
        name: 'personal-space',
        redirect: { name: appResource.routeName },
        meta: {
          sidebar: {
            activeIcon: 'material-symbols:person-rounded',
            group: 'main',
            icon: 'lucide:user-round',
            label: '个人空间',
          },
        },
      },
      {
        path: 'personal-space/apps',
        name: 'personal-space-apps',
        component: PersonalSpace,
        meta: {
          workspaceKey: 'personal-space',
        },
      },
      {
        path: 'personal-space/plugins',
        name: 'personal-space-plugins',
        component: PersonalSpace,
        meta: {
          workspaceKey: 'personal-space',
        },
      },
      {
        path: 'personal-space/workflows',
        name: 'personal-space-workflows',
        component: PersonalSpace,
        meta: {
          workspaceKey: 'personal-space',
        },
      },
      {
        path: 'personal-space/knowledge',
        name: 'personal-space-knowledge',
        component: PersonalSpace,
        meta: {
          workspaceKey: 'personal-space',
        },
      },
      {
        path: 'app-market',
        name: 'app-market',
        redirect: '/',
        meta: {
          sidebar: {
            activeIcon: 'material-symbols:smart-toy-rounded',
            group: 'explore',
            icon: 'lucide:bot',
            label: '应用广场',
          },
        },
      },
      {
        path: 'plugin-market',
        name: 'plugin-market',
        redirect: '/',
        meta: {
          sidebar: {
            activeIcon: 'material-symbols:inventory-2-rounded',
            group: 'explore',
            icon: 'lucide:box',
            label: '插件广场',
          },
        },
      },
      {
        path: 'open-api',
        name: 'open-api',
        redirect: '/',
        meta: {
          sidebar: {
            activeIcon: 'material-symbols:add-link-rounded',
            group: 'explore',
            icon: 'lucide:link',
            label: '开放 API',
          },
        },
      },
    ],
  },
  {
    path: '/apps/:appId/orchestration',
    name: 'app-orchestration',
    component: AppOrchestration,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
