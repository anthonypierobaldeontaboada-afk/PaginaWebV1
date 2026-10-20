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
        admision: 'admision.html',
        matricula: 'matricula.html',
        transparencia: 'transparencia.html',
        tramites: 'tramites.html',
        presentacion: 'presentacion.html',
        vision: 'vision.html',
        organizacion: 'organizacion.html',
        planaJerarquica: 'plana-jerarquica.html',
      },
    },
  },
})