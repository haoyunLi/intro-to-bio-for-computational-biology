(() => {
  const courses = window.BIOCS_BOOK;
  const sources = window.BIOCS_SOURCES;
  const uiuc = window.BIOCS_UIUC;
  const guided = window.BIOCS_GUIDED_PATH;
  const glossary = window.BIOCS_GLOSSARY;
  const chapters = courses.flatMap(course => course.chapters.map((chapter, index) => ({...chapter, course, index})));
  const allChapterIds = chapters.map(chapter => chapter.id);
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
    const library = uiuc.stages.map((stage,index) => {
      const contents=stage.courseCodes.map(code=>courses.find(course=>course.code===code)).filter(Boolean).map(renderCourse).join('');
      if(!contents)return '';
      return `<section class="toc-stage"><header><b>${String(index+1).padStart(2,'0')}</b><span>${escape(stage.year)} · ${escape(stage.short)}</span></header>${contents}</section>`;
    }).join('');
    if (term) {
      $('#book-toc').innerHTML = library || '<p class="toc-empty">没有匹配的章节。试试 DNA、enhancer、signaling 或 TCGA。</p>';
      $('#search-status').textContent = `找到 ${$('#book-toc').querySelectorAll('.toc-course>a').length} 章；清空搜索可回到主线。`;
      return;
    }
    const currentUnit = guided.unitByChapter[state.active]?.unit.id;
    const main = guided.units.map((unit, index) => `<details class="toc-guided-unit" ${unit.id === currentUnit ? 'open' : ''}><summary><b>${String(index+1).padStart(2,'0')}</b>${escape(unit.title)}<small>${unit.core.filter(id=>state.completed.has(id)).length}/${unit.core.length}</small></summary><div>${unit.core.map(id=>`<a href="#${escape(id)}" ${id===state.active?'aria-current="page"':''} class="${state.completed.has(id)?'is-complete':''}">${escape(byId.get(id)?.title || id)}</a>`).join('')}</div></details>`).join('');
    $('#book-toc').innerHTML = `<div class="toc-guided"><h2>连续学习主线</h2>${main}</div><details class="toc-library" ${currentUnit?'':'open'}><summary>按课程查全部 ${chapters.length} 章</summary>${library}</details>`;
    $('#search-status').textContent = `主线 ${guided.ids.length} 步 · 全站 ${chapters.length} 章`;
  }
  function renderCurriculum() {
    $('#curriculum-tracks').innerHTML=uiuc.tracks.map(track=>`<section><span>${escape(track.label)}</span><h3>${escape(track.title)}</h3><p>${escape(track.description)}</p><div>${track.chapters.map(id=>`<a href="#${id}">${id.toUpperCase()}</a>`).join('')}</div></section>`).join('');
    $('#curriculum-grid').innerHTML = uiuc.stages.map((stage,index)=>`<section class="curriculum-stage"><header><b>${String(index+1).padStart(2,'0')}</b><div><span>${escape(stage.year)} · ${escape(stage.official.join(' + '))}</span><h3>${escape(stage.title)}</h3><p>${escape(stage.description)}</p></div></header>${stage.courseCodes.map(code=>courses.find(course=>course.code===code)).filter(Boolean).map(course => `<section class="curriculum-course"><div><h3><span>COURSE ${escape(course.code)} · ${course.chapters.length} CHAPTERS</span>${escape(course.title)}</h3><p>${escape(course.description)}</p></div><ul>${course.chapters.map(ch => `<li><a href="#${escape(ch.id)}">${escape(ch.id.toUpperCase())} · ${escape(ch.title)}</a></li>`).join('')}</ul></section>`).join('')}</section>`).join('');
    $('#book-scope').textContent=`先学 ${guided.ids.length} 步主线，再按需查 ${chapters.length - guided.ids.length} 章拓展。`;
  }
  function renderProgress() {
    const mainDone=guided.ids.filter(id=>state.completed.has(id)).length;
    $('#book-progress-fill').style.width = `${mainDone / guided.ids.length * 100}%`;
    $('#book-progress-label').textContent = `主线 ${mainDone} / ${guided.ids.length} · 全站 ${state.completed.size} / ${chapters.length}`;
    $('#mark-chapter').classList.toggle('done', state.completed.has(state.active));
    $('#mark-chapter').textContent = state.completed.has(state.active) ? '已学完 · 撤销标记' : '标记本章已学完';
  }
  function markInlineTerms(chapter) {
    const candidates = new Map();
    const title = `${chapter.title} ${chapter.subtitle}`.toLocaleLowerCase();
    const aliases = {'Tumor purity':['purity'],'Copy number':['copy number']};
    const add = (name, extra = []) => {
      const entry = glossary.get(name);
      if (entry && !candidates.has(glossary.normalized(entry.label))) candidates.set(glossary.normalized(entry.label), {entry, patterns:[entry.label,...extra]});
    };
    for (const term of chapter.terms || []) add(term[0]);
    for (const name of glossary.essentials) {
      const extra = aliases[name] || [];
      if ([name,...extra].some(label => title.includes(label.toLocaleLowerCase()))) add(name, extra);
    }
    const remaining = [...candidates.values()];
    const used = new Set();
    const isWord = char => /[A-Za-z0-9]/.test(char || '');
    const roots = $('#chapter-body').querySelectorAll('.book-subtitle,.book-thesis,.book-intro,.chapter-section,.worked,.data-bridge');
    const nodes = [];
    for (const root of roots) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) nodes.push(walker.currentNode);
    }
    for (const node of nodes) {
      if (used.size >= 8 || node.parentElement?.closest('a,button,code,pre,summary,.chapter-refs,.data-bridge-sources')) continue;
      const value = node.textContent;
      const lower = value.toLocaleLowerCase();
      let cursor = 0;
      const fragment = document.createDocumentFragment();
      let changed = false;
      while (cursor < value.length && used.size < 8) {
        let best = null;
        for (const candidate of remaining) {
          if (used.has(glossary.normalized(candidate.entry.label))) continue;
          for (const pattern of candidate.patterns) {
            const needle = pattern.toLocaleLowerCase();
            let at = lower.indexOf(needle, cursor);
            while (at >= 0 && (isWord(value[at-1]) || isWord(value[at+needle.length]))) at = lower.indexOf(needle, at+1);
            if (at >= 0 && (!best || at < best.at || (at === best.at && needle.length > best.length))) best = {at, length:needle.length, entry:candidate.entry};
          }
        }
        if (!best) break;
        fragment.append(document.createTextNode(value.slice(cursor,best.at)));
        const button=document.createElement('button');
        button.type='button'; button.className='inline-term'; button.dataset.term=best.entry.label;
        button.setAttribute('aria-label',`解释术语 ${best.entry.label}`);
        button.textContent=value.slice(best.at,best.at+best.length);
        fragment.append(button);
        used.add(glossary.normalized(best.entry.label));
        cursor=best.at+best.length;
        changed=true;
      }
      if (changed) {fragment.append(document.createTextNode(value.slice(cursor)));node.replaceWith(fragment);}
    }
  }
  let lastTermTrigger = null;
  function closeTerm(returnFocus = true) {
    const panel=$('#term-panel');
    if (panel.hidden) return;
    panel.hidden=true;
    if (returnFocus) lastTermTrigger?.focus();
  }
  function openTerm(name, trigger) {
    const entry=glossary.get(name);
    if (!entry) return;
    lastTermTrigger=trigger;
    $('#term-name').textContent=entry.label;
    $('#term-simple').textContent=entry.simple;
    $('#term-example').hidden=!entry.example;
    $('#term-example').textContent=entry.example?`例如 · ${entry.example}`:'';
    $('#term-caution').hidden=!entry.caution;
    $('#term-caution').textContent=entry.caution?`别误会 · ${entry.caution}`:'';
    const source=sources[entry.sourceKey];
    $('#term-links').innerHTML=`<a href="textbook.html#${escape(entry.chapterId)}">相关章节 →</a><a href="glossary.html?q=${encodeURIComponent(entry.label)}">在术语库查看 →</a>${source?`<a href="${escape(source[1])}" target="_blank" rel="noopener noreferrer">来源 ↗</a>`:''}`;
    $('#term-panel').hidden=false;
    $('#term-panel').focus({preventScroll:true});
  }
  function renderChapter(id, scroll = false) {
    closeTerm(false);
    const chapter = byId.get(id) || chapters[0];
    if (!chapter) return;
    state.active = chapter.id;
    const number = chapters.indexOf(chapter), sourceKeys = new Set();
    const routeStep = guided.unitByChapter[chapter.id];
    const navigationIds = routeStep ? guided.ids : allChapterIds;
    const navigationIndex = navigationIds.indexOf(chapter.id);
    const nextId = navigationIds[navigationIndex + 1];
    const uiucStage=uiuc.stageByCourse[chapter.course.code];
    const intuition=chapter.intuition||window.BIOCS_INTUITION?.[chapter.id];
    const anchorTerms=(chapter.terms||[]).slice(0,4).map(item=>item[0]);
    const intuitionHTML=intuition?`<div class="book-thesis"><p>${escape(intuition[0])}</p><small>${escape(intuition[1])}</small></div>`:'';
    const chapterGuide=`<nav class="chapter-story-map" aria-label="本章推理步骤"><span>这一章怎样讲清楚</span><ol>${chapter.sections.map((section,i)=>`<li><a href="#step-${escape(chapter.id)}-${i+1}"><b>${String(i+1).padStart(2,'0')}</b>${escape(section[0])}</a></li>`).join('')}</ol></nav>`;
    const practiceMap={x06:['#regulation','调控逻辑：同时改变 chromatin、TF 与 enhancer contact'],x14:['#vaf','VAF 分母：拖动 purity、CNV、mutant copy 与 CCF'],x18:['project-lab.html#genetics-reasoning','结构变异：把 copy number、purity 与 read-level observation 分开'],x19:['project-lab.html#raw-assay','Allele-specific reasoning：先辨 assay signal 与 mapping bias'],x20:['project-lab.html#claim-builder','QTL 到因果：给每一句结论标 evidence level'],x21:['project-lab.html#integration','Immunogenetics：从 mutation 走到 antigen presentation 与功能'],x22:['project-lab.html#genetics-reasoning','Tumor evolution：沿多个时间点重建有限的 clone hypothesis'],l05:['#dynamics','信号时间：比较 pulse、sustained input 与 feedback']};
    const practice=practiceMap[chapter.id];
    const practiceHTML=practice?`<a class="chapter-practice-link" href="${practice[0].startsWith('project-lab')?practice[0]:`genetics-lab.html${practice[0]}`}"><span>可操作模型 · INTERACTIVE</span><b>${escape(practice[1])}</b><i aria-hidden="true">→</i></a>`:'';
    const lens = window.BIOCS_DATA_LENS?.[chapter.id];
    const dataBridge = lens ? (() => {
      (lens[3] || []).forEach(key => sourceKeys.add(key));
      const practice = lens[4] ? `<a class="data-bridge-practice" href="${escape(lens[4])}">动手试一试 ↗</a>` : '';
      return `<aside class="data-bridge" aria-label="本章概念与数据的连接"><div class="data-bridge-head"><strong>把这章接到数据上</strong>${practice}</div><dl><div><dt>实验信号</dt><dd>${escape(lens[0])}</dd></div><div><dt>文件与单位</dt><dd>${escape(lens[1])}</dd></div><div><dt>推断边界</dt><dd>${escape(lens[2])}</dd></div></dl><p class="data-bridge-sources">依据 ${(lens[3]||[]).map(sourceLink).join(' · ')}</p></aside>`;
    })() : '';
    const sectionParts = chapter.sections.map((section, i) => {
      (section[2] || []).forEach(key => sourceKeys.add(key));
      return `<section class="chapter-section" id="step-${escape(chapter.id)}-${i+1}" tabindex="-1"><span class="section-count">${String(i+1).padStart(2,'0')} / ${escape(chapter.id.toUpperCase())}</span><h2>${escape(section[0])}</h2><div>${section[1]}</div><div class="chapter-refs">${(section[2]||[]).map(sourceLink).join(' · ')}</div></section>`;
    });
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
    const readingSections = routeStep ? sectionParts.join('') + worked : sectionParts[0] + worked + sectionParts.slice(1).join('');
    const terms = chapter.terms?.length ? `<section class="book-vocab"><h2>本章术语</h2><div class="vocab-grid">${chapter.terms.map(term=>`<div><strong>${escape(term[0])}</strong><p>${escape(term[1])}</p>${sourceLink(term[2])}</div>`).join('')}</div></section>` : '';
    const check = chapter.check ? `<section class="book-check"><h2>CHECK YOUR UNDERSTANDING</h2><p>${escape(chapter.check[0])}</p><details><summary>展开答案与理由</summary><p>${chapter.check[1]}</p></details></section>` : '';
    const transfer = routeStep && routeStep.index === routeStep.unit.core.length - 1 ? `<section class="chapter-transfer" aria-label="把本单元应用到自己的数据"><span>单元 ${String(routeStep.unitIndex + 1).padStart(2,'0')} · 主线最后一章</span><h2>把这一步用在自己的数据上</h2><p>${escape(routeStep.unit.transfer[0])}</p><a href="${escape(routeStep.unit.transfer[1])}">去整理自己的项目 →</a></section>` : '';
    const refs = `<section class="book-sources"><h2>来源与继续阅读</h2><ol>${[...sourceKeys].map(key=>`<li>${sourceLink(key)}</li>`).join('')}</ol></section>`;
    const prereq = chapter.prereq?.length ? `<p class="prereq">建议先读：${chapter.prereq.map(id=>`<a href="#${escape(id)}">${escape(byId.get(id)?.title||id)}</a>`).join(' · ')}</p>` : '<p class="prereq">不要求生物学前置知识。</p>';
    const pathLabel=routeStep?`主线 ${navigationIndex+1} / ${guided.ids.length} · ${routeStep.unit.title}`:`拓展章节 · ${chapter.course.title}`;
    $('#chapter-body').innerHTML = `<div class="book-article"><header class="book-hero"><h1>${escape(chapter.title)}</h1><span class="book-kicker">${escape(chapter.course.title)} · ${escape(chapter.id.toUpperCase())} · ${number+1} / ${chapters.length}</span><p class="book-subtitle">${escape(chapter.subtitle)}</p>${intuitionHTML}<div class="book-context"><a href="index.html#guided-route">${escape(pathLabel)} ↗</a><p>${escape(uiucStage.year)} · ${escape(uiucStage.title)}</p>${prereq}</div></header>${chapter.intro?`<p class="book-intro">${chapter.intro}</p>`:''}${visual}${chapterGuide}${readingSections}${dataBridge}${practiceHTML}<div class="book-term-line"><b>本章 English terms</b><span>${anchorTerms.map(item=>escape(item.split(' / ')[0])).join(' · ')}</span></div><details class="book-goals"><summary>读完本章，你应该能做什么？</summary><ul>${chapter.goals.map(g=>`<li>${escape(g)}</li>`).join('')}</ul></details>${terms}${check}${transfer}${refs}</div>`;
    markInlineTerms(chapter);
    $('#chapter-position').textContent = pathLabel;
    if(window.BIOCS_MOTION?.scenes?.some(scene=>scene.chapters.includes(chapter.id))){
      const motionHost=document.createElement('section');
      motionHost.id='chapter-motion';
      const practiceLink=$('.chapter-practice-link');
      const bridge=$('.data-bridge');
      const workedExample=$('.worked');
      const lastSection=[...document.querySelectorAll('.chapter-section')].at(-1);
      (practiceLink || bridge || workedExample || lastSection || $('.book-intro')).after(motionHost);
      window.BIOCS_MOTION.mountChapter(chapter.id,motionHost);
    }
    $('#prev-chapter').disabled = navigationIndex === 0;
    $('#next-chapter').disabled = !nextId;
    $('#prev-chapter').textContent = routeStep ? '← 上一步' : '← 上一章';
    $('#next-chapter').textContent = routeStep ? '下一步 →' : '下一章 →';
    if (routeStep && nextId) {
      const nextStep=guided.unitByChapter[nextId];
      const transition=nextStep.unit.id!==routeStep.unit.id?routeStep.unit.bridge:(byId.get(nextId)?.subtitle || '继续把本章的对象与机制接到下一步。');
      $('#next-step-preview').innerHTML=`<span>接下来 · 主线 ${navigationIndex+2} / ${guided.ids.length}</span><p>${escape(transition)}</p><a href="#${escape(nextId)}">${escape(byId.get(nextId)?.title || nextId)} →</a>`;
    } else if (routeStep) {
      $('#next-step-preview').innerHTML='<span>连续主线已到终点</span><p>用一个完整案例检验你能否把机制、assay 与结论边界接起来。</p><a href="project-lab.html">进入 Project Lab →</a>';
    } else {
      $('#next-step-preview').innerHTML='<span>按需深入的拓展章节</span><p>如果术语或前置概念不清楚，可回到连续主线；当前章节仍保留原课程目录顺序。</p><a href="index.html#guided-route">回到学习主线 →</a>';
    }
    document.title = `${chapter.title} · Bio/CS 零基础教材`;
    renderToc($('#chapter-search').value);
    renderProgress();
    if (scroll) { $('#chapter').focus({preventScroll:true}); window.scrollTo({top:0,behavior:'instant'}); }
  }
  $('#chapter-search').addEventListener('input', e => renderToc(e.target.value));
  $('#chapter-body').addEventListener('click', e => {
    const term=e.target.closest('.inline-term');
    if (term) {openTerm(term.dataset.term,term);return;}
    const link=e.target.closest('.chapter-story-map a');
    if (!link) return;
    e.preventDefault();
    const target=document.querySelector(link.getAttribute('href'));
    target?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
    target?.focus({preventScroll:true});
  });
  $('#term-close').addEventListener('click', () => closeTerm());
  document.addEventListener('keydown', e => { if(e.key==='Escape' && !$('#term-panel').hidden) {e.preventDefault();closeTerm();} });
  document.addEventListener('pointerdown', e => {if(!$('#term-panel').hidden && !$('#term-panel').contains(e.target) && !e.target.closest('.inline-term'))closeTerm(false);});
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
  $('#prev-chapter').addEventListener('click', () => { const ids=guided.unitByChapter[state.active]?guided.ids:allChapterIds; const i=ids.indexOf(state.active); if(i>0) location.hash=ids[i-1]; });
  $('#next-chapter').addEventListener('click', () => { const ids=guided.unitByChapter[state.active]?guided.ids:allChapterIds; const i=ids.indexOf(state.active); if(i<ids.length-1) location.hash=ids[i+1]; });
  $('#mark-chapter').addEventListener('click', () => { if(state.completed.has(state.active))state.completed.delete(state.active);else state.completed.add(state.active);save();renderProgress();renderToc($('#chapter-search').value); });
  window.addEventListener('hashchange', () => { const id=location.hash.slice(1); if (byId.has(id)) renderChapter(id, true); });
  renderCurriculum();
  renderChapter(location.hash.slice(1));
})();
