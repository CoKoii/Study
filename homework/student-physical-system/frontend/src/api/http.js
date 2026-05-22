import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

const tokenKeys = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  user: 'currentUser'
}

let refreshPromise = null

export function setAuthTokens(authData) {
  localStorage.setItem(tokenKeys.accessToken, authData.accessToken)
  localStorage.setItem(tokenKeys.refreshToken, authData.refreshToken)
  localStorage.setItem(tokenKeys.user, JSON.stringify(authData.user || {}))
}

export function clearAuthTokens() {
  localStorage.removeItem(tokenKeys.accessToken)
  localStorage.removeItem(tokenKeys.refreshToken)
  localStorage.removeItem(tokenKeys.user)
}

export function getRefreshToken() {
  return localStorage.getItem(tokenKeys.refreshToken)
}

export function getAccessToken() {
  return localStorage.getItem(tokenKeys.accessToken)
}

export function getCurrentUser() {
  const rawUser = localStorage.getItem(tokenKeys.user)
  if (!rawUser) {
    return null
  }
  try {
    return JSON.parse(rawUser)
  } catch (error) {
    return null
  }
}

http.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(tokenKeys.accessToken)
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

http.interceptors.response.use(
  (response) => {
    const result = response.data
    if (result.code !== 200) {
      return Promise.reject(new Error(result.message || '请求失败'))
    }
    return result
  },
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const authData = await refreshAccessToken()
        originalRequest.headers.Authorization = `Bearer ${authData.accessToken}`
        return http(originalRequest)
      } catch (refreshError) {
        clearAuthTokens()
        window.dispatchEvent(new CustomEvent('auth-expired'))
        return Promise.reject(refreshError)
      }
    }
    const message =
      error.response?.data?.message ||
      error.message ||
      '网络异常，请检查后端服务是否启动'
    return Promise.reject(new Error(message))
  }
)

async function refreshAccessToken() {
  if (!refreshPromise) {
    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      return Promise.reject(new Error('登录状态已失效，请重新登录'))
    }
    refreshPromise = axios
      .post(`${http.defaults.baseURL}/auth/refresh`, { refreshToken }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        const result = response.data
        if (result.code !== 200) {
          throw new Error(result.message || 'Token 刷新失败')
        }
        setAuthTokens(result.data)
        return result.data
      })
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

export default http
