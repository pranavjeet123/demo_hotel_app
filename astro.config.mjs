import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  output: 'static',
  site: 'https://pranavjeet123.github.io',
  base: '/hotel_demo_app',
});
