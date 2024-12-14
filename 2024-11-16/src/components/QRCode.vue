<script setup lang="ts">
import { renderSVG } from 'uqr'
import { computed } from 'vue'

const props = defineProps<{
  text: string
  white?: string
  black?: string
}>()

function addGradientToSVG(svg: string) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(svg, 'image/svg+xml')
  const svgElement = doc.documentElement

  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
  const linearGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient')
  linearGradient.setAttribute('id', 'gradient')
  linearGradient.setAttribute('x1', '0%')
  linearGradient.setAttribute('y1', '0%')
  linearGradient.setAttribute('x2', '100%')
  linearGradient.setAttribute('y2', '100%')

  const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
  stop1.setAttribute('offset', '0%')
  stop1.setAttribute('style', 'stop-color:rgb(207,52,255);stop-opacity:1')

  const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
  stop2.setAttribute('offset', '100%')
  stop2.setAttribute('style', 'stop-color:rgb(0,0,0);stop-opacity:1')

  linearGradient.appendChild(stop1)
  linearGradient.appendChild(stop2)
  defs.appendChild(linearGradient)
  svgElement.insertBefore(defs, svgElement.firstChild)

  const paths = svgElement.querySelectorAll('path')
  paths.forEach((path) => {
    path.setAttribute('fill', 'url(#gradient)')
  })

  return new XMLSerializer().serializeToString(svgElement)
}

const html = computed(() => {
  const svg = renderSVG(props.text, {
    whiteColor: props.white,
    blackColor: props.black,
  })
  return addGradientToSVG(svg)
})
</script>

<template>
  <div v-html="html" />
</template>
