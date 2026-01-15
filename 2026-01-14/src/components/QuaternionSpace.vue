<script setup lang="ts">
import { OrbitControls } from '@tresjs/cientos';
import { TresCanvas } from '@tresjs/core';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { computed, ref } from 'vue';

// --- State ---
const progress = ref(0);
const isAnimating = ref(false);

// --- Computed Metrics ---
const physicalAngle = computed(() => progress.value * 720);
const currentStateLabel = computed(() => {
  const p = progress.value;
  if (p < 0.05 || p > 0.95)
    return 'Identity (q)';
  if (Math.abs(p - 0.5) < 0.05)
    return 'Antipodal (-q)';
  return 'Transitioning...';
});

// --- Animation Control ---
function animateDemo() {
  if (isAnimating.value)
    return;
  if (progress.value >= 0.99)
    progress.value = 0;

  isAnimating.value = true;
  gsap.to(progress, {
    value: 1,
    duration: 8,
    ease: 'power1.inOut',
    onComplete: () => { isAnimating.value = false; },
  });
}

function scrub(e: Event) {
  const target = e.target as HTMLInputElement;
  progress.value = Number.parseFloat(target.value);
  isAnimating.value = false;
}

// --- Visual Helpers ---
const markerPos = computed(() => {
  const angleRad = progress.value * Math.PI * 2;
  // Radius of ring
  const R = 4.0;
  return [Math.sin(angleRad) * R, Math.cos(angleRad) * R, 0];
});

// Object Rotation (Physical)
const objectRotation = computed(() => [0, 0, -progress.value * Math.PI * 4]);
</script>

