<script setup lang="ts">
import { OrbitControls } from '@tresjs/cientos';
import { TresCanvas } from '@tresjs/core';
import * as THREE from 'three';
import { computed, onMounted, ref, watch } from 'vue';

// --- State ---
const rot = ref({ x: 0, y: 0, z: 0 });
const matrix = ref([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
const autoRotate = ref(true);

// Strict tuple type for TresJS rotation
const tresRotation = computed<[number, number, number]>(() => [rot.value.x, rot.value.y, rot.value.z]);

// --- Math Logic ---
function updateMatrix() {
  const e = new THREE.Euler(rot.value.x, rot.value.y, rot.value.z, 'XYZ');
  const m = new THREE.Matrix4().makeRotationFromEuler(e);
  const el = m.elements; // Column-major

  // Update state for UI display
  matrix.value = [
    [el[0], el[4], el[8]], // Row 1
    [el[1], el[5], el[9]], // Row 2
    [el[2], el[6], el[10]], // Row 3
  ];
}

watch(rot, updateMatrix, { deep: true });

// --- Animation Loop ---
let frame = 0;
function animate() {
  if (autoRotate.value) {
    rot.value.x = Math.sin(frame * 0.005) * 0.5;
    rot.value.y = frame * 0.008;
    rot.value.z = Math.cos(frame * 0.003) * 0.2;
    updateMatrix();
  }
  frame++;
  requestAnimationFrame(animate);
}

onMounted(animate);
</script>

<template>
  <div class="h-full flex gap-8 font-sans">
    <!-- Left Panel: Narrative & Matrix HUD -->
    <div class="flex-1 flex flex-col justify-center z-10 min-w-0">
      <h2 class="text-4xl font-bold mb-2 tracking-tight text-white">
        SO(3) Groups
      </h2>
      <div class="text-lg opacity-60 mb-6 font-mono text-gray-300">
        Special Orthogonal Group in 3D
      </div>

      <!-- The Matrix Visualization (Compacted) -->
      <div class="glass-panel p-5 rounded-2xl border border-white/10 relative overflow-hidden shadow-2xl mb-5">
        <!-- Decoration -->
        <div class="absolute top-[-10px] right-[-10px] p-4 opacity-[0.03] text-8xl font-black font-serif select-none pointer-events-none">
          M
        </div>

        <div class="flex justify-center items-stretch gap-3 font-mono relative z-10">
          <!-- Left Bracket -->
          <div class="w-3 border-l-2 border-t-2 border-b-2 border-white/30 rounded-l-lg self-stretch" />

          <!-- Matrix Data -->
          <div class="grid grid-cols-3 gap-x-4 gap-y-2 py-2">
            <!-- Column 1: X Vector (Red) -->
            <div class="flex flex-col gap-2 group text-center">
              <span class="text-[9px] text-[#fca5a5] uppercase tracking-widest opacity-60">Basis X</span>
              <div
                v-for="(v, i) in [matrix[0][0], matrix[1][0], matrix[2][0]]" :key="`c1${i}`"
                class="text-[#fca5a5] font-bold text-sm text-center w-14 bg-[#fca5a5]/10 rounded px-1 py-0.5 border border-[#fca5a5]/20"
              >
                {{ v.toFixed(2) }}
              </div>
            </div>

            <!-- Column 2: Y Vector (Green) -->
            <div class="flex flex-col gap-2 group text-center">
              <span class="text-[9px] text-[#86efac] uppercase tracking-widest opacity-60">Basis Y</span>
              <div
                v-for="(v, i) in [matrix[0][1], matrix[1][1], matrix[2][1]]" :key="`c2${i}`"
                class="text-[#86efac] font-bold text-sm text-center w-14 bg-[#86efac]/10 rounded px-1 py-0.5 border border-[#86efac]/20"
              >
                {{ v.toFixed(2) }}
              </div>
            </div>

            <!-- Column 3: Z Vector (Blue) -->
            <div class="flex flex-col gap-2 group text-center">
              <span class="text-[9px] text-[#93c5fd] uppercase tracking-widest opacity-60">Basis Z</span>
              <div
                v-for="(v, i) in [matrix[0][2], matrix[1][2], matrix[2][2]]" :key="`c3${i}`"
                class="text-[#93c5fd] font-bold text-sm text-center w-14 bg-[#93c5fd]/10 rounded px-1 py-0.5 border border-[#93c5fd]/20"
              >
                {{ v.toFixed(2) }}
              </div>
            </div>
          </div>

          <!-- Right Bracket -->
          <div class="w-3 border-r-2 border-t-2 border-b-2 border-white/30 rounded-r-lg self-stretch" />
        </div>
      </div>

      <!-- Explanation -->
      <div class="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/5 mb-5">
        <div class="i-ph-info-duotone text-xl text-teal-400 shrink-0 mt-0.5" />
        <div class="text-xs text-gray-400 leading-relaxed">
          <strong class="text-white">The "Aha!" Moment:</strong> A rotation matrix isn't just random numbers.
          <br>
          <span class="text-[#fca5a5]">Column 1</span> is simply the coordinates of the <span class="text-[#fca5a5]">Red Arrow</span>.
          <br>
          <span class="text-[#86efac]">Column 2</span> is the <span class="text-[#86efac]">Green Arrow</span>.
        </div>
      </div>

      <div>
        <button
          class="px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 w-max"
          @click="autoRotate = !autoRotate"
        >
          <div :class="autoRotate ? 'i-ph-pause-fill' : 'i-ph-play-fill'" />
          {{ autoRotate ? 'Pause Rotation' : 'Auto Rotate' }}
        </button>
      </div>
    </div>

    <!-- Right Panel: 3D Visualization -->
    <div class="flex-1 glass-panel rounded-2xl border border-white/10 relative overflow-hidden bg-gradient-to-b from-[#0a0a0a] to-black">
      <TresCanvas clear-color="#080808" alpha>
        <TresPerspectiveCamera :position="[4, 3, 5]" :look-at="[0, 0, 0]" />
        <OrbitControls :enable-pan="false" :enable-zoom="false" />

        <!-- Environment -->
        <TresGridHelper :args="[20, 20, 0x222222, 0x111111]" :position="[0, -2, 0]" />

        <!-- STATIC WORLD FRAME (Ghosts) -->
        <TresGroup>
          <!-- X Ghost -->
          <TresMesh :rotation="[0, 0, -Math.PI / 2]" :position="[1.5, 0, 0]">
            <TresCylinderGeometry :args="[0.01, 0.01, 3]" />
            <TresMeshBasicMaterial color="#333" transparent :opacity="0.5" />
          </TresMesh>
          <!-- Y Ghost -->
          <TresMesh :position="[0, 1.5, 0]">
            <TresCylinderGeometry :args="[0.01, 0.01, 3]" />
            <TresMeshBasicMaterial color="#333" transparent :opacity="0.5" />
          </TresMesh>
          <!-- Z Ghost -->
          <TresMesh :rotation="[Math.PI / 2, 0, 0]" :position="[0, 0, 1.5]">
            <TresCylinderGeometry :args="[0.01, 0.01, 3]" />
            <TresMeshBasicMaterial color="#333" transparent :opacity="0.5" />
          </TresMesh>
        </TresGroup>

        <!-- ROTATED ACTIVE FRAME (Unshaded Basic Materials) -->
        <TresGroup :rotation="tresRotation">
          <!-- X Axis (Red Pastel) -->
          <TresGroup>
            <TresMesh :rotation="[0, 0, -Math.PI / 2]" :position="[1, 0, 0]">
              <TresCylinderGeometry :args="[0.05, 0.05, 2]" />
              <TresMeshBasicMaterial color="#fca5a5" />
            </TresMesh>
            <TresMesh :rotation="[0, 0, -Math.PI / 2]" :position="[2, 0, 0]">
              <TresConeGeometry :args="[0.15, 0.4, 32]" />
              <TresMeshBasicMaterial color="#fca5a5" />
            </TresMesh>
          </TresGroup>

          <!-- Y Axis (Green Pastel) -->
          <TresGroup>
            <TresMesh :position="[0, 1, 0]">
              <TresCylinderGeometry :args="[0.05, 0.05, 2]" />
              <TresMeshBasicMaterial color="#86efac" />
            </TresMesh>
            <TresMesh :position="[0, 2, 0]">
              <TresConeGeometry :args="[0.15, 0.4, 32]" />
              <TresMeshBasicMaterial color="#86efac" />
            </TresMesh>
          </TresGroup>

          <!-- Z Axis (Blue Pastel) -->
          <TresGroup>
            <TresMesh :rotation="[Math.PI / 2, 0, 0]" :position="[0, 0, 1]">
              <TresCylinderGeometry :args="[0.05, 0.05, 2]" />
              <TresMeshBasicMaterial color="#93c5fd" />
            </TresMesh>
            <TresMesh :rotation="[Math.PI / 2, 0, 0]" :position="[0, 0, 2]">
              <TresConeGeometry :args="[0.15, 0.4, 32]" />
              <TresMeshBasicMaterial color="#93c5fd" />
            </TresMesh>
          </TresGroup>

          <!-- Central Anchor -->
          <TresMesh>
            <TresBoxGeometry :args="[0.4, 0.4, 0.4]" />
            <TresMeshBasicMaterial color="#333" wireframe />
          </TresMesh>
        </TresGroup>
      </TresCanvas>

      <!-- View Label -->
      <div class="absolute bottom-4 right-6 text-right pointer-events-none">
        <div class="text-[10px] uppercase tracking-widest text-gray-500 mb-1">
          Visualizer
        </div>
        <div class="text-xs font-bold text-gray-300">
          Basis Vectors
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
