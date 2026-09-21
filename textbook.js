(() => {
  const courses = window.BIOCS_BOOK;
  const sources = window.BIOCS_SOURCES;
  const chapters = courses.flatMap(course => course.chapters.map((chapter, index) => ({...chapter, course, index})));
  const byId = new Map(chapters.map(ch => [ch.id, ch]));
  const state = {active: chapters[0]?.id, completed: new Set()};
  const key = 'biocs-textbook-progress-v1';
  const $ = selector => document.querySelector(selector);
  const escape = s => String(s ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const sourceLink = key => {
    const source = sources[key];
    return source ? `<a href="${escape(source[1])}" target="_blank" rel="noopener noreferrer">${escape(source[0])} ↗</a>` : '';
  };
  try { const saved = JSON.parse(localStorage.getItem(key) || '[]'); if (Array.isArray(saved)) state.completed = new Set(saved.filter(id => byId.has(id))); } catch (_) {}
  function save() { try { localStorage.setItem(key, JSON.stringify([...state.completed])); } catch (_) {} }
  function renderToc(query = '') {
    const term = query.trim().toLocaleLowerCase();
    $('#book-toc').innerHTML = courses.map(course => {
      const matches = course.chapters.filter(ch => !term || [ch.id,course.title,ch.title,ch.subtitle,ch.intro,...ch.sections.map(s => s[0]+' '+s[1]),...(ch.terms||[]).map(t => t[0]+' '+t[1])].join(' ').replace(/<[^>]+>/g,'').toLocaleLowerCase().includes(term));
      if (!matches.length) return '';
      return `<section class="toc-course"><h2><span>${escape(course.code)}</span>${escape(course.title)}</h2>${matches.map(ch => `<a href="#${escape(ch.id)}" data-id="${escape(ch.id)}" ${ch.id===state.active?'aria-current="page"':''} class="${state.completed.has(ch.id)?'is-complete':''}"><b>${escape(ch.id.toUpperCase())}</b><span>${escape(ch.title)}</span></a>`).join('')}</section>`;
    }).join('') || '<p class="toc-empty">没有匹配的章节。试试 DNA、细胞、RNA 或 TCGA。</p>';
    $('#search-status').textContent = term ? `找到 ${$('#book-toc').querySelectorAll('a').length} 章；清空搜索可查看全部。` : `全部 ${chapters.length} 章`;
  }
  function renderCurriculum() {
    $('#curriculum-grid').innerHTML = courses.map(course => `<section class="curriculum-course"><div><h3><span>COURSE ${escape(course.code)}</span>${escape(course.title)}</h3><p>${escape(course.description)}</p></div><ul>${course.chapters.map(ch => `<li><a href="#${escape(ch.id)}">${escape(ch.id.toUpperCase())} · ${escape(ch.title)}</a></li>`).join('')}</ul></section>`).join('');
  }
  function renderProgress() {
    $('#book-progress-fill').style.width = `${state.completed.size / chapters.length * 100}%`;
    $('#book-progress-label').textContent = `${state.completed.size} / ${chapters.length} 章已完成`;
    $('#mark-chapter').classList.toggle('done', state.completed.has(state.active));
    $('#mark-chapter').textContent = state.completed.has(state.active) ? '已学完 · 撤销标记' : '标记本章已学完';
  }
  function renderChapter(id, scroll = false) {
    const chapter = byId.get(id) || chapters[0];
    if (!chapter) return;
    state.active = chapter.id;
    const number = chapters.indexOf(chapter), sourceKeys = new Set();
    const lens = window.BIOCS_DATA_LENS?.[chapter.id];
    const dataBridge = lens ? (() => {
      (lens[3] || []).forEach(key => sourceKeys.add(key));
      const practice = lens[4] ? `<a class="data-bridge-practice" href="${escape(lens[4])}">动手试一试 ↗</a>` : '';
      return `<aside class="data-bridge" aria-label="本章概念与数据的连接"><div class="data-bridge-head"><strong>把这章接到数据上</strong>${practice}</div><dl><div><dt>实验信号</dt><dd>${escape(lens[0])}</dd></div><div><dt>文件与单位</dt><dd>${escape(lens[1])}</dd></div><div><dt>推断边界</dt><dd>${escape(lens[2])}</dd></div></dl><p class="data-bridge-sources">依据 ${(lens[3]||[]).map(sourceLink).join(' · ')}</p></aside>`;
    })() : '';
    const sectionHTML = chapter.sections.map((section, i) => {
      (section[2] || []).forEach(key => sourceKeys.add(key));
      return `<section class="chapter-section"><span class="section-count">${String(i+1).padStart(2,'0')} / ${escape(chapter.id.toUpperCase())}</span><h2>${escape(section[0])}</h2><div>${section[1]}</div><div class="chapter-refs">${(section[2]||[]).map(sourceLink).join(' · ')}</div></section>`;
    }).join('');
    (chapter.terms||[]).forEach(term => sourceKeys.add(term[2]));
    (chapter.more||[]).forEach(key => sourceKeys.add(key));
    let visual = '';
    if (chapter.image) {
      (chapter.image[3] || []).forEach(key => sourceKeys.add(key));
      visual = `<figure class="concept-figure"><div class="book-image-scroll"><img src="${escape(chapter.image[0])}" alt="${escape(chapter.image[1])}" loading="lazy"></div><figcaption>原创教学示意 · ${escape(chapter.image[2])} 图像依据 ${(chapter.image[3]||[]).map(sourceLink).join(' · ')}。手机端可左右滑动查看。</figcaption></figure>`;
    } else if (chapter.flow) {
      visual = `<figure class="concept-figure"><div class="concept-flow" role="img" aria-label="${escape(chapter.flow.map(x=>x[0]).join('，然后'))}">${chapter.flow.map((item,i)=>`${i?'<span aria-hidden="true">→</span>':''}<div><b>${escape(item[0])}</b><small>${escape(item[1])}</small></div>`).join('')}</div><figcaption>原创概念图 · 简化关系，细节和限制见正文；依据本章来源。</figcaption></figure>`;
    }
    const worked = chapter.worked ? `<aside class="worked"><h2>WORKED EXAMPLE · 跟着做</h2><h3>${escape(chapter.worked[0])}</h3><ol>${chapter.worked[1].map(x=>`<li>${x}</li>`).join('')}</ol></aside>` : '';
    const terms = chapter.terms?.length ? `<section class="book-vocab"><h2>本章术语</h2><div class="vocab-grid">${chapter.terms.map(term=>`<div><strong>${escape(term[0])}</strong><p>${escape(term[1])}</p>${sourceLink(term[2])}</div>`).join('')}</div></section>` : '';
    const check = chapter.check ? `<section class="book-check"><h2>CHECK YOUR UNDERSTANDING</h2><p>${escape(chapter.check[0])}</p><details><summary>展开答案与理由</summary><p>${chapter.check[1]}</p></details></section>` : '';
    const refs = `<section class="book-sources"><h2>来源与继续阅读</h2><ol>${[...sourceKeys].map(key=>`<li>${sourceLink(key)}</li>`).join('')}</ol></section>`;
    const prereq = chapter.prereq?.length ? `<p class="prereq">建议先读：${chapter.prereq.map(id=>`<a href="#${escape(id)}">${escape(byId.get(id)?.title||id)}</a>`).join(' · ')}</p>` : '<p class="prereq">不要求生物学前置知识。</p>';
    $('#chapter-body').innerHTML = `<div class="book-article"><header class="book-hero"><span class="book-kicker">COURSE ${escape(chapter.course.code)} · CHAPTER ${escape(chapter.id.toUpperCase())} · ${number+1} / ${chapters.length}</span><h1>${escape(chapter.title)}</h1><p class="book-subtitle">${escape(chapter.subtitle)}</p><ul class="book-objectives">${chapter.goals.map(g=>`<li>${escape(g)}</li>`).join('')}</ul>${prereq}</header><p class="book-intro">${chapter.intro}</p>${dataBridge}${visual}${sectionHTML}${worked}${terms}${check}${refs}</div>`;
    $('#chapter-position').textContent = `${chapter.course.title} · ${number+1} / ${chapters.length}`;
    if(window.BIOCS_MOTION){
      const motionHost=document.createElement('section');
      motionHost.id='chapter-motion';
      const bridge=$('.data-bridge');
      if(bridge)bridge.after(motionHost);else $('.book-intro').after(motionHost);
      window.BIOCS_MOTION.mountChapter(chapter.id,motionHost);
    }
    $('#prev-chapter').disabled = number === 0;
    $('#next-chapter').disabled = number === chapters.length-1;
    document.title = `${chapter.title} · Bio/CS 零基础教材`;
    renderToc($('#chapter-search').value);
    renderProgress();
    if (scroll) { $('#chapter').focus({preventScroll:true}); window.scrollTo({top:0,behavior:'instant'}); }
  }
  $('#chapter-search').addEventListener('input', e => renderToc(e.target.value));
  $('.skip-link').addEventListener('click', e => { e.preventDefault(); $('#chapter').focus(); $('#chapter').scrollIntoView(); });
  const mobile = window.matchMedia('(max-width:760px)');
  function closeToc(returnFocus = false) {
    const wasOpen = $('.book-sidebar').classList.contains('open');
    $('.book-sidebar').classList.remove('open');
    $('.book-main').inert = false; $('.book-header').inert = false;
    document.body.classList.remove('toc-is-open');
    $('#toc-toggle').setAttribute('aria-expanded','false'); $('#toc-toggle').textContent='打开目录';
    if (returnFocus && wasOpen) $('#toc-toggle').focus();
  }
  $('#toc-toggle').addEventListener('click', () => {
    if ($('.book-sidebar').classList.contains('open')) { closeToc(true); return; }
    $('.book-sidebar').classList.add('open');
    $('.book-main').inert = true; $('.book-header').inert = true;
    document.body.classList.add('toc-is-open');
    $('#toc-toggle').textContent='收起目录'; $('#toc-toggle').setAttribute('aria-expanded','true');
    $('#chapter-search').focus();
  });
  $('#toc-close').addEventListener('click', () => closeToc(true));
  $('#book-toc').addEventListener('click', e => { if (e.target.closest('a')) { closeToc(); if (mobile.matches) $('#chapter').focus({preventScroll:true}); } });
  document.addEventListener('keydown', e => {
    if (!$('.book-sidebar').classList.contains('open')) return;
    if (e.key==='Escape') { e.preventDefault(); closeToc(true); }
    if (e.key==='Tab') {
      const items = [...$('.book-sidebar').querySelectorAll('button,input,a[href]')];
      const first=items[0], last=items[items.length-1];
      if (e.shiftKey && document.activeElement===first) {e.preventDefault();last.focus();}
      else if (!e.shiftKey && document.activeElement===last) {e.preventDefault();first.focus();}
    }
  });
  mobile.addEventListener('change', () => closeToc());
  $('#prev-chapter').addEventListener('click', () => { const i=chapters.findIndex(ch=>ch.id===state.active); if(i>0) location.hash=chapters[i-1].id; });
  $('#next-chapter').addEventListener('click', () => { const i=chapters.findIndex(ch=>ch.id===state.active); if(i<chapters.length-1) location.hash=chapters[i+1].id; });
  $('#mark-chapter').addEventListener('click', () => { if(state.completed.has(state.active))state.completed.delete(state.active);else state.completed.add(state.active);save();renderProgress();renderToc($('#chapter-search').value); });
  window.addEventListener('hashchange', () => { const id=location.hash.slice(1); if (byId.has(id)) renderChapter(id, true); });
  renderCurriculum();
  renderChapter(location.hash.slice(1));
})();
