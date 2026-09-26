import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const files = [
  'textbook-data.js', 'textbook-undergrad-sources.js',
  ...Array.from({length:10}, (_, index) => `textbook-part-${index}.js`),
  'textbook-undergrad-a.js', 'textbook-genetics-deep.js', 'textbook-genetics-extension.js', 'textbook-undergrad-b.js',
  'textbook-immunology-deep.js', 'textbook-undergrad-c.js', 'textbook-metabolism.js',
  'textbook-uiuc-expansion.js',
  'textbook-extension-worked-a.js', 'textbook-extension-worked-b.js', 'textbook-extension-worked-c.js', 'textbook-extension-worked-d.js',
  'textbook-intuition.js', 'textbook-data-lens.js', 'textbook-extension-lens-a.js', 'textbook-extension-lens-b.js', 'textbook-core-lens.js', 'textbook-terminology.js', 'uiuc-curriculum.js',
  'guided-path.js', 'glossary-data.js', 'glossary-expansion-genetics.js', 'glossary-expansion-data.js', 'glossary-expansion-organisms.js', 'glossary-expansion-systems.js',
  'glossary-expansion-metabolism.js', 'glossary-expansion-lab.js', 'glossary-expansion-proteins.js',
  'glossary-expansion-pathogens.js', 'glossary-expansion-animals.js'
];
const context = {window:{}};
vm.createContext(context);
for (const file of files) vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, {filename:file});

const book = context.window.BIOCS_BOOK;
const sources = context.window.BIOCS_SOURCES;
const intuition = context.window.BIOCS_INTUITION;
const dataLens = context.window.BIOCS_DATA_LENS;
const uiuc = context.window.BIOCS_UIUC;
const guided = context.window.BIOCS_GUIDED_PATH;
const glossary = context.window.BIOCS_GLOSSARY;
const projectLab = fs.readFileSync(path.join(root, 'project-lab.html'), 'utf8');
const chapters = book.flatMap(course => course.chapters.map(chapter => ({...chapter, course})));
const ids = new Set(chapters.map(chapter => chapter.id));
const extensionChapters = chapters.filter(chapter => !guided.ids.includes(chapter.id));
const errors = [];
const sourceKeys = chapter => [
  ...(chapter.sections || []).flatMap(section => section[2] || []),
  ...(chapter.terms || []).map(item => item[2]),
  ...(chapter.more || []),
  ...(chapter.image?.[3] || [])
].filter(Boolean);
const plainLength = chapter => (chapter.sections || []).reduce((sum, section) => sum + section[1].replace(/<[^>]+>/g, '').length, 0);

if (book.length !== 24) errors.push(`expected 24 courses; found ${book.length}`);
if (chapters.length !== 180) errors.push(`expected 180 chapters; found ${chapters.length}`);
if (ids.size !== chapters.length) errors.push('chapter IDs are not unique');
if (chapters.some(chapter => /^p\d+$/i.test(chapter.id) || /Plant Biology|植物生物学/.test(chapter.title))) errors.push('Plant Biology content is still present');
if (new Set(guided.ids).size !== guided.ids.length) errors.push('guided path repeats a chapter');
for (const unit of guided.units) {
  if (!unit.question || !unit.outcome || !unit.bridge) errors.push(`guided unit ${unit.id} lacks a question, takeaway, or transition`);
  if (!unit.practice?.[0] || !unit.practice?.[1]) errors.push(`guided unit ${unit.id} lacks a concrete practice handoff`);
  if (!unit.transfer?.[0] || !unit.transfer?.[1]) errors.push(`guided unit ${unit.id} lacks a transfer question`);
  else if (unit.transfer[1].startsWith('project-lab.html#') && !projectLab.includes(`id="${unit.transfer[1].split('#')[1]}"`)) errors.push(`guided unit ${unit.id} links to a missing project field`);
}
guided.ids.forEach((id, index) => {
  const chapter = chapters.find(item => item.id === id);
  if (!chapter) errors.push(`guided path contains unknown chapter ${id}`);
  else for (const prerequisite of chapter.prereq || []) if (!guided.ids.slice(0, index).includes(prerequisite)) errors.push(`guided path places ${id} before prerequisite ${prerequisite}`);
});
for (const name of glossary.essentials) {
  const term = glossary.get(name);
  if (!term) errors.push(`essential glossary term is missing: ${name}`);
}
for (const term of glossary.entries.values()) {
  if (!ids.has(term.chapterId)) errors.push(`glossary term ${term.label} links to unknown chapter ${term.chapterId}`);
  if (!sources[term.sourceKey]) errors.push(`glossary term ${term.label} has no valid source`);
  if (!term.example || term.example.length < 12) errors.push(`glossary term ${term.label} lacks a concrete example`);
  if (!term.caution || term.caution.length < 12) errors.push(`glossary term ${term.label} lacks a misconception or boundary`);
}
if (extensionChapters.length !== 102) errors.push(`expected 102 extension chapters; found ${extensionChapters.length}`);
for (const chapter of extensionChapters) {
  if (!chapter.worked || chapter.worked[0] === '四步读懂一个相关结果') errors.push(`${chapter.id}: extension chapter still has a generic worked example`);
  if (!chapter.worked?.[1] || chapter.worked[1].length < 3) errors.push(`${chapter.id}: extension chapter lacks a stepwise worked example`);
}
for (const chapter of chapters) {
  const lens = dataLens[chapter.id];
  if (!lens || lens.slice(0, 3).some(value => !value || value.length < 10)) errors.push(`${chapter.id}: missing a concrete signal/unit/inference data bridge`);
  if (!lens?.[3]?.length) errors.push(`${chapter.id}: data bridge lacks a source`);
  for (const key of lens?.[3] || []) if (!sources[key]) errors.push(`${chapter.id}: unknown data bridge source ${key}`);
}

