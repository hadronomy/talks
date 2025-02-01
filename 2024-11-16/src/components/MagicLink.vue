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
  margin-right: 8px;
}

i {
  font-size: 24px;
  margin-right: 8px;
}
</style>
