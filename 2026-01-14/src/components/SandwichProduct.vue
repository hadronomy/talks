<script setup lang="ts">
import { OrbitControls } from '@tresjs/cientos';
import { TresCanvas } from '@tresjs/core';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { computed, onMounted, ref } from 'vue';
import KatexRenderer from './KatexRenderer.vue';

// --- State ---
const step = ref(0);
const isAnimating = ref(false);
const animProgress = ref(0); // 0.0 to 1.0

// --- Vectors & Math ---
const startVec = ref(new THREE.Vector3(1, 0, 0));
const targetVec = ref(new THREE.Vector3(0, 0, 1));

// Computed Rotation Data
const computedData = computed(() => {
  const q = new THREE.Quaternion().setFromUnitVectors(startVec.value, targetVec.value);
  let axis = new THREE.Vector3(0, 1, 0);

  // Angle = 2 * acos(w)
  const angle = 2 * Math.acos(Math.min(Math.max(q.w, -1), 1));

  const s = Math.sqrt(1 - q.w * q.w);
  if (s > 0.001) {
    axis.set(q.x / s, q.y / s, q.z / s).normalize();
  }

  return { q, axis, angle };
});

// --- Randomization ---
function randomize() {
  if (isAnimating.value)
    return;
  isAnimating.value = true;
  step.value = 0;
  animProgress.value = 0;

  // New random vectors
  const r1 = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
  let r2 = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
  // Ensure they aren't too close
  while (r1.angleTo(r2) < 0.5) r2.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();

  // GSAP Tween objects
  const tempStart = { x: startVec.value.x, y: startVec.value.y, z: startVec.value.z };
  const tempTarget = { x: targetVec.value.x, y: targetVec.value.y, z: targetVec.value.z };

  const tl = gsap.timeline({
    onUpdate: () => {
      // Re-assign to trigger computed props
      startVec.value = new THREE.Vector3(tempStart.x, tempStart.y, tempStart.z).normalize();
      targetVec.value = new THREE.Vector3(tempTarget.x, tempTarget.y, tempTarget.z).normalize();
    },
    onComplete: () => isAnimating.value = false,
  });

  tl.to(tempStart, { x: r1.x, y: r1.y, z: r1.z, duration: 1.0, ease: 'power2.inOut' }, 0);
  tl.to(tempTarget, { x: r2.x, y: r2.y, z: r2.z, duration: 1.0, ease: 'power2.inOut' }, 0);
}

// --- Visual Transforms ---

// 1. Active Vector Quaternion
// Calculates the rotation for the Yellow Arrow based on progress
const activeVectorQuat = computed(() => {
  const { axis, angle } = computedData.value;
  const currentRad = animProgress.value * angle;
  const qCurrent = new THREE.Quaternion().setFromAxisAngle(axis, currentRad);

  // Calculate current vector position
  const v = startVec.value.clone().applyQuaternion(qCurrent);

  // Return Quaternion that rotates Y-up cylinder to vector v
  return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), v).toArray();
});

// 2. Arc Basis
// Constructs a coordinate system for the RingGeometry so it aligns with the rotation plane
const arcOrientation = computed(() => {
  const { axis } = computedData.value;
  const u = startVec.value.clone(); // Local X (Start of Arc)
  const n = axis.clone(); // Local Z (Normal of ring)
  const v = new THREE.Vector3().crossVectors(n, u).normalize(); // Local Y

  const m = new THREE.Matrix4().makeBasis(u, v, n);
  const q = new THREE.Quaternion().setFromRotationMatrix(m);
  return q.toArray();
});

// 3. Static Ghosts
function getGhostQuat(vec: THREE.Vector3) {
  return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), vec).toArray();
}

// Arc Logic
const halfAngle = computed(() => computedData.value.angle / 2);

const arc1Len = computed(() => {
  // Map progress 0..0.5 to 0..halfAngle
  const p = Math.min(animProgress.value, 0.5) * 2;
  return p * halfAngle.value;
});

const arc2Len = computed(() => {
  // Map progress 0.5..1.0 to 0..halfAngle
  const p = Math.max(0, (animProgress.value - 0.5) * 2);
  return p * halfAngle.value;
});

