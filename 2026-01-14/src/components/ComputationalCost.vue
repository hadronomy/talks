<script setup lang="ts">
import { OrbitControls } from '@tresjs/cientos';
import { TresCanvas } from '@tresjs/core';
import * as THREE from 'three';
import { onUnmounted, ref, shallowRef } from 'vue';

// State
const iterations = ref(0);
const maxIterations = 3000;
const isRunning = ref(false);

// Metrics
const matrixDet = ref(1); // Determinant (Volume) - should be 1
const qDet = ref(1); // Quaternion equivalent volume
const matrixSkew = ref(0);

// THREE References for direct manipulation
const matrixMesh = shallowRef<THREE.Mesh | null>(null);
const quatMesh = shallowRef<THREE.Mesh | null>(null);

let animationId: number | null = null;

// Mathematical State
// We use THREE.Matrix4/Quaternion for easier math, but manage the drift manually
const matState = new THREE.Matrix4();
const qState = new THREE.Quaternion();

// Simulation Constants
// We create a "dirty" rotation matrix that represents floating point error accumulation
// It rotates, but also slightly scales (1.001) and slightly shears
const errorAxis = new THREE.Vector3(1, 1, 0).normalize();
const pureRot = new THREE.Matrix4().makeRotationAxis(errorAxis, 0.05);

// The "Drifted" transform: Rotate + tiny scale error + tiny shear error
// This simulates what happens after thousands of ops with 32-bit floats
const badRot = pureRot.clone();
const el = badRot.elements;
el[0] *= 1.001; // Drift scale X
el[5] *= 0.9995; // Drift scale Y (uneven scaling causes squashing)
el[1] += 0.0005; // Shear XY

// The "Pure" Quaternion rotation
const pureQ = new THREE.Quaternion().setFromAxisAngle(errorAxis, 0.05);

function simulate() {
  if (!isRunning.value || !matrixMesh.value || !quatMesh.value)
    return;

  // 1. Matrix Path: Accumulate Error
  // We multiply the current matrix by the "bad" rotation repeatedly
  matState.multiply(badRot);

  // Apply to Mesh directly to show deformation
  matrixMesh.value.matrix.copy(matState);
  matrixMesh.value.matrixWorldNeedsUpdate = true;

  // Calculate Visual Metrics
  const det = matState.determinant();
  matrixDet.value = det;
  // Simple skew metric: how far is the determinant from 1?
  matrixSkew.value = Math.abs(1 - det);

  // 2. Quaternion Path: Stable
  // Rotate
  qState.multiply(pureQ);
  // NORMALIZE (The cheap fix)
  qState.normalize();

  // Update Mesh
  const qMat = new THREE.Matrix4().makeRotationFromQuaternion(qState);
  quatMesh.value.matrix.copy(qMat);
  quatMesh.value.matrixWorldNeedsUpdate = true;

  qDet.value = 1.0; // Quaternions preserve volume by definition when normalized

  iterations.value++;

  if (iterations.value < maxIterations && matrixSkew.value < 2.0) {
    animationId = requestAnimationFrame(simulate);
  }
  else {
    isRunning.value = false;
  }
}

function toggleSim() {
  if (isRunning.value) {
    isRunning.value = false;
    if (animationId)
      cancelAnimationFrame(animationId);
  }
  else {
    // Reset if we are restarting or crashed
    if (iterations.value > 0) {
      iterations.value = 0;
      matState.identity();
      qState.identity();
      matrixSkew.value = 0;
      matrixDet.value = 1;

      // Reset meshes
      if (matrixMesh.value) {
        matrixMesh.value.matrix.identity();
        matrixMesh.value.matrixWorldNeedsUpdate = true;
      }
      if (quatMesh.value) {
        quatMesh.value.matrix.identity();
        quatMesh.value.matrixWorldNeedsUpdate = true;
      }
    }
    isRunning.value = true;
    simulate();
  }
}

onUnmounted(() => {
  if (animationId)
    cancelAnimationFrame(animationId);
});
</script>

