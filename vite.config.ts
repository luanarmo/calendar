import { defineConfig} from 'vite'
import { resolve } from 'path'

export default defineConfig({
    base: '/calendar/',
    build: {
        rollupOptions: {
          input: {
            main: resolve(__dirname, 'index.html'),
            secreto: resolve(__dirname, './secreto/easter.html'),
          },
        },
      },
})