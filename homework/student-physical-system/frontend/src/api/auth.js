import http, { clearAuthTokens, getRefreshToken, setAuthTokens } from './http'

export async function register(payload) {
  const result = await http.post('/auth/register', payload)
  setAuthTokens(result.data)
  return result
}

export async function login(payload) {
  const result = await http.post('/auth/login', payload)
  setAuthTokens(result.data)
  return result
}

export async function logout() {
  const refreshToken = getRefreshToken()
  try {
    if (refreshToken) {
      await http.post('/auth/logout', { refreshToken })
    }
  } finally {
    clearAuthTokens()
  }
}

export function isLoggedIn() {
  return Boolean(localStorage.getItem('accessToken') && localStorage.getItem('refreshToken'))
}
