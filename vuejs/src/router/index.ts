import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home/:id',
      component: () => import('@/views/Home/Home.vue'),
    },
    {
      path: '/about',
      component: () => import('@/views/About/About.vue'),
    },
  ],
})

export default router
