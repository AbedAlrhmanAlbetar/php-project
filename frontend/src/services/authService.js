import api from './api'

export const authService = {
  async register(data) {
    const res = await api.post('/register', data)
    return res.data
  },

  async login(data) {
    const res = await api.post('/login', data)
    return res.data
  },

  async logout() {
    const res = await api.post('/logout')
    return res.data
  },

  async me() {
    const res = await api.get('/me')
    return res.data
  },
}
