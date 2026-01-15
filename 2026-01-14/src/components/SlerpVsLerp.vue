<script setup lang="ts">
import { OrbitControls } from '@tresjs/cientos';
import { TresCanvas } from '@tresjs/core';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { nlerp, normalize, slerp } from '../utils/quaternion';

// --- Math Setup ---
const angle = 135 * (Math.PI / 180);
const axis = [0, 1, 0];
const startQ = [1, 0, 0, 0];
const endQ = [
  Math.cos(angle / 2),
  axis[0] * Math.sin(angle / 2),
  axis[1] * Math.sin(angle / 2),
  axis[2] * Math.sin(angle / 2),
];

// State
const progress = ref(0);
const isPlaying = ref(false);
const speed = ref(1);
let animationId: number | null = null;

// Derived Positions
function getPos(q: number[]) {
  const x = q[1]; const y = q[2]; const z = q[3]; const w = q[0];
  const vx = 0; const vy = 0; const vz = 1.5;
  const ix = w * vx + y * vz - z * vy;
  const iy = w * vy + z * vx - x * vz;
  const iz = w * vz + x * vy - y * vx;
  const iw = -x * vx - y * vy - z * vz;
  const rx = ix * w + iw * -x + iy * -z - iz * -y;
  const ry = iy * w + iw * -y + iz * -x - ix * -z;
  const rz = iz * w + iw * -z + ix * -y - iy * -x;
  return [rx, ry, rz];
}

const lerpPos = computed(() => getPos(nlerp(startQ, endQ, progress.value)));
const slerpPos = computed(() => getPos(slerp(startQ, endQ, progress.value)));

// Breadcrumbs
const breadcrumbsLerp = [];
const breadcrumbsSlerp = [];
for (let i = 1; i < 10; i++) {
  const t = i / 10;
  breadcrumbsLerp.push(getPos(nlerp(startQ, endQ, t)));
  breadcrumbsSlerp.push(getPos(slerp(startQ, endQ, t)));
}

// --- Velocity Graphing ---
const canvasRef = ref<HTMLCanvasElement>();
const currentLerpVel = ref(0);

function drawGraph() {
  if (!canvasRef.value)
    return;
  const ctx = canvasRef.value.getContext('2d');
  if (!ctx)
    return;

  const rect = canvasRef.value.getBoundingClientRect();
  const w = canvasRef.value.width = rect.width * 2;
  const h = canvasRef.value.height = rect.height * 2;
  ctx.scale(2, 2);
  const rw = w / 2; const rh = h / 2;

  // Padding
  const padTop = 15;
  const padBot = 15;
  const padX = 10;
  const graphH = rh - padTop - padBot;
  const graphW = rw - (padX * 2);

  ctx.clearRect(0, 0, rw, rh);

  // Background Grid
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padX, rh - padBot); ctx.lineTo(rw - padX, rh - padBot); // Baseline
  ctx.setLineDash([4, 4]);
  ctx.moveTo(padX, padTop); ctx.lineTo(rw - padX, padTop); // Max line
  ctx.stroke();
  ctx.setLineDash([]);

  // Generate Data & Find Max
  const steps = 100;
  const dataL = []; const dataS = [];
  let maxVel = 0;

  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const tNext = (i + 1) / (steps - 1);

    const p1 = getPos(nlerp(startQ, endQ, t));
    const p2 = getPos(nlerp(startQ, endQ, tNext));
    const distL = Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2 + (p1[2] - p2[2]) ** 2) * 1000;

    const s1 = getPos(slerp(startQ, endQ, t));
    const s2 = getPos(slerp(startQ, endQ, tNext));
    const distS = Math.sqrt((s1[0] - s2[0]) ** 2 + (s1[1] - s2[1]) ** 2 + (s1[2] - s2[2]) ** 2) * 1000;

    if (distL > maxVel)
      maxVel = distL;
    dataL.push(distL);
    dataS.push(distS);
  }

  maxVel = maxVel * 1.15; // Pad Max

  // Draw Lines Helper
  const drawLine = (data: number[], color: string) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    data.forEach((val, i) => {
      const x = padX + (i / steps) * graphW;
      const y = (rh - padBot) - (val / maxVel) * graphH;
      if (i === 0)
        ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  };

  drawLine(dataS, '#10b981'); // Green
  drawLine(dataL, '#ef4444'); // Red

  // Cursor
  const cx = padX + progress.value * graphW;
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.moveTo(cx, padTop);
  ctx.lineTo(cx, rh - padBot);
  ctx.stroke();
  ctx.globalAlpha = 1.0;

  // Metric
  const idx = Math.floor(progress.value * (steps - 1));
  currentLerpVel.value = dataL[idx] || 0;
}

