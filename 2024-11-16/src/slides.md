---
layout: cover
highlighter: shiki
css: unocss
colorSchema: dark
transition: fade-out
mdc: true
glowSeed: 4
title: Bolt.new
lang: es
remoteAssets: true
addons:
  - slidev-addon-graph
---

<div text-6xl font-600 my-5>
  <svg xmlns="http://www.w3.org/2000/svg" h-10 my-2 viewBox="0 45.65 160 68.7" fill="#ffffff"><path d="M75.61 106.195c-14.747 0-21.962-8.468-21.962-19.136s10.04-24.157 24.782-24.157c14.746 0 21.96 8.47 21.96 19.137 0 10.668-10.038 24.156-24.78 24.156Zm.624-13.488c5.02 0 8.473-4.707 8.473-9.727 0-5.02-2.512-6.273-6.902-6.273-4.395 0-8.473 4.703-8.473 9.723 0 5.02 2.512 6.277 6.902 6.277Zm39.844 12.547h-15.371l12.547-57.098h15.375l-12.55 56.785Zm0 0"/><path fill-rule="evenodd" d="M30.117 106.195c-4.707 0-9.41-1.566-11.922-5.332l-.941 4.39L0 114.353l1.883-9.098L14.43 48.156h15.375L25.41 68.234c3.453-3.765 6.902-5.332 11.297-5.332 9.41 0 15.371 5.961 15.371 17.254 0 11.293-7.215 26.04-21.96 26.04Zm5.961-22.902c0 5.336-3.766 9.414-8.785 9.414-5.02 0-5.332-.941-6.902-2.824l2.511-10.352c1.883-1.883 3.766-2.824 6.274-2.824 3.765 0 6.902 2.824 6.902 6.902Zm0 0"/><path d="M144.629 106.195c-8.785 0-15.375-3.136-15.375-10.351 0-7.215 0-2.196.316-3.137l3.45-15.375h-6.903l3.137-13.176h6.902l2.512-11.293 17.254-7.215-1.883 7.215-2.508 11.293H160l-3.137 13.176h-8.472l-2.196 10.04v1.882c0 1.883 1.254 3.453 3.766 3.453 2.508 0 1.883 0 2.195-.316v12.238c-1.566 1.254-4.39 1.566-7.215 1.566Zm0 0"/></svg>
  <span>Bolt.new</span>
</div>

<div text-2xl mt--1 op50>
  La IA y el desarrollo web se unen
</div>

<div abs-br mx-10 my-12 flex="~ col" text-sm text-right>
  <img src="/logo-ull.svg" h-20 alt="Nuxt Nation" />
  <div px-6 text-sm opacity-50>16.12.2024</div>
</div>

---
layout: intro
class: pl-30
glowSeed: 14
---

# Pablo Hernández

<div class="[&>*]:important-leading-10 opacity-80">

<div>
Programando todo tipo de cosas desde
<div inline-flex="~ gap-1" gap-1 items-center align-middle text-blue bg-blue:15 px1.5 rounded>
  <div i-ph-calendar-dots-duotone />
  <span>2010</span>
</div>
<br>

Mi stack: {TypeScript} {Rust} {CSS}<br>
Actualmente estudiando en {ULL}<br>
</div>

</div>

<div my-10 w-min flex="~ gap-1" items-center justify-center>
  <div i-ri-user-3-line op50 ma text-xl />
  <div>
    <a href="https://hadronomy.com" target="_blank" class="border-none! font-300">
      hadronomy.com
    </a>
  </div>
  <div i-ri-github-line op50 ma text-xl ml4/>
  <div>
    <a href="https://github.com/hadronomy" target="_blank" class="border-none! font-300">
      hadronomy
    </a>
  </div>
  <div i-ri-twitter-x-line op50 ma text-xl ml4/>
  <div>
    <a href="https://twitter.com/hadronomy" target="_blank" class="border-none! font-300">
      hadronomy
    </a>
  </div>
</div>

<img src="https://github.com/hadronomy.png" rounded-full absolute top-38 right-15 w-40 />

---
layout: fact
clicks: 1
glowSeed: 3
---

<div
  v-motion
  :initial="{ y: 50 }"
  :click-1="{ y: 0 }"