<template>
  <div class="h-full flex flex-col gap-3">
    <!-- Header -->
    <div class="flex justify-between items-center h-12 shrink-0">
      <div>
        <h2 class="text-3xl font-bold leading-none">
          Computational Decay
        </h2>
        <span class="text-sm opacity-60">Visualizing the loss of geometric integrity</span>
      </div>
      <button
        class="px-5 py-2 rounded-lg font-bold transition-all text-sm uppercase tracking-wider"
        :class="isRunning ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-teal-500/20 text-teal-400 border border-teal-500/50'"
        @click="toggleSim"
      >
        {{ isRunning ? 'Stop Breakdown' : (iterations > 0 ? 'Reset & Run' : 'Simulate Decay') }}
      </button>
    </div>

    <!-- Visualizers Row -->
    <div class="flex gap-4 h-52 shrink-0">
      <!-- Matrix Box (The Failure) -->
      <div class="flex-1 glass-panel rounded-lg overflow-hidden relative border border-white/10 flex flex-col">
        <div class="absolute top-3 left-4 z-10">
          <div class="text-red-400 font-bold">
            Rotation Matrix
          </div>
          <div class="text-[10px] text-gray-400">
            9 Floats (Unconstrained)
          </div>
        </div>

        <!-- Warning Label -->
        <div v-if="matrixSkew > 0.3" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <div class="bg-red-500/90 text-white font-black text-xl px-4 py-2 rounded rotate-[-15deg] border-2 border-white shadow-xl">
            DESTRUCTIVE<br>SHEAR
          </div>
        </div>

        <div class="flex-1 relative bg-black/40">
          <TresCanvas clear-color="#080808" alpha>
            <TresPerspectiveCamera :position="[3, 3, 3]" :look-at="[0, 0, 0]" />
            <OrbitControls />
            <TresAmbientLight :intensity="1" />
            <TresDirectionalLight :position="[3, 3, 3]" />

            <!-- IMPORTANT: matrix-auto-update="false" lets us manually crush this cube -->
            <TresMesh ref="matrixMesh" :matrix-auto-update="false">
              <TresBoxGeometry :args="[1.2, 1.2, 1.2]" />
              <!-- Color shifts to red as volume dies -->
              <TresMeshBasicMaterial
                :color="`rgb(255, ${Math.max(50, 255 - matrixSkew * 1500)}, ${Math.max(50, 255 - matrixSkew * 1500)})`"
                wireframe
              />
              <TresAxesHelper :args="[1.5]" />
            </TresMesh>
          </TresCanvas>
        </div>
        <div class="px-4 py-2 bg-black/20 border-t border-white/5 flex justify-between items-center">
          <div class="flex flex-col">
            <span class="text-[10px] uppercase text-gray-500">Volume (Determinant)</span>
            <span class="text-[9px] text-gray-600">Target: 1.00</span>
          </div>
          <span class="font-mono text-xl" :class="matrixSkew > 0.1 ? 'text-red-500 font-bold' : 'text-gray-300'">
            {{ matrixDet.toFixed(3) }}
          </span>
        </div>
      </div>

      <!-- Quaternion Box (The Solution) -->
      <div class="flex-1 glass-panel rounded-lg overflow-hidden relative border border-white/10 flex flex-col">
        <div class="absolute top-3 left-4 z-10">
          <div class="text-teal-400 font-bold">
            Quaternion
          </div>
          <div class="text-[10px] text-gray-400">
            4 Floats (Normalized)
          </div>
        </div>
        <div class="flex-1 relative bg-black/40">
          <TresCanvas clear-color="#080808" alpha>
            <TresPerspectiveCamera :position="[3, 3, 3]" :look-at="[0, 0, 0]" />
            <OrbitControls />
            <TresAmbientLight :intensity="1" />
            <TresDirectionalLight :position="[3, 3, 3]" />

            <TresMesh ref="quatMesh" :matrix-auto-update="false">
              <TresBoxGeometry :args="[1.2, 1.2, 1.2]" />
              <TresMeshBasicMaterial color="#2dd4bf" wireframe />
              <TresAxesHelper :args="[1.5]" />
            </TresMesh>
          </TresCanvas>
        </div>
        <div class="px-4 py-2 bg-black/20 border-t border-white/5 flex justify-between items-center">
          <div class="flex flex-col">
            <span class="text-[10px] uppercase text-gray-500">Volume (Determinant)</span>
            <span class="text-[9px] text-gray-600">Preserved via normalization</span>
          </div>
          <span class="font-mono text-xl text-teal-400 font-bold">
            {{ qDet.toFixed(3) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Explanation Panel -->
    <div class="flex-1 glass-panel rounded-lg border border-white/10 p-5 flex flex-col justify-center">
      <div class="grid grid-cols-3 gap-8">
        <div class="flex flex-col gap-2">
          <div class="text-xs uppercase text-gray-400 font-bold tracking-widest">
            The Problem
          </div>
          <p class="text-sm opacity-80">
            Rotation matrices accumulate floating point errors in 9 separate values. The axes stop being 90° apart (Shear) and change length (Scale).
          </p>
          <div class="text-xs text-red-400 mt-1">
            Result: The geometry is crushed.
          </div>
        </div>

        <div class="flex flex-col gap-2 border-l border-white/10 pl-8">
          <div class="text-xs uppercase text-gray-400 font-bold tracking-widest">
            The Fix
          </div>
          <p class="text-sm opacity-80">
            Quaternions only have 4 values. Drift creates scale error, but <span class="text-teal-400 font-mono">normalize(q)</span> costs only 4 multiplications.
          </p>
          <div class="text-xs text-green-400 mt-1">
            Result: Perfect rotation forever.
          </div>
        </div>

        <div class="flex flex-col justify-center items-center gap-1 border-l border-white/10 pl-8">
          <div class="text-5xl font-bold text-white mb-[-5px]">
            1.5<span class="text-2xl text-gray-500">x</span>
          </div>
          <div class="text-xs uppercase text-gray-500">
            Performance Gain
          </div>
          <div class="text-[10px] opacity-50">
            In physics engines
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glass-panel {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(5px);
}
</style>
