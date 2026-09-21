(() => {
  const scenarios = [
    {
      title: '记录 A · RNA-seq 结果',
      evidence: [
        ['assay', 'GDC 风格 bulk RNA-seq（教学记录）'],
        ['target', 'Gene A：在本次基因注释与输出表中'],
        ['reported_count', '0：文件中有这一行'],
        ['file_qc', '通过；可读取定量文件']
      ],
      answer: 'zero',
      reason: '在当前数据表里保留数值 0，因为这是合格文件实际报告的计数。它表示此定量流程未分配到 reads，不能推断细胞内绝对没有该 RNA。GDC 文档还指出，完全被其他基因覆盖的基因可能因为 reads 不被重复计数而显示 0。',
      wrong: {
        na: '这里不是“没测”：目标列存在，且文件明确写了 0。NA 会抹去已报告的数值。',
        exclude: 'QC 已通过；不能仅因一个基因是 0 就排除整份样本。',
        verify: '若这个 0 出乎预期，可以进一步核查流程；但本题已确认目标在表中、文件 QC 通过，当前矩阵应保留报告值。'
      }
    },
    {
      title: '记录 B · Xenium 结果',
      evidence: [
        ['assay', 'Xenium 定向空间 RNA（教学记录）'],
        ['target', 'Gene Q：不在本次 gene_panel.json 中'],
        ['reported_count', '没有 Gene Q 对应的 feature 行'],
        ['file_qc', '通过；其他 panel 基因正常输出']
      ],
      answer: 'na',
      reason: '记为未测的 NA，并附上 not_in_panel 状态。Xenium 只针对 panel 中的目标进行检测；gene_panel.json 已确认 Gene Q 不在本次目标集合。没有测到的项目不能伪装成一次测得的 0。',
      wrong: {
        zero: '0 会宣称“针对 Gene Q 做过检测，但计数为零”；这里没有设计该目标，无法得出这个观测。',
        exclude: '整份文件 QC 通过，其他 panel 基因仍有用；不应因为研究目标缺席就扔掉所有数据。',
        verify: '已经用 gene_panel.json 核实目标缺席；不需要把明确的未测状态继续当作未知。'
      }
    },
    {
      title: '记录 C · 文件与 QC 报告',
      evidence: [
        ['assay', 'bulk RNA-seq（教学记录）'],
        ['target', 'Gene A：方案本应测量'],
        ['reported_count', '脚本输出空白'],
        ['file_qc', '失败：本次文件未达到预设质量门槛']
      ],
      answer: 'exclude',
      reason: '这份失败文件暂不进入本次表达定量比较；在样本清单中保留 qc_failed 和失败原因，等待重做或重新处理。这里的“排除”是当前分析决策，不等于删除原始材料或患者记录。',
      wrong: {
        zero: '空白来自失败文件，不能伪造成 Gene A 的生物学零计数。',
        na: '单写 NA 会掩盖“文件 QC 失败”这一重要原因；当前定量比较需先排除整个失败文件。',
        verify: 'QC 报告已经明确失败；可另外排查或重做，但当前分析不能把它当作可用文件。'
      }
    },
    {
      title: '记录 D · 合并后的表格',
      evidence: [
        ['assay', 'Xenium 定向空间 RNA（教学记录）'],
        ['target', 'Gene R：目标清单尚未取得'],
        ['reported_count', '导出的合并表为空白'],
        ['file_qc', '未知：缺少 QC 摘要与原始输出']
      ],
      answer: 'verify',
      reason: '先取得 gene_panel.json、cell_feature_matrix 和 QC/运行报告，确认目标是否在 panel 内、文件是否合格、合并过程是否丢行。原因未明前不要把空白改写成 0 或固定的 NA，也不要直接排除。',
      wrong: {
        zero: '没有原始计数或目标信息，不能把合并表的空白解释为已测的 0。',
        na: 'NA 可以临时标示缺失，但本题要先确定原因：未测、QC 失败和数据连接错误需要不同处理。',
        exclude: '还没有失败证据；直接排除会丢掉可能有效的样本。'
      }
    }
  ];

  const labels = {zero: '0', na: 'NA', exclude: '排除', verify: '核查'};
  const workspace = document.querySelector('.missingness-workspace');
  const progress = document.querySelector('#missingness-progress');
  const prompt = document.querySelector('#missingness-prompt');
  const evidence = document.querySelector('#missingness-evidence');
  const buttons = [...document.querySelectorAll('[data-missingness-choice]')];
  const submit = document.querySelector('#missingness-submit');
  const next = document.querySelector('#missingness-next');
  const feedback = document.querySelector('#missingness-feedback');
  const complete = document.querySelector('#missingness-complete');

  let index = 0;
  let selected = null;
  let errorsOnCurrent = 0;
  let firstTryCorrect = 0;

  function render(focusPrompt = false) {
    const caseData = scenarios[index];
    selected = null;
    errorsOnCurrent = 0;
    progress.textContent = `记录 ${index + 1} / ${scenarios.length}`;
    prompt.textContent = caseData.title;
    evidence.innerHTML = caseData.evidence.map(([field, value]) => `<tr><td>${field}</td><td>${value}</td></tr>`).join('');
    buttons.forEach(button => {
      button.setAttribute('aria-pressed', 'false');
      button.disabled = false;
    });
    submit.disabled = true;
    next.hidden = true;
    feedback.textContent = '';
    feedback.removeAttribute('data-state');
    if (focusPrompt) prompt.focus();
  }

  buttons.forEach(button => button.addEventListener('click', () => {
    if (button.disabled) return;
    selected = button.dataset.missingnessChoice;
    buttons.forEach(option => option.setAttribute('aria-pressed', String(option === button)));
    submit.disabled = false;
    feedback.textContent = '';
    feedback.removeAttribute('data-state');
  }));

  submit.addEventListener('click', () => {
    if (!selected) return;
    const caseData = scenarios[index];
    if (selected !== caseData.answer) {
      errorsOnCurrent += 1;
      feedback.dataset.state = 'incorrect';
      feedback.innerHTML = `<strong>${labels[selected]}：再检查一遍证据</strong>${caseData.wrong[selected]}`;
      return;
    }
    if (errorsOnCurrent === 0) firstTryCorrect += 1;
    feedback.dataset.state = 'correct';
    feedback.innerHTML = `<strong>正确：${labels[selected]}</strong>${caseData.reason}`;
    submit.disabled = true;
    buttons.forEach(button => { button.disabled = true; });
    next.textContent = index === scenarios.length - 1 ? '查看结果 →' : '下一份记录 →';
    next.hidden = false;
    next.focus();
  });

  next.addEventListener('click', () => {
    if (index < scenarios.length - 1) {
      index += 1;
      render(true);
      return;
    }
    workspace.classList.add('is-complete');
    progress.textContent = '4 / 4 已完成';
    complete.hidden = false;
    complete.innerHTML = `<h3>你已经区分了四种“空”</h3><p>四条记录均完成判断；首次作答正确 ${firstTryCorrect} / ${scenarios.length}。把 <strong>assay_targeted、reported_count、qc_status、missing_reason</strong> 分开保存，后续模型才不会把未测、零计数与失败文件混为一谈。</p><button type="button" id="missingness-restart">重新练习</button>`;
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
