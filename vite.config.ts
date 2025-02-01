import MarkdownItMagicLink from 'markdown-it-magic-link';
import { defineConfig } from 'vite';
import '@slidev/cli';

export default defineConfig({
  optimizeDeps: {
    include: [
      'chroma-js',
      'vis-network',
      'vis-data',
    ],
  },
  slidev: {
    markdown: {
      markdownItSetup(md) {
        md.use(MarkdownItMagicLink, {
          linksMap: {
            'NuxtLabs': { link: 'https://nuxtlabs.com', imageUrl: 'https://nuxtlabs.com/icon.png' },
            'Vitest': 'https://github.com/vitest-dev/vitest',
            'Slidev': 'https://github.com/slidevjs/slidev',
            'VueUse': 'https://github.com/vueuse/vueuse',
            'UnoCSS': 'https://github.com/unocss/unocss',
            'Elk': 'https://github.com/elk-zone/elk',
            'Type Challenges': 'https://github.com/type-challenges/type-challenges',
            'Vue': 'https://github.com/vuejs/core',
            'Nuxt': 'https://github.com/nuxt/nuxt',
            'Vite': 'https://github.com/vitejs/vite',
            'Shiki': 'https://github.com/shikijs/shiki',
            'Twoslash': 'https://github.com/twoslashes/twoslash',
            'ESLint Stylistic': 'https://github.com/eslint-stylistic/eslint-stylistic',
            'Unplugin': 'https://github.com/unplugin',
            'Nuxt DevTools': 'https://github.com/nuxt/devtools',
            'Vite PWA': 'https://github.com/vite-pwa',
            'i18n Ally': 'https://github.com/lokalise/i18n-ally',
            'ESLint': 'https://github.com/eslint/eslint',
            'Astro': 'https://github.com/withastro/astro',
            'TwoSlash': 'https://github.com/twoslashes/twoslash',
            'Anthony Fu Collective': { link: 'https://opencollective.com/antfu', imageUrl: 'https://github.com/antfu-collective.png' },
            'Netlify': { link: 'https://netlify.com', imageUrl: 'https://github.com/netlify.png' },
            'Stackblitz': { link: 'https://stackblitz.com', imageUrl: 'https://github.com/stackblitz.png' },
            'Vercel': { link: 'https://vercel.com', imageUrl: 'https://github.com/vercel.png' },
            'React': { link: 'https://reactjs.org', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
            'TypeScript': { link: 'https://typescriptlang.org', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
            'JavaScript': { link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
            'Rust': { link: 'https://rust-lang.org', imageUrl: 'https://skillicons.dev/icons?i=rust' },
            'C++': { link: 'https://isocpp.org', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
            'Python': { link: 'https://python.org', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
            'HTML': { link: 'https://developer.mozilla.org/en-US/docs/Web/HTML', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
            'CSS': { link: 'https://developer.mozilla.org/en-US/docs/Web/CSS', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
            'C#': { link: 'https://docs.microsoft.com/en-us/dotnet/csharp/', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg' },
            'Go': { link: 'https://golang.org', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original-wordmark.svg' },
            'ULL': { link: 'https://ull.es', imageUrl: 'https://www3.gobiernodecanarias.org/medusa/edublog/ceadsantacruzdetenerifemercedespinto/wp-content/uploads/sites/341/2018/10/logo-ull.jpg' },
          },
        });
      },
    },
  },
  server: {
    fs: {
      allow: ['.'],
    },
  },
});
