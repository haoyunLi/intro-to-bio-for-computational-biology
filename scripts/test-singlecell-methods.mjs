import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const root=new URL('../',import.meta.url);
const ctx={window:{BIOCS_BOOK:[{code:'05',chapters:[]}],BIOCS_SOURCES:{},BIOCS_INTUITION:{},BIOCS_DATA_LENS:{}}};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(new URL('textbook-singlecell-methods.js',root),'utf8'),ctx);
const win=ctx.window,chapters=win.BIOCS_BOOK[0].chapters,M=win.BIOCS_SINGLECELL_METHODS_MATH;
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,`${a} differs from ${b}`);
assert.equal(chapters.length,8);
let sections=0, snippets=0;
for(const [index,c] of chapters.entries()){
 assert.equal(c.id,`sc${13+index}`);
 assert.ok(c.sections.length>=5&&c.goals.length>=3&&c.worked[1].length>=4,c.id);
 sections+=c.sections.length;
 assert.ok(c.sections.reduce((n,s)=>n+s[1].replace(/<[^>]+>/g,'').length,0)>1000,c.id);
 const html=c.sections.map(s=>s[1]).join('');
 assert.equal((html.match(/<svg /g)||[]).length,1,c.id);
 assert.ok(html.includes('synthetic example'));
 for(const match of html.matchAll(/<code>([\s\S]*?)<\/code>/g)){
  snippets++;assert.ok(match[1].includes('\n'),c.id+' multiline code');assert.ok(!match[1].includes('\\n'),c.id+' no literal escaped newline');
 }
 assert.ok(win.BIOCS_DATA_LENS[c.id].length===4);
 for(const t of c.terms){assert.equal(t.length,5);assert.ok(!/[\u3400-\u9fff]/.test(t[0]));assert.ok(t[3].length>=12&&t[4].length>=12,t[0]);assert.ok(win.BIOCS_SOURCES[t[2]],t[2]);}
 for(const key of c.sections.flatMap(s=>s[2]))assert.ok(win.BIOCS_SOURCES[key],key);
}
assert.equal(snippets,8);
assert.deepEqual([...M.ambient(1000,.1,[.6,.3,.1])],[60,30,10]);
for(const rho of [0,.05,.1,.3])near(M.ambient(1000,rho,[.6,.3,.1]).reduce((a,b)=>a+b,0),1000*rho);
near(M.heterotypic([.8,.2]),.32);near(M.heterotypic([.5,.5]),.5);near(M.heterotypic([1,0]),0);
near(M.jaccard(['a','b','c','d'],['a','b','e','f']),1/3);near(M.jaccard(['a','a'],['a']),1);near(M.jaccard([],[]),1);
for(const lambda of [0,1,9]){const shift=M.ridgeShift(10,lambda);near(2*(shift-10)+2*lambda*shift,0);}
assert.deepEqual([0,1,9].map(l=>M.ridgeShift(10,l)),[10,5,1]);
const a=M.mappingScores([.1,1.1]),b=M.mappingScores([10,11]);near(a[0],b[0]);near(a[0],1/(1+Math.exp(-1)));near(a.reduce((x,y)=>x+y),1);
const counts=M.neighborhoodCounts([['a','b','c'],['b','c','d']],{a:'S1',b:'S1',c:'S2',d:'S2'},['S1','S2']);
assert.equal(JSON.stringify(counts),'[[2,1],[1,2]]');near(counts.flat().reduce((x,y)=>x+y),6);
const left=M.pathTime([0,1,3,6]),right=M.pathTime([0,1,3,6],true);left.forEach((x,i)=>near(x+right[i],1));near(left[1],1/6);near(left[2],.5);assert.deepEqual([...M.pathTime([2,2])],[0,0]);
const hi=M.affinity([.9,.2],[.1,.8],.8),lo=M.affinity([.9,.2],[.1,.8],.2);near(hi[0],.74);near(hi[1],.32);near(lo[0],.26);near(lo[1],.68);
console.log(`PASS · 8 single-cell methods chapters · ${sections} sections · 8 SVG figures · 24 complete terms · 8 copyable R examples`);
console.log('PASS · ambient mass · doublet random-pairing fractions · Jaccard · ridge derivative · score-shift invariance · overlapping memberships · root reversal · multimodal affinities');
