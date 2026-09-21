(() => {
  const stages = [...document.querySelectorAll('[data-stage]')];
  const rail = [...document.querySelectorAll('[data-step-index]')];
  const answered = stages.map(() => false);
  const wrongHints = [
    '看看字段所在的实体：cases 是病例，cases.samples 是从病例取得的材料，file_id 是处理结果文件。',
    '想一想 STAR 在测序仪之后做了什么：它先比对读段，再给基因计数。',
    '先看这一列的名字和这一行的名字：unstranded 是计数尺度，TSPAN6 是 gene_name。',
    '零值是在这份文件的这个基因行出现的结果；它不是一个 DNA 缺失判定。',
    '一份样本没有比较组。把能直接观察的文件字段与需要其他实验的数据分开。'
  ];
  let active = 0;
  const previous = document.querySelector('#previous-step');
  const next = document.querySelector('#next-step');
  const label = document.querySelector('#progress-label');
  const fill = document.querySelector('#progress-fill');
  const scrollOptions = () => ({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});

  function show(index) {
    active = Math.max(0, Math.min(index, stages.length - 1));
    stages.forEach((stage, i) => { stage.hidden = i !== active; });
    rail.forEach((item, i) => {
      item.classList.toggle('current', i === active);
      item.classList.toggle('passed', answered[i]);
      const button = item.querySelector('button');
      button.disabled = i > active && !answered.slice(0, i).every(Boolean);
      button.setAttribute('aria-current', i === active ? 'step' : 'false');
    });
    label.textContent = `步骤 ${active + 1} / ${stages.length}`;
    fill.style.width = `${(active + 1) / stages.length * 100}%`;
    previous.disabled = active === 0;
    next.disabled = !answered[active];
    next.textContent = active === stages.length - 1 ? '完成 · 查看来源 ↓' : answered[active] ? '下一步 →' : '答对后继续 →';
    const heading=stages[active].querySelector('h2');
    heading.tabIndex=-1; heading.focus({preventScroll:true});
    document.querySelector('.stage-area').scrollIntoView(scrollOptions());
  }

  stages.forEach((stage, index) => {
    const quiz = stage.querySelector('[data-quiz]');
    const feedback = quiz.querySelector('.feedback');
    const explanation = quiz.querySelector('.explanation');
    quiz.querySelectorAll('.choices button').forEach(button => {
      button.addEventListener('click', () => {
        if (answered[index]) return;
        if (button.dataset.correct === 'true') {
          answered[index] = true;
          button.classList.add('correct');
          quiz.querySelectorAll('.choices button').forEach(choice => {
            choice.disabled = true;
            choice.setAttribute('aria-pressed', String(choice === button));
          });
          feedback.hidden = false;
          feedback.className = 'feedback success';
          feedback.textContent = '判断正确。请读下面的理由，再进入下一步。';
          explanation.hidden = false;
          showWithoutScroll();
        } else {
          button.classList.add('incorrect');
          button.disabled = true;
          button.setAttribute('aria-pressed', 'true');
          feedback.hidden = false;
          feedback.className = 'feedback retry';
          feedback.textContent = wrongHints[index];
        }
      });
    });
  });

  function showWithoutScroll() {
    rail.forEach((item, i) => {
      item.classList.toggle('passed', answered[i]);
      item.querySelector('button').disabled = i > 0 && !answered.slice(0,i).every(Boolean);
    });
    next.disabled = !answered[active];
    next.textContent = active === stages.length - 1 ? '完成 · 查看来源 ↓' : '下一步 →';
  }

  rail.forEach((item, i) => item.querySelector('button').addEventListener('click', () => {
    if (i <= active || answered.slice(0, i).every(Boolean)) show(i);
  }));
  previous.addEventListener('click', () => show(active - 1));
  document.querySelector('#restart-walkthrough').addEventListener('click', () => {
    answered.fill(false);
    stages.forEach(stage => {
      stage.querySelectorAll('.choices button').forEach(button => { button.disabled=false; button.classList.remove('correct','incorrect'); button.removeAttribute('aria-pressed'); });
      stage.querySelector('.feedback').hidden=true; stage.querySelector('.explanation').hidden=true;
    });
    show(0);
  });
  next.addEventListener('click', () => {
    if (!answered[active]) return;
    if (active === stages.length - 1) document.querySelector('#sources').scrollIntoView(scrollOptions());
    else show(active + 1);
  });
  showWithoutScroll();
  rail[0].classList.add('current');
  rail[0].querySelector('button').setAttribute('aria-current','step');
  rail.slice(1).forEach(item => { item.querySelector('button').disabled = true; });
  previous.disabled = true;
})();
