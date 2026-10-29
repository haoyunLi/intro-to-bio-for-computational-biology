/* Pure, deterministic synthetic models. No empirical estimates are fitted here. */
(() => {
  'use strict';
  const sum = a => a.reduce((s, x) => s + x, 0);
  const mean = a => sum(a) / a.length;
  function positive(x, name, allowZero = false) {
    if (!Number.isFinite(x) || (allowZero ? x < 0 : x <= 0)) throw new RangeError(name);
  }
  function models(n, m) {
    positive(n, 'donors'); positive(m, 'measurements');
    if (!Number.isInteger(n) || !Number.isInteger(m)) throw new RangeError('integer counts');
    const between = 4 / n, within = 9 / (n * m), variance = between + within;
    const naiveVariance = 13 / (n * m), icc = 4 / 13;
    return { n, m, total: n * m, between, within, variance, se: Math.sqrt(variance),
      naiveVariance, naiveSE: Math.sqrt(naiveVariance), icc,
      designEffect: 1 + (m - 1) * icc, effectiveN: n * m / (1 + (m - 1) * icc),
      limitSE: Math.sqrt(4 / n), curve: Array.from({ length: 20 }, (_, i) => [i + 1, Math.sqrt(4 / n + 9 / (n * (i + 1)))]) };
  }
  function lineage(origin, tissue, cloneFraction) {
    const origins = ['inherited', 'de-novo', 'early', 'somatic', 'germ-only'];
    const tissues = ['blood', 'skin', 'germ'];
    if (!origins.includes(origin) || !tissues.includes(tissue) || !Number.isFinite(cloneFraction) || cloneFraction < 0 || cloneFraction > 1) throw new RangeError('lineage inputs');
    const fractions = origin === 'inherited' || origin === 'de-novo' ? [1, 1, 1] :
      origin === 'early' ? [cloneFraction, cloneFraction, cloneFraction] :
      origin === 'somatic' ? [cloneFraction, 0, 0] : [0, 0, cloneFraction];
    const vafs = fractions.map(f => f / 2), index = tissues.indexOf(tissue);
    return { origin, tissue, cloneFraction, fractions, vafs, selectedFraction: fractions[index],
      altCopies: 100 * fractions[index], totalCopies: 200, expectedVAF: vafs[index] };
  }
  const motifCounts = [[8, 1, 1, 0], [0, 2, 7, 1], [1, 1, 1, 7], [3, 3, 2, 2]];
  function motif(alpha, gc, sequence = 'AGTA') {
    positive(alpha, 'pseudocount mass');
    if (!Number.isFinite(gc) || gc <= 0 || gc >= 1 || !/^[ACGT]{4}$/.test(sequence)) throw new RangeError('motif inputs');
    const bases = ['A', 'C', 'G', 'T'], background = [(1 - gc) / 2, gc / 2, gc / 2, (1 - gc) / 2];
    const probabilities = motifCounts.map(row => row.map((c, j) => (c + alpha * background[j]) / (sum(row) + alpha)));
    const indices = [...sequence].map(b => bases.indexOf(b));
    const observed = indices.map((j, i) => probabilities[i][j]);
    const nullProbabilities = indices.map(j => background[j]);
    const contributions = observed.map((p, i) => Math.log2(p / nullProbabilities[i]));
    const score = sum(contributions);
    return { counts: motifCounts.map(r => [...r]), bases, background, probabilities, sequence, observed, nullProbabilities, contributions, score,
      motifLikelihood: observed.reduce((a, b) => a * b, 1), backgroundLikelihood: nullProbabilities.reduce((a, b) => a * b, 1) };
  }
  function enhancer(activity1, includeThird) {
    positive(activity1, 'activity', true);
    const labels = includeThird ? ['E1', 'E2', 'E3'] : ['E1', 'E2'];
    const activities = [activity1, 1, 4].slice(0, labels.length), contacts = [.4, .5, .1].slice(0, labels.length);
    const weights = activities.map((a, i) => a * contacts[i]), denominator = sum(weights);
    const scores = weights.map(w => w / denominator);
    const twoCandidateScore = .4 * activity1 / (.4 * activity1 + .5);
    return { labels, activities, contacts, weights, denominator, scores, twoCandidateScore, included: Boolean(includeThird) };
  }
  function complex(r2, ligand) {
    positive(r2, 'R2', true); positive(ligand, 'free ligand', true);
    const r1 = 60, kd = 5, capacity = Math.min(r1 / 2, r2), occupancy = ligand / (kd + ligand);
    return { r1, r2, kd, ligand, capacity, occupancy, bound: capacity * occupancy, free: capacity * (1 - occupancy),
      unusedR1: r1 - 2 * capacity, unusedR2: r2 - capacity,
      curve: Array.from({ length: 21 }, (_, l) => [l, l / (kd + l)]) };
  }
  function lr(receptor2, lengthScale) {
    positive(receptor2, 'R2 expression', true); positive(lengthScale, 'length scale');
    const labels = ['D1', 'D2', 'D3', 'D4'];
    const controlLigand = [2, 3, 4, 5], treatmentLigand = [4, 4, 6, 6];
    const controlDistance = [10, 20, 30, 40], treatmentDistance = [10, 35, 60, 80];
    const controlGate = controlDistance.map(d => Math.exp(-d / lengthScale)), treatmentGate = treatmentDistance.map(d => Math.exp(-d / lengthScale));
    const limitingReceptor = Math.min(4, receptor2);
    const controlScores = controlLigand.map((l, i) => l * 4 * controlGate[i]);
    const treatmentScores = treatmentLigand.map((l, i) => l * limitingReceptor * treatmentGate[i]);
    const differences = treatmentScores.map((s, i) => s - controlScores[i]), observed = mean(differences);
    const permutations = Array.from({ length: 16 }, (_, mask) => ({
      signs: labels.map((_, i) => mask & (1 << i) ? -1 : 1),
      value: mean(differences.map((d, i) => (mask & (1 << i) ? -1 : 1) * d))
    }));
    const extremeCount = permutations.filter(p => p.value >= observed - 1e-12).length;
    return { labels, controlLigand, treatmentLigand, controlDistance, treatmentDistance, controlGate, treatmentGate,
      limitingReceptor, controlScores, treatmentScores, differences, observed, permutations, extremeCount, pValue: extremeCount / 16 };
  }
  window.BIOCS_REGULATION_MATH = Object.freeze({ models, lineage, motif, enhancer, complex, lr });
})();
