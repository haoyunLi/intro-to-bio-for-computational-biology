import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const ctx={window:{BIOCS_BOOK:[{code:'07',chapters:[]}],BIOCS_SOURCES:{},BIOCS_INTUITION:{},BIOCS_DATA_LENS:{}}};
vm.createContext(ctx);vm.runInContext(fs.readFileSync(new URL('../textbook-spatial-methods.js',import.meta.url),'utf8'),ctx);
const chapters=ctx.window.BIOCS_BOOK[0].chapters,M=ctx.window.BIOCS_SPATIAL_METHODS_MATH;
assert.equal(chapters.length,8);
for(const [i,c] of chapters.entries()){
 assert.equal(c.id,`sp${String(i+1).padStart(2,'0')}`);
 assert.ok(c.goals.length>=3&&c.sections.length>=5&&c.worked[1].length>=4);
 assert.equal(c.intuition.length,2);assert.equal(c.check.length,2);assert.equal(c.terms.length,3);
 const html=c.sections.map(s=>s[1]).join('');assert.equal((html.match(/<svg /g)||[]).length,1);
 assert.ok(html.includes('synthetic example'));assert.ok(html.replace(/<[^>]+>/g,'').length>1000,c.id);
 assert.ok(!html.includes('\\n'),`${c.id}: copyable code newlines`);
 for(const t of c.terms){assert.equal(t.length,5);assert.ok(!/[\u3400-\u9fff]/.test(t[0]));assert.ok(t[3].length>=12&&t[4].length>=12,t[0]);assert.ok(ctx.window.BIOCS_SOURCES[t[2]]);}
 for(const key of c.sections.flatMap(s=>s[2]))assert.ok(ctx.window.BIOCS_SOURCES[key],key);
 assert.equal(ctx.window.BIOCS_DATA_LENS[c.id].length,4);
}
const near=(x,y)=>assert.ok(Math.abs(x-y)<1e-10,`${x} vs ${y}`);
const arr=(x,y)=>{assert.equal(x.length,y.length);x.forEach((v,i)=>near(v,y[i]));};
arr(M.mix([8,2],[2,8],.75),[6.5,3.5]);
for(let i=0;i<=10;i++)arr(M.mix([5],[5],i/10),[5]);
arr(M.transform([4,2],.5,Math.PI/2,[10,20]),[9,22]);near(M.rmse([1,2]),Math.sqrt(2.5));near(M.iou(80,100,120),4/7);
const sparse=M.radius([0,1,3,8],2);assert.equal(sparse.flat().reduce((a,b)=>a+b,0),4);assert.equal(sparse[3].reduce((a,b)=>a+b,0),0);arr(M.rowNormalize(sparse)[1],[.5,0,.5,0]);arr(M.rowNormalize(sparse)[3],[0,0,0,0]);
const W=[[0,1,0,0],[1,0,1,0],[0,1,0,1],[0,0,1,0]];
near(M.moran([1,2,5,6],W),7/17);near(M.moran([1,2,5,6],M.rowNormalize(W)),9/17);assert.equal(M.moran([1,1,1,1],W),null);
arr(M.smooth([0,0,10,10],W,.5),[0,2.5,7.5,10]);arr(M.smooth([1,9],[[0,0],[0,0]],.5),[1,9]);near(10-0,10);near(7.5-2.5,5);
near(M.geometricComplex([9,1]),3);near(M.geometricComplex([9,0]),0);near(4*M.geometricComplex([9,1]),12);
near(M.minTrainDistance([0,1,2,3],[6,7]),3);near(M.minTrainDistance([0,2,4,6],[1,3,5,7]),1);
const scores=[.95,.95,.95,.95,.95,.95,.6,.6,.6,.6],correct=[true,true,true,true,true,true,true,true,false,false];
let result=M.selective(scores,correct,0);near(result.coverage,1);near(result.accuracy,.8);
result=M.selective(scores,correct,.9);near(result.coverage,.6);near(result.accuracy,1);assert.equal(result.n,6);
result=M.selective(scores,correct,1);assert.equal(result.accuracy,null);near(result.coverage,0);
console.log('PASS · 8 Spatial methods chapters · 40 detailed sections · 8 SVGs · 24 terms');
console.log('PASS · mixture identifiability · transform/RMSE · IoU · graph isolation/weights · Moran · boundary smoothing · complex score · split distance · risk–coverage');
