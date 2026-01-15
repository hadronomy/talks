<script setup lang="ts">
import katex from 'katex';
import { computed } from 'vue';
import 'katex/dist/katex.min.css';

const props = defineProps<{
  formula: string;
  displayMode?: boolean;
}>();

const html = computed(() => {
  try {
    return katex.renderToString(props.formula, {
      displayMode: props.displayMode || false,
      throwOnError: false,
    });
  }
  catch (e) {
    return `<span class="error">${e.message}</span>`;
  }
});
</script>

<template>
  <span v-html="html" />
</template>
