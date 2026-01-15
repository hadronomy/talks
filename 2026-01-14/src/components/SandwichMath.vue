<script setup lang="ts">
import { useSlideContext } from '@slidev/client';
import katex from 'katex';
import { computed } from 'vue';
import 'katex/dist/katex.min.css';

// --- Slidev Context ---
const { $clicks } = useSlideContext();

// --- Math Content ---
const steps = [
  {
    title: 'The Equation',
    // Standard single line
    latex: '\\textcolor{#c084fc}{q} \\cdot \\textcolor{#fde047}{p} \\cdot \\textcolor{#67e8f9}{q^{-1}}',
    desc: 'The standard formula for rotating a vector using quaternions.',
  },
  {
    title: '1. Encoding (Pure Quaternion)',
    // Standard single line
    latex: '\\textcolor{#fde047}{p} = [0, \\mathbf{v}]',
    desc: 'We promote the 3D vector <b>v</b> into 4D space by setting the scalar part (w) to 0.',
  },
  {
    title: '2. The First Product (Twist)',
    // MULTILINE FIX: Use aligned environment to split long equation
    latex: '\\begin{aligned} \\textcolor{#c084fc}{q}\\textcolor{#fde047}{p} &= [ -\\vec{u}\\cdot\\vec{v}, \\\\ &\\quad\\quad\\, w\\vec{v} + \\vec{u}\\times\\vec{v} ] \\end{aligned}',
    desc: 'Multiplying q and p creates a \'Spinor\'. Notice the scalar part is <b>non-zero</b>. It is no longer a vector; it is a mixed 4D state.',
  },
  {
    title: '3. The Inverse Product (Untwist)',
    // Single line fits fine
    latex: '(\\textcolor{#c084fc}{q}\\textcolor{#fde047}{p})\\textcolor{#67e8f9}{q^{-1}} = [0, \\mathbf{v}\']',
    desc: 'The second multiplication cancels out the scalar part exactly, returning a \'Pure Quaternion\'. The vector has been rotated by <b>2θ</b>.',
  },
];

// Map slide clicks to steps, clamping to the array length
const currentStepIndex = computed(() => {
  return Math.min($clicks.value, steps.length - 1);
});

const currentStep = computed(() => steps[currentStepIndex.value]);

// Helper to render KaTeX string to HTML
function renderMath(rawLatex: string) {
  return katex.renderToString(rawLatex, {
    throwOnError: false,
    displayMode: true,
    macros: {
      '\\vec': '\\mathbf',
    },
  });
}
</script>

<template>
  <div class="h-full flex gap-8 font-sans">
    <!-- Left Panel: Context -->
    <div class="flex-1 flex flex-col justify-center z-10">
      <h2 class="text-4xl font-bold mb-2 tracking-tight text-white">
        Algebraic Mechanics
      </h2>
      <div class="text-lg opacity-60 mb-8 font-mono text-purple-200">
        Why does it work?
      </div>

      <!-- Explainer Card (Fixed Height to prevent layout shift) -->
      <div class="glass-panel p-6 rounded-2xl border border-white/10 mb-8 flex flex-col justify-center shadow-lg relative overflow-hidden h-48">
        <!-- Step Number Watermark -->
        <div class="absolute -right-4 -bottom-8 text-9xl font-black text-white opacity-[0.03] select-none pointer-events-none">
          {{ currentStepIndex }}
        </div>

        <transition name="fade" mode="out-in">
          <div :key="currentStepIndex" class="w-full">
            <div class="text-xs font-bold uppercase tracking-widest text-purple-400 mb-3">
              {{ currentStep.title }}
            </div>
            <p class="text-base text-gray-200 leading-relaxed" v-html="currentStep.desc" />
          </div>
        </transition>
      </div>

      <!-- Progress Indicator -->
      <div class="flex gap-2 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <div
          v-for="(s, i) in steps" :key="i"
          class="h-full flex-1 transition-all duration-500 ease-out"
          :class="i <= currentStepIndex ? 'bg-purple-500' : 'bg-transparent'"
        />
      </div>
      <div class="mt-2 text-[10px] text-gray-500 uppercase tracking-widest text-right">
        Step {{ currentStepIndex + 1 }} / {{ steps.length }}
      </div>
    </div>

    <!-- Right Panel: Math Visualization -->
    <div class="flex-1 flex items-center justify-center">
      <div class="glass-panel w-full aspect-square rounded-3xl border border-white/10 relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] to-[#000] shadow-2xl">
        <!-- Background Glows -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

        <!-- Main Equation Display -->
        <!-- Fixed height container to center math vertically without jumping -->
        <div class="w-full px-6 flex items-center justify-center h-40 relative z-10">
          <transition name="slide-up" mode="out-in">
            <div :key="currentStepIndex" class="text-center w-full">
              <!-- Removed scaling transform to prevent overflow, adjusted font-size in CSS -->
              <div
                class="math-container"
                v-html="renderMath(currentStep.latex)"
              />
            </div>
          </transition>
        </div>

        <!-- Static Legend -->
        <div class="absolute bottom-8 left-0 w-full flex justify-center gap-6 text-[10px] font-mono text-gray-500 uppercase tracking-widest pointer-events-none">
          <div class="flex items-center gap-1.5">
            <div class="w-2 h-2 rounded-full bg-[#c084fc]" />
            <span>Operator</span>
          </div>
          <div class="flex items-center gap-1.5">
            <div class="w-2 h-2 rounded-full bg-[#fde047]" />
            <span>Data</span>
          </div>
          <div class="flex items-center gap-1.5">
            <div class="w-2 h-2 rounded-full bg-[#67e8f9]" />
            <span>Inverse</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glass-panel {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
}

/* Reduced size to ensure fit */
.math-container :deep(.katex) {
  font-size: 1.75rem;
  text-shadow: 0 0 30px rgba(192, 132, 252, 0.2);
  line-height: 1.4;
}

/* Specific override for the multiline block to align left/center nicely */
.math-container :deep(.katex-display) {
  margin: 0;
  padding: 0;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
  filter: blur(4px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(1.05);
  filter: blur(4px);
}
</style>