// Animation
function animate() {
  if (!isPlaying.value)
    return;
  progress.value += 0.003 * speed.value;
  if (progress.value >= 1) {
    progress.value = 1;
    isPlaying.value = false;
  }
  drawGraph();
  animationId = requestAnimationFrame(animate);
}

function toggle() {
  isPlaying.value = !isPlaying.value;
  if (isPlaying.value) {
    if (progress.value >= 1)
      progress.value = 0;
    animate();
  }
  else if (animationId) {
    cancelAnimationFrame(animationId);
  }
}

const onResize = () => drawGraph();

onMounted(() => {
  drawGraph();
  window.addEventListener('resize', onResize);
});
onUnmounted(() => {
  if (animationId)
    cancelAnimationFrame(animationId);
  window.removeEventListener('resize', onResize);
});
</script>

<template>
  <div class="h-full flex flex-col gap-4">
    <!-- Header -->
    <div class="flex justify-between items-center h-12 shrink-0">
      <div>
        <h2 class="text-3xl font-bold leading-none">
          SLERP vs NLERP
        </h2>
        <div class="text-sm opacity-60">
          Visualizing Angular Velocity Variance
        </div>
      </div>
      <div class="flex items-center gap-4">
        <div class="text-xs font-mono text-gray-400">
          SPEED
        </div>
        <input v-model.number="speed" type="range" min="0.5" max="3" step="0.5" class="w-24 accent-blue-500 cursor-pointer">
        <button
          class="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition-all flex items-center gap-2"
          @click="toggle"
        >
          <div v-if="!isPlaying" class="i-ph-play-fill" />
          <div v-else class="i-ph-pause-fill" />
          {{ isPlaying ? 'PAUSE' : 'RACE' }}
        </button>
      </div>
    </div>

    <!-- 3D Comparison Row (Reduced height to h-60 to give text more room) -->
    <div class="flex gap-6 h-50  shrink-0">
      <!-- NLERP Panel -->
      <div class="flex-1 glass-panel rounded-xl border border-red-500/30 relative flex flex-col overflow-hidden">
        <div class="absolute top-3 left-4 z-10 pointer-events-none">
          <div class="text-red-400 font-bold text-lg">
            NLERP
          </div>
          <div class="text-xs text-red-200/60">
            Linear Interpolation + Normalize
          </div>
        </div>

        <!-- Speedometer -->
        <div class="absolute bottom-3 right-4 z-10 pointer-events-none text-right">
          <div class="text-[10px] text-gray-500 uppercase tracking-widest">
            Velocity
          </div>
          <div class="text-2xl font-mono text-white transition-colors duration-100" :class="currentLerpVel > 45 ? 'text-red-500 scale-110' : ''">
            {{ currentLerpVel.toFixed(0) }} <span class="text-xs opacity-50">deg/s</span>
          </div>
        </div>

        <div class="flex-1 bg-black/40">
          <TresCanvas clear-color="#050505" alpha>
            <TresPerspectiveCamera :position="[0, 5, 0]" :look-at="[0, 0, 0]" />
            <OrbitControls :enable-rotate="false" :enable-zoom="false" />
            <TresAmbientLight :intensity="1" />

            <TresMesh :rotation="[-Math.PI / 2, 0, 0]">
              <TresRingGeometry :args="[1.48, 1.5, 64]" />
              <TresMeshBasicMaterial color="#333" />
            </TresMesh>

            <TresMesh v-for="(pos, i) in breadcrumbsLerp" :key="i" :position="pos">
              <TresSphereGeometry :args="[0.03]" />
              <TresMeshBasicMaterial color="#552222" />
            </TresMesh>

            <TresMesh :position="lerpPos">
              <TresSphereGeometry :args="[0.12]" />
              <TresMeshBasicMaterial color="#ef4444" />
            </TresMesh>
          </TresCanvas>
        </div>
      </div>

      <!-- SLERP Panel -->
      <div class="flex-1 glass-panel rounded-xl border border-green-500/30 relative flex flex-col overflow-hidden">
        <div class="absolute top-3 left-4 z-10 pointer-events-none">
          <div class="text-green-400 font-bold text-lg">
            SLERP
          </div>
          <div class="text-xs text-green-200/60">
            Spherical Linear Interpolation
          </div>
        </div>

        <div class="absolute bottom-3 right-4 z-10 pointer-events-none text-right">
          <div class="text-[10px] text-gray-500 uppercase tracking-widest">
            Velocity
          </div>
          <div class="text-2xl font-mono text-green-400">
            32 <span class="text-xs opacity-50">deg/s</span>
          </div>
        </div>

        <div class="flex-1 bg-black/40">
          <TresCanvas clear-color="#050505" alpha>
            <TresPerspectiveCamera :position="[0, 5, 0]" :look-at="[0, 0, 0]" />
            <OrbitControls :enable-rotate="false" :enable-zoom="false" />
            <TresAmbientLight :intensity="1" />

            <TresMesh :rotation="[-Math.PI / 2, 0, 0]">
              <TresRingGeometry :args="[1.48, 1.5, 64]" />
              <TresMeshBasicMaterial color="#333" />
            </TresMesh>

            <TresMesh v-for="(pos, i) in breadcrumbsSlerp" :key="i" :position="pos">
              <TresSphereGeometry :args="[0.03]" />
              <TresMeshBasicMaterial color="#225522" />
            </TresMesh>

            <TresMesh :position="slerpPos">
              <TresSphereGeometry :args="[0.12]" />
              <TresMeshBasicMaterial color="#10b981" />
            </TresMesh>
          </TresCanvas>
        </div>
      </div>
    </div>

    <!-- Data Panel (Changed from h-40 to flex-1 to allow dynamic height) -->
    <div class="glass-panel rounded-xl border border-white/10 p-4 flex gap-6 flex-1 min-h-0">
      <div class="flex-1 relative bg-black/40 rounded border border-white/5 overflow-hidden">
        <div class="absolute top-2 left-3 text-[10px] font-bold uppercase text-gray-500 z-10 tracking-widest">
          Velocity Profile
        </div>
        <canvas ref="canvasRef" class="w-full h-full block" />
      </div>

      <div class="w-96 flex flex-col justify-center gap-1">
        <!-- Comparison Item -->
        <div>
          <div class="flex justify-between items-center mb-0">
            <span class="text-sm font-bold text-red-400">NLERP</span>
            <span class="text-xs text-red-400/70 border border-red-500/20 px-2 rounded">Variable</span>
          </div>
          <p class="text-xs text-gray-400 leading-snug !my-0">
            Shortcuts through the sphere's chord. Velocity peaks at 50% progress (midpoint acceleration), creating unnatural motion.
          </p>
        </div>

        <!-- Comparison Item -->
        <div>
          <div class="flex justify-between items-center">
            <span class="text-sm font-bold text-green-400">SLERP</span>
            <span class="text-xs text-green-400/70 border border-green-500/20 px-2 rounded">Constant</span>
          </div>
          <p class="text-xs text-gray-400 leading-snug !my-0">
            Calculates the exact great-circle arc. Maintains perfect angular velocity throughout the rotation.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glass-panel {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
}
</style>
