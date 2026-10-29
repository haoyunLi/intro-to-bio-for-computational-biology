import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const read = path => fs.readFileSync(new URL(path, root), 'utf8');
const audit = read('scripts/audit-zero-background.mjs');
const files = vm.runInNewContext(audit.match(/const files = (\[[\s\S]*?\]);/)[1]);
const ctx = { window: {} };
vm.createContext(ctx);
for (const file of files) vm.runInContext(read(file), ctx, { filename: file });
vm.runInContext(read('biology-search.js'), ctx);
const chapters = ctx.window.BIOCS_BOOK.flatMap(c => c.chapters);
assert.equal(chapters.length, 245);
const ids = new Set(chapters.map(c => c.id));
for (let n = 1; n <= 8; n++) assert.ok(ids.has(`rb0${n}`));
for (const page of ['index.html', 'textbook.html', 'glossary.html']) {
  const html = read(page);
  assert.equal((html.match(/src="textbook-regulation-bridge.js/g) || []).length, 1, page);
  assert.ok(html.indexOf('textbook-regulation-bridge.js') < html.indexOf('textbook-terminology.js'), page);
  assert.ok(html.includes('biology-search.js'), page);
}
for (const page of ['index.html', 'omics-workbench.html', 'singlecell-spatial-lab.html'])
  assert.ok(read(page).includes('regulation-lab.html'), page);
for (const match of read('index.html').matchAll(/textbook.html#(rb\d+)/g))
  assert.ok(ids.has(match[1]), match[1]);
const matches = ctx.window.BIOCS_SEARCH.matches;
for (const [query, text] of [
  ['invivo', 'in vivo model'], ['invitro', 'in vitro'], ['ex vivo', 'ex-vivo tissue'],
  ['TF', 'Transcription Factor activity'], ['LR', 'Ligand–Receptor evidence'],
  ['GRN', 'Gene Regulatory Network'], ['enhanse', 'Enhancer–Gene linking'],
  ['somatic', 'Somatic / Germline'], ['谱系', '先确认细胞谱系'],
]) assert.ok(matches(text, query), query);
assert.ok(!matches('Control or endpoint', 'LR'), 'Short acronyms do not match arbitrary substrings');
assert.ok(!matches('Nothing matching', '<script>'), 'Search is literal text');
assert.ok(matches('Anything', ''), 'Clearing search restores all entries');
console.log('PASS · 245 chapters, 8 new route IDs, page loader order, two-site navigation and biological search aliases');
