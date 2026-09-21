(() => {
  const courses = window.BIOCS_BOOK;
  const sources = window.BIOCS_SOURCES;
  const uiuc = window.BIOCS_UIUC;
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
    const renderCourse = course => {
      const matches = course.chapters.filter(ch => !term || [ch.id,course.title,ch.title,ch.subtitle,ch.intro,ch.core,...(ch.intuition||window.BIOCS_INTUITION?.[ch.id]||[]),...ch.sections.map(s => s[0]+' '+s[1]),...(ch.terms||[]).map(t => t[0]+' '+t[1])].join(' ').replace(/<[^>]+>/g,'').toLocaleLowerCase().includes(term));
      if (!matches.length) return '';
      return `<section class="toc-course"><h2><span>${escape(course.code)}</span>${escape(course.title)}</h2>${matches.map(ch => `<a href="#${escape(ch.id)}" data-id="${escape(ch.id)}" ${ch.id===state.active?'aria-current="page"':''} class="${state.completed.has(ch.id)?'is-complete':''}"><b>${escape(ch.id.toUpperCase())}</b><span>${escape(ch.title)}</span></a>`).join('')}</section>`;
    };
    $('#book-toc').innerHTML = uiuc.stages.map((stage,index) => {
      const contents=stage.courseCodes.map(code=>courses.find(course=>course.code===code)).filter(Boolean).map(renderCourse).join('');
      if(!contents)return '';
      return `<section class="toc-stage"><header><b>${String(index+1).padStart(2,'0')}</b><span>${escape(stage.year)} · ${escape(stage.short)}</span></header>${contents}</section>`;
    }).join('') || '<p class="toc-empty">没有匹配的章节。试试 DNA、enhancer、signaling 或 TCGA。</p>';
    $('#search-status').textContent = term ? `找到 ${$('#book-toc').querySelectorAll('a').length} 章；清空搜索可查看全部。` : `全部 ${chapters.length} 章`;
  }
  function renderCurriculum() {
    $('#curriculum-tracks').innerHTML=uiuc.tracks.map(track=>`<section><span>${escape(track.label)}</span><h3>${escape(track.title)}</h3><p>${escape(track.description)}</p><div>${track.chapters.map(id=>`<a href="#${id}">${id.toUpperCase()}</a>`).join('')}</div></section>`).join('');
    $('#curriculum-grid').innerHTML = uiuc.stages.map((stage,index)=>`<section class="curriculum-stage"><header><b>${String(index+1).padStart(2,'0')}</b><div><span>${escape(stage.year)} · ${escape(stage.official.join(' + '))}</span><h3>${escape(stage.title)}</h3><p>${escape(stage.description)}</p></div></header>${stage.courseCodes.map(code=>courses.find(course=>course.code===code)).filter(Boolean).map(course => `<section class="curriculum-course"><div><h3><span>COURSE ${escape(course.code)} · ${course.chapters.length} CHAPTERS</span>${escape(course.title)}</h3><p>${escape(course.description)}</p></div><ul>${course.chapters.map(ch => `<li><a href="#${escape(ch.id)}">${escape(ch.id.toUpperCase())} · ${escape(ch.title)}</a></li>`).join('')}</ul></section>`).join('')}</section>`).join('');
    $('#book-scope').textContent=`UIUC 5 阶段 · ${courses.length} 门课 · ${chapters.length} 章；Genetics 深入。`;
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
    const uiucStage=uiuc.stageByCourse[chapter.course.code];
    const intuition=chapter.intuition||window.BIOCS_INTUITION?.[chapter.id];
    const core=chapter.core||({b:'Structure & Function / 结构与功能',g:'Information Flow / 信息流',m:'Information Flow / 信息流',c:'Systems / 系统',t:'Evolution & Systems / 演化与系统',d:'Science Practice / 科学实践',r:'Science Practice / 科学实践',s:'Structure & Function / 结构与功能',k:'Science Practice / 科学实践',q:'Information Flow / 信息流'})[chapter.id[0]];
    const anchorTerms=(chapter.terms||[]).slice(0,4).map(item=>item[0]);
    const intuitionHTML=intuition?`<section class="intuition-panel" aria-labelledby="intuition-title"><div class="intuition-meta"><span>INTUITION FIRST · 先建立直觉</span>${core?`<b>${escape(core)}</b>`:''}</div><h2 id="intuition-title">${escape(intuition[0])}</h2><p>${escape(intuition[1])}</p>${anchorTerms.length?`<div class="intuition-terms"><span>本章英文锚点</span>${anchorTerms.map(item=>`<b>${escape(item.split(' / ')[0])}</b>`).join('')}</div>`:''}</section>`:'';
    const practiceMap={x06:['#regulation','调控逻辑：同时改变 chromatin、TF 与 enhancer contact'],x14:['#vaf','VAF 分母：拖动 purity、CNV、mutant copy 与 CCF'],l05:['#dynamics','信号时间：比较 pulse、sustained input 与 feedback']};
    const practice=practiceMap[chapter.id];
    const practiceHTML=practice?`<a class="chapter-practice-link" href="genetics-lab.html${practice[0]}"><span>可操作模型 · INTERACTIVE</span><b>${escape(practice[1])}</b><i aria-hidden="true">→</i></a>`:'';
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
    $('#chapter-body').innerHTML = `<div class="book-article"><header class="book-hero"><span class="book-kicker">${escape(uiucStage.year)} · ${escape(uiucStage.subtitle)} · CHAPTER ${escape(chapter.id.toUpperCase())} · ${number+1} / ${chapters.length}</span><h1>${escape(chapter.title)}</h1><p class="book-subtitle">${escape(chapter.subtitle)}</p><p class="uiuc-alignment"><b>UIUC PATH · ${escape(uiucStage.short)}</b><span>${escape(uiucStage.title)} → ${escape(chapter.course.title)}</span></p><ul class="book-objectives">${chapter.goals.map(g=>`<li>${escape(g)}</li>`).join('')}</ul>${prereq}</header>${intuitionHTML}${practiceHTML}<p class="book-intro">${chapter.intro}</p>${dataBridge}${visual}${sectionHTML}${worked}${terms}${check}${refs}</div>`;
    $('#chapter-position').textContent = `${chapter.course.title} · ${number+1} / ${chapters.length}`;
    if(window.BIOCS_MOTION?.scenes?.some(scene=>scene.chapters.includes(chapter.id))){
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
