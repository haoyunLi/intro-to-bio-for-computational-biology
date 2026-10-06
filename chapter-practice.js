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
    if (!Number.isFinite(treatmentEffect) || treatmentEffect<-2 || treatmentEffect>5) throw new RangeError('effect must be finite and within the demonstration range -2 to 5');
    const batchEffect=3-treatmentEffect;
    const observed=crossed ? [[0,0,5],[1,0,6],[0,1,7],[1,1,8]] : [[0,0,5],[1,1,8]];
    const rows=observed.map(([treatment,batch,value])=>({treatment,batch,value,prediction:5+treatmentEffect*treatment+batchEffect*batch}));
    return {treatmentEffect,batchEffect,rows,rank:matrixRank(rows.map(row=>[1,row.treatment,row.batch])),fits:rows.every(row=>Math.abs(row.value-row.prediction)<1e-10)};
  }
  function designStatus(model) {
    return `β treatment=${model.treatmentEffect.toFixed(2)}，β batch=${model.batchEffect.toFixed(2)}；当前预测${model.fits?'匹配':'不匹配'}全部观测。Design matrix rank=${model.rank}/3（含 intercept 的模型矩阵；图中 baseline 固定为 5）。${model.rank<3?'Treatment 与 batch 两列完全重合，只能识别两种效应的和 3，连 treatment 的正负都不能据此确定；演示滑块的范围不是由读数推断的界限。':'两列可区分；在无 interaction 的加性模型下，treatment 差 1、batch 差 2。可识别不等于估计精确，更不等于已证因果。'}`;
  }
  const designQuestions = [
    {prompt:'1. 最初 control/batch 1=5、treated/batch 2=8，直接支持什么？', choices:[
      ['treatment-only','Treatment 单独使信号增加 3'],
      ['confounded','观测差为 3，但 treatment 与 batch 完全重合；不能唯一分配两个效应'],
      ['batch-only','Batch 单独使信号增加 3，treatment 一定无效']
    ], answer:'confounded', feedback:'观察差 +3 也可以是 treatment −1 与 batch +4 之和，不能证明 treatment 为正。增加相同两组的重复或把 batch 加进公式，不会拆开重合的两列。'},
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
  const designStages = ['先看观测', '固定 baseline', '加入 treatment', '加入 batch，比较预测'];
  const isReducedMotion = () => typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let designTimer = null;
  let activeDesign = null;

  function designContributions(model, row) {
    return {baseline:5,treatment:model.treatmentEffect*row.treatment,batch:model.batchEffect*row.batch};
  }
  function designFigure(model, stage=0) {
    const height=150+model.rows.length*165;
    const color={baseline:'#d6dfe3',treatment:'#225e78',batch:'#a75b20'};
    const x=220, scale=44;
    return `<svg viewBox="0 0 750 ${height}" role="img" aria-labelledby="design-figure-title design-figure-desc"><title id="design-figure-title">${designStages[stage]}：${model.rank===2?'完全混杂':'批次内交叉'}设计</title><desc id="design-figure-desc">黑色空框是观测信号。灰色段、蓝色箭头与棕色箭头分别是假设的 baseline、treatment 与 batch；向右增加、向左减少，不是已经测定的生物贡献。${model.rows.map(row=>`${row.treatment?'Treated':'Control'}/batch ${row.batch+1}：观测${row.value}，完整假设预测${row.prediction.toFixed(2)}`).join('；')}。</desc><text x="8" y="26">Observed signal：黑框</text><text x="220" y="26">假设贡献：灰 baseline → 蓝 treatment → 棕 batch</text>${model.rows.map((row,i)=>{
      const y=66+i*165, parts=designContributions(model,row);
      const segments=[['baseline',parts.baseline,1],['treatment',parts.treatment,2],['batch',parts.batch,3]];
      let offset=0;
      const stack=segments.map(([name,value,reveal],j)=>{
        const start=offset;offset+=value;
        if(stage<reveal)return '';
        const left=x+start*scale, end=x+offset*scale, center=y+8+j*27;
        const direction=Math.sign(value), tip=Math.min(8,Math.abs(value)*scale/2);
        const arrow=value===0?'':name==='baseline'?`<rect class="design-contribution baseline" x="${left}" y="${center-7}" width="${value*scale}" height="14" fill="${color[name]}"/>`:`<path class="design-contribution ${name}${value<0?' decreasing':''}" data-contribution="${value}" data-start="${start}" data-end="${offset}" d="M${left} ${center-6}H${end-direction*tip}V${center-10}L${end} ${center}L${end-direction*tip} ${center+10}V${center+6}H${left}Z" fill="${color[name]}"><title>假设 ${name}=${value.toFixed(2)}，${value<0?'向左减少':'向右增加'}</title></path>`;
        const connector=j===0?'':`<path d="M${left} ${center-20}V${center-8}" stroke="#778c96" stroke-dasharray="2 2"/>`;
        return `${connector}${arrow}<text x="8" y="${center+4}">${name} ${value>0?'+':''}${value.toFixed(2)}</text>`;
      }).join('');
      const partial=stage===0?null:parts.baseline+(stage>=2?parts.treatment:0)+(stage>=3?parts.batch:0);
      const delta=row.prediction-row.value;
      return `<text class="design-row-label" x="8" y="${y-16}">${row.treatment?'Treated':'Control'} / batch ${row.batch+1}</text>${stack}<rect x="${x}" y="${y+82}" width="${row.value*scale}" height="20" fill="none" stroke="#153d53" stroke-width="2"/><text x="${x+row.value*scale+10}" y="${y+97}">观测 ${row.value}</text>${stage===3?`<path data-full-prediction="${row.prediction}" d="M${x+row.prediction*scale} ${y+76}V${y+107}" stroke="#153d53" stroke-width="2"/>`:''}<text x="220" y="${y+126}">${partial===null?'尚未拆分假设的贡献':`假设：5${stage>=2?` + (${parts.treatment.toFixed(2)})`:''}${stage>=3?` + (${parts.batch.toFixed(2)})`:''} = ${partial.toFixed(2)}`}${stage===3?`；预测−观测 ${delta.toFixed(2)}`:''}</text>`;
    }).join('')}<path d="M220 ${height-65}h440" fill="none" stroke="#607582"/>${[0,5,10].map(value=>`<path d="M${x+value*scale} ${height-65}v7" stroke="#607582"/><text x="${x+value*scale}" y="${height-40}" text-anchor="middle">${value}</text>`).join('')}<text x="220" y="${height-12}">Synthetic log-scale signal · arbitrary units · 从零起的同一比例尺</text></svg>`;
  }
  function designStepText(model, stage) {
    if (stage===0) return model.rank===2?'先只看黑框：control / batch 1 是 5，treated / batch 2 是 8。差 3 是观测；它尚未告诉我们哪一种因素造成差异。':'先看四个黑框：control / batch 1 是 5，treated / batch 1 是 6，control / batch 2 是 7，treated / batch 2 是 8。这些是新增组合后的观测值，还没有拆成机制贡献。';
    if (stage===1) return '先假设一个共同 baseline=5。灰色段是模型的起点，不是额外测到的组成。接下来只对 treated 加入 treatment 项。';
    if (stage===2) return `蓝色段：β treatment=${model.treatmentEffect.toFixed(2)} × treated 指标（0 或 1）。Treatment 只影响 treated；同一 batch 的 control 不加这一项。棕色 batch 项尚未加入。`;
    return `棕色项：β batch=${model.batchEffect.toFixed(2)} × batch 2 指标（0 或 1）。${model.rank===2?'只有两个对角组合，蓝与棕相加都可为 3。试解释 D：treatment −1 使信号减少，batch +4 抵消并超过它，最终仍为 8。观测差 +3 不能证明 treatment 为正。':'在每个 batch 内都有两种 treatment 状态，批次内的差给 treatment 独立信息。试解释 A/B/D：6 与 7 两个新黑框会与假设的终点不一致；解释 C 才匹配此示意的四个读数。'}`;
  }
  function stopDesignAnimation() {
    if (designTimer!==null) {window.clearTimeout(designTimer);designTimer=null;}
    if (activeDesign?.isConnected) {
      activeDesign.dataset.playing='false';
      const button=activeDesign.querySelector('[data-play-design]');
      if(button) {button.textContent='播放分解';button.setAttribute('aria-pressed','false');}
      activeDesign.querySelector('[data-design-step-text]').setAttribute('aria-live','polite');
    }
    activeDesign=null;
  }
  function syncDesign(section, stage=Number(section.dataset.designStage||0)) {
    const model=designModel(Number(section.querySelector('[data-treatment-effect]').value),section.dataset.crossed==='true');
    stage=Math.max(0,Math.min(3,stage));section.dataset.designStage=String(stage);
    section.querySelector('.design-figure-scroll').innerHTML=designFigure(model,stage);
    section.querySelector('[data-design-step-text]').textContent=designStepText(model,stage);
    section.querySelector('[data-design-step-text]').setAttribute('aria-live',section.dataset.playing==='true'?'off':'polite');
    section.querySelector('[data-design-step-label]').textContent=`${stage+1}/4 · ${designStages[stage]}`;
    section.querySelector('[data-model-result]').textContent=designStatus(model);
    model.rows.forEach((row,i)=>{section.querySelector(`[data-prediction="${i}"]`).textContent=row.prediction.toFixed(2);});
    section.querySelector('[data-design-back]').disabled=stage===0;
    section.querySelector('[data-design-next]').disabled=stage===3;
    const play=section.querySelector('[data-play-design]');
    play.disabled=isReducedMotion();play.setAttribute('aria-pressed',String(section.dataset.playing==='true'));
    play.textContent=section.dataset.playing==='true'?'暂停':'播放分解';
    section.querySelector('.design-motion-note').textContent=isReducedMotion()?'系统减少动态效果已启用：请手动逐步查看静态分解。':'播放只在点击后开始；每步停留 2.4 秒，可暂停或重播。改变假设会暂停播放。';
    section.querySelector('[data-treatment-output]').textContent=model.treatmentEffect.toFixed(2);
    section.querySelectorAll('[data-design-hypothesis]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.designHypothesis)===model.treatmentEffect)));
  }
  function setDesignStage(section, stage) {stopDesignAnimation();syncDesign(section,stage);}
  function setDesignHypothesis(section, effect) {
    stopDesignAnimation();section.querySelector('[data-treatment-effect]').value=String(effect);syncDesign(section,3);
  }
  function playDesign(section) {
    if(isReducedMotion())return;
    if(section.dataset.playing==='true'){stopDesignAnimation();return;}
    stopDesignAnimation();activeDesign=section;section.dataset.playing='true';
    if(Number(section.dataset.designStage)===3)syncDesign(section,0);else syncDesign(section);
    const tick=()=>{
      if(!section.isConnected||isReducedMotion()||window.document.hidden){stopDesignAnimation();return;}
      const next=Number(section.dataset.designStage)+1;syncDesign(section,next);
      if(next>=3){stopDesignAnimation();return;}
      designTimer=window.setTimeout(tick,2400);
    };
    designTimer=window.setTimeout(tick,2400);
  }
  if(typeof window.matchMedia==='function')window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',()=>{
    stopDesignAnimation();const section=window.document.querySelector('.design-exercise');if(section)syncDesign(section);
  });
  window.document?.addEventListener('visibilitychange',()=>{if(window.document.hidden)stopDesignAnimation();});
  function designMarkup(crossed=false,treatmentEffect=1,stage=0) {
    const model=designModel(treatmentEffect,crossed);
    const labels=model.rows.map(row=>`${row.treatment?'Treated':'Control'} / batch ${row.batch+1}`);
    return `<section class="design-exercise" id="batch-design-exercise" data-crossed="${crossed}" data-design-stage="${stage}" data-playing="false" aria-labelledby="design-title">
      <h2 id="design-title">同一个信号，哪些机制解释还分不开？</h2>
      <p>把 observed signal 的黑框保留不动，再改变假设的 treatment 与 batch 分解。原创合成 assay signal，任意 log-scale 单位；每个组合只有一个示意观测，没有误差条或独立重复。这不是 RNA-seq raw counts，不用于 DESeq2 拟合。</p>
      <p class="design-equation">signal = <span>baseline 5</span> + <span class="treatment-term">β treatment × treated</span> + <span class="batch-term">β batch × batch 2</span></p>
      <p>两项指标各为 0/1；假设没有 interaction。两种效应的和固定为 3，但各项可以为负。滑块 −2 到 5 只是演示范围，不是由观测推断的界限。蓝、棕箭头是待比较的假设，不是测定的 biological mechanism。</p>
      <label class="design-effect-label">假设的 β treatment<output data-treatment-output>${treatmentEffect.toFixed(2)}</output><input aria-label="假设的 β treatment" data-treatment-effect type="range" min="-2" max="5" step="0.25" value="${treatmentEffect}"></label>
      <div class="design-hypotheses" role="group" aria-label="比较同样差值的四个解释"><button data-design-hypothesis="3" aria-pressed="${treatmentEffect===3}">解释 A：treatment 3 + batch 0</button><button data-design-hypothesis="0" aria-pressed="${treatmentEffect===0}">解释 B：treatment 0 + batch 3</button><button data-design-hypothesis="1" aria-pressed="${treatmentEffect===1}">解释 C：treatment 1 + batch 2</button><button data-design-hypothesis="-1" aria-pressed="${treatmentEffect===-1}">解释 D：treatment −1 + batch 4</button></div>
      <div class="design-playback"><button data-design-back ${stage===0?'disabled':''}>← 分解上一步</button><button data-play-design aria-pressed="false" ${isReducedMotion()?'disabled':''}>播放分解</button><button data-design-next ${stage===3?'disabled':''}>分解下一步 →</button><button data-design-replay>重播分解</button></div>
      <p class="design-motion-note">${isReducedMotion()?'系统减少动态效果已启用：请手动逐步查看静态分解。':'播放只在点击后开始；每步停留 2.4 秒，可暂停或重播。改变假设会暂停播放。'}</p>
      <h3 data-design-step-label>${stage+1}/4 · ${designStages[stage]}</h3>
      <figure><div class="design-figure-scroll" role="region" tabindex="0" aria-label="合成信号图，窄屏可左右滑动">${designFigure(model,stage)}</div><figcaption>黑框=观测；灰色段与分层箭头=当前假设的加性贡献，向右增加、向左减少；竖线=完整预测终点。所有行共用从 0 起的比例尺。窄屏可左右滑动。</figcaption></figure>
      <p data-design-step-text role="status" aria-live="polite">${designStepText(model,stage)}</p>
      <button type="button" data-cross-design="${!crossed}">${crossed?'回到完全混杂设计':'加入批次内 control / treated'}</button><p>加入新组合改变可用信息；切换会清空本题回答。改变假设不会改动观测数据。</p>
      <p data-model-result role="status" aria-live="polite">${designStatus(model)}</p>
      <details class="design-numeric-table"><summary>对照每个组合的完整模型预测</summary><div class="design-table-scroll" role="region" tabindex="0" aria-label="观测和模型预测对照表"><table><thead><tr><th scope="col">组合</th><th scope="col">观测</th><th scope="col">此假设的预测</th></tr></thead><tbody>${model.rows.map((row,i)=>`<tr><th scope="row">${labels[i]}</th><td>${row.value}</td><td data-prediction="${i}">${row.prediction.toFixed(2)}</td></tr>`).join('')}</tbody></table></div></details>
      <details class="design-self-check"><summary>可选：用三个判断检查证据边界</summary><div class="design-questions">${designQuestions.map((question,i)=>`<fieldset><legend>${escape(question.prompt)}</legend>${question.choices.map(([id,label])=>`<label><input type="radio" name="design-${i}" value="${id}"><span>${escape(label)}</span></label>`).join('')}</fieldset>`).join('')}</div><button type="button" data-check-design>检查三个判断</button><button type="button" data-retry-design hidden>清空本题，重新判断</button><p data-design-feedback class="design-feedback" role="status" aria-live="polite">先比较假设和观测；这三个判断不代表已掌握实验设计。</p></details>
      <p>模型边界：baseline 固定为 5，无噪声、无 interaction、每个组合一个示意值；系数可识别不等于估计精确或已证因果。</p><p>继续阅读：<a href="https://bioconductor.org/packages/release/bioc/vignettes/DESeq2/inst/doc/DESeq2.html#linear-combinations" target="_blank" rel="noopener noreferrer">DESeq2：Linear combinations</a> · <a href="https://www.ebi.ac.uk/training/materials/introduction-to-rna-seq-materials/course-content/" target="_blank" rel="noopener noreferrer">EMBL-EBI RNA-seq 课程</a>。图、数值与解释均为原创教学内容。</p></section>`;
  }
  window.BIOCS_PRACTICE={attemptForm,attemptError,designMarkup,designQuestions,evaluateDesign,designModel,designStatus,matrixRank,designFigure,designContributions,designStepText,designStages,stopDesignAnimation,syncDesign,setDesignStage,setDesignHypothesis,playDesign};
})();
