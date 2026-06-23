import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

import { appResource } from '@/views/personal-space/share/resources'

declare module 'vue-router' {
  interface RouteMeta {
    appTransition?: 'app-shell' | 'page-forward'
    pageTransition?: 'workspace-fade' | 'workspace-slide' | 'workspace-rise'
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
    component: () => import('@/components/AppLayout/index.vue'),
    meta: {
      appTransition: 'app-shell',
    },
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          pageTransition: 'workspace-rise',
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
          pageTransition: 'workspace-fade',
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
        component: () => import('@/views/personal-space/index.vue'),
        meta: {
          pageTransition: 'workspace-fade',
          workspaceKey: 'personal-space',
        },
      },
      {
        path: 'personal-space/plugins',
        name: 'personal-space-plugins',
        component: () => import('@/views/personal-space/index.vue'),
        meta: {
          pageTransition: 'workspace-fade',
          workspaceKey: 'personal-space',
        },
      },
      {
        path: 'personal-space/workflows',
        name: 'personal-space-workflows',
        component: () => import('@/views/personal-space/index.vue'),
        meta: {
          pageTransition: 'workspace-fade',
          workspaceKey: 'personal-space',
        },
      },
      {
        path: 'personal-space/knowledge',
        name: 'personal-space-knowledge',
        component: () => import('@/views/personal-space/index.vue'),
        meta: {
          pageTransition: 'workspace-fade',
          workspaceKey: 'personal-space',
        },
      },
      {
        path: 'personal-space/knowledge/:knowledgeId',
        name: 'personal-space-knowledge-detail',
        component: () => import('@/views/personal-space/components/KnowledgeDetail/index.vue'),
        meta: {
          pageTransition: 'workspace-slide',
          workspaceKey: 'personal-space-detail',
        },
      },
      {
        path: 'personal-space/knowledge/:knowledgeId/add-file',
        name: 'personal-space-knowledge-add-file',
        component: () => import('@/views/personal-space/components/KnowledgeAddFile/index.vue'),
        meta: {
          pageTransition: 'workspace-slide',
          workspaceKey: 'personal-space-detail',
        },
      },
      {
        path: 'app-market',
        name: 'app-market',
        redirect: '/',
        meta: {
          pageTransition: 'workspace-fade',
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
          pageTransition: 'workspace-fade',
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
          pageTransition: 'workspace-fade',
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
    component: () => import('@/views/app-orchestration/index.vue'),
    meta: {
      appTransition: 'page-forward',
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
