/* Original, synthetic learning exercises; no clinical interpretation. */
(() => {
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  function attemptError(text, confidence) {
    if (!String(text).trim()) return '先用自己的话写一个判断，并说明依据或你不确定的地方。';
    if (!['low','medium','high'].includes(confidence)) return '请选择作答前的信心，再记录回答。';
    return '';
  }
  function attemptForm() {
    return `<div class="chapter-attempt"><label for="chapter-attempt-text">先写我的解释：直接观察、可能机制、还缺什么证据？</label><textarea id="chapter-attempt-text" data-attempt-text rows="4" maxlength="2000" aria-describedby="chapter-attempt-status"></textarea><label for="chapter-attempt-confidence">作答前的信心</label><select id="chapter-attempt-confidence" data-attempt-confidence><option value="">请选择</option><option value="low">低 · 主要在猜</option><option value="medium">中 · 有依据但不完整</option><option value="high">高 · 能说明证据边界</option></select><button type="button" data-submit-attempt>记录回答，再对照理由</button><p id="chapter-attempt-status" data-attempt-status role="status">阅读标记只表示已读；此回答只保留在当前章节，文本不会自动评分。</p><p data-attempt-snapshot class="attempt-snapshot" hidden></p></div>`;
  }

  function matrixRank(input) {
    const rows=input.map(row=>[...row]);
    let rank=0;
    for (let column=0; column<rows[0].length && rank<rows.length; column++) {
      const pivot=rows.findIndex((row,i)=>i>=rank && Math.abs(row[column])>1e-10);
      if (pivot<0) continue;
      [rows[rank],rows[pivot]]=[rows[pivot],rows[rank]];
      const scale=rows[rank][column];
      rows[rank]=rows[rank].map(value=>value/scale);
      for (let i=rank+1; i<rows.length; i++) {
        const factor=rows[i][column];
        rows[i]=rows[i].map((value,j)=>value-factor*rows[rank][j]);
      }
      rank++;
    }
    return rank;
  }
  function designModel(treatmentEffect=1, crossed=false) {
    if (!Number.isFinite(treatmentEffect) || treatmentEffect<0 || treatmentEffect>3) throw new RangeError('effect must be finite and between 0 and 3');
    const batchEffect=3-treatmentEffect;
    const observed=crossed ? [[0,0,5],[1,0,6],[0,1,7],[1,1,8]] : [[0,0,5],[1,1,8]];
    const rows=observed.map(([treatment,batch,value])=>({treatment,batch,value,prediction:5+treatmentEffect*treatment+batchEffect*batch}));
    return {treatmentEffect,batchEffect,rows,rank:matrixRank(rows.map(row=>[1,row.treatment,row.batch])),fits:rows.every(row=>Math.abs(row.value-row.prediction)<1e-10)};
  }
  function designStatus(model) {
    return `β treatment=${model.treatmentEffect.toFixed(2)}，β batch=${model.batchEffect.toFixed(2)}；当前预测${model.fits?'匹配':'不匹配'}全部观测。Design matrix rank=${model.rank}/3。${model.rank<3?'两列完全重合，只能识别两种效应的和 3；拖动参数仍得到同样读数。':'两列可区分；在无 interaction 的加性模型下，treatment 差 1、batch 差 2。可识别不等于估计精确，更不等于已证因果。'}`;
  }
  const designQuestions = [
    {prompt:'1. 最初 control/batch 1=5、treated/batch 2=8，直接支持什么？', choices:[
      ['treatment-only','Treatment 单独使信号增加 3'],
      ['confounded','观测差为 3，但 treatment 与 batch 完全重合；不能唯一分配两个效应'],
      ['batch-only','Batch 单独使信号增加 3，treatment 一定无效']
    ], answer:'confounded', feedback:'观察差 3 可以是 treatment、batch 或二者之和。增加相同两组的重复或把 batch 加进公式，不会拆开重合的两列。'},
    {prompt:'2. 哪种对照/补充设计能区分这两个解释？', choices:[
      ['deeper','只对原来的两组测得更深'],
      ['within-batch','在各 batch 内都放 control 与 treated，记录独立生物重复，并在可行时随机分配和处理'],
      ['omit-batch','删除 batch 标签，就能去掉 batch effect']
    ], answer:'within-batch', feedback:'批次内比较给 treatment 提供独立变化。删除 covariate 不会创造信息；测深或复制同样组合可改善测量，却不能修复完全混杂。'},
    {prompt:'3. 加入 6 与 7 两个读数后，能直接证明什么？', choices:[
      ['causal','唯一系数就是明确的 biological mechanism'],
      ['precise','有四个点，置信区间一定很窄'],
      ['identifiable','在指定的加性模型下系数可识别；精度需足够独立重复，因果/机制仍需设计与其他证据']
    ], answer:'identifiable', feedback:'Identifiability 问是否能区分参数；precision 问噪声下多不确定；causality 问替代原因是否被设计排除。此合成示意未估计噪声、interaction、p 值或置信区间。'}
  ];
  function evaluateDesign(answers) {
    if (answers.length!==designQuestions.length || answers.some((answer,i)=>!designQuestions[i].choices.some(([id])=>id===answer))) return {complete:false,correct:0,message:'先回答三个判断，再查看反馈。'};
    const correct=answers.filter((answer,i)=>answer===designQuestions[i].answer).length;
    const feedback=designQuestions.map((question,i)=>`${i+1}. ${answers[i]===question.answer?'本题判断成立':'需要重看'}：${question.feedback}`).join('\n\n');
    return {complete:true,correct,message:`本次 ${correct}/3 个关键判断成立；只检查本题，不代表已掌握实验设计。\n\n${feedback}`};
  }
  function designMarkup(crossed=false, treatmentEffect=1) {
    const model=designModel(treatmentEffect,crossed);
    const labels=model.rows.map(row=>`${row.treatment?'Treated':'Control'} / batch ${row.batch+1}`);
    return `<section class="design-exercise" id="batch-design-exercise" data-crossed="${crossed}" aria-labelledby="design-title"><h2 id="design-title">读图与对照：差 3，是 treatment 还是 batch？</h2><p>原创合成 assay signal，任意 log-scale 单位；每个组合只有一个示意观测，没有误差条或独立重复。它不是 RNA-seq raw counts，不用于 DESeq2 拟合。先分清观察、模型参数与机制主张。</p><figure><div class="design-figure-scroll" role="region" tabindex="0" aria-label="合成信号图，窄屏可左右滑动"><svg viewBox="0 0 600 270" role="img" aria-labelledby="design-figure-title design-figure-desc"><title id="design-figure-title">${crossed?'加入批次内对照':'完全混杂'}的合成信号</title><desc id="design-figure-desc">${model.rows.map((row,i)=>labels[i]+'='+row.value).join('；')}。横轴从零开始，条长表示观测信号。</desc><path d="M195 20V205H555" fill="none" stroke="#607582"/>${model.rows.map((row,i)=>`<text x="8" y="${45+i*43}">${labels[i]}</text><rect x="195" y="${28+i*43}" width="${row.value*40}" height="24" fill="#225e78"/><text x="${205+row.value*40}" y="${45+i*43}">${row.value}</text>`).join('')}<text x="189" y="229">0</text><text x="349" y="229">4</text><text x="509" y="229">8</text><text x="228" y="250">Synthetic log-scale signal · arbitrary units</text></svg></div><figcaption>起初只观察到两个对角组合；补齐另外两个组合才提供批次内比较。窄屏可左右滑动查看完整图与读数。</figcaption></figure><p>教学模型：signal = 5 + β treatment × treated + β batch × batch 2。两项指标各为 0/1；假设没有 interaction。保持 β treatment + β batch = 3，试着给差值不同解释。</p><label class="design-effect-label">假设的 β treatment<input data-treatment-effect type="range" min="0" max="3" step="0.25" value="${treatmentEffect}"></label><p data-model-result role="status" aria-live="polite">${designStatus(model)}</p><div class="design-table-scroll" role="region" tabindex="0" aria-label="观测和模型预测对照表"><table><thead><tr><th scope="col">组合</th><th scope="col">观测</th><th scope="col">此假设的预测</th></tr></thead><tbody>${model.rows.map((row,i)=>`<tr><th scope="row">${labels[i]}</th><td>${row.value}</td><td data-prediction="${i}">${row.prediction.toFixed(1)}</td></tr>`).join('')}</tbody></table></div><button type="button" data-cross-design="${!crossed}">${crossed?'回到完全混杂设计':'加入批次内 control / treated'}</button><p>切换设计会清空本题回答。改变模型假设不会改变观测数据。</p><div class="design-questions">${designQuestions.map((question,i)=>`<fieldset><legend>${escape(question.prompt)}</legend>${question.choices.map(([id,label])=>`<label><input type="radio" name="design-${i}" value="${id}"><span>${escape(label)}</span></label>`).join('')}</fieldset>`).join('')}</div><button type="button" data-check-design>检查三个判断</button><button type="button" data-retry-design hidden>清空本题，重新判断</button><p data-design-feedback class="design-feedback" role="status" aria-live="polite">先比较模型与数据，再判断对照、识别性和结论边界。</p><p>继续阅读：<a href="https://bioconductor.org/packages/release/bioc/vignettes/DESeq2/inst/doc/DESeq2.html#linear-combinations" target="_blank" rel="noopener noreferrer">DESeq2：Linear combinations</a> · <a href="https://www.ebi.ac.uk/training/materials/introduction-to-rna-seq-materials/course-content/" target="_blank" rel="noopener noreferrer">EMBL-EBI RNA-seq 课程</a>。图、数值与题目均为原创教学内容。</p></section>`;
  }
  window.BIOCS_PRACTICE={attemptForm,attemptError,designMarkup,designQuestions,evaluateDesign,designModel,designStatus,matrixRank};
})();
