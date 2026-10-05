import { defineConfig } from 'astro/config';

// GitHub Pages project site: https://<user>.github.io/aum-aurum/
// When a custom domain is connected, switch to SITE = 'https://<domain>' and BASE = '/'.
const SITE = 'https://dbondarenko007.github.io';
const BASE = '/aum-aurum';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});
