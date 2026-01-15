<script setup>
const props = defineProps({
  href: {
    type: String,
    required: true,
  },
  src: {
    type: String,
    required: false,
  },
  iconClass: {
    type: String,
    required: false,
  },
});

const baseUrl = import.meta.env.BASE_URL;
</script>

<template>
  <a
    :href="props.href"
    class="markdown-magic-link markdown-magic-link-link"
    target="_blank"
    mx-1
  >
    <img
      v-if="props.src"
      :src="`${baseUrl}${props.src}`"
      alt=""
      class="markdown-magic-link-image"
    >
    <i
      v-else-if="props.iconClass"
      :class="props.iconClass"
    />
    <slot />
  </a>
</template>

<style scoped>
.markdown-magic-link-image {
  display: inline-block;
  width: 24px;
  height: 24px;
  background-size: contain;
  background-repeat: no-repeat;
}

i {
  font-size: 30px;
}

/* Apply margin only when image/icon is followed by slot content */
.markdown-magic-link-image:not(:last-child),
i:not(:last-child) {
  margin-right: 8px;
}
</style>
