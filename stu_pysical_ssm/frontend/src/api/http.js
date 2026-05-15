import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'

const http = axios.create({
    baseURL,
    timeout: 10000,
    withCredentials: true,   // 允许携带 Cookie（SessionId）
    headers: {
        'Content-Type': 'application/json'
    }
})

// 响应拦截器（处理 401 未登录）
http.interceptors.response.use(
    response => {
        const result = response.data
        if (result.code !== 200) {
            return Promise.reject(new Error(result.message || '请求失败'))
        }
        return result
    },
    error => {
        if (error.response?.status === 401) {
            // 未登录或登录过期，跳转登录页
            localStorage.removeItem('loggedIn')
            window.location.href = '/login'
            return Promise.reject(new Error('请先登录'))
        }
        const message = error.response?.data?.message || error.message || '网络异常'
        return Promise.reject(new Error(message))
    }
)

export default http