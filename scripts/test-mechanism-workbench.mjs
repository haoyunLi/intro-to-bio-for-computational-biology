import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const require=createRequire(import.meta.url);
const m=require('../mechanism-workbench.js');
let checks=0;
const near=(a,b,tol=1e-9)=>{assert.ok(Math.abs(a-b)<=tol,`${a} != ${b}`);checks++;};
near(m.enzyme(10,10,0,'none').rate,50);
near(m.enzyme(20,10,1,'competitive').rate,50);
near(m.enzyme(10,10,1,'noncompetitive').rate,25);
for(const mode of ['none','competitive','noncompetitive'])for(let s=0;s<=100;s++)for(let ratio=0;ratio<=4;ratio+=.5){const r=m.enzyme(s,10,ratio,mode);assert.ok(r.rate>=0&&r.rate<=r.vmax);checks++;if(!ratio)near(r.rate,r.baseline);}
for(let n=1;n<=4;n+=.25){near(m.receptor(20,20,n).occupancy,.5);near(m.receptor(20,20,n).response,.5);for(let l=0;l<=100;l++){const r=m.receptor(l,10,n);assert.ok(r.occupancy>=0&&r.occupancy<=1&&r.response>=0&&r.response<=1);checks++;}}
for(let t=0;t<=40;t+=.5)for(const a of [0,1,10,20])for(const h of [1,2,6,8]){const r=m.expression(t,a,h,6);assert.ok(r.rna>=-1e-10&&r.protein>=-1e-10&&Object.values(r).every(Number.isFinite));checks++;}
near(m.expression(0,10,2,6).rna,0);near(m.expression(0,10,2,6).protein,0);
const atOff=m.expression(10,10,2,6), afterHalf=m.expression(12,10,2,6);
near(afterHalf.rna,atOff.rna/2);assert.ok(afterHalf.protein>atOff.protein);checks++;
for(const h of [2,6,8]){const r=m.expression(10,10,h,h), eps=m.expression(10,10,h,h+1e-7);near(r.protein,eps.protein,1e-4);}
for(const copies of [20,40,100,400])for(const p of [0,.2,.5,.9,1])for(const s of [-.2,0,.2])for(const seed of [1,7,20]){const a=m.population(copies,p,s,seed),b=m.population(copies,p,s,seed);assert.deepEqual(a,b);assert.ok(a.every(x=>x>=0&&x<=1));a.slice(1).forEach(x=>near(x*copies,Math.round(x*copies),1e-8));if(p===0||p===1)assert.ok(a.every(x=>x===p));checks+=3;}
assert.deepEqual(m.selectionPath(.5,0),Array(31).fill(.5));checks++;
const html=readFileSync(new URL('../foundations-lab.html',import.meta.url),'utf8'),js=readFileSync(new URL('../mechanism-workbench.js',import.meta.url),'utf8');
assert.ok(html.includes('id="mechanism-workbench"')&&html.includes('href="#mechanism-workbench"')&&html.includes('src="mechanism-workbench.js"'));
assert.equal((js.match(/question: '/g)||[]).length,4);
console.log(`Validated four biology mechanism modules: ${checks} numeric checks, exact turnover/half-life, bounded responses, deterministic drift, and page integration.`);
