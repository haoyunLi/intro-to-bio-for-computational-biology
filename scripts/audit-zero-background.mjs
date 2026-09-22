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
  'textbook-intuition.js', 'textbook-data-lens.js', 'textbook-terminology.js', 'uiuc-curriculum.js'
];
const context = {window:{}};
vm.createContext(context);
for (const file of files) vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, {filename:file});

const book = context.window.BIOCS_BOOK;
const sources = context.window.BIOCS_SOURCES;
const intuition = context.window.BIOCS_INTUITION;
const uiuc = context.window.BIOCS_UIUC;
const chapters = book.flatMap(course => course.chapters.map(chapter => ({...chapter, course})));
const ids = new Set(chapters.map(chapter => chapter.id));
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

for (const chapter of chapters) {
  const prefix = chapter.id.toUpperCase();
  if (!chapter.title || !chapter.subtitle || !chapter.intro) errors.push(`${prefix}: missing title, subtitle, or intro`);
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
  console.log(`PASS · ${book.length} courses · ${chapters.length} chapters · ${sectionCount} sections · ${Object.keys(sources).length} sources`);
  console.log('PASS · unique IDs · valid prerequisites · valid sources · English term labels · no Plant Biology');
  console.log('PASS · every chapter has intuition, ≥3 goals, ≥3 sections, ≥3 terms, a check, and ≥400 characters of section detail');
}
