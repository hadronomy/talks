---
layout: cover
highlighter: shiki
css: unocss
colorSchema: dark
transition: fade-out
mdc: true
glowSeed: 4
title: Large Language Models for Recommendation Systems
lang: es
remoteAssets: true
addons:
  - slidev-addon-graph
---

<div text-6xl font-600 my-5 flex="~ gap-4 col">
  <div i-ph-brain-duotone text-7xl text-teal-400 />
  <div flex="~ col">
    <span>Large Language Models</span>
    <span text-4xl op-80>for Recommendation Systems</span>
  </div>
</div>

<div text-2xl mt-5 op50>
  De la Factorización de Matrices a la IA Generativa
</div>

<div abs-br mx-10 my-12 flex="~ col" text-sm text-right>
  <img src="/logo-ull.svg" h-20 alt="ULL Logo" />
  <div px-6 text-sm opacity-50>01.12.2025</div>
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
<br/>

Mi stack
<div class="flex flex-wrap justify-start gap-1 w-3/4">
  <MagicLink href="https://git-scm.com" iconClass="i-devicon-git" />
  <MagicLink href="https://reactjs.org" iconClass="i-devicon-react" />
  <MagicLink href="https://typescriptlang.org" iconClass="i-devicon-typescript" />
  <MagicLink href="https://rust-lang.org" iconClass="i-simple-icons-rust" />
  <MagicLink href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" iconClass="i-devicon-javascript" />
  <MagicLink href="https://isocpp.org" iconClass="i-devicon-cplusplus" />
  <MagicLink href="https://python.org" iconClass="i-devicon-python" />
  <MagicLink href="https://developer.mozilla.org/en-US/docs/Web/HTML" iconClass="i-devicon-html5" />
  <MagicLink href="https://developer.mozilla.org/en-US/docs/Web/CSS" iconClass="i-devicon-css3" />
  <MagicLink href="https://webassembly.org" iconClass="i-simple-icons-webassembly" />
  <MagicLink href="https://docker.com" iconClass="i-devicon-docker" />
  <MagicLink href="https://prisma.io" iconClass="i-simple-icons-prisma" />
  <MagicLink href="https://nodejs.org" iconClass="i-devicon-nodejs" />
  <MagicLink href="https://tailwindcss.com" iconClass="i-devicon-tailwindcss" />
  <MagicLink href="https://linux.org" iconClass="i-devicon-linux" />
  <MagicLink href="https://nixos.org" iconClass="i-devicon-nixos" />
  <MagicLink href="https://kubernetes.io" iconClass="i-devicon-kubernetes" />
  <MagicLink href="https://nextjs.org" iconClass="i-devicon-nextjs" />
  <MagicLink href="https://astro.build" iconClass="i-devicon-astro" />
  <MagicLink href="https://www.postgresql.org" iconClass="i-devicon-postgresql" />
  <MagicLink href="https://ziglang.org" iconClass="i-devicon-zig" />
  <MagicLink href="https://golang.org" iconClass="i-devicon-go" />
  <MagicLink href="https://code.visualstudio.com" iconClass="i-devicon-vscode" />
  <MagicLink href="https://vitejs.dev" iconClass="i-devicon-vitejs" />
  <MagicLink href="https://vitest.dev" iconClass="i-devicon-vitest" />
  <MagicLink href="https://tauri.app" iconClass="i-devicon-tauri" />
  <MagicLink href="https://neovim.io" iconClass="i-devicon-neovim" />
</div>

<br/>
Actualmente estudiando en <MagicLink src="ull-icon.jpg" href="https://ull.es">ULL</MagicLink><br/>
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

<div relative>

<div
  v-motion
  :initial="{ y: 50 }"
  :click-1="{ y: 0 }"
>
  <div text-6xl my-6>
    RecSys Clásico
  </div>

  <div relative text-3xl mt--3
    v-click="1"
    v-motion
    :initial="{ y: -50 }"
    :enter="{ y: 0 }"
  >
    <span v-mark.red.highlight.delay100.op10="1" text-red>
      Tiene límites claros
    </span>
  </div>
</div>

<div text-2xl mt5 text-shadow-2xl op75
  v-click
  v-motion
  :initial="{ y: -60 }"
  :enter="{ y: 0 }"
>
  Cold Start & Falta de Semántica
</div>

<MF v-after opacity-70 />

</div>

---
glowSeed: 4
---

# Entran los <span class="text-teal-400">LLMs</span>

