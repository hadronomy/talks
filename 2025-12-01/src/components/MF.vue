<script setup lang="ts">
import * as d3 from 'd3';
import { onMounted, ref } from 'vue';

const container = ref<HTMLElement | null>(null);

const CONFIG = {
  width: 950,
  height: 350,
  cellSize: 20,
  gap: 3,
  users: 6,
  items: 6,
  factors: 3,
  colors: d3.interpolateGnBu,
};

function generateData() {
  const P = Array.from({ length: CONFIG.users }, () =>
    Array.from({ length: CONFIG.factors }, () => Math.random()));
  const Q = Array.from({ length: CONFIG.factors }, () =>
    Array.from({ length: CONFIG.items }, () => Math.random()));
  const R_full = P.map(row =>
    Q[0].map((_, j) => row.reduce((sum, elm, k) => sum + elm * Q[k][j], 0)),
  );
  const R_sparse = R_full.map(row =>
    row.map(val => Math.random() > 0.6 ? val : null),
  );
  return { P, Q, R_full, R_sparse };
}

const { P, Q, R_full, R_sparse } = generateData();

onMounted(() => {
  if (!container.value)
    return;

  const svg = d3.select(container.value)
    .append('svg')
    .attr('viewBox', `0 0 ${CONFIG.width} ${CONFIG.height}`)
    .style('max-width', '100%')
    .style('font-family', 'ui-sans-serif, system-ui, sans-serif');

  const g = svg.append('g');

  // --- 1. Layout Calculations ---
  const getDim = (count: number) => count * (CONFIG.cellSize + CONFIG.gap) - CONFIG.gap;
  const extraColW = CONFIG.cellSize + CONFIG.gap;

  const wR = getDim(CONFIG.items);
  const hR = getDim(CONFIG.users);
  const wP = getDim(CONFIG.factors);
  const wQ = getDim(CONFIG.items);
  const wHat = getDim(CONFIG.items);

  const arrowGap = 60;
  const multGap = 40;

  const totalWidth = wR + arrowGap + wP + multGap + (wQ + extraColW) + arrowGap + (wHat + extraColW);
  const startX = (CONFIG.width - totalWidth) / 2;
  const centerY = (CONFIG.height - 50) / 2;

  const yBase = centerY - (hR / 2);
  const yQ = centerY - (getDim(CONFIG.factors) / 2);

  const xR = startX;
  const xP = xR + wR + arrowGap;
  const xQ = xP + wP + multGap;
  const xHat = xQ + wQ + arrowGap + extraColW;

  // --- 2. Helper: Draw Matrix ---
  const drawMatrix = (data: (number | null)[][], x: number, y: number, label: string, id: string) => {
    const group = g.append('g')
      .attr('id', id)
      .attr('transform', `translate(${x}, ${y})`);

    // Label
    group.append('text')
      .attr('x', getDim(data[0].length) / 2)
      .attr('y', -15)
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('opacity', 0)
      .attr('class', 'matrix-label')
      .text(label);

    // Cells
    data.forEach((row, i) => {
      row.forEach((val, j) => {
        group.append('rect')
          .attr('x', j * (CONFIG.cellSize + CONFIG.gap))
          .attr('y', i * (CONFIG.cellSize + CONFIG.gap))
          .attr('width', CONFIG.cellSize)
          .attr('height', CONFIG.cellSize)
          .attr('rx', 2)
          .attr('fill', val === null ? '#333' : CONFIG.colors(val))
          .attr('stroke', val === null ? '#555' : 'none')
          .attr('class', `cell-${i}-${j}`)
          .attr('transform', `scale(0)`)
          .attr('transform-origin', `${j * (CONFIG.cellSize + CONFIG.gap) + 10}px ${i * (CONFIG.cellSize + CONFIG.gap) + 10}px`);
      });
    });

    if (label.includes('(R)')) {
      group.append('text').attr('transform', 'rotate(-90)').attr('x', -hR / 2).attr('y', -15).attr('text-anchor', 'middle').attr('fill', '#888').style('font-size', '9px').attr('opacity', 0).attr('class', 'axis-label').text('USERS');
      group.append('text').attr('x', wR / 2).attr('y', hR + 15).attr('text-anchor', 'middle').attr('fill', '#888').style('font-size', '9px').attr('opacity', 0).attr('class', 'axis-label').text('ITEMS');
    }
    return group;
  };

  // --- 3. Draw Elements ---
  const gR = drawMatrix(R_sparse, xR, yBase, 'Input (R)', 'gR');
  const gP = drawMatrix(P, xP, yBase, 'P (User Factors)', 'gP');
  const gQ = drawMatrix(Q, xQ, yQ, 'Q (Item Factors)', 'gQ');
  const gRHat = drawMatrix(R_full, xHat, yBase, 'Prediction (R̂)', 'gRHat');

  gRHat.selectAll('rect').attr('fill', '#222').attr('stroke', '#444');

  const sign = g.append('text')
    .attr('x', xP + wP + multGap / 2)
    .attr('y', centerY + 3)
    .attr('text-anchor', 'middle')
    .attr('fill', '#fff')
    .attr('font-size', '24px')
    .attr('opacity', 0)
    .text('×');

  svg.append('defs').append('marker').attr('id', 'arrowhead-h').attr('viewBox', '0 -5 10 10').attr('refX', 8).attr('refY', 0).attr('markerWidth', 6).attr('markerHeight', 6).attr('orient', 'auto').append('path').attr('d', 'M0,-5L10,0L0,5').attr('fill', '#888');

  const createArrow = (x1: number, x2: number) => {
    return g.append('line')
      .attr('x1', x1)
      .attr('y1', centerY)
      .attr('x2', x2)
      .attr('y2', centerY)
      .attr('stroke', '#888')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrowhead-h)');
  };

  const arrow1 = createArrow(xR + wR + 5, xP - 10);
  const arrow2 = createArrow(xQ + wQ + 5, xHat - 10);

  [arrow1, arrow2].forEach((a) => {
    const len = (a.node() as SVGLineElement).getTotalLength();
    a.attr('stroke-dasharray', len).attr('stroke-dashoffset', len).attr('opacity', 0);
  });

  // --- 4. Animation Logic ---
  let animated = false;

  const animateFloodFill = (group: d3.Selection<SVGGElement, unknown, null, undefined>, delay = 0) => {
    group.select('.matrix-label').transition().delay(delay).duration(500).attr('opacity', 1);
    group.selectAll('.axis-label').transition().delay(delay).duration(500).attr('opacity', 1);

    group.selectAll('rect')
      .transition()
      .delay((d, i, n) => {
        const el = n[i] as SVGRectElement;
        const cls = d3.select(el).attr('class');
        const match = cls.match(/cell-(\d+)-(\d+)/);
        const r = match ? match[1] : '0';
        const c = match ? match[2] : '0';
        return delay + (Number.parseInt(r) + Number.parseInt(c)) * 50;
      })
      .duration(400)
      .ease(d3.easeBackOut)
      .attr('transform', 'scale(1)');
  };

  const animateArrow = (arrow: d3.Selection<SVGLineElement, unknown, null, undefined>) => {
    arrow.attr('opacity', 1)
      .transition()
      .duration(600)
      .ease(d3.easeCubicOut)
      .attr('stroke-dashoffset', 0);
  };

  const playAnimation = async () => {
    if (animated)
      return;
    animated = true;

    // Phase 1: Reveal Input
    animateFloodFill(gR, 0);
    await new Promise(r => setTimeout(r, 1000));

    // Phase 2: Decomposition
    animateArrow(arrow1);
    await new Promise(r => setTimeout(r, 400));

    animateFloodFill(gP, 0);
    animateFloodFill(gQ, 200);
    sign.transition().delay(400).duration(500).attr('opacity', 1);

    await new Promise(r => setTimeout(r, 1200));

    // Phase 3: Reveal Result Grid (Empty)
    animateArrow(arrow2);
    await new Promise(r => setTimeout(r, 400));
    animateFloodFill(gRHat, 0);

    await new Promise(r => setTimeout(r, 800));

    // Phase 4: Compute Fill Animation
    const highlightColor = '#f43f5e';

    // LOOP OVER EVERY USER (ROW)
    for (let u = 0; u < CONFIG.users; u++) {
      const pRow = gP.selectAll(`.cell-${u}-0, .cell-${u}-1, .cell-${u}-2`);

      // Highlight current Row P
      pRow.transition().duration(100).attr('fill', highlightColor).attr('stroke', '#fff');

      // LOOP OVER EVERY ITEM (COL)
      for (let i = 0; i < CONFIG.items; i++) {
        // Slow speed for the first few cells of the first row to demonstrate logic
        // Fast for the rest
        const speed = (u === 0 && i < 3) ? 300 : 15;

        // Only highlight Q column during the slow demonstration phase
        const qCol = gQ.selectAll(`.cell-0-${i}, .cell-1-${i}, .cell-2-${i}`);
        if (speed > 100) {
          qCol.transition().duration(100).attr('fill', highlightColor).attr('stroke', '#fff');
        }

        // Fill Result Cell
        const targetCell = gRHat.select(`.cell-${u}-${i}`);
        targetCell.transition().duration(speed).attr('fill', CONFIG.colors(R_full[u][i])).attr('stroke', 'none');

        await new Promise(r => setTimeout(r, speed));

        // Un-highlight Q column immediately if slow
        if (speed > 100) {
          qCol.transition().duration(100).attr('stroke', 'none').attr('fill', (d, idx) => CONFIG.colors(Q[idx][i]));
        }
      }

      // Un-highlight Row P after row is done
      pRow.transition().duration(100).attr('stroke', 'none').attr('fill', (d, idx) => CONFIG.colors(P[u][idx]));
    }

    // Phase 5: The "New Item" Problem
    await new Promise(r => setTimeout(r, 800));

    const alertText = svg.append('text')
      .attr('x', CONFIG.width / 2)
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .attr('fill', '#fb923c')
      .attr('font-size', '20px')
      .attr('font-weight', 'bold')
      .attr('opacity', 0)
      .text('⚠️ New Item Added to Catalog');

    alertText.transition().duration(500).attr('y', 60).attr('opacity', 1);

    const newColIdx = CONFIG.items;
    const qXPos = newColIdx * (CONFIG.cellSize + CONFIG.gap);

    // Add new col to Q
    for (let f = 0; f < CONFIG.factors; f++) {
      gQ.append('rect')
        .attr('x', qXPos)
        .attr('y', f * (CONFIG.cellSize + CONFIG.gap))
        .attr('width', CONFIG.cellSize)
        .attr('height', CONFIG.cellSize)
        .attr('rx', 2)
        .attr('fill', '#fb923c')
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .attr('transform', 'scale(0)')
        .attr('transform-origin', `${qXPos + 10}px ${f * (CONFIG.cellSize + CONFIG.gap) + 10}px`)
        .transition()
        .delay(f * 100)
        .duration(400)
        .ease(d3.easeBackOut)
        .attr('transform', 'scale(1)');
    }

    // Add empty col to R_hat
    for (let u = 0; u < CONFIG.users; u++) {
      gRHat.append('rect')
        .attr('x', qXPos)
        .attr('y', u * (CONFIG.cellSize + CONFIG.gap))
        .attr('width', CONFIG.cellSize)
        .attr('height', CONFIG.cellSize)
        .attr('rx', 2)
        .attr('fill', '#222')
        .attr('stroke', '#ef4444')
        .attr('stroke-width', 1)
        .attr('transform', 'scale(0)')
        .attr('transform-origin', `${qXPos + 10}px ${u * (CONFIG.cellSize + CONFIG.gap) + 10}px`)
        .transition()
        .delay(u * 50 + 300)
        .duration(400)
        .ease(d3.easeBackOut)
        .attr('transform', 'scale(1)');
    }

    await new Promise(r => setTimeout(r, 1500));

    // Phase 6: Retraining Visual
    alertText.transition().duration(500).attr('opacity', 0);

    // Explicitly set start values for cleaner transition
    [gP, gQ, gRHat].forEach((g) => {
      g.style('filter', 'grayscale(0%)').attr('opacity', 1).transition().duration(1000).style('filter', 'grayscale(100%)').attr('opacity', 0.4);
    });

    const barW = 400;
    const barH = 20;
    const barX = (CONFIG.width - barW) / 2;
    const barY = CONFIG.height - 40;
    const statusGroup = svg.append('g').attr('opacity', 0);

    statusGroup.append('text')
      .attr('x', CONFIG.width / 2)
      .attr('y', barY - 15)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ef4444')
      .attr('font-weight', 'bold')
      .text('MODEL OUTDATED: RETRAINING...');

    statusGroup.append('rect').attr('x', barX).attr('y', barY).attr('width', barW).attr('height', barH).attr('rx', 10).attr('fill', '#333');
    const progress = statusGroup.append('rect').attr('x', barX).attr('y', barY).attr('width', 0).attr('height', barH).attr('rx', 10).attr('fill', '#ef4444');

    statusGroup.transition().delay(500).duration(500).attr('opacity', 1);
    progress.transition().delay(1000).duration(4000).ease(d3.easeLinear).attr('width', barW);

    const loadingText = statusGroup.select('text');
    (function repeat() {
      loadingText.transition().duration(800).attr('opacity', 0.5).transition().duration(800).attr('opacity', 1).on('end', repeat);
    })();
  };

  const waitForVisibility = () => {
    if (!container.value)
      return;
    const isHidden = container.value.classList.contains('slidev-vclick-hidden');
    if (!isHidden)
      playAnimation();
    else requestAnimationFrame(waitForVisibility);
  };

  waitForVisibility();
});
</script>

<template>
  <div ref="container" class="mf-container">
    <!-- SVG injected here -->
  </div>
</template>

<style scoped>
.mf-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