const showArc1 = computed(() => arc1Len.value > 0.001);
const showArc2 = computed(() => arc2Len.value > 0.001);

// Axis Visual
const axisVisualQuat = computed(() => {
  // Rotate cylinder (Y-up) to align with Axis
  return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), computedData.value.axis).toArray();
});

// --- Stepper Logic ---
function setStep(targetStep: number) {
  if (isAnimating.value || targetStep === step.value)
    return;
  isAnimating.value = true;

  let targetP = 0;
  if (targetStep === 1)
    targetP = 0.5;
  if (targetStep === 2)
    targetP = 1.0;

  gsap.to(animProgress, {
    value: targetP,
    duration: 1.2,
    ease: 'power3.inOut',
    onComplete: () => {
      step.value = targetStep;
      isAnimating.value = false;
    },
  });
}

const next = () => step.value < 2 ? setStep(step.value + 1) : setStep(0);
</script>

<template>
  <div class="h-full flex gap-8 font-sans">
    <!-- Left Panel -->
    <div class="flex-1 flex flex-col justify-center z-10 min-w-0">
      <h2 class="text-4xl font-bold mb-2 tracking-tight text-white">
        The Sandwich Product
      </h2>
      <div class="text-xl opacity-70 font-mono text-gray-300">
        <KatexRenderer formula="p' = q \cdot p \cdot q^{-1}" :display-mode="true" />
      </div>

      <!-- Animated Formula Visualization -->
      <div class="glass-panel p-5 rounded-2xl border border-white/10 mb-4 flex flex-col items-center shadow-2xl relative overflow-hidden">
        <!-- Formula -->
        <div class="flex items-center gap-4 text-5xl font-mono relative z-10 pl-10">
          <!-- q -->
          <div
            class="transition-all duration-700 transform"
            :class="step >= 1 ? 'opacity-100 scale-110 text-purple-400 drop-shadow-[0_0_20px_rgba(192,132,252,0.6)]' : 'opacity-20 blur-[2px] scale-90'"
          >
            <KatexRenderer formula="q" />
          </div>
          <span class="text-gray-600 text-3xl">·</span>
          <!-- p -->
          <div
            class="transition-all duration-700 transform text-yellow-300"
            :class="step === 0 ? 'scale-110 drop-shadow-[0_0_15px_rgba(253,224,71,0.5)]' : 'scale-100 opacity-80'"
          >
            <KatexRenderer formula="p" />
          </div>
          <span class="text-gray-600 text-3xl">·</span>
          <!-- q-1 -->
          <div
            class="transition-all duration-700 transform"
            :class="step >= 2 ? 'opacity-100 scale-110 text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]' : 'opacity-20 blur-[2px] scale-90'"
          >
            <KatexRenderer formula="q^{-1}" />
          </div>
        </div>

        <!-- Micro Data Row -->
        <div class="mt-5 flex gap-6 text-[10px] font-mono text-gray-500 uppercase tracking-widest border-t border-white/10 pt-3 w-full justify-center">
          <div class="flex gap-2">
            <span>w:</span> <span class="text-purple-300">{{ computedData.q.w.toFixed(2) }}</span>
          </div>
          <div class="flex gap-2">
            <span>xyz:</span> <span class="text-cyan-300">[{{ computedData.q.x.toFixed(2) }}, {{ computedData.q.y.toFixed(2) }}, {{ computedData.q.z.toFixed(2) }}]</span>
          </div>
          <div class="flex gap-2">
            <span>Angle:</span> <span class="text-white">{{ (computedData.angle * 180 / Math.PI).toFixed(0) }}°</span>
          </div>
        </div>
      </div>

      <!-- Stepper Controls -->
      <div class="bg-black/20 rounded-xl border border-white/10 p-5 mb-4">
        <div class="flex items-center gap-4 mb-4">
          <button
            :disabled="isAnimating" class="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-xs font-bold transition-all hover:bg-white/10 z-10"
            :class="step >= 0 ? 'bg-blue-600 border-blue-500 text-white' : 'text-gray-500'"
            @click="setStep(0)"
          >
            0
          </button>

          <div class="h-px flex-1 bg-white/10 relative overflow-hidden -mx-2">
            <div class="absolute inset-0 bg-purple-500 transition-all duration-1000" :style="{ width: step >= 1 ? '100%' : '0%' }" />
          </div>

          <button
            :disabled="isAnimating" class="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-xs font-bold transition-all hover:bg-white/10 z-10"
            :class="step >= 1 ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/50' : 'text-gray-500'"
            @click="setStep(1)"
          >
            1
          </button>

          <div class="h-px flex-1 bg-white/10 relative overflow-hidden -mx-2">
            <div class="absolute inset-0 bg-cyan-500 transition-all duration-1000" :style="{ width: step >= 2 ? '100%' : '0%' }" />
          </div>

          <button
            :disabled="isAnimating" class="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-xs font-bold transition-all hover:bg-white/10 z-10"
            :class="step >= 2 ? 'bg-cyan-600 border-cyan-500 text-white shadow-lg shadow-cyan-900/50' : 'text-gray-500'"
            @click="setStep(2)"
          >
            2
          </button>
        </div>

        <div class="h-10 relative">
          <transition name="fade" mode="out-in">
            <div v-if="step === 0" key="0" class="absolute w-full text-sm text-gray-400">
              <span class="text-white font-bold block mb-1">Initial State</span>
              Vector <span class="text-yellow-200 font-mono">p</span> ready for rotation.
            </div>
            <div v-else-if="step === 1" key="1" class="absolute w-full text-sm text-gray-400">
              <span class="text-purple-300 font-bold block mb-1">Step 1: Apply q</span>
              Half-rotation (<KatexRenderer formula="\theta/2" />).
            </div>
            <div v-else-if="step === 2" key="2" class="absolute w-full text-sm text-gray-400">
              <span class="text-cyan-300 font-bold block mb-1">Step 2: Apply q⁻¹</span>
              Second half-rotation (<KatexRenderer formula="\theta/2" />).
            </div>
          </transition>
        </div>
      </div>

      <button
        :disabled="isAnimating" class="w-full py-3 rounded-lg font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-white/10"
        :class="step === 2 ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg'"
        @click="next"
      >
        <span>{{ step === 2 ? 'Reset System' : 'Next Step' }}</span>
        <div v-if="step < 2" class="i-ph-arrow-right" />
        <div v-else class="i-ph-arrow-counter-clockwise" />
      </button>
    </div>

    <!-- Right Panel: 3D Visualization -->
    <div class="flex-1 glass-panel rounded-2xl border border-white/10 relative overflow-hidden bg-gradient-to-b from-[#050505] to-black">
      <!-- Randomize Button (Inside 3D View) -->
      <div class="absolute top-4 right-4 z-20">
        <button
          :disabled="isAnimating" class="px-3 py-1.5 bg-black/60 hover:bg-white/10 border border-white/20 rounded-md text-xs font-bold text-gray-300 flex items-center gap-2 backdrop-blur-md transition-all"
          @click="randomize"
        >
          <div class="i-ph-shuffle text-purple-400" />
          Randomize Vectors
        </button>
      </div>

      <TresCanvas clear-color="#080808" alpha>
        <TresPerspectiveCamera :position="[4.5, 5.5, 4.5]" :look-at="[0, 0, 0]" />
        <OrbitControls :enable-pan="false" :enable-zoom="false" />

        <TresAmbientLight :intensity="1" />
        <TresDirectionalLight :position="[5, 5, 5]" :intensity="2" />

        <!-- Environment -->
        <TresGridHelper :args="[10, 10, 0x333333, 0x111111]" :position="[0, -0.01, 0]" />
        <TresAxesHelper :args="[1]" />

        <!-- Origin Point -->
        <TresMesh :position="[0, 0, 0]">
          <TresSphereGeometry :args="[0.05]" />
          <TresMeshBasicMaterial color="#333" />
        </TresMesh>

        <!-- Rotation Axis Line (Grey Dashed) -->
        <TresGroup :quaternion="axisVisualQuat">
          <TresMesh :position="[0, 2.5, 0]">
            <TresCylinderGeometry :args="[0.01, 0.01, 5]" />
            <TresMeshBasicMaterial color="#444" transparent :opacity="0.3" />
          </TresMesh>
        </TresGroup>

        <!-- STATIC GHOSTS -->
        <!-- Start Vector (Grey) -->
        <TresGroup :quaternion="getGhostQuat(startVec)">
          <TresMesh :position="[0, 1.5, 0]">
            <TresCylinderGeometry :args="[0.03, 0.03, 3]" />
            <TresMeshBasicMaterial color="#444" transparent :opacity="0.5" />
          </TresMesh>
          <TresMesh :position="[0, 3, 0]">
            <TresConeGeometry :args="[0.1, 0.3, 32]" />
            <TresMeshBasicMaterial color="#444" transparent :opacity="0.5" />
          </TresMesh>
        </TresGroup>

        <!-- Target Vector (Cyan Outline) -->
        <TresGroup :quaternion="getGhostQuat(targetVec)">
          <TresMesh :position="[0, 1.5, 0]">
            <TresCylinderGeometry :args="[0.03, 0.03, 3]" />
            <TresMeshBasicMaterial color="#22d3ee" transparent :opacity="0.2" />
          </TresMesh>
          <TresMesh :position="[0, 3, 0]">
            <TresConeGeometry :args="[0.1, 0.3, 32]" />
            <TresMeshBasicMaterial color="#22d3ee" transparent :opacity="0.2" />
          </TresMesh>
        </TresGroup>

        <!-- ACTIVE VECTOR (Yellow Solid) -->
        <TresGroup :quaternion="activeVectorQuat">
          <TresMesh :position="[0, 1.5, 0]">
            <TresCylinderGeometry :args="[0.05, 0.05, 3]" />
            <TresMeshStandardMaterial color="#fcd34d" :roughness="0.2" :metalness="0.8" emissive="#fcd34d" :emissive-intensity="0.2" />
          </TresMesh>
          <TresMesh :position="[0, 3, 0]">
            <TresConeGeometry :args="[0.15, 0.4, 32]" />
            <TresMeshStandardMaterial color="#fcd34d" :roughness="0.2" :metalness="0.8" emissive="#fcd34d" :emissive-intensity="0.4" />
          </TresMesh>
        </TresGroup>

        <!-- DYNAMIC ARCS -->
        <TresGroup :quaternion="arcOrientation">
          <!-- Arc 1 (Purple) -->
          <TresGroup v-if="showArc1">
            <TresMesh :rotation="[0, 0, 0]">
              <TresRingGeometry :args="[2.9, 3.1, 64, 1, 0, arc1Len]" />
              <TresMeshBasicMaterial color="#a855f7" :side="2" />
            </TresMesh>
            <TresMesh>
              <TresRingGeometry :args="[0, 3.0, 64, 1, 0, arc1Len]" />
              <TresMeshBasicMaterial color="#a855f7" transparent :opacity="0.1" :side="2" />
            </TresMesh>
          </TresGroup>

          <!-- Arc 2 (Cyan) -->
          <TresGroup v-if="showArc2">
            <TresMesh>
              <!-- Start from halfAngle -->
              <TresRingGeometry :args="[2.9, 3.1, 64, 1, halfAngle, arc2Len]" />
              <TresMeshBasicMaterial color="#22d3ee" :side="2" />
            </TresMesh>
            <TresMesh>
              <TresRingGeometry :args="[0, 3.0, 64, 1, halfAngle, arc2Len]" />
              <TresMeshBasicMaterial color="#22d3ee" transparent :opacity="0.1" :side="2" />
            </TresMesh>
          </TresGroup>
        </TresGroup>
      </TresCanvas>

      <!-- HUD -->
      <div class="absolute bottom-6 left-6 text-xs font-mono text-gray-500 space-y-2 pointer-events-none">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-gray-500" />
          <span>Start Vector</span>
        </div>
        <div class="flex items-center gap-2 transition-colors duration-500" :class="step >= 2 ? 'text-cyan-300' : ''">
          <div class="w-2 h-2 rounded-full bg-[#22d3ee]" :class="step >= 2 ? 'shadow-[0_0_5px_currentColor]' : 'opacity-30'" />
          <span>Target Vector</span>
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
