import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

export default defineConfig({
  site: 'https://bladimirsalazar.com',
  output: 'static',
  integrations: [
    svelte(),
  ],
  vite: {
    cssCodeSplit: true,
  },
});