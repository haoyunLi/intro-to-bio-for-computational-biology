(() => {
  const reads = [
    {
      title: 'Read 1 · @read_01',
      fastq: '@read_01\nACGTTACA\n+\nIIIIIIII',
      answer: 'geneA',
      reason: '八个 I 在本题的 Phred+33 编码中均为 Q40，先通过 Q20 门槛。ACGTTACA 只匹配 Gene A 的参考片段，因此本题给 Gene A +1。',
      trace: [
        '1 · Quality：IIIIIIII = 每碱基 Q40 → 通过本题门槛。',
        '2 · Alignment：ACGTTACA 与教学参考片段精确匹配一次。',
        '3 · Annotation：命中的片段属于 Gene A。',
        '4 · Count：Gene A +1；Gene B +0。'
      ],
      wrong: {
        geneB: '对照参考表：Gene B 没有 ACGTTACA 这段序列。',
        ambiguous: '对照两行参考序列：这条 read 只有 Gene A 一个候选 gene。',
        quality: 'I 在本题使用的 Phred+33 编码里是 Q40，高于 Q20 门槛。'
      }
    },
    {
      title: 'Read 2 · @read_02',
      fastq: '@read_02\nGGAATCCG\n+\nIIIIIIII',
      answer: 'ambiguous',
      reason: 'Q40 通过门槛，但 GGAATCCG 在 Gene A 与 Gene B 的教学参考片段中都出现。按本题“必须唯一归到一个 gene”规则，它不给任何 gene 加 count；GDC 官方文档也说明，其 STAR 计数不计入映射到多个不同 gene 的 reads。',
      trace: [
        '1 · Quality：IIIIIIII = 每碱基 Q40 → 通过本题门槛。',
        '2 · Alignment：GGAATCCG 有两个候选片段。',
        '3 · Annotation：候选片段分属 Gene A 和 Gene B，归属不唯一。',
        '4 · Count：两个 gene 都 +0；记录为本题的多基因歧义。'
      ],
      wrong: {
        geneA: '只看到 Gene A 的命中还不够：Gene B 也有完全相同的 GGAATCCG。',
        geneB: '只看到 Gene B 的命中还不够：Gene A 也有完全相同的 GGAATCCG。',
        quality: 'I 对应 Q40，这条 read 通过质量门槛；真正的问题在 gene 归属。'
      }
    },
    {
      title: 'Read 3 · @read_03',
      fastq: '@read_03\nTTGACCGA\n+\n!!!!!!!!',
      answer: 'quality',
      reason: '八个 ! 在 Phred+33 编码中均为 Q0，低于本题设定的 Q20 门槛。因此本题先停止，不做后续比对和计数。虽然字符序列与 Gene B 的片段相同，低可信度的 base calls 不能按此教学规则给 Gene B +1。真实流程的修剪、过滤与重比对策略会因实验而异。',
      trace: [
        '1 · Quality：!!!!!!!! = 每碱基 Q0 → 未通过本题 Q20 门槛。',
        '2 · Alignment：本题在 QC 后停止，未把这条 read 送去比对。',
        '3 · Annotation：没有可用比对，不能分配 Gene B。',
        '4 · Count：Gene A +0；Gene B +0。'
      ],
      wrong: {
        geneA: 'TTGACCGA 不在 Gene A 片段中；而且先看 FASTQ 第四行质量。',
        geneB: '字符串看似能匹配 Gene B，但本题先做质量门槛：! 是 Q0，不能先跳到计数。',
        ambiguous: '这段序列不是多基因歧义；拦下它的是 FASTQ 第四行的低质量符号。'
      }
    }
  ];

  const labels = {geneA:'Gene A +1',geneB:'Gene B +1',ambiguous:'不计数：多基因歧义',quality:'不计数：质量未过关'};
  const workspace = document.querySelector('.mapping-workspace');
  const progress = document.querySelector('#mapping-progress');
  const prompt = document.querySelector('#mapping-prompt');
  const fastq = document.querySelector('#mapping-fastq');
  const buttons = [...document.querySelectorAll('[data-mapping-choice]')];
  const submit = document.querySelector('#mapping-submit');
  const next = document.querySelector('#mapping-next');
  const feedback = document.querySelector('#mapping-feedback');
  const trace = document.querySelector('#mapping-trace');
  const complete = document.querySelector('#mapping-complete');

  let index = 0;
  let selected = null;
  let errorsOnCurrent = 0;
  let firstTryCorrect = 0;

  function render(focusPrompt = false) {
    selected = null;
    errorsOnCurrent = 0;
    progress.textContent = `READ ${index + 1} / ${reads.length}`;
    prompt.textContent = reads[index].title;
    fastq.textContent = reads[index].fastq;
    feedback.textContent = '';
    feedback.removeAttribute('data-state');
    trace.hidden = true;
    trace.innerHTML = '';
    submit.disabled = true;
    next.hidden = true;
    buttons.forEach(button => {
      button.disabled = false;
      button.setAttribute('aria-pressed', 'false');
    });
    if (focusPrompt) prompt.focus();
  }

  buttons.forEach(button => button.addEventListener('click', () => {
    if (button.disabled) return;
    selected = button.dataset.mappingChoice;
    buttons.forEach(option => option.setAttribute('aria-pressed', String(option === button)));
    submit.disabled = false;
    feedback.textContent = '';
    feedback.removeAttribute('data-state');
  }));

  submit.addEventListener('click', () => {
    if (!selected) return;
    const read = reads[index];
    if (selected !== read.answer) {
      errorsOnCurrent += 1;
      feedback.dataset.state = 'incorrect';
      feedback.innerHTML = `<strong>${labels[selected]}：再看一遍证据</strong>${read.wrong[selected]}`;
      return;
    }
    if (errorsOnCurrent === 0) firstTryCorrect += 1;
    feedback.dataset.state = 'correct';
    feedback.innerHTML = `<strong>正确：${labels[selected]}</strong>${read.reason}`;
    trace.innerHTML = read.trace.map(step => `<li>${step}</li>`).join('');
    trace.hidden = false;
    submit.disabled = true;
    buttons.forEach(button => { button.disabled = true; });
    next.textContent = index === reads.length - 1 ? '查看 count 表 →' : '下一条 read →';
    next.hidden = false;
    next.focus();
  });

  next.addEventListener('click', () => {
    if (index < reads.length - 1) {
      index += 1;
      render(true);
      return;
    }
    workspace.classList.add('is-complete');
    progress.textContent = '3 / 3 READS 已判读';
    complete.hidden = false;
    complete.innerHTML = `<h3>这三条 read 形成怎样的 gene count？</h3><div class="table-scroll"><table><thead><tr><th>gene</th><th>本题 raw count</th><th>由哪条 read 贡献</th></tr></thead><tbody><tr><td>Gene A</td><td>1</td><td>read_01</td></tr><tr><td>Gene B</td><td>0</td><td>没有可分配 read</td></tr></tbody></table></div><p>read_02 因多基因歧义未分配，read_03 因本题质量规则未进入比对。<strong>Gene B = 0</strong> 是此流程的计数结果，不能断言样本中绝对没有 Gene B RNA。首次作答正确 ${firstTryCorrect} / ${reads.length}。</p><p><a href="data-lab.html#missingness">接着做第 8 题：零值、未测与 QC 失败有什么不同？ ↗</a></p><button type="button" id="mapping-restart">重练三条 read</button>`;
    complete.querySelector('button').addEventListener('click', () => {
      index = 0;
      firstTryCorrect = 0;
      complete.hidden = true;
      workspace.classList.remove('is-complete');
      render(true);
    });
    complete.querySelector('button').focus();
  });

  render();
})();
