<script setup>
const props = defineProps({
  href: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <a
    :href="props.href"
    class="markdown-magic-link markdown-magic-link-link"
    target="_blank"
  >
    <span
      class="markdown-magic-link-image"
      :style="{ backgroundImage: `url(${props.imageUrl})` }"
    />
    <slot />
  </a>
</template>