for (const chapter of chapters) {
  const prefix = chapter.id.toUpperCase();
  if (!chapter.title || !chapter.subtitle) errors.push(`${prefix}: missing title or subtitle`);
  if (!Array.isArray(chapter.goals) || chapter.goals.length < 3) errors.push(`${prefix}: fewer than 3 learning goals`);
  if (!Array.isArray(chapter.sections) || chapter.sections.length < 3) errors.push(`${prefix}: fewer than 3 teaching sections`);
  if (plainLength(chapter) < 400) errors.push(`${prefix}: section detail is below 400 characters`);
  if (!(chapter.intuition || intuition?.[chapter.id])) errors.push(`${prefix}: missing zero-background intuition`);
  if (!Array.isArray(chapter.terms) || chapter.terms.length < 3) errors.push(`${prefix}: fewer than 3 anchor terms`);
  if ((chapter.terms || []).some(term => /[\u3400-\u9fff]/.test(term[0]))) errors.push(`${prefix}: term label is not English: ${chapter.terms.find(term => /[\u3400-\u9fff]/.test(term[0]))?.[0]}`);
  if (!Array.isArray(chapter.check) || chapter.check.length < 2) errors.push(`${prefix}: missing understanding check`);
  for (const prerequisite of chapter.prereq || []) if (!ids.has(prerequisite)) errors.push(`${prefix}: unknown prerequisite ${prerequisite}`);
  for (const key of sourceKeys(chapter)) if (!sources[key]) errors.push(`${prefix}: unknown source key ${key}`);
  if (!uiuc.stageByCourse[chapter.course.code]) errors.push(`${prefix}: course ${chapter.course.code} is outside the UIUC path`);
}

if (errors.length) {
  console.error(`Zero-background audit failed with ${errors.length} issue(s):`);
  errors.forEach(error => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  const sectionCount = chapters.reduce((sum, chapter) => sum + chapter.sections.length, 0);
  const explainedCount = [...glossary.entries.values()].filter(term => term.example && term.caution).length;
  console.log(`PASS · ${book.length} courses · ${chapters.length} chapters · ${sectionCount} sections · ${Object.keys(sources).length} sources`);
  console.log('PASS · unique IDs · valid prerequisites · valid sources · English term labels · no Plant Biology');
  console.log('PASS · every chapter has intuition, ≥3 goals, ≥3 sections, ≥3 terms, a check, and ≥400 characters of section detail');
  console.log(`PASS · ${guided.units.length} guided units · ${guided.ids.length} unique prerequisite-ordered core steps · ${extensionChapters.length} extension chapters with chapter-specific worked examples`);
  console.log(`PASS · all ${chapters.length} chapters connect the biological mechanism to a signal, data unit, and inference boundary`);
  console.log(`PASS · ${glossary.entries.size} searchable terms · ${explainedCount} with examples and misconceptions · ${glossary.entries.size - explainedCount} pending`);
}
