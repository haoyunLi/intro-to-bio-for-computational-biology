import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const root = new URL('../', import.meta.url);
const fixture = {window: {
  BIOCS_BOOK: [{code:'00', title:'生物学基础', description:'重新组织内容，翻译说明', chapters:[{
    id:'fixture', title:'复制品与激酶', sections:[['普通动词','组织事件，再生成产物；蛋白质组学与免疫染色。',[]]],
    terms:[['Kinase / 激酶','催化磷酸化的酶，不是普通中文翻译的对象。','source']],
  }]}],
  BIOCS_INTUITION:{fixture:['把内容翻译成中文']},
  BIOCS_DATA_LENS:{fixture:['复制品不是 DNA replication']},
}};
vm.createContext(fixture);
vm.runInContext(fs.readFileSync(new URL('textbook-terminology.js', root),'utf8'),fixture);
const course=fixture.window.BIOCS_BOOK[0], chapter=course.chapters[0];
assert.equal(course.title,'Biology Foundations');
assert.equal(course.description,'重新组织内容，翻译说明');
assert.equal(chapter.title,'复制品与激酶');
assert.equal(chapter.sections[0][1],'组织事件，再生成产物；蛋白质组学与免疫染色。');
assert.equal(chapter.terms[0][0],'Kinase');
assert.match(chapter.terms[0][1],/催化磷酸化的酶/);
assert.equal(fixture.window.BIOCS_INTUITION.fixture[0],'把内容翻译成中文');
assert.equal(fixture.window.BIOCS_DATA_LENS.fixture[0],'复制品不是 DNA replication');

const audit=fs.readFileSync(new URL('scripts/audit-zero-background.mjs',root),'utf8');
const files=vm.runInNewContext(audit.match(/const files = (\[[\s\S]*?\]);/)[1]);
const actual={window:{}}; vm.createContext(actual);
for(const file of files) vm.runInContext(fs.readFileSync(new URL(file,root),'utf8'),actual,{filename:file});
const chapters=actual.window.BIOCS_BOOK.flatMap(c=>c.chapters);
assert.equal(chapters.length,180);
for(const ch of chapters) for(const term of ch.terms) assert.doesNotMatch(term[0],/[\u3400-\u9fff]/,ch.id+': English term label');
const body=id=>chapters.find(c=>c.id===id).sections.map(s=>s[1]).join(' ');
assert.match(body('b04'),/ES/);
assert.match(body('b05'),/成熟的人类红细胞/);
assert.match(body('j06'),/两阶段 time–kill curve/);
assert.match(body('j07'),/单次 spillover 不要求/);
console.log('PASS · Chinese prose and compound words preserved · English labels across 180 chapters · corrected enzyme, cell and infection explanations');
