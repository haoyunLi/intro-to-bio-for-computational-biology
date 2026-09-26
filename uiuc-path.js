(() => {
  const data = window.BIOCS_UIUC;
  const guided = window.BIOCS_GUIDED_PATH;
  const courses = window.BIOCS_BOOK;
  const byCode = new Map(courses.map(course => [course.code, course]));
  const byChapter = new Map(courses.flatMap(course => course.chapters.map(chapter => [chapter.id, chapter])));
  const completed = (() => {
    try { return new Set(JSON.parse(localStorage.getItem('biocs-textbook-progress-v1') || '[]')); }
    catch (_) { return new Set(); }
  })();
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  let activeTrack = 'genetics';

  function chapterLinks(ids) {
    return ids.filter(id => byChapter.has(id)).map(id => `<a href="textbook.html#${escape(id)}" class="${completed.has(id) ? 'is-complete' : ''}"><b>${escape(id.toUpperCase())}</b><span>${escape(byChapter.get(id).title)}</span></a>`).join('');
  }

  function renderGuided() {
    const done = guided.ids.filter(id => completed.has(id)).length;
    const nextId = guided.ids.find(id => !completed.has(id));
    const next = nextId && guided.unitByChapter[nextId];
    const target = nextId ? `textbook.html#${escape(nextId)}` : 'project-lab.html';
    const label = nextId ? `继续：${escape(byChapter.get(nextId)?.title || nextId)} →` : '主线完成 · 去 Project Lab 综合练习 →';
    document.querySelector('#guided-progress').textContent = `主线已完成 ${done} / ${guided.ids.length} 步`;
    document.querySelector('#guided-next').href = target;
    document.querySelector('#guided-next').innerHTML = label;
    const hero = document.querySelector('#hero-resume');
    hero.href = target;
    hero.textContent = done ? (nextId ? '继续上次的主线 →' : '去做综合案例 →') : '从第一步开始 →';
    document.querySelector('#guided-units').innerHTML = guided.units.map((unit, index) => {
      const unitDone = unit.core.filter(id => completed.has(id)).length;
      const isCurrent = next?.unit.id === unit.id;
      return `<details class="guided-unit" id="unit-${escape(unit.id)}" ${isCurrent || (!nextId && index === guided.units.length - 1) ? 'open' : ''}>
        <summary><span class="guided-unit-number">${String(index + 1).padStart(2, '0')}</span><span class="guided-unit-heading"><strong>${escape(unit.title)}</strong><small>${escape(unit.question)}</small></span><span class="guided-unit-progress">${unitDone} / ${unit.core.length}</span></summary>
        <div class="guided-unit-body"><p class="guided-outcome">学完后：${escape(unit.outcome)}</p><ol>${unit.core.map((id, step) => `<li class="${completed.has(id) ? 'is-complete' : ''} ${id === nextId ? 'is-next' : ''}"><a href="textbook.html#${escape(id)}"><span>${String(step + 1).padStart(2, '0')}</span><b>${escape(byChapter.get(id)?.title || id)}</b>${id === nextId ? '<em>下一步</em>' : ''}</a></li>`).join('')}</ol><p class="guided-bridge">${escape(unit.bridge)}</p><div class="guided-apply"><b>换成自己的数据</b><p>${escape(unit.transfer[0])}</p><a href="${escape(unit.transfer[1])}">打开项目工作页 →</a></div><div class="guided-unit-more"><p><b>需要更深时再读</b> ${unit.explore.map(id => `<a href="textbook.html#${escape(id)}">${escape(byChapter.get(id)?.title || id)}</a>`).join(' · ')}</p><a class="guided-practice" href="${escape(unit.practice[0])}">${escape(unit.practice[1])} ↗</a></div></div>
      </details>`;
    }).join('');
  }

  function renderTracks() {
    document.querySelector('#track-switch').innerHTML = data.tracks.map(track => `<button type="button" data-track="${escape(track.id)}" aria-pressed="${track.id === activeTrack}">${escape(track.label)}</button>`).join('');
    const track = data.tracks.find(item => item.id === activeTrack);
    const remaining=track.chapters.slice(6);
    document.querySelector('#track-summary').innerHTML = `<div><h3>${escape(track.title)}</h3><p>${escape(track.description)}</p></div><div class="track-chapters"><div class="track-preview">${chapterLinks(track.chapters.slice(0,6))}</div>${remaining.length?`<details class="track-more"><summary>查看其余 ${remaining.length} 章</summary><div>${chapterLinks(remaining)}</div></details>`:''}</div>`;
  }

  function renderStages() {
    document.querySelector('#stage-list').innerHTML = data.stages.map((stage, index) => {
      const stageCourses = stage.courseCodes.map(code => byCode.get(code)).filter(Boolean);
      const chapters = stageCourses.flatMap(course => course.chapters);
      const done = chapters.filter(chapter => completed.has(chapter.id)).length;
      return `<article class="stage" data-stage="${escape(stage.id)}">
        <div class="stage-index"><b>${String(index + 1).padStart(2, '0')}</b><span>${escape(stage.year)}</span></div>
        <header><span>${escape(stage.short)}</span><h3>${escape(stage.title)}</h3><p>${escape(stage.description)}</p><div class="official-codes">${stage.official.map(code => `<b>${escape(code)}</b>`).join('')}</div></header>
        <div class="stage-content">
          <div class="stage-progress"><span style="width:${chapters.length ? done / chapters.length * 100 : 0}%"></span></div>
          <small>${done} / ${chapters.length} chapters complete</small>
          <ul>${stageCourses.map(course => `<li><a href="textbook.html#${escape(course.chapters[0].id)}"><span>COURSE ${escape(course.code)}</span><b>${escape(course.title)}</b><small>${course.chapters.length} chapters →</small></a></li>`).join('')}</ul>
        </div>
      </article>`;
    }).join('');
  }

  function renderAdvanced() {
    document.querySelector('#advanced-grid').innerHTML = data.advancedClusters.map((cluster, index) => `<article><span>${String(index + 1).padStart(2, '0')} · ${escape(cluster.courses)}</span><h3>${escape(cluster.title)}</h3><p>${escape(cluster.description)}</p><div>${cluster.chapters.slice(0, 5).map(id => `<a href="textbook.html#${escape(id)}">${escape(id.toUpperCase())}</a>`).join('')}</div></article>`).join('');
  }

  function renderSupport() {
    document.querySelector('#support-list').innerHTML = data.supporting.map((item, index) => `<article><b>${String(index + 1).padStart(2, '0')}</b><div><h3>${escape(item[0])}</h3><span>${escape(item[1])}</span><p>${escape(item[2])}</p></div></article>`).join('');
  }

  function renderSources() {
    const labels = {mcb:'MCB BSLAS', mcbds:'MCB + Data Science', ib:'Integrative Biology', advanced:'Advanced MCB Courses', mcb354:'MCB 354 Syllabus', mcb408:'MCB 408 Syllabus', mcb364:'MCB 364 Lab Syllabus', biop401:'BIOP 401 Syllabus', mcb438:'MCB 438 Virology Syllabus', mcb466:'MCB 466 Pharmacology Syllabus', biology:'Choosing Your Major'};
    document.querySelector('#official-links').innerHTML = Object.entries(data.sources).map(([key, url]) => `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(labels[key])} ↗</a>`).join('');
  }

  document.querySelector('#track-switch').addEventListener('click', event => {
    const button = event.target.closest('button[data-track]');
    if (!button) return;
    activeTrack = button.dataset.track;
    renderTracks();
    document.querySelector('#track-summary').animate([{opacity:.35,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}], {duration:220,easing:'ease-out'});
  });

  renderGuided();
  renderTracks();
  renderStages();
  renderAdvanced();
  renderSupport();
  renderSources();
})();
