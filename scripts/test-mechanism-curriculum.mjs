import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const html = fs.readFileSync(root + 'textbook.html', 'utf8');
const scripts = [...html.matchAll(/<script src="([^"?]+)(?:\?[^" ]*)?" defer><\/script>/g)].map(x => x[1]);
assert.ok(scripts.indexOf('textbook-core-lens.js') < scripts.indexOf('textbook-mechanism-expansion.js'));
assert.ok(scripts.indexOf('textbook-mechanism-expansion.js') < scripts.indexOf('textbook.js'));
const context = vm.createContext({window:{}});
for (const file of scripts) {
  if (file === 'bio-motion.js') break;
  vm.runInContext(fs.readFileSync(root + file, 'utf8'), context, {filename:file});
}
const w = context.window;
const all = w.BIOCS_BOOK.flatMap(c => c.chapters);
const ids = new Set(all.map(c => c.id));
const added = all.filter(c => /^r(?:07|08|09|10|11|12)$/.test(c.id));
assert.equal(added.length, 6);
assert.equal(all.length, 237);
assert.equal(ids.size, all.length);
for (const c of added) {
  assert.ok(c.intuition.length >= 2 && c.goals.length >= 3);
  assert.ok(c.sections.length >= 4 && c.worked[1].length >= 4);
  assert.ok(c.check[0].length >= 20 && c.check[1].length >= 30);
  assert.ok(c.sections.reduce((n, s) => n + s[1].replace(/<[^>]+>/g, '').length, 0) > 700);
  const diagram = c.sections[0][1];
  assert.match(diagram, /<svg[^>]+role="img"/);
  assert.match(diagram, new RegExp(`aria-labelledby="${c.id}-figure-title ${c.id}-figure-desc"`));
  assert.match(diagram, /role="region" tabindex="0"/);
  assert.match(diagram, /synthetic example/);
  assert.match(diagram, /min-width:640px/);
  assert.ok(!diagram.includes('onload=') && !diagram.includes('<script'));
  for (const id of c.prereq) assert.ok(ids.has(id), `${c.id} unknown prerequisite ${id}`);
  for (const section of c.sections) for (const key of section[2]) assert.ok(w.BIOCS_SOURCES[key], key);
  for (const term of c.terms) {
    assert.ok(!/[\u3400-\u9fff]/.test(term[0]), term[0]);
    assert.ok(w.BIOCS_SOURCES[term[2]], term[2]);
  }
  assert.equal(w.BIOCS_DATA_LENS[c.id].length, 4);
}

const math = w.BIOCS_MECHANISM_MATH;
assert.equal(math.velocity(4, 4, 1, .5), 2);
assert.equal(math.velocity(1, 4, 1, .5), -1);
assert.equal(math.velocity(2, 8, 1, .5), -2);
assert.ok(Math.abs(math.velocity(2, 8, 1, .1) - 1.2) < 1e-12);
// Equilibrium identity and scale behavior over a bounded physically meaningful domain.
for (const beta of [.1, .5, 1, 2]) for (const gamma of [.1, .5, 1, 2]) for (const s of [0, 1, 4, 20]) {
  assert.ok(Math.abs(math.velocity(gamma * s / beta, s, beta, gamma)) < 1e-12);
}
for (const counts of [[50,50], [50,150], [40,60], [80,120], [0,10,30]]) {
  const first = math.composition(counts), scaled = math.composition(counts.map(x => x * 7));
  assert.ok(Math.abs(first.fractions.reduce((s,x) => s+x,0)-1) < 1e-12);
  first.fractions.forEach((v,i) => assert.ok(Math.abs(v-scaled.fractions[i]) < 1e-12));
}
assert.equal(math.composition([0,0]).fractions[0], null);
assert.equal(math.composition([50,150]).fractions[0], .25);
assert.equal(JSON.stringify(math.pairedDifference([[10,14],[20,24],[5,9],[30,34]])), '[4,4,4,4]');
console.log('PASS · six research-method chapters, six accessible quantitative figures, source/ID/data-lens integration and independent numerical identities');
