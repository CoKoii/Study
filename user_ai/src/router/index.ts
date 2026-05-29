import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/home/index.vue'
import PersonalSpace from '@/views/personal-space/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/personal-space',
      name: 'personal-space',
      component: PersonalSpace,
    },
  ],
})

export default router
