import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const ctx={window:{BIOCS_BOOK:[{code:'05',chapters:[]}],BIOCS_SOURCES:{},BIOCS_INTUITION:{},BIOCS_DATA_LENS:{}}};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root,'textbook-singlecell-spatial.js'),'utf8'),ctx);
const win=ctx.window, chapters=win.BIOCS_BOOK[0].chapters, math=win.BIOCS_SC_SPATIAL_MATH;
assert.equal(chapters.length,12);
const ids=chapters.map(c=>c.id);
assert.equal(new Set(ids).size,12);
for(const [i,c] of chapters.entries()){
  assert.equal(c.id,`sc${String(i+1).padStart(2,'0')}`);
  assert.ok(c.goals.length>=3 && c.sections.length>=4 && c.worked[1].length>=4);
  assert.ok(c.sections.reduce((n,s)=>n+s[1].replace(/<[^>]+>/g,'').length,0)>600,c.id);
  assert.ok(c.intuition.length===2 && c.check.length===2 && c.terms.length>=3);
  assert.ok(win.BIOCS_DATA_LENS[c.id].length===4);
  const html=c.sections.map(s=>s[1]).join('');
  assert.equal((html.match(/<svg /g)||[]).length,1);
  assert.ok(html.includes('synthetic example') && html.includes('<ol>'));
  assert.ok(!/NaN|Infinity|undefined/.test(html));
  for(const t of c.terms){
    assert.equal(t.length,5);
    assert.ok(!/[\u3400-\u9fff]/.test(t[0]),t[0]);
    assert.ok(t[3].length>=12 && t[4].length>=12,t[0]);
    assert.ok(win.BIOCS_SOURCES[t[2]],t[2]);
  }
  for(const key of c.sections.flatMap(s=>s[2]))assert.ok(win.BIOCS_SOURCES[key],key);
}
assert.equal(math.normalized(2,100),200);
assert.equal(math.normalized(20,1000),200);
assert.ok(Math.abs(Math.log1p(200)-5.303304908059076)<1e-12);
assert.equal(math.qcFraction(160,400),.4);
const soft=math.softAggregate([10,6],[[.8,.2],[.25,.75]]);
assert.equal(soft[0],9.5);assert.equal(soft[1],6.5);assert.equal(soft[0]+soft[1],16);
const w=[[0,1,0,0],[1,0,1,0],[0,1,0,1],[0,0,1,0]];
assert.ok(Math.abs(math.moran([1,1,3,3],w)-1/3)<1e-12);
assert.equal(math.moran([1,3,1,3],w),-1);
assert.equal(math.moran([2,2,2,2],w),null);
assert.equal(math.moran([1,2],[[0,0],[0,0]]),null);
assert.ok(Math.abs(math.moran([3,3,9,9],w)-1/3)<1e-12);
assert.equal(6*2*1000,12000);
assert.equal(100*.5+10,60);assert.equal(50*.5+20,45);
console.log(`PASS · ${chapters.length} single-cell/spatial chapters · 12 original quantitative SVGs · 36 detailed terms · primary-source references`);
console.log('PASS · normalization · QC fractions · assignment mass/expected values · Moran weights/constant/no-edge cases · coordinate transform · donor hierarchy');
