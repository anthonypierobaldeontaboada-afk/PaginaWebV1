import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: './',
  plugins: [
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        index: 'index.html',
        presentacion: 'presentacion.html',
        vision: 'vision.html',
        organizacion: 'organizacion.html',
        planaJerarquica: 'plana-jerarquica.html',
      },
    },
  },
})