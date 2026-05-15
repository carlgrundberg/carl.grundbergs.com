import { defineConfig, type UserConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import netlify from '@netlify/vite-plugin-tanstack-start'

const config = defineConfig({
  resolve: {
    tsconfigPaths: true,
  } as NonNullable<UserConfig['resolve']>,
  plugins: [
    devtools(),
    netlify(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