>
  <div text-6xl my-6>
    Desarrollo Web
  </div>

  <div relative text-3xl mt--3
    v-click="1"
    v-motion
    :initial="{ y: -50 }"
    :enter="{ y: 0 }"
  >
    <span v-mark.teal.highlight.delay100.op10="1" text-teal>
      No es tan sencillo
    </span>
  </div>
</div>

<div text-2xl mt5 text-shadow-2xl op75
  v-click
  v-motion
  :initial="{ y: -60 }"
  :enter="{ y: 0 }"
>

  Complejidad $n^\infty$
</div>

<IconsBurst v-after />

---
glowSeed: 4
---

# Entra <BoltLogo h-12 inline-block />

<div grid="~ gap-12 gap-y-15 cols-3" py10 w-max>

<div v-click flex="~ col gap-1">
  <div flex="~ gap-1 items-center align-middle" text-3xl ml--1>
    <div text-gray text-4xl i-ph-github-logo-duotone />
    <div text-gray3>Open Source</div>
  </div>
  <div text-base op60 mb1>
    Si tienes algún problema <br/>
    puedes contribuir
    soluciones
  </div>
  <div flex="~ gap-2 items-end">
    <div i-ph-github-logo-duotone text-blue />
    <div i-ph-git-branch-duotone text-green />
    <div i-ph-code-duotone text-yellow />
    <div i-ph-git-pull-request-duotone text-rose />
    <div i-ph-arrows-merge-duotone text-red />
  </div>
</div>

<div v-click flex="~ col gap-1">
  <div flex="~ gap-1 items-center" text-3xl ml--1>
    <div text-green text-4xl i-ph-cheers-duotone />
    <div text-green3>Fácil de usar</div>
  </div>
  <div text-base op60 mb1 mb--1>
    Más sencillo que chatgpt
    <br/>
    todo está automatizado
  </div>
  <div flex="~ gap-2 items-end" mt-1>
    <div i-ph-smiley-duotone />
    <div i-ph-game-controller-duotone />
  </div>
</div>

<div v-click flex="~ col gap-1">
  <div flex="~ gap-1 items-center" text-3xl ml--1>
    <div text-blue text-4xl i-ph-users-four-duotone />
    <div text-blue3>Gratis<super>*</super></div>
  </div>
  <div text-base op60 mb1>
    Lo puedes hospedar en tu
    <br/>
    propio servidor
  </div>
  <div flex="~ gap-2 items-center">
    <div i-simple-icons-heroku />
    <div i-simple-icons-vercel />
    <div i-simple-icons-netlify />
    <div i-simple-icons-digitalocean />
    <div i-simple-icons-awsamplify />
    <div i-simple-icons-microsoftazure />
    <div i-simple-icons-aws />
    <div i-simple-icons-selfhosted />
  </div>
</div>

<div v-click flex="~ col gap-1">
  <div flex="~ gap-1 items-center" text-3xl ml--1>
    <div text-amber text-4xl i-ph-cube-duotone/>
    <div text-amber3>Multimodelo</div>
  </div>
  <div text-base op60 mb1>
    Elige entre varios <br/> modelos de IA
    Generativa
  </div>
  <div flex="~ gap-2 items-center">
    <div i-simple-icons-ollama />
    <div i-simple-icons-openai />
    <div i-simple-icons-huggingface />
    <div i-simple-icons-claude />
    <div i-simple-icons-amazonaws />
    <div i-simple-icons-microsoftazure />
  </div>
</div>

<div v-click flex="~ col gap-1">
  <div flex="~ gap-1 items-center" text-3xl ml--1>
    <div text-violet text-4xl i-ph-code-duotone />
    <div text-violet3>Hackable</div>
  </div>
  <div text-base op60 mb1>
    Personaliza a tu gusto
  </div>
  <div flex="~ gap-2 items-center">
    <div i-ph-code-duotone />
    <div i-ph-terminal-window-duotone />
    <div i-ph-file-code-duotone />
    <div i-ph-brackets-curly-duotone />
    <div i-ph-code-simple-duotone />
    <div i-ph-code-block-duotone />
  </div>
</div>

