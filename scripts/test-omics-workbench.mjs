import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require=createRequire(import.meta.url),M=require('../omics-math.js');
let checks=0;
const near=(a,b,t=1e-9)=>{checks++;assert.ok(Math.abs(a-b)<t,`${a} differs from ${b}`);};
assert.equal(M.alignment('id').difference,20);assert.equal(M.alignment('position').difference,-2);
assert.equal(M.alignment('id').rank,3);assert.equal(M.alignment('id',true).rank,2);
assert.equal(M.alignment('position').matched,false);near(M.rank([[1,0,1],[1,1,2],[1,2,3]]),2);
for(let depth=1;depth<=3;depth++)for(let composition=800;composition<=8000;composition+=100){const r=M.normalization(composition,depth);near(r.ratioFC,0);near(r.rawFC,Math.log2(depth));near(r.cpmFC,Math.log2(1000/(200+composition)));near(r.factors[0]*r.factors[1],1);}
// Independent R phyper reference values, not rounded display output.
near(M.ora(200,20,20,5).p,0.034536741079601099,1e-12);
near(M.ora(2000,20,20,5).p,8.2428047972872861e-7,1e-14);
for(let N=100;N<=2000;N+=50){let previous=1;for(let k=0;k<=20;k++){const r=M.ora(N,20,20,k);assert.ok(r.p<=previous+1e-12);previous=r.p;near(r.probabilities.reduce((a,b)=>a+b,0),1,1e-10);near(r.table.flat().reduce((a,b)=>a+b,0),N);near(r.table[0].reduce((a,b)=>a+b,0),20);}}
assert.throws(()=>M.ora(10,20,20,5));
M.adjustBH([.01,.04,.03,.2]).forEach((x,i)=>near(x,[.04,4*.04/3,4*.04/3,.2][i]));
for(const preset of ['positive','negative','mixed'])for(const p of [0,1,2]){const r=M.gsea(preset,p);near(r.rows.at(-1).running,0);near(r.rows.filter(x=>x.hit).reduce((a,b)=>a+b.increment,0),1);near(r.rows.filter(x=>!x.hit).reduce((a,b)=>a+b.increment,0),-1);assert.ok(Math.abs(r.es)<=1+1e-9);assert.ok(r.leading.every(g=>r.rows.find(x=>x.gene===g)?.hit));}
assert.ok(M.gsea('positive').es>0);assert.ok(M.gsea('negative').es<0);
assert.deepEqual(M.gsea('negative').leading,['G9','G10']);
for(const p of [0,1,2]){const r=M.gsea('mixed',p);near(r.maxPositive,-r.minNegative);assert.equal(r.tied,true);assert.equal(r.es,0);assert.deepEqual(r.leading,[]);assert.equal(r.peak,null);}
for(let x=10;x<=90;x+=5){const r=M.pseudobulk(x);near(r.totalCells,200);near(r.pairedDifference,2);near(r.rows[0].targetCount+r.rows[2].targetCount,r.pooledC*100);}
near(M.pseudobulk(90).pooledDifference,-2.8);near(M.pseudobulk(50).pooledDifference,2);
for(let o=-1;o<=1.00001;o+=.1)for(let t=.5;t<=8;t+=.5)for(const threshold of [.5,.8,.95]){const r=M.spatial(o,t,threshold);near(r.p+r.q,1);assert.ok(r.entropy>=0&&r.entropy<=Math.log(2)+1e-10);for(const matrix of [r.soft,r.hard,r.abstain])for(let g=0;g<2;g++)near(matrix.reduce((total,row)=>total+row[g],0),23);}
near(M.spatial(0).entropy,Math.log(2));assert.equal(M.spatial(0,4,.8).accepted,false);assert.ok(M.spatial(1,1).p>M.spatial(1,8).p);
const ui=fs.readFileSync(new URL('../omics-workbench.js',import.meta.url),'utf8');assert.ok(ui.includes('prefers-reduced-motion'));assert.ok(ui.includes('document.hidden'));assert.ok(ui.includes('aria-live'));
console.log(`PASS · six Omics experiments · ${checks} numeric checks · R-reference ORA/BH · invariant totals, ranks and endpoints`);
