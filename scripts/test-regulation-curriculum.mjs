import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const filename=path.join(root,'textbook-regulation-bridge.js');
const context=vm.createContext({window:{BIOCS_BOOK:['01','01B','05','13'].map(code=>({code,chapters:[]})),BIOCS_SOURCES:{}}});
vm.runInContext(fs.readFileSync(filename,'utf8'),context,{filename});
const W=context.window;
const chapters=W.BIOCS_BOOK.flatMap(course=>course.chapters);
const registry=W.BIOCS_REGULATION_BRIDGE_CHAPTERS;
const M=W.BIOCS_REGULATION_BRIDGE_MATH;
const near=(actual,expected,message='')=>assert.ok(Math.abs(actual-expected)<1e-11,`${message}: ${actual} != ${expected}`);
const expectedCourses={rb01:'05',rb02:'05',rb03:'01',rb04:'01B',rb05:'01B',rb06:'13',rb07:'13',rb08:'05'};
assert.equal(chapters.length,8);
assert.equal(new Set(chapters.map(c=>c.id)).size,8);
assert.equal(registry.length,8);
for(const chapter of chapters){
  assert.equal(registry.find(c=>c.id===chapter.id).course,expectedCourses[chapter.id]);
  assert.ok(chapter.title&&chapter.subtitle&&chapter.core);
  assert.ok(chapter.prereq.length>=2);
  assert.ok(chapter.goals.length>=3);
  assert.ok(chapter.sections.length>=5);
  assert.equal(chapter.worked.length,2);
  assert.ok(chapter.worked[1].length>=6,`${chapter.id}: six ordered worked steps`);
  assert.ok(chapter.worked[1].every(step=>step.length>20));
  assert.ok(chapter.terms.length>=3&&chapter.terms.length<=5);
  assert.equal(chapter.check.length,2);
  assert.ok(chapter.check[1].length>40);
  assert.equal(W.BIOCS_INTUITION[chapter.id].length,2);
  assert.equal(W.BIOCS_DATA_LENS[chapter.id].length,4);
  const html=chapter.sections.map(s=>s[1]).join('\n');
  const plain=html.replace(/<[^>]*>/g,'');
  assert.ok(plain.length>1200,`${chapter.id}: needs substantive explanations, got ${plain.length} characters`);
  assert.equal((html.match(/<svg /g)||[]).length,1,`${chapter.id}: one original explanatory figure`);
  assert.match(html,/synthetic example/);
  assert.match(html,/<title id="[^\"]+-title">/);
  assert.match(html,/<desc id="[^\"]+-desc">/);
  assert.match(html,/role="region" tabindex="0"/);
  assert.match(html,/regulation-lab\.html#(models|lineage|motif|enhancer|complex|lr)/);
  assert.match(html,/textbook\.html#/);
  assert.ok(chapter.sections.some(section=>/设置|怎么选|如何设置/.test(section[0])));
  assert.ok(chapter.sections.some(section=>/排错/.test(section[0])));
  for(const [heading,body,refs] of chapter.sections){
    assert.ok(heading&&body&&refs.length);
    for(const key of refs)assert.ok(W.BIOCS_SOURCES[key],`${chapter.id}: unknown source ${key}`);
  }
  for(const entry of chapter.terms){
    assert.equal(entry.length,5);
    assert.ok(!/[\u3400-\u9fff]/u.test(entry[0]),`${chapter.id}: term names must be English`);
    assert.ok(entry[1].length>8&&entry[3].length>12&&entry[4].length>12);
    assert.ok(W.BIOCS_SOURCES[entry[2]]);
  }
  for(const key of W.BIOCS_DATA_LENS[chapter.id][3])assert.ok(W.BIOCS_SOURCES[key]);
  assert.deepEqual([...chapter.more].sort(),[...new Set(chapter.sections.flatMap(s=>s[2]))].sort());
  for(const [,href] of html.matchAll(/href="([^"]+)"/g)){
    if(href.startsWith('https://haoyunli.github.io/deep-learning-atlas/'))assert.match(href,/#\/lesson\/[a-z-]+\?animation=1$/);
  }
}
for(const [label,url] of Object.values(W.BIOCS_SOURCES)){
  assert.ok(label.length>12);
  assert.equal(new URL(url).protocol,'https:');
}

// Independent arithmetic fixtures, not snapshots of generated prose.
assert.deepEqual(JSON.parse(JSON.stringify(M.modelUnits(4,3))),{donors:4,measurements:12});
assert.equal(M.modelUnits(4,20).donors,4);
assert.throws(()=>M.modelUnits(0,3),/Positive integer/);
[.2,1/3,.5,2/3].forEach((expected,t)=>near(M.cultureFraction(.2,2,t),expected,'selection fraction'));
[3.2,4,5,6].forEach((expected,t)=>{const f=M.cultureFraction(.2,2,t);near(8*f+2*(1-f),expected,'mixture marker');});
near(M.cultureFraction(.2,1,50),.2,'no relative selection');
near(M.cultureFraction(0,2,3),0);
near(M.cultureFraction(1,2,3),1);
assert.throws(()=>M.cultureFraction(.2,0,3));
near(M.somaticVaf(.5,1,1,2,2),.25,'purity mixture');
near(M.somaticVaf(1,.5,1,2,2),.25,'subclone mixture');
near(M.somaticVaf(.5,1,1,4,2),1/6,'CN denominator');
near(M.somaticVaf(.5,1,2,4,2),1/3,'ALT multiplicity');
near(M.somaticVaf(0,1,1,2,2),0,'normal ALT zero assumption');
assert.throws(()=>M.somaticVaf(.5,1,3,2,2));
assert.throws(()=>M.somaticVaf(.5,1,0,0,0));
near(M.targetScore([1,1,-1],[2,1,-1]),4/3,'signed target score');
near(M.targetScore([3,3,-3],[2,1,-1]),4/3,'weight scaling invariance');
near(M.targetScore([1,1,-1],[2,1,1]),2/3,'opposite repressed target');
assert.throws(()=>M.targetScore([0,0],[2,1]));
assert.throws(()=>M.targetScore([1],[2,1]));
M.abc([4,2,1],[.1,.2,.4]).forEach(v=>near(v,1/3));
M.abc([4,2,1],[.1,.2,.8]).forEach((v,i)=>near(v,[.25,.25,.5][i]));
near(M.abc([4,2],[.1,.2]).reduce((a,b)=>a+b,0),1);
M.abc([40,20,10],[.1,.2,.4]).forEach(v=>near(v,1/3));
assert.throws(()=>M.abc([0],[1]));
assert.throws(()=>M.abc([1,-1],[1,1]));
near(M.capacity(12,4),4);
near(M.capacity(120,4),4,'non-limiting subunit increase');
near(M.capacity(6,4),3,'R1 becomes bottleneck');
near(M.occupancy(2,2),.5);
near(M.capacity(12,4)*M.occupancy(2,2),2);
near(M.occupancy(0,2),0);
near(M.occupancy(2,6),.25);
assert.throws(()=>M.occupancy(2,0));
near(M.lrMean(4,[9,1]),2.5);
near(M.lrMean(4,[9,4]),4);
near(M.lrMean(4,[90,1]),2.5,'min-subunit bottleneck');
assert.throws(()=>M.lrMean(4,[]));
near(M.interaction(1,5,3,9),2);
near(M.interaction(1,5,3,7),0,'additive null');
near(M.interaction(11,15,13,19),2,'baseline shift invariance');
assert.equal(5*3/1,15,'multiplicative reference differs');
assert.throws(()=>M.interaction(1,2,3,NaN));

// Protect the conceptual boundary between the two linked LR sandboxes.
const lr=chapters.find(c=>c.id==='rb07').sections.map(s=>s[1]).join('');
assert.match(lr,/20个有label/);
assert.match(lr,/16种sign flips/);
assert.match(lr,/自定义expression×distance score/);
assert.match(lr,/不能互换/);
const urls=chapters.flatMap(c=>[...c.sections.map(s=>s[1]).join('').matchAll(/deep-learning-atlas\/#\/lesson\/([a-z-]+)\?animation=1/g)].map(match=>match[1]));
assert.deepEqual([...new Set(urls)].sort(),['enhancer-gene-abc','ligand-receptor-inference','motif-pwm-scoring','perturbation-generalization','regulon-tf-activity','variant-mixture-inference'].sort());
const variant=chapters.find(c=>c.id==='rb03');
assert.match(variant.terms.find(t=>t[0]==='Somatic variant')[1],/获得/);
assert.match(variant.terms.find(t=>t[0]==='Somatic variant')[4],/constitutional/);
const perturb=chapters.find(c=>c.id==='rb08');
assert.match(perturb.terms.find(t=>t[0]==='Necessity')[1],/无法发生/);
assert.match(perturb.terms.find(t=>t[0]==='Necessity')[3],/仅减弱/);
console.log('Regulation curriculum: 8 chapters, 48 deep sections, 48 worked steps, 8 accessible SVG figures; source, terminology and independent arithmetic checks passed.');
