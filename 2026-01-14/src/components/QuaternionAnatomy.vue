<script setup lang="ts">
import { OrbitControls } from '@tresjs/cientos';
import { TresCanvas } from '@tresjs/core';
import * as THREE from 'three';
import { computed, ref } from 'vue';
import KatexRenderer from './KatexRenderer.vue';

// --- State ---
const angleDeg = ref(0);
const axisRot = ref({ theta: 0, phi: 0 });

// --- Math ---
const axis = computed(() => {
  const theta = axisRot.value.theta;
  const phi = axisRot.value.phi;

  const x = Math.sin(phi) * Math.cos(theta);
  const y = Math.cos(phi);
  const z = Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z).normalize();
});

const quaternion = computed(() => {
  const rad = angleDeg.value * Math.PI / 180;
  const halfRad = rad / 2;
  const s = Math.sin(halfRad);

  return {
    w: Math.cos(halfRad),
    x: axis.value.x * s,
    y: axis.value.y * s,
    z: axis.value.z * s,
  };
});

const objectQuat = computed(() => {
  return [quaternion.value.x, quaternion.value.y, quaternion.value.z, quaternion.value.w] as [number, number, number, number];
});

// Axis Visualization Rotation
const axisGroupRotation = computed(() => {
  const up = new THREE.Vector3(0, 1, 0);
  const q = new THREE.Quaternion().setFromUnitVectors(up, axis.value);
  const e = new THREE.Euler().setFromQuaternion(q);
  return [e.x, e.y, e.z];
});
</script>

