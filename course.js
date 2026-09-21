(() => {
  const ids = Array.from({ length: 12 }, (_, i) => 'l' + String(i + 1).padStart(2, '0'));
  const lessons = new Map(ids.map(id => [id, document.getElementById(id)]));
  const links = new Map(ids.map(id => [id, document.querySelector('[data-lesson-link="' + id + '"]')]));
  const prev = document.getElementById('prev-lesson');
  const next = document.getElementById('next-lesson');
  const complete = document.getElementById('complete-lesson');
  const message = document.getElementById('completion-message');
  const fill = document.getElementById('progress-fill');
  const label = document.getElementById('progress-label');
  const storageKey = 'biocs-course-completed-v1';
  let completed = new Set();
  let active = 'l01';

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (Array.isArray(saved)) completed = new Set(saved.filter(id => ids.includes(id)));
  } catch (_) { completed = new Set(); }

  function save() {
    try { localStorage.setItem(storageKey, JSON.stringify([...completed])); } catch (_) {}
  }
  function paintProgress() {
    fill.style.width = (completed.size / ids.length * 100) + '%';
    label.textContent = completed.size + ' / ' + ids.length + ' 已完成';
    for (const id of ids) links.get(id).classList.toggle('is-complete', completed.has(id));
  }
  function show(id, shouldScroll = false) {
    if (!lessons.has(id)) id = 'l01';
    active = id;
    const index = ids.indexOf(id);
    for (const lessonId of ids) {
      const selected = lessonId === id;
      lessons.get(lessonId).classList.toggle('is-active', selected);
      lessons.get(lessonId).setAttribute('aria-hidden', String(!selected));
      if (selected) links.get(lessonId).setAttribute('aria-current', 'step');
      else links.get(lessonId).removeAttribute('aria-current');
    }
    prev.disabled = index === 0;
    next.disabled = index === ids.length - 1;
    complete.classList.toggle('is-complete', completed.has(id));
    complete.textContent = completed.has(id) ? '已学完 · 撤销标记' : '标记本课已学完';
    message.textContent = '进度保存在此浏览器';
    document.title = lessons.get(id).querySelector('h1').textContent + ' · Bio/CS 12 课复习';
    if (shouldScroll) { document.getElementById('lesson-content').focus({preventScroll:true}); window.scrollTo({ top: 0, behavior: 'instant' }); }
  }
  function go(step) {
    const index = ids.indexOf(active) + step;
    if (index >= 0 && index < ids.length) location.hash = ids[index];
  }
  prev.addEventListener('click', () => go(-1));
  document.querySelector('.skip-link').addEventListener('click', event => { event.preventDefault(); const main=document.getElementById('lesson-content'); main.focus(); main.scrollIntoView(); });
  next.addEventListener('click', () => go(1));
  complete.addEventListener('click', () => {
    if (completed.has(active)) completed.delete(active);
    else completed.add(active);
    save();
    paintProgress();
    show(active);
  });
  window.addEventListener('hashchange', () => { const id=location.hash.slice(1); if (lessons.has(id)) show(id, true); });
  paintProgress();
  show(location.hash.slice(1));
})();
