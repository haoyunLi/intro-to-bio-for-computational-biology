import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const read = path => fs.readFileSync(new URL('../'+path, import.meta.url), 'utf8');
const ctx = {window:{}};
vm.createContext(ctx);
const files = vm.runInNewContext(read('scripts/audit-zero-background.mjs').match(/const files = (\[[\s\S]*?\]);/)[1]);
for(const file of files) vm.runInContext(read(file),ctx,{filename:file});
vm.runInContext(read('chapter-navigation.js'),ctx);
const {resolve,omitRepeatedOpening}=ctx.window.BIOCS_CHAPTER_NAV;
const chapters=ctx.window.BIOCS_BOOK.flatMap(course=>course.chapters);
const catalogue=chapters.map(c=>c.id),core=ctx.window.BIOCS_GUIDED_PATH.ids;
const topic=['rb01','rb02','rb03','rb04','rb05','rb06','rb07','rb08'];
let active='rb01'; const visited=[];
while(active){visited.push(active);const nav=resolve(active,core,catalogue);assert.equal(nav.kind,'regulation');active=nav.nextId;assert.ok(visited.length<=8);}
assert.deepEqual(visited,topic);
assert.equal(resolve('rb01',core,catalogue).previousId,undefined);
assert.equal(resolve('rb08',core,catalogue).nextId,undefined);
assert.equal(resolve('rb03',core,catalogue).previousId,'rb02');
assert.equal(resolve('rb05',core,catalogue).nextId,'rb06');
for(let i=0;i<core.length;i++){
 const nav=resolve(core[i],core,catalogue);assert.equal(nav.kind,'core');assert.equal(nav.previousId,core[i-1]);assert.equal(nav.nextId,core[i+1]);
}
const plain=catalogue.find(id=>!core.includes(id)&&!topic.includes(id));
assert.equal(resolve(plain,core,catalogue).kind,'catalogue');
assert.equal(resolve(plain,core,catalogue).nextId,catalogue[catalogue.indexOf(plain)+1]);
assert.equal(resolve('missing',core,catalogue).nextId,undefined);
assert.equal(resolve('rb03',['rb03','b01'],catalogue).kind,'core','Explicit core membership wins if routes later overlap');
assert.equal(omitRepeatedOpening('<p>Same.</p><p>New mechanism.</p>','Same.'),'<p>New mechanism.</p>');
assert.equal(omitRepeatedOpening('<p>Different.</p><p>Next.</p>','Same.'),'<p>Different.</p><p>Next.</p>');
assert.equal(omitRepeatedOpening('<p>Same.</p>','Same.'),'<p>Same.</p>','Keep a lone explanatory paragraph');
assert.equal(omitRepeatedOpening('<p>Same.</p> <!-- blank --> <p></p>','Same.'),'<p>Same.</p> <!-- blank --> <p></p>');
assert.equal(omitRepeatedOpening('<p>Same, nearly.</p><p>Next.</p>','Same.'),'<p>Same, nearly.</p><p>Next.</p>','No fuzzy deduplication');
for(const id of ['x06','a01','l01','w09']){
 const chapter=chapters.find(c=>c.id===id),intro=(chapter.intuition||ctx.window.BIOCS_INTUITION[id])[1];
 const original=chapter.sections[0][1],result=omitRepeatedOpening(original,intro);
 assert.notEqual(result,original,id);assert.ok(result.includes('<strong>object / 对象</strong>'),id);
 assert.equal(chapter.sections[0][1],original,'Rendering does not change chapter data');
}
const html=read('textbook.html');assert.ok(html.indexOf('chapter-navigation.js')<html.indexOf('textbook.js'));
assert.match(read('textbook.js'),/navigationFor\(state.active\)\.ids/);
console.log('PASS · 8-step topic traversal, 78 core steps, catalogue fallback, route boundaries, and exact opening-paragraph deduplication');
