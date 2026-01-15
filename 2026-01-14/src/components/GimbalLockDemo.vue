<script setup lang="ts">
import { OrbitControls } from '@tresjs/cientos';
import { TresCanvas } from '@tresjs/core';
import * as THREE from 'three';
import { computed, ref } from 'vue';

// --- State ---
const phi = ref(0); // Pitch (Outer - X)
const theta = ref(0); // Yaw (Middle - Y)
const psi = ref(0); // Roll (Inner - Z)

// --- Math & Logic ---
const isLocked = computed(() => {
  const t = Math.abs(theta.value);
  return Math.abs(t - 90) < 5;
});

const determinant = computed(() => {
  return Math.abs(Math.cos(theta.value * Math.PI / 180)).toFixed(3);
});

const alignmentScore = computed(() => {
  const rad = theta.value * Math.PI / 180;
  return Math.abs(Math.sin(rad));
});

// --- Controls ---
function snapToLock() {
  phi.value = 0;
  theta.value = 90;
  psi.value = 0;
}

function reset() {
  phi.value = 0;
  theta.value = 0;
  psi.value = 0;
}
</script>

<template>
  <div class="h-full flex gap-8 font-sans">
    <!-- Left Panel: Controls & Telemetry -->
    <div class="flex-1 flex flex-col justify-center z-10 min-w-0">
      <h2 class="text-4xl font-bold mb-2 tracking-tight text-white">
        Euler Angles & Gimbal Lock
      </h2>
      <div class="text-lg opacity-60 mb-8 font-mono text-gray-300">
        The Jacobian Singularity
      </div>

      <!-- Controls Wrapper (Relative anchor for absolute warning) -->
      <div class="relative mb-6">
        <!-- Absolute Warning Banner (Floats above card) -->
        <transition name="bounce">
          <div v-if="isLocked" class="absolute bottom-[calc(100%+12px)] left-0 right-0 bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg flex items-center gap-3 backdrop-blur-md shadow-lg z-20">
            <div class="i-ph-warning-octagon-fill text-2xl animate-pulse text-red-500" />
            <div class="leading-none">
              <div class="font-bold text-sm">
                GIMBAL LOCK DETECTED
              </div>
              <div class="text-[10px] opacity-80 uppercase tracking-widest">
                Degree of Freedom Lost
              </div>
            </div>
          </div>
        </transition>

        <!-- Controls Card -->
        <div class="glass-panel p-6 rounded-2xl border border-white/10 shadow-2xl space-y-5">
          <!-- Pitch (Outer) -->
          <div>
            <div class="flex justify-between text-xs font-bold text-[#fca5a5] mb-2 uppercase tracking-wider">
              <span>Outer Gimbal (Pitch)</span> <span>{{ phi }}°</span>
            </div>
            <input v-model.number="phi" type="range" min="-180" max="180" class="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer range-red">
          </div>

          <!-- Yaw (Middle - The Problem) -->
          <div>
            <div class="flex justify-between text-xs font-bold text-[#86efac] mb-2 uppercase tracking-wider">
              <span>Middle Gimbal (Yaw)</span> <span>{{ theta }}°</span>
            </div>
            <input v-model.number="theta" type="range" min="-90" max="90" class="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer range-green">
            <div class="flex justify-between mt-1 px-1">
              <span class="text-[9px] text-gray-600">Safe</span>
              <span class="text-[9px] text-red-400 font-bold transition-opacity duration-300" :class="isLocked ? 'opacity-100' : 'opacity-0'">CRITICAL (90°)</span>
              <span class="text-[9px] text-gray-600">Safe</span>
            </div>
          </div>

          <!-- Roll (Inner) -->
          <div>
            <div class="flex justify-between text-xs font-bold text-[#93c5fd] mb-2 uppercase tracking-wider">
              <span>Inner Gimbal (Roll)</span> <span>{{ psi }}°</span>
            </div>
            <input v-model.number="psi" type="range" min="-180" max="180" class="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer range-blue">
          </div>
        </div>
      </div>

      <!-- Data Readout -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="bg-black/40 rounded-xl p-3 border border-white/10">
          <div class="text-[9px] text-gray-500 uppercase tracking-widest mb-1">
            Determinant
          </div>
          <div class="text-2xl font-mono transition-colors" :class="isLocked ? 'text-red-500' : 'text-teal-400'">
            {{ determinant }}
          </div>
        </div>
        <div class="bg-black/40 rounded-xl p-3 border border-white/10">
          <div class="text-[9px] text-gray-500 uppercase tracking-widest mb-1">
            Axis Alignment
          </div>
          <div class="h-2 w-full bg-gray-800 rounded-full mt-2 overflow-hidden">
            <div
              class="h-full transition-all duration-300 ease-out"
              :style="{ width: `${alignmentScore * 100}%` }"
              :class="alignmentScore > 0.9 ? 'bg-red-500' : 'bg-gray-500'"
            />
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3">
        <button class="flex-1 py-3 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-300 rounded-lg text-xs font-bold uppercase tracking-widest transition-all" @click="snapToLock">
          Snap to Lock
        </button>
        <button class="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-all" @click="reset">
          <div class="i-ph-arrow-counter-clockwise text-lg" />
        </button>
      </div>
    </div>

    <!-- Right Panel: 3D Visualization -->
    <div class="flex-1 glass-panel rounded-2xl border border-white/10 relative overflow-hidden bg-gradient-to-b from-[#0a0a0a] to-black">
      <TresCanvas clear-color="#080808" alpha>
        <TresPerspectiveCamera :position="[5, 4, 6]" :look-at="[0, 0, 0]" />
        <OrbitControls :enable-pan="false" :enable-zoom="false" />

        <!-- Basic Environment -->
        <TresGridHelper :args="[20, 20, 0x222222, 0x111111]" :position="[0, -3, 0]" />

        <!-- GIMBAL HIERARCHY (Unshaded Basic Materials) -->

        <!-- OUTER RING (Red / Pitch / X) -->
        <TresGroup :rotation="[phi * Math.PI / 180, 0, 0]">
          <TresMesh>
            <TresTorusGeometry :args="[3.5, 0.15, 32, 100]" />
            <TresMeshBasicMaterial color="#fca5a5" />
          </TresMesh>
          <!-- Pins -->
          <TresMesh :position="[0, 3.5, 0]">
            <TresCylinderGeometry :args="[0.2, 0.2, 0.5]" /><TresMeshBasicMaterial color="#666" />
          </TresMesh>
          <TresMesh :position="[0, -3.5, 0]">
            <TresCylinderGeometry :args="[0.2, 0.2, 0.5]" /><TresMeshBasicMaterial color="#666" />
          </TresMesh>

          <!-- MIDDLE RING (Green / Yaw / Y) -->
          <TresGroup :rotation="[0, theta * Math.PI / 180, 0]">
            <TresMesh>
              <TresTorusGeometry :args="[2.8, 0.15, 32, 100]" />
              <TresMeshBasicMaterial color="#86efac" />
            </TresMesh>
            <!-- Pins -->
            <TresMesh :rotation="[0, 0, Math.PI / 2]" :position="[2.8, 0, 0]">
              <TresCylinderGeometry :args="[0.2, 0.2, 0.5]" /><TresMeshBasicMaterial color="#666" />
            </TresMesh>
            <TresMesh :rotation="[0, 0, Math.PI / 2]" :position="[-2.8, 0, 0]">
              <TresCylinderGeometry :args="[0.2, 0.2, 0.5]" /><TresMeshBasicMaterial color="#666" />
            </TresMesh>

            <!-- INNER RING (Blue / Roll / Z) -->
            <TresGroup :rotation="[0, 0, psi * Math.PI / 180]">
              <TresMesh>
                <TresTorusGeometry :args="[2.1, 0.15, 32, 100]" />
                <TresMeshBasicMaterial color="#93c5fd" />
              </TresMesh>

              <!-- Payload -->
              <TresGroup>
                <!-- Body -->
                <TresMesh :rotation="[0, 0, -Math.PI / 2]">
                  <TresConeGeometry :args="[0.5, 3.0, 32]" />
                  <TresMeshBasicMaterial color="#ffffff" />
                </TresMesh>
                <!-- Wings -->
                <TresMesh>
                  <TresBoxGeometry :args="[2.5, 0.1, 0.8]" />
                  <TresMeshBasicMaterial color="#ffffff" />
                </TresMesh>
                <!-- Local Z Axis -->
                <TresMesh :position="[0, 2, 0]">
                  <TresCylinderGeometry :args="[0.05, 0.05, 4]" />
                  <TresMeshBasicMaterial color="#93c5fd" />
                </TresMesh>
              </TresGroup>
            </TresGroup>
          </TresGroup>
        </TresGroup>

        <!-- GLOBAL AXIS (Visual Reference for Alignment) -->
        <TresMesh :rotation="[0, 0, Math.PI / 2]">
          <TresCylinderGeometry :args="[0.02, 0.02, 10]" />
          <TresMeshBasicMaterial color="#fca5a5" transparent :opacity="0.3" />
        </TresMesh>
      </TresCanvas>

      <!-- HUD Labels -->
      <div class="absolute bottom-4 left-4 flex flex-col gap-2 pointer-events-none">
        <div class="flex items-center gap-2">
          <div class="w-3 h-1 bg-[#fca5a5]" />
          <span class="text-[10px] text-gray-400 uppercase tracking-widest">Outer (Pitch)</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-1 bg-[#86efac]" />
          <span class="text-[10px] text-gray-400 uppercase tracking-widest">Middle (Yaw)</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-1 bg-[#93c5fd]" />
          <span class="text-[10px] text-gray-400 uppercase tracking-widest">Inner (Roll)</span>
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

.bounce-enter-active {
  animation: bounce-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.bounce-leave-active {
  animation: bounce-in 0.3s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Custom Range Sliders */
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  margin-top: -5px;
  border: 2px solid rgba(0, 0, 0, 0.5);
  cursor: pointer;
  transition: transform 0.1s;
}
input[type='range']::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.range-red::-webkit-slider-thumb {
  background: #fca5a5;
}
.range-green::-webkit-slider-thumb {
  background: #86efac;
}
.range-blue::-webkit-slider-thumb {
  background: #93c5fd;
}
</style>
