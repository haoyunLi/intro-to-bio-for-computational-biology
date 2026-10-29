import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const M = require('../singlecell-spatial-math.js');
let checks = 0;
const equal = (a, b, label = '') => { checks++; assert.deepEqual(a, b, label); };
const near = (a, b, label = '', tolerance = 1e-9) => { checks++; assert.ok(Number.isFinite(a) && Math.abs(a - b) <= tolerance, `${label}: ${a} != ${b}`); };
const sum = values => values.reduce((a, b) => a + b, 0);

// Independent fixed-mixture arithmetic: 80% of [800,200,0] plus
// 200 ambient counts in proportions [0.05,0.15,0.8].
equal(M.ambient(.2).observed, [650, 190, 160], 'observed synthetic counts');
equal(M.ambient(.2).corrected, [800, 200, 0], 'correct mixing fraction');
equal(M.ambient(.5).raw, [1250, 230, -480], 'overcorrection before clipping');
near(M.ambient(.5).corrected[0], 1000 * 625 / 740, 'renormalized profile, not retained molecules');
for (let i = 0; i <= 16; i++) {
  const rho = i / 20, r = M.ambient(rho);
  near(sum(r.observed), 1000, 'fixed observed library');
  near(sum(r.raw), 1000, 'unclipped fixed-scale profile');
  near(sum(r.corrected), 1000, 'clipped fixed-scale profile');
  equal(r.negatives, rho > .2 ? 1 : 0, 'negative residual indicator');
  const expectedError = rho <= .2 ? 2 * (160 - 800 * rho) / (1 - rho) : 2 * (1000 * (650 - 50 * rho) / (840 - 200 * rho) - 800);
  near(r.error, expectedError, 'L1 error against known toy truth');
}

// Hand-counted graph fixtures: two disconnected squares; then two bridging
// edges; finally the complete graph without self edges.
const local = M.graph('radius', 1.1, 2, .5, 0);
equal(local.edges.length, 8); equal(local.cross, 0); near(local.moran, 1);
const bridge = M.graph('radius', 2.1, 2, .5, 1);
equal(bridge.edges.length, 14); equal(bridge.cross, 2);
equal(bridge.values, [0, 1.25, 0, 1.25, 8.75, 10, 8.75, 10]);
near(bridge.contrast, 8.75); near(bridge.moran, 58 / 75);
const isolated = M.graph('radius', .5, 2, .5, 4);
equal(isolated.isolates, 8); equal(isolated.moran, null);
equal(isolated.values, [0, 0, 0, 0, 10, 10, 10, 10]);
const complete = M.graph('radius', 5, 2, 1, 1);
equal(complete.edges.length, 28); near(complete.contrast, -10 / 7);
near(complete.moran, -1 / 7, 'complete graph Moran statistic');
equal(M.graph('radius', 5, 2, 7 / 8, 1).moran, null, 'constant values have undefined Moran statistic');
for (const mode of ['radius', 'knn']) for (const radius of [.5, 1, 1.5, 2, 2.5, 3, 4.5]) for (const k of [1, 2, 3, 4, 7]) for (const alpha of [0, .25, .5, .75, 1]) {
  const r = M.graph(mode, radius, k, alpha, 6);
  for (let i = 0; i < 8; i++) {
    equal(r.A[i][i], 0, 'no self edges');
    near(sum(r.W[i]), r.degree[i] ? 1 : 0, 'row standardization');
    for (let j = 0; j < 8; j++) equal(r.A[i][j], r.A[j][i], 'union-symmetrized graph');
    assert.ok(r.values[i] >= -1e-9 && r.values[i] <= 10 + 1e-9); checks++;
  }
  const initial = r.degree.slice(4).reduce((s, d) => s + 10 * d, 0);
  // Ordinary count totals need not be conserved by row-stochastic smoothing.
  near(sum(r.values.map((x, i) => x * r.degree[i])), initial, 'degree-weighted stationary sum');
}

// A balanced layout preserves a true type gap; full confounding makes
// batch-mean subtraction erase the total observed gap.
for (const shift of [0, 2, 4, 8]) for (const strength of [0, .25, .5, .75, 1]) {
  const b = M.integration('balanced', shift, strength);
  near(b.beforeGap, 4); near(b.afterGap, 4); near(b.batchGap, (1 - strength) * shift);
  equal(b.identifiable, true);
  const c = M.integration('confounded', shift, strength);
  near(c.beforeGap, 4 + shift); near(c.afterGap, (4 + shift) * (1 - strength));
  equal(c.identifiable, false);
}

// The two signature columns have eigenvalues 10 and contrast. The exact
// constrained optimum is clip(0.65 + perturbation/contrast, 0, 1).
for (const contrast of [.2, .5, 1, 2, 4, 6, 8, 10]) for (const noise of [-1, -.1, 0, .1, 1]) {
  const r = M.deconvolution(contrast, noise);
  const fitted = Math.max(0, Math.min(1, .65 + noise / contrast));
  near(r.fitted, fitted); near(sum(r.A), 10); near(sum(r.B), 10); near(sum(r.y), 10);
  near(r.condition, 10 / contrast, '2-norm condition in allowed contrast domain');
  near(r.bestLoss, 2 * (contrast * (fitted - .65) - noise) ** 2, 'exact residual loss');
  assert.ok(r.range[0] >= 0 && r.range[1] <= 1 && r.range[0] <= r.range[1]); checks++;
}
equal(M.deconvolution(6, 0).range, [.62, .68], 'discrete loss-tolerance range, not confidence interval');
equal(M.deconvolution(0, 0).fitted, null, 'non-identifiable mixture');
equal(M.deconvolution(0, 0).range, [0, 1]);
near(M.deconvolution(0, .3).bestLoss, .18);

// The third type alone expands. A/B log-ratio is unchanged unless capture
// selectively alters A; each paired donor then changes by log2(capture).
for (const expansion of [1, 2, 3, 4, 5]) for (const capture of [.25, .5, .75, 1]) {
  const r = M.abundance(expansion, capture);
  near(r.absoluteDelta, 0); near(r.ratioDelta, Math.log2(capture));
  for (const delta of r.deltas) near(delta.logratio, Math.log2(capture));
  if (capture === 1) near(r.fractionDelta, 1 / (expansion + 2) - 1 / 3);
  for (let i = 0; i < 3; i++) equal(r.rows[i * 2].absolute[0], r.rows[i * 2 + 1].absolute[0]);
}
near(M.abundance(3, 1).fractionDelta, -2 / 15);

// Exact one-nearest-neighbor predictions on an integer coordinate line.
near(M.validation('interleaved').mae, 1);
for (let buffer = 0; buffer <= 5; buffer++) {
  const r = M.validation('block', buffer, 4);
  equal(r.train.length, 6 - buffer); equal(r.test.length, 6);
  near(r.mae, 3.5 + buffer); near(r.distance, 3.5 + buffer);
  equal(r.test.map(x => x.neighbor), Array(6).fill(5 - buffer));
}
for (const shift of [0, 2, 4, 8]) {
  const r = M.validation('donor', 0, shift);
  near(r.mae, shift); near(r.distance, 0);
  equal(new Set(r.train.map(x => x.donor)), new Set(['A']));
  equal(new Set(r.test.map(x => x.donor)), new Set(['B']));
}
console.log(`PASS · six Single-cell/Spatial toy models · ${checks} independent fixtures and invariant checks`);