<template>
  <div class="h-full flex gap-8 font-sans py-4">
    <!-- Left Panel: Narrative & Controls -->
    <div class="flex-1 flex flex-col justify-center z-10 min-w-0">
      <h2 class="text-4xl font-bold mb-2 tracking-tight text-white truncate">
        Quaternion Space <span class="font-serif italic text-purple-300">ℍ</span>
      </h2>
      <div class="text-lg opacity-70 mb-6 font-mono text-purple-200">
        The Double Cover of SO(3)
      </div>

      <!-- State Card -->
      <div class="glass-panel p-6 rounded-2xl border border-white/10 mb-6 shadow-2xl">
        <div class="flex justify-between items-end mb-4 border-b border-white/10 pb-4">
          <div>
            <div class="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
              Physical Rotation
            </div>
            <div class="text-4xl font-mono text-white">
              {{ physicalAngle.toFixed(0) }}°
            </div>
          </div>
          <div class="text-right">
            <div class="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
              Topological State
            </div>
            <div
              class="text-xl font-bold transition-colors duration-300"
              :class="Math.abs(progress - 0.5) < 0.05 ? 'text-pink-300' : 'text-purple-300'"
            >
              {{ currentStateLabel }}
            </div>
          </div>
        </div>

        <div class="text-sm leading-relaxed text-gray-300">
          <p class="mb-3">
            Watch the <strong class="text-purple-300">Configuration Ring</strong> on the right.
          </p>
          <ul class="space-y-2 text-xs">
            <li class="flex gap-2">
              <div class="mt-1.5 w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
              <span>At <strong>360°</strong>, the object looks reset, but the math state is antipodal <strong>(-q)</strong>.</span>
            </li>
            <li class="flex gap-2">
              <div class="mt-1.5 w-1.5 h-1.5 rounded-full bg-pink-300 flex-shrink-0" />
              <span>It takes <strong>720°</strong> (two spins) to fully return to the identity state <strong>(q)</strong>.</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Timeline Control -->
      <div class="bg-black/20 rounded-xl border border-white/10 p-5">
        <div class="flex justify-between text-[10px] font-mono text-gray-500 mb-2 uppercase tracking-wider">
          <span>0° (q)</span>
          <span class="text-pink-300">360° (-q)</span>
          <span>720° (q)</span>
        </div>
        <input
          type="range"
          min="0" max="1" step="0.001"
          :value="progress"
          class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-400 hover:accent-purple-300 transition-all"
          @input="scrub"
        >

        <button
          :disabled="isAnimating" class="mt-6 w-full py-3 rounded-lg font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2"
          :class="isAnimating ? 'bg-gray-800 text-gray-500 border border-gray-700' : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/40'"
          @click="animateDemo"
        >
          <div v-if="!isAnimating" class="i-ph-play-fill text-lg" />
          <span>{{ isAnimating ? 'Traversing Hypersphere...' : 'Visualize 720° Cycle' }}</span>
        </button>
      </div>
    </div>

    <!-- Right Panel: 3D Visualization -->
    <div class="flex-1 glass-panel rounded-2xl border border-white/10 relative overflow-hidden bg-gradient-to-b from-[#050505] to-black">
      <TresCanvas clear-color="#080808" alpha>
        <!-- Zoomed out camera to fit labels -->
        <TresPerspectiveCamera :position="[0, 0, 12]" :look-at="[0, 0, 0]" />
        <OrbitControls :enable-pan="false" :enable-zoom="false" :enable-rotate="false" />

        <TresAmbientLight :intensity="1.5" />
        <TresDirectionalLight :position="[5, 5, 10]" :intensity="2" />
        <TresPointLight :position="[-5, -5, 5]" :intensity="1" color="#d8b4fe" />

        <!-- Background Grid -->
        <TresGridHelper :args="[20, 20, 0x222222, 0x111111]" :rotation="[Math.PI / 2, 0, 0]" :position="[0, 0, -4]" />

        <!-- CONFIGURATION RING -->
        <TresGroup>
          <!-- The Ring -->
          <TresMesh>
            <TresTorusGeometry :args="[4.0, 0.03, 32, 100]" />
            <TresMeshBasicMaterial color="#444" transparent :opacity="0.6" />
          </TresMesh>

          <!-- Top Marker (q = 1) -->
          <TresMesh :position="[0, 4.0, 0]">
            <TresSphereGeometry :args="[0.15]" />
            <TresMeshBasicMaterial color="#d8b4fe" />
          </TresMesh>

          <!-- Bottom Marker (q = -1) -->
          <TresMesh :position="[0, -4.0, 0]">
            <TresSphereGeometry :args="[0.15]" />
            <TresMeshBasicMaterial color="#f9a8d4" />
          </TresMesh>

          <!-- Moving State Marker (Glowing) -->
          <TresMesh :position="markerPos">
            <TresSphereGeometry :args="[0.25]" />
            <TresMeshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              :emissive-intensity="0.8"
            />
          </TresMesh>

          <!-- Tether -->
          <TresMesh :position="[markerPos[0] / 2, markerPos[1] / 2, 0]" :rotation="[0, 0, -progress * Math.PI * 2]">
            <TresCylinderGeometry :args="[0.01, 0.01, 4.0]" />
            <TresMeshBasicMaterial color="#666" transparent :opacity="0.4" />
          </TresMesh>
        </TresGroup>

        <!-- CENTRAL PHYSICAL OBJECT -->
        <TresGroup :rotation="objectRotation">
          <!-- Crystal Core -->
          <TresMesh>
            <TresIcosahedronGeometry :args="[1.4, 0]" />
            <TresMeshStandardMaterial
              color="#c4b5fd"
              flat-shading
              :metalness="0.5"
              :roughness="0.1"
            />
          </TresMesh>

          <!-- Orientation Indicator (Green Cone) -->
          <TresMesh :position="[0, 1.8, 0]">
            <TresConeGeometry :args="[0.3, 0.8, 16]" />
            <TresMeshStandardMaterial color="#86efac" :metalness="0.2" :roughness="0.2" />
          </TresMesh>

          <!-- Orientation Indicator (Red Cone) -->
          <TresMesh :position="[1.8, 0, 0]" :rotation="[0, 0, -Math.PI / 2]">
            <TresConeGeometry :args="[0.2, 0.6, 16]" />
            <TresMeshStandardMaterial color="#fca5a5" :metalness="0.2" :roughness="0.2" />
          </TresMesh>
        </TresGroup>
      </TresCanvas>

      <!-- HUD Labels (Positioned safely away from mesh) -->

      <!-- Top Label -->
      <div class="absolute top-6 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <div class="text-purple-300 font-bold text-xs bg-black/60 px-3 py-1.5 rounded-full border border-purple-500/30 backdrop-blur-md shadow-lg">
          Start / End (q)
        </div>
      </div>

      <!-- Bottom Label -->
      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <div class="text-pink-300 font-bold text-xs bg-black/60 px-3 py-1.5 rounded-full border border-pink-500/30 backdrop-blur-md shadow-lg">
          360° Point (-q)
        </div>
      </div>

      <!-- Legend Corner -->
      <div class="absolute bottom-4 right-4 text-right pointer-events-none">
        <div class="text-[10px] uppercase tracking-widest text-gray-500 mb-1">
          Center View
        </div>
        <div class="text-xs font-bold text-gray-300">
          Physical Object
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
</style>
