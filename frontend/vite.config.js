import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // تم حذف البروكسي لأنه يسبب تضارب مع إعدادات CORS في لارافيل
  },
})