<div class="grid grid-cols-3 gap-4 mt-8">

  <!-- Card 1: Semántica -->
  <div v-click class="flex flex-col gap-2 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition duration-300">
    <div class="flex items-center gap-3">
      <div class="text-teal-400 text-3xl i-ph-brain-duotone"></div>
      <div class="text-teal-200 font-bold text-lg">Semántica</div>
    </div>
    <div class="text-sm opacity-70 leading-tight">
      Entienden el contenido y el contexto, no solo coinciden IDs o etiquetas.
    </div>
    <div class="flex gap-2 mt-auto pt-2 opacity-50">
      <div class="i-ph-text-aa-duotone text-blue-400"></div>
      <div class="i-ph-translate-duotone text-green-400"></div>
    </div>
  </div>

  <!-- Card 2: Zero-Shot -->
  <div v-click class="flex flex-col gap-2 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition duration-300">
    <div class="flex items-center gap-3">
      <div class="text-amber-400 text-3xl i-ph-snowflake-duotone"></div>
      <div class="text-amber-200 font-bold text-lg">Zero-Shot Rec</div>
    </div>
    <div class="text-sm opacity-70 leading-tight">
      Capacidad de recomendar sin historial previo del usuario (Cold Start).
    </div>
    <div class="flex gap-2 mt-auto pt-2 opacity-50">
      <div class="i-ph-lightning-duotone text-yellow-400"></div>
      <div class="i-ph-magic-wand-duotone text-purple-400"></div>
    </div>
  </div>

  <!-- Card 3: Conversacional -->
  <div v-click class="flex flex-col gap-2 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition duration-300">
    <div class="flex items-center gap-3">
      <div class="text-blue-400 text-3xl i-ph-chat-circle-dots-duotone"></div>
      <div class="text-blue-200 font-bold text-lg">Conversacional</div>
    </div>
    <div class="text-sm opacity-70 leading-tight">
      El usuario puede pedir mejoras o cambios en lenguaje natural.
    </div>
    <div class="flex gap-2 mt-auto pt-2 opacity-50">
      <div class="i-ph-user-focus-duotone text-indigo-400"></div>
      <div class="i-ph-question-duotone text-cyan-400"></div>
    </div>
  </div>

  <!-- Card 4: Explicabilidad -->
  <div v-click class="flex flex-col gap-2 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition duration-300">
    <div class="flex items-center gap-3">
      <div class="text-rose-400 text-3xl i-ph-student-duotone"></div>
      <div class="text-rose-200 font-bold text-lg">Explicabilidad</div>
    </div>
    <div class="text-sm opacity-70 leading-tight">
      El modelo puede razonar y explicar por qué recomienda algo específico.
    </div>
    <div class="flex gap-2 mt-auto pt-2 opacity-50">
      <div class="i-ph-article-duotone text-red-400"></div>
      <div class="i-ph-quotes-duotone text-orange-400"></div>
    </div>
  </div>

  <!-- Card 5: RAG -->
  <div v-click class="flex flex-col gap-2 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition duration-300">
    <div class="flex items-center gap-3">
      <div class="text-violet-400 text-3xl i-ph-database-duotone"></div>
      <div class="text-violet-200 font-bold text-lg">RAG & Knowledge</div>
    </div>
    <div class="text-sm opacity-70 leading-tight">
      Uso de conocimiento externo y bases de datos vectoriales para enriquecer los datos.
    </div>
    <div class="flex gap-2 mt-auto pt-2 opacity-50">
      <div class="i-simple-icons-langchain text-green-400"></div>
      <div class="i-simple-icons-llamaindex text-blue-400"></div>
    </div>
  </div>

  <!-- Card 6: Transfer Learning -->
  <div v-click class="flex flex-col gap-2 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition duration-300">
    <div class="flex items-center gap-3">
      <div class="text-green-400 text-3xl i-ph-arrows-left-right-duotone"></div>
      <div class="text-green-200 font-bold text-lg">Transfer Learning</div>
    </div>
    <div class="text-sm opacity-70 leading-tight">
      Conocimiento general del mundo aplicado a tu dominio específico.
    </div>
    <div class="flex gap-2 mt-auto pt-2 opacity-50">
      <div class="i-ph-globe-duotone text-emerald-400"></div>
      <div class="i-ph-book-duotone text-lime-400"></div>
    </div>
  </div>

</div>

---
layout: two-cols
glowSeed: 4
---

# <div flex items-center gap-3><div i-ph-strategy-duotone text-teal-400 />Arquitecturas</div>

