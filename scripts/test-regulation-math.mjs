import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

// Evaluate the same pure browser module without importing any UI machinery.
const context = { window: {} };
vm.runInNewContext(readFileSync(new URL('../regulation-math.js', import.meta.url), 'utf8'), context);
const M = context.window.BIOCS_REGULATION_MATH;
const close = (actual, expected, label = '') => assert.ok(
  Math.abs(actual - expected) <= 1e-10 * Math.max(1, Math.abs(expected)),
  `${label}: expected ${expected}, received ${actual}`,
);
const vector = (actual, expected, label = '') => {
  assert.equal(actual.length, expected.length);
  expected.forEach((value, index) => close(actual[index], value, `${label}[${index}]`));
};
const finite = value => {
  if (typeof value === 'number') assert.ok(Number.isFinite(value));
  else if (Array.isArray(value)) value.forEach(finite);
  else if (value && typeof value === 'object') Object.values(value).forEach(finite);
};
const within = (value, low, high) => assert.ok(value >= low - 1e-12 && value <= high + 1e-12);
let states = 0;

// Hand-calculated fixture: four clusters, three measurements, variances 4 and 9.
const model = M.models(4, 3);
close(model.between, 1);
close(model.within, 3 / 4);
close(model.se, Math.sqrt(7) / 2);
close(model.naiveSE, Math.sqrt(13 / 12));
close(model.effectiveN, 52 / 7);
for (let n = 2; n <= 12; n++) for (let m = 1; m <= 20; m++) {
  const r = M.models(n, m); finite(r); states++;
  close(r.se ** 2, r.between + r.within);
  close(r.se ** 2 / r.naiveSE ** 2, r.designEffect);
  within(r.effectiveN, n, n * m);
  assert.ok(r.se >= r.naiveSE - 1e-12);
  assert.ok(r.se > r.limitSE);
  if (m === 1) close(r.se, r.naiveSE);
  if (m > 1) assert.ok(r.se < M.models(n, m - 1).se);
  if (n > 2) assert.ok(r.se < M.models(n - 1, m).se);
}

// Origin is declared, not inferred. Equal VAF can arise from different histories.
vector(M.lineage('inherited', 'blood', 0).vafs, [0.5, 0.5, 0.5]);
vector(M.lineage('de-novo', 'blood', 0).vafs, [0.5, 0.5, 0.5]);
vector(M.lineage('early', 'blood', 0.4).vafs, [0.2, 0.2, 0.2]);
vector(M.lineage('somatic', 'blood', 0.4).vafs, [0.2, 0, 0]);
vector(M.lineage('germ-only', 'germ', 0.4).vafs, [0, 0, 0.2]);
for (const origin of ['inherited', 'de-novo', 'early', 'somatic', 'germ-only']) {
  for (const tissue of ['blood', 'skin', 'germ']) for (let tick = 0; tick <= 20; tick++) {
    const r = M.lineage(origin, tissue, tick / 20); finite(r); states++;
    r.fractions.forEach(value => within(value, 0, 1));
    r.vafs.forEach(value => within(value, 0, 0.5));
    close(r.altCopies / r.totalCopies, r.expectedVAF);
    close(r.expectedVAF, r.selectedFraction / 2);
    assert.equal(r.totalCopies, 200);
    if (origin === 'germ-only' && tissue === 'blood') close(r.expectedVAF, 0);
  }
}

// At alpha=1 and q=.25, AGTA probabilities are 3/4,29/44,29/44,13/44.
const motif = M.motif(1, 0.5);
vector(motif.observed, [3 / 4, 29 / 44, 29 / 44, 13 / 44]);
close(motif.score, Math.log2(32799 / 1331));
close(M.motif(1, 0.5, 'CGTA').score - motif.score, Math.log2(5 / 33));
for (let a = 1; a <= 10; a++) for (let g = 4; g <= 16; g++) {
  for (const sequence of ['AGTA', 'CGTA']) {
    const r = M.motif(a / 2, g / 20, sequence); finite(r); states++;
    close(r.background.reduce((sum, x) => sum + x), 1);
    r.probabilities.forEach(row => {
      close(row.reduce((sum, x) => sum + x), 1);
      row.forEach(value => assert.ok(value > 0 && value < 1));
    });
    close(r.score, Math.log2(r.motifLikelihood / r.backgroundLikelihood));
  }
}
assert.ok(Math.abs(M.motif(1e8, 0.5).score) < 1e-5);

