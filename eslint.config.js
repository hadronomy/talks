import hadronomy from '@hadronomy/eslint-config';

export default hadronomy({
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
  ignores: [
    '**/demo/eslint/**',
    '*.md',
  ],
});
