import axios from 'axios'
import toast from 'react-hot-toast'


const api = axios.create({
  baseURL:  'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
})
/**
 * Request interceptor
 * - يضيف التوكن إذا موجود (Bearer Token)
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Response interceptor
 * - معالجة الأخطاء بشكل عام
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const message = error.response?.data?.message

    // Unauthorized
    if (status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')

      window.dispatchEvent(new Event('auth:logout'))
      toast.error('Session expired. Please login again.')
    }

    // Forbidden
    else if (status === 403) {
      toast.error(message || 'You do not have permission.')
    }

    // Validation errors
    else if (status === 422) {
      // لا نظهر toast عام هنا لأن الفورم يتعامل معها
    }

    // Not found
    else if (status === 404) {
      // اختياري
    }

    // Server error
    else if (status >= 500) {
      toast.error('Server error. Please try again later.')
    }

    return Promise.reject(error)
  }
)

export default api