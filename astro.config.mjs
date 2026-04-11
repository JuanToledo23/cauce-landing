import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://cauce.mx',
  output: 'static',
  adapter: vercel({
    webAnalytics: { enabled: false },
    speedInsights: { enabled: false },
  }),
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap()],
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
});