import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = fs.readFileSync(path.join(root, 'project-transfer.js'), 'utf8');
const names = ['question', 'object', 'measurement', 'value', 'method', 'design', 'claim', 'alternative'];
const storage = new Map();

function boot() {
  const fields = new Map();
  class Element {
    constructor(id = '') {
      this.id = id;
      this.value = '';
      this.textContent = '';
      this.innerHTML = '';
      this.dataset = {};
      this.handlers = {};
      this.marks = new Set();
      this.classList = {add: name => this.marks.add(name), remove: name => this.marks.delete(name)};
    }
    addEventListener(name, callback) { this.handlers[name] = callback; }
    fire(name, event = {target:this}) { this.handlers[name]?.(event); }
    matches(selector) { return selector === '[data-transfer]' && Boolean(this.name); }
    closest(selector) { return selector === '.transfer-field' ? fields.get(this.name) : null; }
  }
  for (const name of names) fields.set(name, new Element(`transfer-${name}`));
  const inputs = names.map(name => {
    const input = new Element(`transfer-${name}-input`);
    input.name = name;
    return input;
  });
  const elementIds = ['transfer-profile', 'transfer-method-guide', 'transfer-progress', 'transfer-feedback', 'transfer-form', 'transfer-check', 'transfer-save', 'transfer-clear'];
  const elements = new Map(elementIds.map(id => [id, new Element(id)]));
  elements.get('transfer-profile').value = 'other';
  const document = {
    querySelector: selector => elements.get(selector.slice(1)),
    querySelectorAll: selector => selector === '[data-transfer]' ? inputs : [...fields.values()],
    getElementById: id => fields.get(id.slice('transfer-'.length))
  };
  const localStorage = {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: key => storage.delete(key)
  };
  vm.runInNewContext(source, {document, localStorage}, {filename:'project-transfer.js'});
  return {elements, fields, inputs};
}

let page = boot();
assert.match(page.elements.get('transfer-progress').textContent, /0 \/ 8/);
for (const [profile, expected] of [
  ['binCell', '一个 2 × 2 µm bin'],
  ['pathwayAge', '20 位 patient'],
  ['methylationAge', 'β value 是 0.72']
]) {
  page.elements.get('transfer-profile').value = profile;
  page.elements.get('transfer-profile').fire('change');
  assert.ok(page.elements.get('transfer-method-guide').innerHTML.includes(expected));
}
page.inputs[0].value = 'Synthetic question without private data';
page.elements.get('transfer-form').fire('input', {target:page.inputs[0]});
page.elements.get('transfer-save').fire('click');
assert.ok(storage.has('biocs-project-transfer-v1'));
page = boot();
assert.equal(page.elements.get('transfer-profile').value, 'methylationAge');
assert.equal(page.inputs[0].value, 'Synthetic question without private data');
page.elements.get('transfer-clear').fire('click');
assert.equal(page.elements.get('transfer-clear').dataset.pending, 'true');
assert.ok(storage.has('biocs-project-transfer-v1'));
page.elements.get('transfer-clear').fire('click');
assert.equal(storage.has('biocs-project-transfer-v1'), false);
assert.equal(page.inputs[0].value, '');
page.elements.get('transfer-check').fire('click');
assert.equal([...page.fields.values()].filter(field => field.marks.has('is-empty')).length, 8);
console.log('PASS · method guides, local save/restore, two-click deletion, and eight-field check');
