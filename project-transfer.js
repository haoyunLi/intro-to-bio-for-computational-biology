(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const profiles = {
    other: {
      title:'先确定数据代表什么',
      observed:'选一行或一个数，倒查它来自哪个 organism、patient、sample 与 assay。',
      analysis:'先明确要比较的 biological unit、数据类型和问题；方法名应该最后出现。',
      boundary:'如果不知道分母、对照或独立重复，先不要把统计显著写成机制。',
      links:[['从对象开始','textbook.html#b01'],['读懂实验测量','textbook.html#w01']]
    },
    bulk: {
      title:'Bulk RNA-seq：比较的是混合样本的 RNA signal',
      observed:'FASTQ reads 经 alignment 与 gene assignment 形成每个 sample 的 gene-level raw counts；TPM 是另一种经过变换的相对尺度。',
      analysis:'若问题是组间 differential expression，常从 raw counts、sample metadata 和与配对/batch 相符的 count-based design 出发；DESeq2 是一种选择，不是自动答案。',
      boundary:'biological replicate 通常是独立生物材料或个体；cell composition、library size 与 RNA→protein 的断层仍需另外考虑。',
      links:[['数值与分母','textbook.html#d04'],['统计比较','textbook.html#k04'],['GDC RNA pipeline','https://docs.gdc.cancer.gov/Data/Bioinformatics_Pipelines/Expression_mRNA_Pipeline/'],['DESeq2 vignette','https://bioconductor.org/packages/release/bioc/vignettes/DESeq2/inst/doc/DESeq2.html']]
    },
    variant: {
      title:'Tumor DNA-seq：先相信 reads，再讨论 clone',
      observed:'比对后的 reads 为 REF/ALT 提供支持；VCF 中的 variant call 是 caller 与 filtering 产生的推断。',
      analysis:'先核对 matched normal、depth、mapping、artifact 与 contamination；解释 VAF 时再加入 purity、copy number、allele state 和 clone 假设。',
      boundary:'18% VAF 不是 18% tumor cells。单一 variant 也不能独立证明 driver 或 resistance mechanism。',
      links:[['VAF 手算与限制','textbook.html#x14'],['可操作模型','genetics-lab.html#vaf'],['GATK Mutect2','https://gatk.broadinstitute.org/hc/en-us/articles/360037438791-Mutect2']]
    },
    spatial: {
      title:'Single-cell / spatial：cell 不是自动独立的 patient',
      observed:'transcripts 或 image signal 经捕获、segmentation 与 assignment，才形成 cell × gene 和空间位置表。',
      analysis:'先检查 cell boundary、cell type 标注、donor/sample 层级与 batch；跨条件比较需保留 biological replicate，可考虑 donor-level aggregation 或合适的层级模型。',
      boundary:'邻近不等于细胞在通信，cluster 不等于 cell type；错误 segmentation 能同时改变表达和空间距离。',
      links:[['空间测量边界','textbook.html#s01'],['分割误差练习','data-lab.html#segmentation'],['Xenium outputs','https://www.10xgenomics.com/support/software/xenium-onboard-analysis/latest/analysis/xoa-output-understanding-outputs'],['单细胞差异分析研究','https://www.nature.com/articles/s41467-021-25960-2']]
    },
    binCell: {
      title:'Spatial bin → cell：归属是推断，不是原始观测',
      observed:'Visium HD 的 bin 有坐标和 expression counts；Xenium 可提供 transcript 坐标、cell-feature matrix 与估计的 cell boundaries。两者的单位与测量方式不同。',
      analysis:'先固定坐标、单位和切片配准，再分开评估 candidate matching、bin-to-cell assignment、cell-type annotation。若有参考数据，必须写明它只用于验证，还是也进入了建模。',
      boundary:'一个 bin、一个 nucleus、一个 cell 不能互换。用同一份参考信息既指导预测又评估预测，会高估独立验证；polygon IoU 也只评价几何重合，不独自证明 expression 正确。',
      mini:['一个 2 × 2 µm bin 有 6 个 RNA counts，它等于一个 cell 吗？','不能。bin 是捕获网格；它可能跨越两颗 cell，也可能只覆盖一颗 cell 的一小部分。先看组织图像、边界、坐标和计数来源，再讨论如何分配。'],
      links:[['测量单位','textbook.html#s01'],['空间文件与坐标','textbook.html#k08'],['分割误差练习','data-lab.html#segmentation'],['Xenium outputs','https://www.10xgenomics.com/support/software/xenium-onboard-analysis/2.0/tutorials/outputs/xoa-output-understanding-outputs']]
    },
    pathwayAge: {
      title:'Pseudobulk + pathway：预测年龄前先数清 patient',
      observed:'single-cell counts 按 patient（必要时再按 cell type）汇总成 pseudobulk；gene set score 又把多个 gene 的数值压成一个特征。每一步都改变了单位。',
      analysis:'按 patient 拆训练与测试；只在训练数据内做任何依赖数据的特征筛选。比较真实 gene set、合适的随机对照与简单基线，并检查 batch、cell composition 和检测率。',
      boundary:'年龄预测准确，不代表某条 pathway 造成衰老。若随机 gene sets 也能预测，需追问随机化保留了哪些整体信号，而不是直接说真实 pathway 无意义。',
      mini:['20 位 patient 共贡献 20,000 个 cell，预测年龄时样本量是多少？','如果年龄标签和独立性在 patient 层，独立单位通常是 20 位 patient；把同一人的 cell 分到训练和测试两边，会让测试成绩虚高。'],
      links:[['pseudobulk 与伪重复','textbook.html#k07'],['效应、混杂与验证','textbook.html#r03'],['GSVA / ssGSEA 文档','https://bioconductor.org/packages/release/bioc/manuals/GSVA/man/GSVA.pdf'],['AUCell 文档','https://bioconductor.org/packages/release/bioc/manuals/AUCell/man/AUCell.pdf']]
    },
    methylationAge: {
      title:'DNA methylation + age：β value 先回到原始强度',
      observed:'methylation array 的一个 probe 在一个 specimen 中给出 methylated 与 unmethylated intensity；处理后的 β value 通常在 0–1 之间。',
      analysis:'先对齐 patient/sample 与采样时年龄，核对平台、probe QC、缺失和 batch；在训练集内完成高变异 probe 选择与调参，再按 patient 在独立测试集评估。',
      boundary:'β = 0.72 不是“72% 的细胞被甲基化”的直接计数。预测年龄的 probe 或模型系数，也不自动说明它们导致生物学衰老。',
      mini:['某 probe 的 β value 是 0.72，是否表示 72% 的 cell 都在该位点甲基化？','不能直接这样说。它是 bulk array 上 methylated intensity 占总强度的比例；混合细胞、probe 行为与技术处理都影响这个数。'],
      links:[['methylation 与 gene regulation','textbook.html#d05'],['样本 ID 与跨表连接','textbook.html#k02'],['预测与验证边界','textbook.html#r03'],['GDC methylation pipeline','https://docs.gdc.cancer.gov/Data/Bioinformatics_Pipelines/Methylation_Pipeline/']]
    },
    clinical: {
      title:'Clinical outcome：先定 time zero 和事件',
      observed:'每行首先应代表 patient 或明确的随访区间；event、follow-up time 与 censoring 来自临床记录规则。',
      analysis:'明确入组时间、结局定义和右删失后，才决定用描述性曲线或生存模型；如果治疗或特征随时间改变，设计也要相应处理。',
      boundary:'hazard ratio 是特定模型下的关联量，不是某位患者的因果治疗收益；缺失随访与选择偏差仍可能改变解释。',
      links:[['真实 cohort 与临床连接','real-cohort-lab.html'],['生存问题入门','textbook.html#r04'],['R survival 文档','https://stat.ethz.ch/R-manual/R-devel/library/survival/html/Surv.html']]
    }
  };
  const prompts = {
    question:['transfer-question','把研究问题写成可比较或可检验的一句话。'],
    object:['transfer-object','分开 patient、sample、取样位置/时间与独立 replicate。'],
    measurement:['transfer-measurement','写出 assay 直接观察到的 signal，而不只是处理后文件名。'],
    value:['transfer-value','选一个结果，解释它的单位、分母与处理步骤。'],
    method:['transfer-method','说明方法接受什么输入、估计什么，以及为什么适合这个设计。'],
    design:['transfer-design','检查 control、batch、重复测量、missingness 与数据拆分。'],
    claim:['transfer-claim','把结论限制在数据支持的 observation / association / prediction / mechanism 层。'],
    alternative:['transfer-alternative','至少写出一个替代解释与能区分它的下一项实验。']
  };
  const inputs = [...document.querySelectorAll('[data-transfer]')];
  const storageKey = 'biocs-project-transfer-v1';
  const clearButton = $('#transfer-clear');
  function resetClear() {
    clearButton.dataset.pending = '';
    clearButton.textContent = '删除本机草稿';
  }
  function renderGuide() {
    const profile = profiles[$('#transfer-profile').value] || profiles.other;
    $('#transfer-method-guide').innerHTML = `<section class="transfer-method-guide"><h4>${escape(profile.title)}</h4><dl><div><dt>实验或文件给什么</dt><dd>${escape(profile.observed)}</dd></div><div><dt>分析为何这样选</dt><dd>${escape(profile.analysis)}</dd></div><div><dt>结论不能跨哪一步</dt><dd>${escape(profile.boundary)}</dd></div></dl>${profile.mini?`<details class="transfer-mini"><summary>先猜：${escape(profile.mini[0])}</summary><p>${escape(profile.mini[1])}</p></details>`:''}<div class="transfer-method-links">${profile.links.map(([label,url]) => `<a href="${escape(url)}" ${url.startsWith('http')?'target="_blank" rel="noopener noreferrer"':''}>${escape(label)} ↗</a>`).join('')}</div></section>`;
  }
  function values() { return Object.fromEntries(inputs.map(input => [input.name,input.value.trim()])); }
  function updateProgress() {
    const done = inputs.filter(input => input.value.trim()).length;
    $('#transfer-progress').textContent = `${done} / ${inputs.length} 个问题已有草稿`;
  }
  function check() {
    const draft = values();
    const missing = Object.entries(prompts).filter(([key]) => !draft[key]);
    document.querySelectorAll('.transfer-field').forEach(field => field.classList.remove('is-empty'));
    for (const [key] of missing) document.getElementById(prompts[key][0]).classList.add('is-empty');
    if (missing.length) {
      $('#transfer-feedback').innerHTML = `<p>目前是 ${inputs.length - missing.length} / ${inputs.length}。先补这些环节，避免方法与结论悬空：</p><ul>${missing.map(([key,[id,hint]]) => `<li><a href="#${id}">${escape(hint)}</a></li>`).join('')}</ul>`;
    } else {
      $('#transfer-feedback').innerHTML = '<p>结构上已经覆盖八个关键问题。接下来请自己再检验三件事：独立单位是否与统计模型一致？数值分母是否写对？下一项实验真的能区分替代解释吗？填写完整不等于科学判断已被验证。</p>';
    }
  }
  function save() {
    const draft = values();
    if (!Object.values(draft).some(Boolean)) {
      $('#transfer-feedback').textContent = '还没有可保存的内容。先写一个不含身份信息的研究问题。';
      return;
    }
    try {
      localStorage.setItem(storageKey, JSON.stringify({profile:$('#transfer-profile').value,fields:draft}));
      $('#transfer-feedback').textContent = '草稿已保存在当前浏览器。它不会上传；请勿填写患者身份标识或受限信息。';
    } catch (_) {
      $('#transfer-feedback').textContent = '浏览器未能保存草稿；请检查隐私模式或存储设置，并先保留你填写的内容。';
    }
  }
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (saved && typeof saved === 'object') {
      if (profiles[saved.profile]) $('#transfer-profile').value = saved.profile;
      for (const input of inputs) if (typeof saved.fields?.[input.name] === 'string') input.value = saved.fields[input.name];
    }
  } catch (_) {}
  $('#transfer-profile').addEventListener('change', renderGuide);
  $('#transfer-form').addEventListener('input', event => {
    if (event.target.matches('[data-transfer]')) {
      resetClear();
      event.target.closest('.transfer-field')?.classList.remove('is-empty');
      updateProgress();
    }
  });
  $('#transfer-check').addEventListener('click', check);
  $('#transfer-save').addEventListener('click', () => { resetClear(); save(); });
  clearButton.addEventListener('click', () => {
    if (clearButton.dataset.pending !== 'true') {
      clearButton.dataset.pending = 'true';
      clearButton.textContent = '再点一次确认删除';
      $('#transfer-feedback').textContent = '再次点击“再点一次确认删除”将清空当前表单与此浏览器保存的草稿；此操作无法撤销。';
      return;
    }
    try { localStorage.removeItem(storageKey); }
    catch (_) { $('#transfer-feedback').textContent = '浏览器未能删除本机草稿，请检查站点存储设置。'; return; }
    inputs.forEach(input => { input.value = ''; input.closest('.transfer-field')?.classList.remove('is-empty'); });
    $('#transfer-profile').value = 'other';
    resetClear();
    renderGuide();
    updateProgress();
    $('#transfer-feedback').textContent = '本机草稿和当前表单已清空。';
  });
  renderGuide();
  updateProgress();
})();
