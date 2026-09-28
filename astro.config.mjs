// @ts-check
import { defineConfig } from 'astro/config';

// While the site is in review it is served from GitHub Pages at
// https://samuellabenne.github.io/SamuelLabenneOnline/. At domain launch, set
// CUSTOM_DOMAIN to 'samuellabenne.com' and add a matching public/CNAME file.
const CUSTOM_DOMAIN = '';

export default defineConfig({
  site: CUSTOM_DOMAIN ? `https://${CUSTOM_DOMAIN}` : 'https://samuellabenne.github.io',
  base: CUSTOM_DOMAIN ? '/' : '/SamuelLabenneOnline',
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  devToolbar: { enabled: false },
});