// ABC weights .8,.5,.4 imply shares 8/17,5/17,4/17, not causal probabilities.
const abc = M.enhancer(2, true);
vector(abc.weights, [0.8, 0.5, 0.4]);
vector(abc.scores, [8 / 17, 5 / 17, 4 / 17]);
close(M.enhancer(2, false).scores[0], 8 / 13);
for (let tick = 0; tick <= 20; tick++) for (const third of [true, false]) {
  const r = M.enhancer(tick / 4, third); finite(r); states++;
  close(r.scores.reduce((sum, x) => sum + x), 1);
  r.scores.forEach(value => within(value, 0, 1));
  if (third) assert.ok(r.scores[0] <= r.twoCandidateScore);
  if (tick === 0) close(r.scores[0], 0);
}

// The hypothetical 2:1 receptor uses 40 of 60 R1 copies when R2=20.
const receptor = M.complex(20, 5);
close(receptor.capacity, 20); close(receptor.occupancy, 0.5);
close(receptor.bound, 10); close(receptor.free, 10);
close(receptor.unusedR1, 20); close(receptor.unusedR2, 0);
for (let r2 = 0; r2 <= 60; r2 += 2) for (let ligand = 0; ligand <= 20; ligand++) {
  const r = M.complex(r2, ligand); finite(r); states++;
  within(r.capacity, 0, 30); within(r.occupancy, 0, 1);
  close(r.bound + r.free, r.capacity);
  close(r.unusedR1 + 2 * r.capacity, 60);
  close(r.unusedR2 + r.capacity, r2);
  if (r2 === 0 || ligand === 0) close(r.bound, 0);
  if (r2 >= 30) close(r.capacity, 30);
  if (ligand === 5) close(r.occupancy, 0.5);
}

// Independently specified donor contrast fixture: ten of sixteen signed means
// are at least the observed negative mean. All exact permutations include identity.
const lr = M.lr(4, 40);
vector(lr.controlScores, [8 * Math.exp(-0.25), 12 * Math.exp(-0.5), 16 * Math.exp(-0.75), 20 / Math.E]);
vector(lr.treatmentScores, [16 * Math.exp(-0.25), 16 * Math.exp(-0.875), 24 * Math.exp(-1.5), 24 * Math.exp(-2)]);
close(lr.observed, -0.1726130907920722);
close(lr.pValue, 10 / 16);
close(M.lr(0, 40).pValue, 1);
close(M.lr(4, 1e8).pValue, 1 / 16);
for (let rTick = 0; rTick <= 24; rTick++) for (let lambda = 10; lambda <= 100; lambda += 5) {
  const r = M.lr(rTick / 4, lambda); finite(r); states++;
  within(r.pValue, 1 / 16, 1);
  close(r.pValue * 16, Math.round(r.pValue * 16));
  assert.equal(r.permutations.length, 16);
  assert.equal(new Set(r.permutations.map(p => p.signs.join(','))).size, 16);
  close(r.permutations[0].value, r.observed);
  close(r.permutations.reduce((sum, p) => sum + p.value, 0), 0);
  r.permutations.forEach((p, i) => close(p.value, -r.permutations[15 - i].value));
  [...r.controlGate, ...r.treatmentGate].forEach(value => within(value, 0, 1));
  if (rTick > 16) vector(r.treatmentScores, M.lr(4, lambda).treatmentScores);
}
assert.notEqual(M.lr(4, 10).observed, M.lr(4, 100).observed);

// Defend numeric types and physical domain boundaries.
for (const invalid of [() => M.models('4', 3), () => M.models(0, 1), () => M.models(2.5, 3),
  () => M.lineage('unknown', 'blood', 0.5), () => M.lineage('early', 'blood', 1.01),
  () => M.motif(0, 0.5), () => M.motif(1, 1), () => M.motif(1, 0.5, 'AGTN'),
  () => M.enhancer(-1, true), () => M.complex(-1, 5), () => M.complex(2, NaN),
  () => M.lr(4, 0), () => M.lr(Infinity, 20)]) {
  assert.throws(invalid, error => error.name === 'RangeError');
}
console.log(`PASS: six independent fixtures, ${states} supported parameter states, invalid inputs and scientific bounds.`);
