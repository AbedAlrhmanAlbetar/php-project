import api from './api'

/* ─── Providers ──────────────────────────────────────────── */
export const providerService = {
  list: (params) => api.get('/providers', { params }).then(r => r.data),
  get:  (id)     => api.get(`/providers/${id}`).then(r => r.data),
  myProfile:  () => api.get('/my-profile').then(r => r.data),
  update: (data) => api.post('/my-profile', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data),
}

/* ─── Categories ─────────────────────────────────────────── */
export const categoryService = {
  list:    ()         => api.get('/categories').then(r => r.data),
  get:     (id)       => api.get(`/categories/${id}`).then(r => r.data),
  create:  (data)     => api.post('/categories', data).then(r => r.data),
  update:  (id, data) => api.put(`/categories/${id}`, data).then(r => r.data),
  destroy: (id)       => api.delete(`/categories/${id}`).then(r => r.data),
}

/* ─── Reviews ────────────────────────────────────────────── */
export const reviewService = {
  list:    (providerId, params) => api.get(`/providers/${providerId}/reviews`, { params }).then(r => r.data),
  create:  (providerId, data)   => api.post(`/providers/${providerId}/reviews`, data).then(r => r.data),
  destroy: (id)                 => api.delete(`/reviews/${id}`).then(r => r.data),
}

/* ─── Works ──────────────────────────────────────────────── */
export const workService = {
  list:    ()         => api.get('/works').then(r => r.data),
  get:     (id)       => api.get(`/works/${id}`).then(r => r.data),
  create:  (data)     => api.post('/works', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data),
  update:  (id, data) => api.post(`/works/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data),
  destroy: (id)       => api.delete(`/works/${id}`).then(r => r.data),
}

/* ─── Media ──────────────────────────────────────────────── */
export const mediaService = {
  upload:  (data) => api.post('/media/upload', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data),
  destroy: (id)   => api.delete(`/media/${id}`).then(r => r.data),
}

/* ─── Admin ──────────────────────────────────────────────── */
/* ─── Admin ──────────────────────────────────────────────── */
export const adminService = {
  stats:         ()         => api.get('/admin/stats').then(r => r.data),
  users:         (params)   => api.get('/admin/users', { params }).then(r => r.data),
  verifyUser:    (id)       => api.patch(`/admin/users/${id}/verify`).then(r => r.data), 
  deleteUser:    (id)       => api.delete(`/admin/users/${id}`).then(r => r.data),
  providers:     (params)   => api.get('/admin/providers', { params }).then(r => r.data),
  reviews:       ()         => api.get('/admin/reviews').then(r => r.data),
  
  // تعديل هنا: حذف كلمة admin لأن المسار في Laravel هو /api/reviews/{id}
  deleteReview:  (id)       => api.delete(`/reviews/${id}`).then(r => r.data),
}