<div class="flex flex-col gap-4 mt-4">

  <!-- Concept 1: Discriminative -->
  <div v-click class="p-3 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition duration-300">
    <div class="flex items-center justify-between mb-1">
      <div class="flex items-center gap-2 text-red-300 font-bold text-lg">
        <div i-ph-magnifying-glass-duotone /> Discriminative
      </div>
      <span class="text-xs border border-red-500/40 px-1.5 py-0.5 rounded text-red-200 bg-red-500/20">Embeddings</span>
    </div>
    <div class="text-sm opacity-70 leading-snug">
      Usar el LLM (ej. BERT) para generar representaciones vectoriales densas de items y usuarios para calcular similitud.
    </div>
  </div>

  <!-- Concept 2: Generative -->
  <div v-click class="p-3 rounded-xl border border-teal-500/20 bg-teal-500/5 hover:bg-teal-500/10 transition duration-300">
    <div class="flex items-center justify-between mb-1">
      <div class="flex items-center gap-2 text-teal-300 font-bold text-lg">
        <div i-ph-chat-text-duotone /> Generative
      </div>
      <span class="text-xs border border-teal-500/40 px-1.5 py-0.5 rounded text-teal-200 bg-teal-500/20">SeqRec</span>
    </div>
    <div class="text-sm opacity-70 leading-snug">
      Fine-tuning o Prompting (ej. GPT) para predecir el "siguiente token" como el "siguiente item" a consumir.
    </div>
  </div>

  <!-- Prompt Example Box -->
  <div v-click class="mt-2 rounded-lg border border-gray-700 bg-black/40 overflow-hidden">
    <div class="bg-gray-800/50 px-3 py-1 text-[10px] text-gray-400 font-mono border-b border-gray-700 flex items-center gap-2">
      <div i-ph-terminal-window-duotone /> PROMPT TEMPLATE
    </div>
    <div class="p-3 font-mono text-xs leading-relaxed text-gray-300">
      <span class="text-blue-400">User History:</span> [Matrix, Inception, Interstellar]<br/>
      <span class="text-purple-400">Task:</span> Recommend next movie.<br/>
      <span class="text-yellow-400">Reasoning:</span> User likes sci-fi & mind-bending plots.<br/>
      <span class="text-green-400">Recommendation:</span> <span class="animate-pulse">_</span>
    </div>
  </div>

</div>

::right::

<div class="h-full flex flex-col justify-center gap-6 pl-6">
  <div class="text-xs font-bold text-gray-500 tracking-widest uppercase mb-[-10px]">The Stack</div>
  <!-- Stack 1: Generative / Fine-Tuning -->
  <div v-click class="relative p-4 rounded-2xl border border-teal-500/30 bg-teal-500/5">
    <div class="absolute -top-2.5 left-4 bg-gray-900 px-2 text-[10px] text-teal-400 font-mono border border-teal-500/30 rounded">
      FINE-TUNING PIPELINE
    </div>
    <div class="grid grid-cols-2 gap-3 mt-2">
      <!-- Unsloth -->
      <div class="flex items-center gap-2 bg-black/40 p-2 rounded border border-white/10">
        <div class="i-ph-lightning-duotone text-yellow-400 text-xl"></div>
        <div class="flex flex-col leading-none">
          <span class="text-sm font-bold">Unsloth</span>
          <span class="text-[9px] opacity-60">Fast Training</span>
        </div>
      </div>
      <!-- TRL -->
      <div class="flex items-center gap-2 bg-black/40 p-2 rounded border border-white/10">
        <div class="i-simple-icons-huggingface text-yellow-500 text-xl"></div>
        <div class="flex flex-col leading-none">
          <span class="text-sm font-bold">TRL</span>
          <span class="text-[9px] opacity-60">SFT / DPO</span>
        </div>
      </div>
      <!-- PEFT -->
      <div class="flex items-center gap-2 bg-black/40 p-2 rounded border border-white/10">
        <div class="i-ph-arrows-in-line-horizontal-duotone text-teal-400 text-xl"></div>
        <div class="flex flex-col leading-none">
          <span class="text-sm font-bold">PEFT</span>
          <span class="text-[9px] opacity-60">LoRA / QLoRA</span>
        </div>
      </div>
      <!-- Base -->
      <div class="flex items-center gap-2 bg-black/40 p-2 rounded border border-white/10">
        <div class="i-hugeicons:qwen text-purple-400 text-xl"></div>
        <div class="flex flex-col leading-none">
          <span class="text-sm font-bold">Qwen 2.5</span>
          <span class="text-[9px] opacity-60">Base Model</span>
        </div>
      </div>
    </div>
  </div>
  <!-- Stack 2: Discriminative / Retrieval -->
  <div v-click class="relative p-4 rounded-2xl border border-red-500/30 bg-red-500/5">
    <div class="absolute -top-2.5 left-4 bg-gray-900 px-2 text-[10px] text-red-400 font-mono border border-red-500/30 rounded">
      RETRIEVAL STACK
    </div>
    <div class="flex flex-col gap-3 mt-2">
      <!-- Embedding Model -->
      <div class="flex items-center justify-between bg-black/40 p-2 rounded border border-white/10">
        <div class="flex items-center gap-2">
          <div class="i-ph-cube-transparent-duotone text-orange-400 text-xl"></div>
          <span class="text-sm font-bold">Sentence Transformers</span>
        </div>
        <div class="text-[9px] bg-white/10 px-1.5 py-0.5 rounded">BERT / E5</div>
      </div>
      <!-- Vector DB -->
      <div class="flex items-center justify-between bg-black/40 p-2 rounded border border-white/10">
        <div class="flex items-center gap-2">
          <div class="i-ph-database-duotone text-red-400 text-xl"></div>
          <span class="text-sm font-bold">Vector DB</span>
        </div>
        <div class="flex gap-2">
           <div class="i-simple-icons-qdrant text-red-500"></div>
           <div class="i-simple-icons-pinecone text-blue-400"></div>
        </div>
      </div>
      <!-- Orchestration -->
      <div class="flex items-center justify-between bg-black/40 p-2 rounded border border-white/10">
        <div class="flex items-center gap-2">
          <div class="i-simple-icons-langchain text-green-400 text-xl"></div>
          <span class="text-sm font-bold">LangChain</span>
        </div>
        <div class="text-[9px] opacity-60">Orchestrator</div>
      </div>
    </div>
  </div>
