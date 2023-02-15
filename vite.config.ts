import { defineConfig} from 'vite'
import { resolve } from 'path'

export default defineConfig({
    base: '/calendario/',
    build: {
        rollupOptions: {
          input: {
            main: resolve(__dirname, 'index.html'),
            nested: resolve(__dirname, 'easter.html'),
          },
        },
      },
})