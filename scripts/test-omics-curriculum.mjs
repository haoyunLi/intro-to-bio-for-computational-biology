import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url);
const audit=fs.readFileSync(new URL('scripts/audit-zero-background.mjs',root),'utf8');
const files=vm.runInNewContext(audit.match(/const files = (\[[\s\S]*?\]);/)[1]);
const ctx={window:{}};vm.createContext(ctx);
for(const file of files)vm.runInContext(fs.readFileSync(new URL(file,root),'utf8'),ctx,{filename:file});
vm.runInContext(fs.readFileSync(new URL('omics-curriculum-map.js',root),'utf8'),ctx);
const all=ctx.window.BIOCS_BOOK.flatMap(c=>c.chapters),ids=new Set(all.map(c=>c.id)),chapters=all.filter(c=>/^(cb|om|sc|sp)\d+$/.test(c.id));
assert.equal(chapters.length,51);assert.equal(all.length,237);
for(const chapter of chapters){
 assert.ok(chapter.sections.length>=4,chapter.id+' detailed sections');
 const html=chapter.sections.map(s=>s[1]).join(' ');
 assert.match(html,/<svg/,chapter.id+' quantitative figure');
 assert.match(html,/synthetic/i,chapter.id+' illustration boundary');
 assert.ok(chapter.worked[1].length>=3,chapter.id+' intermediate arithmetic');
 assert.ok(chapter.terms.length>=3,chapter.id+' anchor terms');
 for(const term of chapter.terms)assert.ok(term[3]&&term[4],chapter.id+' term example and caution');
 assert.ok(!html.includes('NaN')&&!html.includes('undefined'),chapter.id+' rendered content');
 for(const m of html.matchAll(/<code>([\s\S]*?)<\/code>/g))assert.ok(!m[1].includes('\\n'),chapter.id+' copyable code has literal escaped newline');
}
const map=ctx.window.BIOCS_OMICS_MAP;assert.equal(map.chapters.length,51);assert.equal(map.files.length,61);
for(const f of map.files){assert.ok(f.file&&f.topics&&f.ids.length,f.file);for(const id of f.ids)assert.ok(ids.has(id),f.file+' missing '+id);}
for(const c of map.corrections)for(const id of c.ids)assert.ok(ids.has(id),'correction missing '+id);
assert.ok(map.missingLectures.includes(16));assert.equal(map.lectureNumbers.length,18);
const serialized=JSON.stringify(map);assert.ok(!serialized.includes('/Users/')&&!serialized.includes('Mobile Documents'),'No private filesystem paths');
for(const page of ['index.html','textbook.html','glossary.html']){const html=fs.readFileSync(new URL(page,root),'utf8');for(const file of ['textbook-cb592.js','textbook-bulk-functional.js','textbook-singlecell-spatial.js','textbook-singlecell-methods.js','textbook-spatial-methods.js'])assert.ok(html.includes(file),`${page}: missing ${file}`);}
for(const file of ['bulk-functional-workflow.R','singlecell-spatial-transfer.R','omics-hand-calculations.R'])assert.ok(fs.existsSync(new URL('recipes/'+file,root)),file);
console.log('PASS · 51 detailed chapters + 51 quantitative figures · 61 source mappings · valid chapter links · copyable code · no private paths');