</div>

---
class: 'h-full'
---

# <div class="flex items-center gap-3"><div class="i-ph-code-duotone text-teal-400"></div>Implementation Strategy</div>

<div class="grid grid-cols-12 gap-6 mt-6 h-[80%]">

  <!-- LEFT COL: The Pipeline -->
  <div class="col-span-5 flex flex-col gap-4">
    <!-- 1. Data Strategy -->
    <div v-click class="p-4 rounded-xl border border-white/10 bg-white/5">
      <div class="flex items-center gap-2 mb-2 text-blue-300 font-bold">
        <div class="i-ph-database-duotone text-xl"></div>
        Data: MovieLens 1M
      </div>
      <div class="text-xs opacity-70 leading-relaxed">
        <span class="text-teal-400 font-bold">Sliding Window Strategy:</span>
        Transformamos el historial de interacciones en una conversación.
        <div class="mt-2 flex gap-1 text-[10px] font-mono opacity-50">
          <span class="border border-gray-600 px-1 rounded">[A, B, C] -> D</span>
          <span class="border border-gray-600 px-1 rounded">[B, C, D] -> E</span>
        </div>
      </div>
    </div>
    <!-- 2. The Model -->
    <div v-click class="p-4 rounded-xl border border-white/10 bg-white/5">
      <div class="flex items-center gap-2 mb-2 text-yellow-300 font-bold">
        <div class="i-ph-lightning-duotone text-xl"></div>
        Engine: Qwen 2.5 + Unsloth
      </div>
      <div class="text-xs opacity-70 leading-relaxed">
        Utilizamos <b>Unsloth</b> para optimizar el fine-tuning (2x más rápido, -70% VRAM) sobre una <b>A100</b> en Google Colab.
      </div>
    </div>
    <!-- 3. Colab Link -->
    <a v-click href="https://colab.research.google.com/drive/1p4SYptCyxYLECThf_Fw07Nz1-pMkBN30?usp=sharing" target="_blank" class="flex items-center justify-between p-4 rounded-xl border border-orange-500/30 bg-orange-500/10 hover:bg-orange-500/20 transition cursor-pointer group">
      <div class="flex items-center gap-3">
        <div class="i-simple-icons-googlecolab text-orange-400 text-2xl"></div>
        <div class="flex flex-col">
          <span class="text-sm font-bold text-orange-200">Open Notebook</span>
          <span class="text-[10px] opacity-60">Full Training & Inference Pipeline</span>
        </div>
      </div>
      <div class="i-ph-arrow-right-duotone text-orange-400 group-hover:translate-x-1 transition"></div>
    </a>
  </div>
  <!-- RIGHT COL: The Code -->
  <iframe v-click src="https://nbviewer.org/urls/gist.githubusercontent.com/hadronomy/48281fc6247bdb78b45ad7681c1f62f6/raw/003528c3a97f1baf5db76ba9ed7db2ad95d26c1a/recsys-llms.ipynb" onload="this.style.visibility = 'visible';" scale-60 origin-top-right absolute right-0 top-0 bottom-0 z--1 w="90%" h="200%" />

</div>
---
layout: two-cols
class: 'flex flex-col text-center pb-5 items-center justify-center'
glowSeed: 8
---

# Muchas gracias

Diapositivas y referencias en:
[hadronomy.com](https://talks.hadronomy.com/2025/llm-recsys)

::right::

<QRCode text="https://talks.hadronomy.com/2025/llm-recsys" w-40 rounded-md overflow-hidden />
