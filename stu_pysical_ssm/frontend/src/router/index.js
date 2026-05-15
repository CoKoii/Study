import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'

const routes = [
    { path: '/login', component: LoginView, meta: { requiresAuth: false } },
    { path: '/register', component: RegisterView, meta: { requiresAuth: false } },
    { path: '/', component: HomeView, meta: { requiresAuth: true } }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const loggedIn = localStorage.getItem('loggedIn') === 'true'
    if (to.meta.requiresAuth && !loggedIn) {
        next('/login')
    } else if ((to.path === '/login' || to.path === '/register') && loggedIn) {
        next('/')
    } else {
        next()
    }
})

export default router