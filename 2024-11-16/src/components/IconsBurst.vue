<script setup lang="ts">
import { useSlideContext } from '@slidev/client'
import seedrandom from 'seedrandom'

const rng = seedrandom('11213343')
const { $clicks } = useSlideContext()

const icons = [...new Set([
  'i-devicon-html5',
  'i-devicon-css3',
  'i-devicon-javascript',
  'i-devicon-typescript',
  'i-devicon-vuejs',
  'i-devicon-react',
  'i-devicon-angularjs',
  'i-devicon-nodejs',
  'i-devicon-express',
  'i-devicon-webpack',
  'i-devicon-babel',
  'i-devicon-sass',
  'i-devicon-less-wordmark',
  'i-devicon-bootstrap',
  'i-devicon-tailwindcss',
  'i-devicon-git',
  'i-devicon-github',
  'i-devicon-gitlab',
  'i-devicon-bitbucket',
  'i-devicon-docker',
  'i-devicon-kubernetes',
  'i-devicon-aws',
  'i-devicon-azure',
  'i-devicon-googlecloud',
  'i-devicon-heroku',
  'i-devicon-mongodb',
  'i-devicon-mysql',
  'i-devicon-postgresql',
  'i-devicon-redis',
  'i-devicon-sqlite',
  'i-devicon-graphql',
  'i-devicon-apollo-graphql',
  'i-devicon-jest',
  'i-devicon-mocha',
  'i-devicon-cypress',
  'i-devicon-storybook',
  'i-devicon-rollupjs',
  'i-devicon-vitejs',
  'i-devicon-eslint',
  'i-devicon-prettier',
  'i-devicon-npm-wordmark',
  'i-devicon-yarn',
  'i-logos-html-5',
  'i-logos-css-3',
  'i-logos-javascript',
  'i-logos-typescript-icon',
  'i-logos-vue',
  'i-logos-react',
  'i-logos-angular-icon',
  'i-logos-nodejs-icon',
  'i-logos-express',
  'i-logos-webpack',
  'i-logos-babel',
  'i-logos-sass',
  'i-logos-less',
  'i-logos-bootstrap',
  'i-logos-tailwindcss-icon',
  'i-logos-git-icon',
  'i-logos-github-icon',
  'i-logos-gitlab-icon',
  'i-logos-bitbucket-icon',
  'i-logos-docker-icon',
  'i-logos-kubernetes',
  'i-logos-aws',
  'i-logos-azure-icon',
  'i-logos-google-cloud',
  'i-logos-heroku-icon',
  'i-logos-mongodb',
  'i-logos-mysql',
  'i-logos-postgresql',
  'i-logos-redis',
  'i-logos-sqlite',
  'i-logos-graphql',
  'i-logos-apollo-graphql',
  'i-logos-jest',
  'i-logos-mocha',
  'i-logos-cypress',
  'i-logos-storybook',
  'i-logos-rollupjs',
  'i-logos-vitejs',
  'i-logos-eslint',
  'i-logos-prettier',
  'i-logos-npm',
  'i-logos-yarn',
  'i-logos-html5',
  'i-logos-chrome',
  'i-logos-firefox',
  'i-logos-safari',
])]

function getPos() {
  const length = rng() * 70
  const angle = rng() * Math.PI * 2
  return {
    x: Math.cos(angle) * length,
    y: Math.sin(angle) * length,
    rotate: (rng() - 0.5) * 30,
    size: rng() + 1,
    opacity: Math.min(1, rng() * 0.3 + ((length - 10) / 60)),
    delay: rng() * 1000,
  }
}

function distance(a: { x: number, y: number }, b: { x: number, y: number }) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

const target: { x: number, y: number, rotate: number, size: number, opacity: number, delay: number }[] = []

function hasCollision(pos: { x: number, y: number }) {
  // Title area
  if (Math.abs(pos.x) < 30 && pos.y > -25 && pos.y < 15)
    return true
  // Subtitle area
  if (Math.abs(pos.x) < 32 && pos.y > 10 && pos.y < 21)
    return true
  // Outbound
  if (Math.abs(pos.x) > 55 || Math.abs(pos.y) > 50)
    return true
  const d = distance(pos, { x: 0, y: 0 })
  if (d > 62 || d < 10)
    return true
  return target.some(t => Math.abs(distance(t, pos)) < 6.5)
}

const MAX_ITER = 500
for (let i = 0; i < icons.length; i++) {
  const pos = getPos()
  let iter = 0
  while (hasCollision(pos) && iter++ < MAX_ITER) {
    Object.assign(pos, getPos())
  }
  if (iter >= MAX_ITER) {
    console.error('Failed to find a position for icon', i)
    continue
  }
  target.push(pos)
}
</script>

<template>
  <div absolute inset-0 z--1>
    <div
      v-for="(t, i) in target"
      :key="icons[i]"
      transition-all duration-600
      :style="
        [
          $clicks < 1 ? {
            left: `${t.x * 0.2 + 50}%`,
            top: `${t.y * 0.2 + 50}%`,
            opacity: 0,
          } : {
            left: `${t.x + 50}%`,
            top: `${t.y + 50}%`,
            transform: `rotate(${t.rotate}deg) scale(${t.size})`,
            opacity: t.opacity,
          },
          {
            transitionDelay: `${t.delay}ms`,
          },
        ]"
      class="absolute origin-center"
    >
      <div :class="icons[i]" />
    </div>
  </div>
</template>
