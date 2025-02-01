import antfu from '@antfu/eslint-config';

export default antfu({
  vue: true,
  react: true,
  formatters: {
    css: true,
    // markdown: true,
    // slidev: {
    //   files: [
    //     '*/src/slides.md',
    //   ],
    // },
  },
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: true,
  },
  ignores: [
    '**/demo/eslint/**',
  ],
});
