<script setup lang="ts">
import * as d3 from 'd3';
import { onMounted, ref } from 'vue';

const container = ref<HTMLElement | null>(null);

const CONFIG = {
  width: 600,
  height: 450,
  margin: { top: 20, right: 80, bottom: 50, left: 60 },
  xDomain: [1e17, 1e22],
  yDomain: [2.0, 6.2],
  numModels: 24,
  animationDuration: 2500,
};

// ... (Data Generation functions remain unchanged) ...
function generateData() {
  const models = [];
  for (let i = 0; i < CONFIG.numModels; i++) {
    const t = i / (CONFIG.numModels - 1);
    const modelSizeScalar = 75 * 10 ** (t * 2.5);
    const xShift = 10 ** (17 + (t * 1.5));
    const floor = 2.05 + (1 - t) * 1.0;
    const points = [];
    for (let e = 17; e <= 22; e += 0.1) {
      const x = 10 ** e;
      if (x > xShift) {
        const logX = Math.log10(x);
        const logShift = Math.log10(xShift);
        const delta = logX - logShift + 0.5;
        const y = floor + (3.5 / delta ** 1.5);
        if (y < 6.5 && y > 1.8)
          points.push({ x, y });
      }
    }
    models.push({ id: i, t, size: modelSizeScalar, points });
  }
  return models;
}

function generateFrontier(models: any[]) {
  const frontier = [];
  for (let e = 17.5; e <= 22; e += 0.1) {
    const x = 10 ** e;
    let minY = 100;
    models.forEach((m) => {
      const p = m.points.find((pt: any) => Math.abs(Math.log10(pt.x) - e) < 0.05);
      if (p && p.y < minY)
        minY = p.y;
    });
    if (minY < 10)
      frontier.push({ x, y: minY });
  }
  return frontier;
}

onMounted(() => {
  if (!container.value)
    return;

  const width = CONFIG.width - CONFIG.margin.left - CONFIG.margin.right;
  const height = CONFIG.height - CONFIG.margin.top - CONFIG.margin.bottom;

  // 1. Setup SVG (Static)
  const svg = d3.select(container.value)
    .append('svg')
    .attr('viewBox', `0 0 ${CONFIG.width} ${CONFIG.height}`)
    .style('max-width', '100%')
    .style('height', 'auto')
    .style('font-family', 'ui-sans-serif, system-ui, sans-serif');

  const g = svg.append('g')
    .attr('transform', `translate(${CONFIG.margin.left},${CONFIG.margin.top})`);

  // Scales & Axes
  const x = d3.scaleLog().domain(CONFIG.xDomain).range([0, width]);
  const y = d3.scaleLinear().domain(CONFIG.yDomain).range([height, 0]);
  const color = d3.scaleSequential(d3.interpolatePlasma).domain([0, 1]);

  const toSuperscript = (num: number) => {
    const map: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
    return num.toString().split('').map(c => map[c] || c).join('');
  };
  const formatPower = (d: number) => `10${toSuperscript(Math.round(Math.log10(d)))}`;

  // Draw Static Axes
  g.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x).ticks(5, formatPower).tickSize(5)).style('color', '#888').call(g => g.select('.domain').attr('stroke', '#444'));
  g.append('g').call(d3.axisLeft(y).ticks(5)).style('color', '#888').call(g => g.select('.domain').attr('stroke', '#444'));

  // Draw Labels
  svg.append('text').attr('x', CONFIG.width / 2).attr('y', CONFIG.height - 10).attr('text-anchor', 'middle').style('fill', '#fff').text('FLOPS');
  svg.append('text').attr('transform', 'rotate(-90)').attr('x', -CONFIG.height / 2).attr('y', 20).attr('text-anchor', 'middle').style('fill', '#fff').text('Training loss');

  // Prepare Data
  const models = generateData();
  const frontier = generateFrontier(models);
  const line = d3.line<{ x: number; y: number }>().x(d => x(d.x)).y(d => y(d.y)).curve(d3.curveBasis);

  // Prepare Paths (Hidden state)
  const paths = g.selectAll('.model-line')
    .data(models)
    .enter()
    .append('path')
    .attr('fill', 'none')
    .attr('stroke', d => color(d.t * 0.9))
    .attr('stroke-width', 2.5)
    .attr('d', d => line(d.points));

  // Initialize paths to "hidden" via dasharray
  paths.each(function () {
    const length = (this as SVGPathElement).getTotalLength();
    d3.select(this)
      .attr('stroke-dasharray', length)
      .attr('stroke-dashoffset', length);
  });

  // Prepare Frontier
  const clipId = `frontier-clip-${Math.random().toString(36).substr(2, 9)}`;
  const clipRect = g.append('defs').append('clipPath').attr('id', clipId).append('rect').attr('width', 0).attr('height', height).attr('x', 0).attr('y', 0);

  g.append('path').datum(frontier).attr('fill', 'none').attr('stroke', 'gray').attr('stroke-width', 5).attr('stroke-dasharray', '5,5').attr('opacity', 0.8).attr('d', line).attr('clip-path', `url(#${clipId})`);

  // Prepare Legend
  const legendG = g.append('g').attr('transform', `translate(${width + 20}, 20)`).attr('opacity', 0);
  const defs = svg.select('defs');
  const gradient = defs.append('linearGradient').attr('id', 'param-gradient').attr('x1', '0%').attr('y1', '100%').attr('x2', '0%').attr('y2', '0%');
  for (let i = 0; i <= 10; i++) gradient.append('stop').attr('offset', `${i * 10}%`).attr('stop-color', color((i / 10) * 0.9));
  legendG.append('rect').attr('width', 15).attr('height', 150).style('fill', 'url(#param-gradient)');
  const legendScale = d3.scaleLinear().domain([0, 1]).range([150, 0]);
  const labels = [{ t: 1.0, label: '10B' }, { t: 0.75, label: '5B' }, { t: 0.5, label: '1B' }, { t: 0.25, label: '250M' }, { t: 0.0, label: '75M' }];
  labels.forEach(l => legendG.append('text').attr('x', 20).attr('y', legendScale(l.t)).attr('dy', '0.32em').style('fill', '#ccc').style('font-size', '10px').text(l.label));
  legendG.append('text').attr('transform', 'rotate(-90)').attr('x', -75).attr('y', 45).attr('text-anchor', 'middle').style('fill', '#ccc').style('font-size', '12px').text('Parameters');

  // --- Visibility Check Logic ---
  let animated = false;

  const playAnimation = () => {
    if (animated)
      return;
    animated = true;

    // 1. Animate Curves
    paths.transition().duration(CONFIG.animationDuration).ease(d3.easeCubicOut).delay((d, i) => i * 30).attr('stroke-dashoffset', 0);

    // 2. Animate Frontier
    clipRect.transition().duration(CONFIG.animationDuration).ease(d3.easeLinear).attr('width', width);

    // 3. Fade in Legend
    legendG.transition().delay(500).duration(1000).attr('opacity', 1);
  };

  const waitForVisibility = () => {
    if (!container.value)
      return;

    // Slidev adds 'slidev-vclick-hidden' class to elements waiting to be clicked
    const isHidden = container.value.classList.contains('slidev-vclick-hidden');

    if (!isHidden) {
      playAnimation();
    }
    else {
      // If still hidden, keep polling
      requestAnimationFrame(waitForVisibility);
    }
  };

  // Start polling
  waitForVisibility();
});
</script>

<template>
  <div ref="container" class="scaling-graph-container">
    <!-- SVG injected by D3 -->
  </div>
</template>

<style scoped>
.scaling-graph-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
}
</style>