<div v-click flex="~ col gap-1">
  <div flex="~ gap-1 items-center" text-3xl ml--1>
    <div text-rose text-4xl i-ph-lightning-duotone />
    <div text-rose3>Rápido</div>
  </div>
  <div text-base op60 mb1>
    Despliega aplicaciones <br/> en minutos
  </div>
  <div flex="~ gap-2 items-center">
    <div i-ph-rocket-launch-duotone />
    <div i-mdi-rocket-launch-outline />
    <div i-mdi-rocket />
    <div i-tabler-rocket />
    <div i-iconamoon-rocket-launch-duotone />
  </div>
</div>

</div>

---
layout: two-cols
glowSeed: 4
---

# <div relative inline-block><BoltLogo h-12 inline-block /><super v-click text-sm v-mark.yellow.highlight.op20="1" absolute top--2 right--10>model</super></div>

<v-clicks>
  <li>
    <div relative inline-block text-red-1>Large Language Models <super absolute top--4 text-sm right--8 px-1 rounded-md bg-red-1 border-red border-2 text-red>LLMs</super></div>
  </li>
  <li>
    <div relative inline-block text-teal-1>Generative Pre-trained Transformer <super absolute top--4 text-sm right--8 px-1 rounded-md bg-teal-1 border-teal border-2 text-teal>GPT</super></div>
  </li>
</v-clicks>

<img v-after src="/gpt-architecture.svg" w-full max-w-65 />

::right::

<div v-click flex="~" flex-col items-center justify-center h-full w-full>
  <Bento
    :icons="['i-simple-icons-huggingface', 'i-simple-icons-claude', 'i-simple-icons-openai', 'i-simple-icons-ollama', 'i-simple-icons-google']"
    :heights="[[64, 32, 56], [56, 24, 32], [32, 64, 32]]"
    w-full
  />
</div>

<!-- <iframe v-click src="https://en.wikipedia.org/wiki/Generative_pre-trained_transformer" onload="this.style.visibility = 'visible';" scale-60 origin-top-right absolute right-0 top-0 bottom-0 w="50%" h="200%" /> -->

---
class: 'h-full'
---

# <div relative inline-block><BoltLogo h-12 inline-block /><super v-click text-sm v-mark.teal.highlight.op20="1" absolute top--2 right--10>demo</super></div>

<Repo name="stackblitz/bolt.new" text-sm />

<div v-click class="w-3/8" mt-6>
  <div text-1xl font-bold mb-4 flex="~ items-center">
    <div i-ph-game-controller-duotone text-2xl inline-block mr-2 /> Crearemos un tick-tack-toe
  </div>

  <div flex="~ gap-2" flex-col text-sm mb-6>
    Con un simple prompt:
    <div flex="~ gap-2 items-center">
      <div i-ph-code-duotone text-2xl inline-block mr-2 />
      <code lang="txt" class="bg-gray-800 text-white p-2 rounded border">
        Create a modern tic-tac-toe game
      </code>
    </div>
    Conseguiremos:
    <div mb-4>
      <ul list-disc list-inside>
        <li flex="~ items-center"><div i-ph-folder-duotone text-green-500 inline-block mr-2 /> Estructura del proyecto</li>
        <li flex="~ items-center"><div i-ph-package-duotone text-blue-500 inline-block mr-2 /> Dependencias necesarias</li>
        <li flex="~ items-center"><div i-ph-eye-duotone text-teal-500 inline-block mr-2 /> Previsualización en tiempo real</li>
        <li flex="~ items-center"><div i-ph-bug-duotone text-red-500 inline-block mr-2 /> Autocorreción de errores</li>
      </ul>
    </div>
  </div>
</div>

<iframe v-click src="https://bolt.new" onload="this.style.visibility = 'visible';" scale-60 origin-top-right absolute right-0 top-0 bottom-0 w="90%" h="200%" />

---
layout: two-cols
class: 'flex flex-col text-center pb-5 items-center justify-center'
glowSeed: 8
---

# Muchas gracias

Pueden encontrar
las diapositivas en [hadronomy.com](https://hadronomy.com)

::right::

<QRCode text="https://hadronomy.com" w-40 rounded-md overflow-hidden />