<template>
  <div class="h-full flex gap-8 font-sans">
    <!-- Left Panel: Algebra & Controls -->
    <div class="flex-1 flex flex-col justify-center z-10 min-w-0">
      <h2 class="text-4xl font-bold mb-2 tracking-tight text-white">
        Anatomy of a Quaternion
      </h2>
      <div class="text-xl opacity-70 mb-6 font-mono text-purple-200">
        <KatexRenderer formula="q = w + xi + yj + zk" />
      </div>

      <!-- Math Card -->
      <div class="glass-panel p-6 rounded-2xl border border-white/10 mb-6 shadow-2xl">
        <div class="text-[10px] text-gray-400 uppercase tracking-widest mb-4 text-center border-b border-white/5 pb-2">
          Euler's Rotation Formula
        </div>

        <div class="font-mono text-lg space-y-4">
          <!-- Scalar W -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-[#d8b4fe] font-bold text-3xl">w</span>
              <span class="text-gray-500 text-sm">= cos(θ/2)</span>
            </div>
            <div class="bg-[#d8b4fe]/10 border border-[#d8b4fe]/20 rounded px-3 py-1 min-w-[5rem] text-right">
              <span class="text-[#d8b4fe] font-bold">{{ quaternion.w.toFixed(3) }}</span>
            </div>
          </div>

          <!-- Vector XYZ -->
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3 mt-2">
              <span class="text-[#67e8f9] font-bold text-3xl">xyz</span>
              <span class="text-gray-500 text-sm">= <span class="text-[#fcd34d] font-bold">û</span> · sin(θ/2)</span>
            </div>
            <div class="text-right text-sm space-y-1">
              <div class="flex items-center justify-end gap-2">
                <span class="text-gray-600 text-xs">x</span>
                <span class="text-[#67e8f9] font-mono">{{ quaternion.x.toFixed(3) }}</span>
              </div>
              <div class="flex items-center justify-end gap-2">
                <span class="text-gray-600 text-xs">y</span>
                <span class="text-[#67e8f9] font-mono">{{ quaternion.y.toFixed(3) }}</span>
              </div>
              <div class="flex items-center justify-end gap-2">
                <span class="text-gray-600 text-xs">z</span>
                <span class="text-[#67e8f9] font-mono">{{ quaternion.z.toFixed(3) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Controls -->
      <div class="bg-black/20 rounded-xl border border-white/10 p-5 space-y-5">
        <!-- Angle Slider -->
        <div>
          <div class="flex justify-between text-xs font-bold text-[#d8b4fe] mb-2 uppercase tracking-wider">
            <span>Rotation Angle (θ)</span>
            <span>{{ angleDeg.toFixed(0) }}°</span>
          </div>
          <input v-model.number="angleDeg" type="range" min="0" max="720" class="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer range-purple">
          <div class="flex justify-between text-[9px] text-gray-500 mt-1 font-mono">
            <span>0°</span>
            <span>360°</span>
            <span>720°</span>
          </div>
        </div>

        <!-- Axis Control -->
        <div>
          <div class="flex justify-between text-xs font-bold text-[#fcd34d] mb-2 uppercase tracking-wider">
            <span>Rotation Axis (û)</span>
          </div>
          <div class="flex gap-4">
            <div class="flex-1">
              <input v-model.number="axisRot.phi" type="range" min="0" max="3.14" step="0.01" class="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer range-yellow">
              <div class="text-[9px] text-center text-gray-500 mt-1">
                Vertical (Latitude)
              </div>
            </div>
            <div class="flex-1">
              <input v-model.number="axisRot.theta" type="range" min="0" max="6.28" step="0.01" class="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer range-yellow">
              <div class="text-[9px] text-center text-gray-500 mt-1">
                Horizontal (Longitude)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Panel: 3D Visualization -->
    <div class="flex-1 glass-panel rounded-2xl border border-white/10 relative overflow-hidden bg-gradient-to-b from-[#0a0a0a] to-black">
      <TresCanvas clear-color="#080808" alpha>
        <TresPerspectiveCamera :position="[4, 4, 6]" :look-at="[0, 0, 0]" />
        <OrbitControls :enable-pan="false" :enable-zoom="false" />

        <!-- Lighting -->
        <TresAmbientLight :intensity="1" />
        <TresDirectionalLight :position="[5, 5, 5]" :intensity="2" />
        <TresPointLight :position="[-5, -5, 5]" :intensity="1" color="#d8b4fe" />

        <!-- Context Grid -->
        <TresGridHelper :args="[10, 10, 0x333333, 0x111111]" :position="[0, -1.5, 0]" />

        <!-- THE UNIT SPHERE (Transparent) -->
        <TresGroup>
          <TresMesh>
            <TresSphereGeometry :args="[3, 32, 32]" />
            <TresMeshBasicMaterial color="#ffffff" wireframe transparent :opacity="0.1" />
          </TresMesh>
          <!-- Inner fill for volume -->
          <TresMesh>
            <TresSphereGeometry :args="[2.95, 32, 32]" />
            <TresMeshBasicMaterial color="#000000" transparent :opacity="0.2" side="2" />
          </TresMesh>
        </TresGroup>

        <!-- THE AXIS VECTOR (Solid Pastel Amber) -->
        <TresGroup :rotation="axisGroupRotation">
          <!-- The Shaft (Through the sphere) -->
          <TresMesh :position="[0, 0, 0]">
            <TresCylinderGeometry :args="[0.04, 0.04, 6]" />
            <TresMeshStandardMaterial color="#fcd34d" :roughness="0.3" :metalness="0.1" />
          </TresMesh>

          <!-- Positive Tip -->
          <TresMesh :position="[0, 3, 0]">
            <TresConeGeometry :args="[0.15, 0.4, 32]" />
            <TresMeshStandardMaterial color="#fcd34d" :roughness="0.3" :metalness="0.1" />
          </TresMesh>

          <!-- Negative Tip (Shows it goes through) -->
          <TresMesh :position="[0, -3, 0]" :rotation="[Math.PI, 0, 0]">
            <TresConeGeometry :args="[0.15, 0.4, 32]" />
            <TresMeshStandardMaterial color="#fcd34d" :roughness="0.3" :metalness="0.1" />
          </TresMesh>
        </TresGroup>

        <!-- THE OBJECT (Rotated by q) -->
        <TresMesh :quaternion="objectQuat">
          <TresBoxGeometry :args="[2, 0.2, 1.5]" />
          <TresMeshStandardMaterial
            color="#67e8f9"
            :metalness="0.5"
            :roughness="0.1"
            transparent
            :opacity="0.9"
          />
          <TresAxesHelper :args="[1.5]" />
        </TresMesh>

        <!-- GHOST OBJECT (Identity State) -->
        <TresMesh>
          <TresBoxGeometry :args="[2, 0.2, 1.5]" />
          <TresMeshBasicMaterial color="#333" wireframe />
        </TresMesh>
      </TresCanvas>

      <!-- Legend -->
      <div class="absolute bottom-6 left-6 text-xs font-mono text-gray-500 space-y-2 pointer-events-none">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-[#fcd34d] shadow-[0_0_8px_#fcd34d]" />
          <span class="text-[#fcd34d]">Rotation Axis (Eigenvector)</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-[#67e8f9] shadow-[0_0_8px_#67e8f9]" />
          <span class="text-[#67e8f9]">Resulting Orientation</span>
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

/* Custom Sliders */
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

.range-purple::-webkit-slider-thumb {
  background: #d8b4fe;
}
.range-yellow::-webkit-slider-thumb {
  background: #fcd34d;
}
</style>
