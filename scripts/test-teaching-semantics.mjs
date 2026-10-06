import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const require=createRequire(import.meta.url);
const {signalModel,signalDescription,signalResponseMax}=require(root+'genetics-lab.js');
const {types,render}=require(root+'textbook-flows.js');

// With feedback disabled, the sustained response has a geometric-series solution.
const zero=signalModel('sustained',0);
zero.values.forEach((v,i)=>assert.ok(Math.abs(v-(1-.46**(i+1))/(1-.46))<1e-12));
assert.equal(zero.peak,zero.endpoint);
assert.match(signalDescription('sustained',0,zero),/没有负反馈.*不是 adaptation/);
for(const feedback of [0,1,5,20,45,100])for(const pattern of ['short','sustained','pulsed']){
  const model=signalModel(pattern,feedback);
  assert.equal(model.inputTotal,{short:4,sustained:24,pulsed:6}[pattern]);
  assert.equal(model.values.length,24);
  assert.ok(model.values.every(v=>Number.isFinite(v)&&v>=0&&v<signalResponseMax));
  if(pattern==='sustained'&&feedback>0){
    const description=signalDescription(pattern,feedback,model);
    assert.match(description,model.peak-model.endpoint>=.01?/部分回落/:/不能.*声称 adaptation/);
  }
}
const feedback=signalModel('sustained',45);
assert.ok(feedback.endpoint<zero.endpoint,'feedback lowers the sustained response in this toy model');
assert.ok(feedback.peak>feedback.endpoint+.01,'this preset has a peak and partial return');

// Load the assembled textbook exactly as the existing content audit does.
const audit=fs.readFileSync(root+'scripts/audit-zero-background.mjs','utf8');
const files=vm.runInNewContext(audit.match(/const files = (\[[\s\S]*?\]);/)[1]);
const context={window:{}};vm.createContext(context);
for(const file of files)vm.runInContext(fs.readFileSync(root+file,'utf8'),context,{filename:file});
const chapters=context.window.BIOCS_BOOK.flatMap(c=>c.chapters);
const flows=chapters.filter(c=>c.flow&&!c.image);
assert.equal(flows.length,171);
assert.deepEqual(Object.keys(types).sort(),Array.from(flows,c=>c.id).sort(),'every displayed flow has an authored type');
for(const chapter of flows){
  const html=render(chapter),sequential=types[chapter.id]==='sequence';
  assert.equal((html.match(/<span aria-hidden="true">→<\/span>/g)||[]).length,sequential?chapter.flow.length-1:0);
  assert.equal(html.includes('；接着，'),sequential);
  assert.match(html,/aria-label=/);
}
for(const id of ['u01','o02','i05','s05','q08']){
  assert.equal(types[id],'parallel');
  const html=render(chapters.find(c=>c.id===id));
  assert.ok(!html.includes('→')&&!html.includes('接着')&&!html.includes('然后'));
}
const unsafe=render({id:'future',flowType:'"><script>bad</script>',flow:[['<img onerror=bad>','A & B']]});
assert.match(unsafe,/data-flow-type="relations"/);
assert.ok(!unsafe.includes('<script>')&&!unsafe.includes('<img '));
assert.match(unsafe,/&lt;img onerror=bad&gt;/);
const html=fs.readFileSync(root+'textbook.html','utf8');
assert.ok(html.indexOf('textbook-flows.js')<html.indexOf('textbook.js?'),'flow helper loads before renderer');
console.log('PASS · signal dose/common scale/zero-feedback analytic response · all 171 authored flow semantics · five parallel cases · safe fallback/HTML escaping');
