import { defineConfig } from 'astro/config';

// Domain is a placeholder until it is bought (see BRIEF.md §11.2).
export default defineConfig({
  site: 'https://aumaurum.ge',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});
