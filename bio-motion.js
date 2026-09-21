/* Original teaching player. A step is a conceptual state, not a calibrated time interval. */
(() => {
  'use strict';
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const scenes = window.BIOCS_MOTION_SCENES || [];
  const sources = window.BIOCS_SOURCES || {};
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const players = new Set();
  let motionPreference=null;
  try{const saved=localStorage.getItem('biocs-motion-effects');if(saved==='smooth')motionPreference=true;if(saved==='step')motionPreference=false;}catch(_){}
  let serial = 0;
  const make = (tag, cls, text) => { const el=document.createElement(tag); if(cls)el.className=cls; if(text!==undefined)el.textContent=text; return el; };
  const sourceHTML = keys => [...new Set(keys || [])].filter(key=>sources[key]).map(key=>`<a href="${escape(sources[key][1])}" target="_blank" rel="noopener noreferrer">${escape(sources[key][0])} ↗</a>`).join(' · ');

  function dataGuide(id) {
    const lens=window.BIOCS_DATA_LENS?.[id];
    if(!lens)return null;
    const labels=['实验信号','文件与单位','推断边界'];
    return {id:`guide-${id}`,title:'把本章概念接到数据上',subtitle:'跟着一个问题，走完读数据的三步。',chapters:[id],sources:lens[3],assumption:'这是阅读顺序示意；箭头不代表生物过程的时间比例，也不等于因果关系。',steps:labels.map((title,index)=>({title,body:lens[index],svg:`<svg viewBox="0 0 720 260" role="img" aria-label="数据阅读第 ${index+1} 步：${title}"><defs><marker id="guide-arrow-${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#7c94b0"/></marker></defs><path d="M200 120 H260 M450 120 H510" fill="none" stroke="#9ab0c9" stroke-width="3" marker-end="url(#guide-arrow-${id})"/>${labels.map((label,i)=>`<g data-motion-key="guide-node-${i}"><rect x="${20+i*240}" y="62" width="200" height="115" rx="16" fill="${index===i?'#e0f1f6':'#f2f6fc'}" stroke="${index===i?'#168292':'#cbdbee'}" stroke-width="${index===i?3:1}"/><text x="${120+i*240}" y="104" text-anchor="middle" font-size="20" fill="#526c8c">0${i+1}</text><text x="${120+i*240}" y="145" text-anchor="middle" font-size="23" font-weight="700" fill="#163c65">${label}</text></g>`).join('')}<circle data-motion-key="guide-reader" cx="${120+index*240}" cy="212" r="10" fill="#176eb2"/><text x="360" y="35" text-anchor="middle" font-size="18" fill="#506b85">从观察对象，走到有边界的解释</text></svg>`}))};
  }

  function mount(host, available, initialId) {
    if(!host || !available.length)return ()=>{};
    const uid=`bm-${++serial}`;
    let scene=available.find(s=>s.id===initialId)||available[0];
    let step=0, timer=null, playing=false, speed=1, destroyed=false;
    let animations=[];
    let smooth=motionPreference??!reduced.matches;
    host.classList.add('bio-motion');
    host.innerHTML=`<div class="bm-heading"><div><p class="bm-label">动态理解 · PLAY & EXPLORE</p><h2 id="${uid}-title"></h2><p class="bm-subtitle"></p></div><a class="bm-library-link" href="motion-lab.html">全部动效 ↗</a></div><label class="bm-select-label" ${available.length<2?'hidden':''}>选择图解 <select class="bm-scene-select" aria-label="选择动态图解">${available.map(s=>`<option value="${escape(s.id)}">${escape(s.title)}</option>`).join('')}</select></label><div class="bm-canvas" role="group" aria-label="分步骤教学图，详细解释在图下"></div><div class="bm-controls" role="group" aria-label="动画播放控制"><button type="button" class="bm-play">▶ 播放过程</button><button type="button" class="bm-previous" aria-label="上一步">← 上一步</button><button type="button" class="bm-next">下一步 →</button><button type="button" class="bm-reset">↺ 重来</button><label class="bm-speed-label">速度 <select class="bm-speed" aria-label="动画速度"><option value="0.5">0.5×</option><option value="1" selected>1×</option><option value="1.5">1.5×</option><option value="2">2×</option></select></label></div><div class="bm-timeline"><label for="${uid}-seek">步骤 <output class="bm-counter"></output></label><input id="${uid}-seek" class="bm-seek" type="range" min="0" step="1" value="0"><span class="bm-motion-note"></span></div><div class="bm-explanation" tabindex="-1" aria-live="polite" aria-atomic="true"><h3></h3><p></p></div><div class="bm-step-list" role="group" aria-label="跳到某个步骤"></div><p class="bm-assumption"></p><p class="bm-sources"></p>`;
    host.setAttribute('aria-labelledby',`${uid}-title`);
    const $=selector=>host.querySelector(selector);
    const canvas=$('.bm-canvas'), play=$('.bm-play'), previous=$('.bm-previous'), next=$('.bm-next'), seek=$('.bm-seek');
    const stageButtons=$('.bm-step-list');
    const select=$('.bm-scene-select');
    const effectsLabel=make('label','bm-effects-label');
    const effects=make('input');effects.type='checkbox';effects.className='bm-effects';
    effectsLabel.append(effects,document.createTextNode('平滑动效'));
    $('.bm-controls').append(effectsLabel);
    function cancelVisuals(){animations.forEach(a=>a.cancel());animations=[];}
    function paintPlaying(){play.textContent=playing?'Ⅱ 暂停':step===scene.steps.length-1?'↻ 再播放一次':'▶ 播放过程';play.setAttribute('aria-pressed',String(playing));host.classList.toggle('bm-playing',playing);}
    function stop(){clearTimeout(timer);timer=null;playing=false;animations.forEach(animation=>{if(animation.playState==='running')animation.pause();});paintPlaying();}
    function render(animate=true){
      cancelVisuals();
      const before=new Map([...canvas.querySelectorAll('[data-motion-key]')].map(el=>[el.getAttribute('data-motion-key'),{bounds:el.getBoundingClientRect(),rects:[...el.querySelectorAll('rect')].map(rect=>({width:rect.getAttribute('width'),height:rect.getAttribute('height')}))}]));
      canvas.innerHTML=scene.steps[step].svg;
      // SVG diagrams share conceptual object keys; interpolate their on-screen positions.
      if(animate&&smooth){
        for(const el of canvas.querySelectorAll('[data-motion-key]')){
          const key=el.getAttribute('data-motion-key'), saved=before.get(key), prior=saved?.bounds, rect=el.getBoundingClientRect();
          if(prior&&rect.width&&rect.height){
            const dx=prior.left-rect.left,dy=prior.top-rect.top;
            if(Math.abs(dx)+Math.abs(dy)>1){
              const matrix=el.parentElement.getScreenCTM?.();
              const det=matrix?matrix.a*matrix.d-matrix.b*matrix.c:1;
              const x=matrix?(matrix.d*dx-matrix.c*dy)/det:dx;
              const y=matrix?(-matrix.b*dx+matrix.a*dy)/det:dy;
              const base=getComputedStyle(el).transform==='none'?'':getComputedStyle(el).transform;
              el.style.transformOrigin='0 0';
              animations.push(el.animate([{transform:`translate(${x}px,${y}px) ${base}`,opacity:.65},{transform:base||'none',opacity:1}],{duration:650/speed,easing:'cubic-bezier(.22,.65,.35,1)'}));
            } else animations.push(el.animate([{opacity:.55},{opacity:1}],{duration:400/speed}));
          }else animations.push(el.animate([{opacity:0},{opacity:1}],{duration:550/speed}));
          if(saved){
            [...el.querySelectorAll('rect')].forEach((bar,index)=>{
              const old=saved.rects[index];if(!old)return;
              const frames=[{},{}];
              for(const prop of ['width','height']){
                const value=bar.getAttribute(prop);
                if(old[prop]!==value&&Number(old[prop])>0&&Number(value)>0){frames[0][prop]=`${old[prop]}px`;frames[1][prop]=`${value}px`;}
              }
              if(Object.keys(frames[0]).length)animations.push(bar.animate(frames,{duration:650/speed,easing:'ease-in-out'}));
            });
          }
        }
      }
      $('.bm-counter').textContent=`${step+1} / ${scene.steps.length}`;
      seek.value=String(step);seek.setAttribute('aria-valuetext',`${step+1} / ${scene.steps.length}：${scene.steps[step].title}`);
      $('.bm-explanation h3').textContent=scene.steps[step].title;
      $('.bm-explanation p').textContent=scene.steps[step].body;
      previous.disabled=step===0;next.disabled=step===scene.steps.length-1;
      stageButtons.querySelectorAll('button').forEach((button,i)=>{button.setAttribute('aria-pressed',String(i===step));button.classList.toggle('bm-visited',i<step);});
      paintPlaying();
      host.dataset.scene=scene.id;host.dataset.step=String(step);
    }
    function schedule(){
      clearTimeout(timer);
      if(!playing||destroyed)return;
      timer=setTimeout(()=>{if(step<scene.steps.length-1){step++;render();schedule();}else stop();},3600/speed);
    }
    function choose(id){
      stop();scene=available.find(s=>s.id===id)||available[0];step=0;
      select.value=scene.id;
      $(`#${uid}-title`).textContent=scene.title;
      $('.bm-subtitle').textContent=scene.subtitle;
      $('.bm-assumption').textContent=`模型边界：${scene.assumption}`;
      $('.bm-sources').innerHTML=`原创教学动效 · 依据 ${sourceHTML(scene.sources)}`;
      seek.max=String(scene.steps.length-1);
      stageButtons.replaceChildren(...scene.steps.map((frame,index)=>{const button=make('button','',`${String(index+1).padStart(2,'0')} ${frame.title}`);button.type='button';button.addEventListener('click',()=>{stop();step=index;render();});return button;}));
      render(false);
    }
    function preference(){smooth=motionPreference??!reduced.matches;effects.checked=smooth;cancelVisuals();stop();$('.bm-motion-note').textContent=smooth?'平滑动效已启用；时间仅为教学节奏。可拖动步骤条反复观察。':'逐帧模式：保留步骤与播放，关闭平滑过渡。勾选“平滑动效”可启用移动效果。';}
    effects.addEventListener('change',()=>{motionPreference=effects.checked;try{localStorage.setItem('biocs-motion-effects',motionPreference?'smooth':'step');}catch(_){}players.forEach(player=>player.preference());});
    play.addEventListener('click',()=>{
      if(playing){stop();return;}
      players.forEach(player=>{if(player.host!==host)player.stop();});
      if(step===scene.steps.length-1){step=0;render();}
      animations.forEach(animation=>{if(animation.playState==='paused')animation.play();});
      playing=true;paintPlaying();schedule();
    });
    previous.addEventListener('click',()=>{stop();step=Math.max(0,step-1);render();});
    next.addEventListener('click',()=>{stop();step=Math.min(scene.steps.length-1,step+1);render();});
    $('.bm-reset').addEventListener('click',()=>{stop();step=0;render();});
    seek.addEventListener('input',()=>{stop();step=Number(seek.value);render(false);});
    $('.bm-speed').addEventListener('change',event=>{speed=Number(event.target.value);schedule();});
    select.addEventListener('change',()=>choose(select.value));
    const onHidden=()=>{if(document.hidden)stop();};
    document.addEventListener('visibilitychange',onHidden);
    reduced.addEventListener('change',preference);
    const observer=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)stop();},{threshold:0});
    observer.observe(host);
    const player={host,stop,choose,preference};players.add(player);
    choose(scene.id);preference();
    return Object.assign(()=>{destroyed=true;stop();cancelVisuals();observer.disconnect();document.removeEventListener('visibilitychange',onHidden);reduced.removeEventListener('change',preference);players.delete(player);},{choose});
  }

  let chapterCleanup=()=>{};
  function mountChapter(id,host){
    chapterCleanup();
    const relevant=scenes.filter(scene=>scene.chapters.includes(id));
    const guide=dataGuide(id);if(guide)relevant.push(guide);
    chapterCleanup=mount(host,relevant);
  }
  window.BIOCS_MOTION={mount,mountChapter,scenes};
  document.querySelectorAll('[data-bio-motion]').forEach(host=>{
    const ids=host.getAttribute('data-bio-motion').split(',');
    mount(host,ids.map(id=>scenes.find(scene=>scene.id===id)).filter(Boolean));
  });

  const atlas=document.querySelector('#motion-atlas-player');
  if(atlas){
    const menu=document.querySelector('#motion-atlas-menu');
    const cleanup=mount(atlas,scenes,location.hash.slice(1));
    const status=document.querySelector('#motion-atlas-status');
    if(status)status.textContent=`${scenes.length} 个机制图解 · ${scenes.reduce((n,scene)=>n+scene.steps.length,0)} 个可停留步骤`;
    menu.innerHTML=scenes.map((scene,index)=>`<a href="#${escape(scene.id)}"><span>${String(index+1).padStart(2,'0')}</span><strong>${escape(scene.title)}</strong><small>${scene.steps.length} 步</small></a>`).join('');
    function route(scroll=false){
      const id=location.hash.slice(1);const selected=scenes.find(scene=>scene.id===id)||scenes[0];
      cleanup.choose(selected.id);
      menu.querySelectorAll('a').forEach(link=>{if(link.hash===`#${selected.id}`)link.setAttribute('aria-current','true');else link.removeAttribute('aria-current');});
      document.querySelector('#motion-chapter-links').innerHTML=`继续读教材：${selected.chapters.map(id=>`<a href="textbook.html#${escape(id)}">${escape(id.toUpperCase())} ↗</a>`).join(' · ')}`;
      document.title=`${selected.title} · Bio/CS 动效图解`;
      if(scroll){atlas.focus({preventScroll:true});atlas.scrollIntoView({block:'start',behavior:'instant'});}
    }
    atlas.querySelector('.bm-scene-select').addEventListener('change',event=>{location.hash=event.target.value;});
    document.querySelector('.motion-skip')?.addEventListener('click',event=>{event.preventDefault();atlas.focus();atlas.scrollIntoView();});
    window.addEventListener('hashchange',()=>{if(scenes.some(scene=>scene.id===location.hash.slice(1)))route(true);});route();
  }
})();
