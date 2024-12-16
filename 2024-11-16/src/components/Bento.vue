<script setup lang="ts">
import { computed } from 'vue'

interface BentoLayoutProps {
  icons?: string[]
  heights: number[][]
}

const props = withDefaults(defineProps<BentoLayoutProps>(), {
  icons: () => [],
})

// Cycle through icons if there are fewer icons than grid cells
const cycledIcons = computed(() => {
  if (!props.icons.length)
    return []

  const totalCells = props.heights.flat().length
  const repeatedIcons = Array.from(
    { length: totalCells },
    (_, index) => props.icons[index % props.icons.length],
  )

  return repeatedIcons
})
</script>

<template>
  <div class="grid grid-flow-col gap-4">
    <div
      v-for="(card, cardIndex) in heights"
      :key="cardIndex"
      class="grid gap-4"
    >
      <div
        v-for="(height, heightIndex) in card"
        :key="heightIndex"
        :class="`
          rounded-xl border-2 border-slate-400/10
          bg-neutral-100 p-4
          dark:bg-neutral-900
          flex items-center justify-center
          h-${height}
        `"
      >
        <div
          v-if="cycledIcons[cardIndex * card.length + heightIndex]"
          class="text-white text-2xl flex items-center justify-center"
        >
          <i :class="cycledIcons[cardIndex * card.length + heightIndex]" />
        </div>
      </div>
    </div>
  </div>
</template>
