import { defineConfig, type UserConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { cloudflare } from "@cloudflare/vite-plugin";

const config = defineConfig({
  resolve: {
    tsconfigPaths: true,
  } as NonNullable<UserConfig['resolve']>,
  plugins: [devtools(), tailwindcss(), tanstackStart(), viteReact(), cloudflare({
    viteEnvironment: {
      name: "ssr"
    }
  })],
})

export default config