import { defineConfig } from 'astro/config';
import { site } from './src/config.ts';
export default defineConfig({
  site: site.url,
  base: site.base,
  output: 'static',
  trailingSlash: 'always',
});
