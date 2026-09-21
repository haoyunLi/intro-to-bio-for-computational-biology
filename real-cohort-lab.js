(async function () {
  'use strict';
  const snapshotUrl = './data/gdc-tcga-brca-paired-star-counts-snapshot.json';
  const stageTitles = ['数清对象', '筛选样本', '按病例连接', '读基因行', '选对量纲', '判断结论'];
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const make = (tag, className, value) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (value !== undefined) element.textContent = value;
    return element;
  };
  const cell = (row, value) => row.appendChild(make('td', '', value));
  const short = value => `${value.slice(0, 8)}…`;
  const caseOf = file => file.cases[0];
  const sampleOf = file => caseOf(file).samples[0];
  const isTumor = file => sampleOf(file).sample_type === 'Primary Tumor';
  const rowOf = (file, gene) => file.rows.find(row => row.gene_name === gene);
  const countDistinct = (files, getId) => new Set(files.map(getId)).size;
  const state = {active: 0, completed: Array(6).fill(false), chosenSamples: new Set()};
  let files;

  function feedback(stageIndex, message, valid) {
    const element = $(`.stage[data-stage="${stageIndex}"] .feedback`);
    element.textContent = message;
    element.className = `feedback ${valid ? 'success' : 'error'}`;
  }
  function renderNav() {
    const list = $('#stage-nav-list');
    list.replaceChildren();
    stageTitles.forEach((title, index) => {
      const item = make('li');
      const button = make('button', '', `${String(index + 1).padStart(2, '0')} ${title}`);
      button.type = 'button';
      button.disabled = index > 0 && !state.completed[index - 1];
      if (index === state.active) button.setAttribute('aria-current', 'step');
      if (state.completed[index]) button.dataset.done = 'true';
      button.addEventListener('click', () => showStage(index));
      item.appendChild(button);
      list.appendChild(item);
    });
  }
  function showStage(index, scroll = true) {
    if (index > 0 && !state.completed[index - 1]) return;
    state.active = index;
    $$('.stage').forEach(stage => { stage.hidden = Number(stage.dataset.stage) !== index; });
    renderNav();
    if (scroll) {
      const stage=$(`.stage[data-stage="${index}"]`), heading=stage.querySelector('h2');
      heading.tabIndex=-1; heading.focus({preventScroll:true});
      stage.scrollIntoView({block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    }
  }
  function complete(index, message) {
    state.completed[index] = true;
    feedback(index, message, true);
    const stage = $(`.stage[data-stage="${index}"]`);
    stage.querySelectorAll('input,select,.sample-choice,.check-button').forEach(control => { if(control.id !== 'gene-picker') control.disabled=true; });
    stage.querySelector('.reveal').hidden = false;
    const next = stage.querySelector('.next-button');
    if (next) next.hidden = false;
    if (index === 5) $('#completion').hidden = false;
    renderNav();
  }
  function setupNavigation() {
    $('#restart-lab').addEventListener('click', () => {
      state.completed.fill(false); state.chosenSamples.clear();
      $$('.stage input,.stage select,.sample-choice,.check-button').forEach(control => {
        control.disabled=false;
        if(control.tagName==='INPUT') { if(control.type==='checkbox'||control.type==='radio')control.checked=false;else control.value=''; }
        if(control.tagName==='SELECT') control.selectedIndex=0;
      });
      $$('.sample-choice').forEach(button=>button.setAttribute('aria-pressed','false'));
      $$('.stage .reveal,.stage .next-button').forEach(element=>{element.hidden=true;});
      $$('.stage .feedback').forEach(element=>{element.textContent='';element.className='feedback';});
      $('#completion').hidden=true; renderGeneRows('INS'); showStage(0);
    });
    $$('.stage .next-button').forEach(button => {
      button.addEventListener('click', () => showStage(Number(button.closest('.stage').dataset.stage) + 1));
    });
  }
  function renderMetadata() {
    const body = $('#metadata-rows');
    files.forEach(file => {
      const row = make('tr');
      cell(row, caseOf(file).submitter_id);
      cell(row, sampleOf(file).submitter_id);
      const sampleCell = make('td');
      sampleCell.appendChild(make('span', `badge ${isTumor(file) ? 'tumor' : 'normal'}`, sampleOf(file).sample_type));
      row.appendChild(sampleCell);
      const fileCell = make('td');
      const link = make('a', 'file-short', short(file.file_id));
      link.href = `https://api.gdc.cancer.gov/files/${file.file_id}?expand=cases,cases.samples,analysis`;
      link.title = file.file_id;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      fileCell.appendChild(link);
      row.appendChild(fileCell);
      body.appendChild(row);
    });
  }
  function setupCounting() {
    $('#count-form').addEventListener('submit', event => {
      event.preventDefault();
      const inputs = event.currentTarget.elements;
      const expected = {
        cases: countDistinct(files, file => caseOf(file).case_id),
        samples: countDistinct(files, file => sampleOf(file).sample_id),
        files: countDistinct(files, file => file.file_id),
      };
      const wrong = Object.keys(expected).filter(key => Number(inputs[key].value) !== expected[key]);
      if (wrong.length) {
        const hints = {
          cases: 'case：查看完整的 case.submitter_id，重复出现的是同一个病例。',
          samples: 'sample：每个不同的 sample.submitter_id 算一个组织样本。',
          files: 'file：表格每行是一份文件；再检查 file_id 是否重复。',
        };
        feedback(0, wrong.map(key => hints[key]).join(' '), false);
      } else complete(0, `正确：${expected.cases} case、${expected.samples} sample、${expected.files} file。`);
    });
  }
  function renderSampleChoices() {
    const container = $('#sample-choices');
    files.forEach(file => {
      const sample = sampleOf(file);
      const button = make('button', 'sample-choice');
      button.type = 'button';
      button.dataset.sampleId = sample.sample_id;
      button.setAttribute('aria-pressed', 'false');
      button.appendChild(make('b', '', sample.submitter_id));
      button.appendChild(make('small', '', `${caseOf(file).submitter_id} · ${sample.sample_type}`));
      button.addEventListener('click', () => {
        const selected = !state.chosenSamples.has(sample.sample_id);
        if (selected) state.chosenSamples.add(sample.sample_id);
        else state.chosenSamples.delete(sample.sample_id);
        button.setAttribute('aria-pressed', String(selected));
      });
      container.appendChild(button);
    });
    $('#check-filter').addEventListener('click', () => {
      const target = new Set(files.filter(isTumor).map(file => sampleOf(file).sample_id));
      const chosen = state.chosenSamples;
      if (chosen.size === target.size && [...target].every(id => chosen.has(id))) complete(1, '正确：选中了全部 Primary Tumor sample，且没有选入 Solid Tissue Normal。');
      else if ([...chosen].some(id => !target.has(id))) feedback(1, '选入了 Solid Tissue Normal。请看每张卡片下方的 sample_type，取消它。', false);
      else feedback(1, '还有 Primary Tumor 没有选中。每个 case 都检查一次。', false);
    });
  }
  function renderJoins() {
    const tumors = files.filter(isTumor);
    const normals = files.filter(file => !isTumor(file));
    tumors.forEach(tumor => {
      const card = make('div', 'join-card');
      card.appendChild(make('small', '', 'TUMOR SAMPLE'));
      card.appendChild(make('b', '', sampleOf(tumor).submitter_id));
      card.appendChild(make('small', '', `case_id: ${caseOf(tumor).submitter_id}`));
      card.appendChild(make('div', 'join-arrow', '↓ JOIN ON case_id'));
      const label = make('label', '', '选择同案 normal sample');
      const select = make('select');
      select.dataset.tumorId = tumor.file_id;
      select.setAttribute('aria-label', `${sampleOf(tumor).submitter_id} 的同案 normal sample`);
      select.appendChild(new Option('请选择', ''));
      normals.forEach(normal => select.appendChild(new Option(sampleOf(normal).submitter_id, normal.file_id)));
      label.appendChild(select);
      card.appendChild(label);
      $('#join-choices').appendChild(card);
    });
    $('#check-join').addEventListener('click', () => {
      const wrong = [...$('#join-choices').querySelectorAll('select')].filter(select => {
        const tumor = files.find(file => file.file_id === select.dataset.tumorId);
        const normal = files.find(file => file.file_id === select.value);
        return !normal || caseOf(tumor).case_id !== caseOf(normal).case_id;
      });
      if (wrong.length) feedback(2, '至少一组没有按 case ID 配对。比较肿瘤与正常样本的 TCGA-A7-A0DC / TCGA-GI-A2C8 部分。', false);
      else complete(2, '正确：两组都以相同 case ID 连接。');
    });
  }
  function renderGeneRows(gene) {
    const body = $('#gene-rows');
    body.replaceChildren();
    files.forEach(file => {
      const geneRow = rowOf(file, gene);
      const row = make('tr');
      [caseOf(file).submitter_id, sampleOf(file).sample_type, geneRow.gene_id, geneRow.gene_name, geneRow.unstranded, geneRow.tpm_unstranded].forEach(value => cell(row, value));
      body.appendChild(row);
    });
  }
  function setupGeneExplorer() {
    const picker = $('#gene-picker');
    ['INS', 'ESR1', 'ERBB2', 'TSPAN6'].forEach(gene => picker.appendChild(new Option(gene, gene)));
    picker.addEventListener('change', () => renderGeneRows(picker.value));
    renderGeneRows('INS');
    $('#check-zero').addEventListener('click', () => {
      const value = $('input[name="zero"]:checked')?.value;
      if (value === 'observed') complete(3, '正确：0 是这个 assay/样本/流程下的观测值。');
      else if (value === 'absent') feedback(3, '读数为 0 不等于基因从 DNA 中消失。它表示该行在这份 RNA-seq 结果中没有计到 unstranded 读数。', false);
      else if (value === 'clinical') feedback(3, 'RNA 测量的一列不能直接证明人体蛋白水平或诊断结论。请先描述表格真正观测到的量。', false);
      else feedback(3, '先选一个解释，再检查。', false);
    });
  }
  function renderMetricComparison() {
    const pair = files.filter(file => caseOf(file).submitter_id === 'TCGA-A7-A0DC');
    const tumor = pair.find(isTumor), normal = pair.find(file => !isTumor(file));
    [['unstranded', 'raw count / 原始读数'], ['tpm_unstranded', 'TPM / 标准化表达量']].forEach(([field, title]) => {
      const card = make('div', 'metric-card');
      card.appendChild(make('div', 'metric-title', `${title} · ESR1`));
      card.appendChild(make('strong', '', rowOf(tumor, 'ESR1')[field]));
      card.appendChild(make('small', '', `${sampleOf(tumor).submitter_id} · Primary Tumor`));
      const other = make('p', '', `同案 normal: ${rowOf(normal, 'ESR1')[field]}`);
      card.appendChild(other);
      $('#metric-comparison').appendChild(card);
    });
    $('#check-metric').addEventListener('click', () => {
      const de = $('#de-field').value, display = $('#display-field').value;
      if (de === 'unstranded' && display === 'tpm_unstranded') complete(4, '正确：计数模型用 raw counts；描述性相对表达量看 TPM。');
      else if (!de || !display) feedback(4, '请给两个任务都选择一列。', false);
      else feedback(4, '第一题问计数分布模型，需要保留 raw counts；第二题问换算后的相对表达量，需要 TPM。', false);
    });
  }
  function renderClaims() {
    const a7Tumor = files.find(file => caseOf(file).submitter_id === 'TCGA-A7-A0DC' && isTumor(file));
    const observed = rowOf(a7Tumor, 'ESR1').unstranded;
    const claims = [
      {id: 'observed', true: true, text: `这份 TCGA-A7-A0DC 肿瘤文件中，ESR1 的 unstranded 是 ${observed}。`},
      {id: 'joined', true: true, text: '此练习中的肿瘤与正常样本可按 case ID 配成两对。'},
      {id: 'significant', true: false, text: 'ESR1 在所有乳腺癌患者中显著升高（已有 p 值证明）。'},
      {id: 'causal', true: false, text: '肿瘤必然导致了这里观察到的 ESR1 差值。'},
      {id: 'clinical', true: false, text: '只凭这四份表达文件就能预测治疗获益。'},
    ];
    claims.forEach(claim => {
      const label = make('label', 'claim-choice');
      const input = make('input');
      input.type = 'checkbox';
      input.value = claim.id;
      label.appendChild(input);
      label.appendChild(make('span', '', claim.text));
      $('#claim-choices').appendChild(label);
    });
    $('#check-claims').addEventListener('click', () => {
      const chosen = new Set($$('#claim-choices input:checked').map(input => input.value));
      const expected = new Set(claims.filter(claim => claim.true).map(claim => claim.id));
      if (chosen.size === expected.size && [...expected].every(id => chosen.has(id))) complete(5, '正确：只保留可从这份快照直接核对的描述。');
      else if ([...chosen].some(id => !expected.has(id))) feedback(5, '有一个结论越过了数据边界：显著性、因果与治疗预测都需要更多数据和研究设计。', false);
      else feedback(5, '你漏选了一个可直接从文件元数据或 ESR1 行核对的描述。', false);
    });
  }
  function renderSources(snapshot) {
    snapshot.files.forEach(file => {
      const card = make('article', 'source-file');
      card.appendChild(make('b', '', `${sampleOf(file).submitter_id} · ${sampleOf(file).sample_type}`));
      const idLine = make('p');
      const link = make('a', '', file.file_id);
      link.href = `https://api.gdc.cancer.gov/files/${file.file_id}?expand=cases,cases.samples,analysis`;
      link.target = '_blank'; link.rel = 'noopener noreferrer';
      idLine.append('file UUID: ', link);
      card.appendChild(idLine);
      const downloadLine = make('p');
      const download = make('a', '', '完整 TSV ↓');
      download.href = `https://api.gdc.cancer.gov/data/${file.file_id}`;
      download.target = '_blank'; download.rel = 'noopener noreferrer';
      downloadLine.append(download, ` · ${file.file_size.toLocaleString()} bytes`);
      card.appendChild(downloadLine);
      card.appendChild(make('p', '', `MD5 (已核验): ${file.md5sum}`));
      card.appendChild(make('p', '', `workflow: ${file.analysis.workflow_type} · version ${file.analysis.workflow_version}`));
      $('#source-files').appendChild(card);
    });
    const date = new Date(snapshot.provenance.retrieved_at_utc).toLocaleString('zh-CN', {timeZone: 'UTC', hour12: false});
    $('.source-notes').prepend(document.createTextNode(`元数据与原文件获取时间：${date} UTC。 `));
  }
  try {
    const response = await fetch(snapshotUrl);
    if (!response.ok) throw Error(`HTTP ${response.status}`);
    const snapshot = await response.json();
    files = snapshot.files;
    if (files.length !== 4 || files.some(file => !file.rows || file.rows.length !== 4)) throw Error('快照结构不完整');
    renderMetadata(); setupCounting(); renderSampleChoices(); renderJoins(); setupGeneExplorer(); renderMetricComparison(); renderClaims(); renderSources(snapshot); setupNavigation();
    $('#load-state').hidden = true;
    showStage(0, false);
  } catch (error) {
    $('#load-state').hidden = true;
    const notice = $('#load-error');
    notice.hidden = false;
    notice.textContent = `无法载入本地数据快照（${error.message}）。请通过 GitHub Pages 或本地 HTTP 服务打开此页；检查 data/gdc-tcga-brca-paired-star-counts-snapshot.json 是否存在。`;
  }
})();
