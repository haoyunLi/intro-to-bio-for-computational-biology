(async () => {
  'use strict';
  const host=document.querySelector('#cohort-workbench');
  if(!host)return;
  const $=selector=>host.querySelector(selector);
  const $$=selector=>[...host.querySelectorAll(selector)];
  const snapshotUrl='./data/gdc-tcga-brca-paired-star-counts-snapshot.json';
  const short=value=>`${value.slice(0,8)}…`;
  const caseOf=file=>file.cases[0];
  const sampleOf=file=>caseOf(file).samples[0];
  const isTumor=file=>sampleOf(file).sample_type==='Primary Tumor';
  let timer=null,playing=false,pipelineStep=0,snapshot;
  const pipeline=[
    {title:'定义 cohort',artifact:'GDC filter JSON',body:'先写疾病、assay、workflow、access 和 sample_type；病例过滤与文件过滤是不同层级。',guard:'保存完整查询和时间，不能只记“从 TCGA 下载”。'},
    {title:'冻结 manifest',artifact:'file_id + MD5 + release',body:'把每个文件 UUID、文件名、MD5、workflow version 与获取日期固定下来。',guard:'同一 sample 可能关联多个文件；更新 release 后结果可能变化。'},
    {title:'确定分析粒度',artifact:'case–sample–file key map',body:'明确一行是 case、sample 还是 file，并决定重复文件、aliquot 与多份材料如何处理。',guard:'文件行数不能当独立患者数。'},
    {title:'构建表达矩阵',artifact:'gene × sample raw counts',body:'按一致的基因注释和字段把文件列拼成矩阵；保存 gene ID 版本和 sample 映射。',guard:'不要把 TPM 直接作为基于计数分布模型的输入。'},
    {title:'质量控制',artifact:'sample QC report',body:'检查库大小、映射/分配摘要、异常样本、重复 ID 与缺失临床字段。',guard:'QC 失败和未测不能填成 0。'},
    {title:'写 design',artifact:'design table at case grain',body:'将 sample_type、pair ID、批次和必要临床协变量连接到样本；配对设计保留 case ID。',guard:'临床字段按 case_id 连接，避免同一病例被重复当作独立结局。'},
    {title:'拟合与诊断',artifact:'model + contrasts + diagnostics',body:'在足够独立病例下拟合适合 raw counts 的模型，定义 contrast，并检查离群点与多重检验。',guard:'先确定模型再看结果；教学子集 n=2 不能估计总体显著性。'},
    {title:'报告边界',artifact:'provenance + effect + uncertainty',body:'同时报告纳入/排除数量、效应量、不确定性、软件版本和可复现入口。',guard:'观察性队列的关联不自动成为因果或临床预测。'}
  ];

  function switchPanel(id){
    stopPipeline();
    $$('[data-workbench-tab]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.workbenchTab===id)));
    $$('.workbench-panel').forEach(panel=>panel.hidden=panel.id!==`workbench-${id}`);
  }
  function renderInventory(){
    const inv=snapshot.cohort_inventory;
    const metrics=[['files','公开文件'],['unique_samples','不重复 sample'],['unique_cases','不重复 case'],['paired_primary_normal_cases','肿瘤/正常配对 case']];
    $('#inventory-metrics').innerHTML=metrics.map(([key,label],index)=>`<article style="--delay:${index*90}ms"><strong>${inv[key].toLocaleString()}</strong><span>${label}</span></article>`).join('');
    const max=inv.files;
    $('#inventory-funnel').innerHTML=metrics.map(([key,label])=>`<div><span>${label}</span><i style="--target:${Math.max(10,inv[key]/max*100)}%"></i><b>${inv[key].toLocaleString()}</b></div>`).join('');
    $('#inventory-types').innerHTML=inv.sample_types.map(row=>`<tr><th>${row.sample_type}</th><td>${row.samples.toLocaleString()}</td><td>${row.files.toLocaleString()}</td><td>${(row.files-row.samples).toLocaleString()}</td></tr>`).join('');
    $('#inventory-date').textContent=new Date(inv.queried_at_utc).toLocaleString('zh-CN',{timeZone:'UTC',hour12:false})+' UTC';
    requestAnimationFrame(()=>host.classList.add('inventory-ready'));
  }
  function renderClinicalTables(){
    $('#clinical-rows').innerHTML=snapshot.clinical_cases.map(item=>`<tr><td>${item.submitter_id}</td><td>${item.diagnosis.ajcc_pathologic_stage}</td><td>${item.demographic.vital_status}</td><td>${item.diagnosis.days_to_last_follow_up??'NA'}</td></tr>`).join('');
    $('#assay-rows').innerHTML=snapshot.files.map(file=>`<tr><td>${caseOf(file).submitter_id}</td><td>${sampleOf(file).submitter_id}</td><td>${sampleOf(file).sample_type}</td><td title="${file.file_id}">${short(file.file_id)}</td></tr>`).join('');
    renderJoin('case_id');
  }
  function renderJoin(key){
    $$('[data-join-key]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.joinKey===key)));
    const body=$('#clinical-join-result'); body.replaceChildren();
    const matches=key==='case_id'?snapshot.files.map(file=>({file,clinical:snapshot.clinical_cases.find(item=>item.case_id===caseOf(file).case_id)})).filter(item=>item.clinical):[];
    matches.forEach((item,index)=>{
      const row=document.createElement('tr'); row.style.setProperty('--delay',`${index*90}ms`);
      const values=[caseOf(item.file).submitter_id,sampleOf(item.file).submitter_id,sampleOf(item.file).sample_type,item.clinical.diagnosis.ajcc_pathologic_stage,item.clinical.demographic.vital_status,short(item.file.file_id)];
      row.innerHTML=values.map(value=>`<td>${value}</td>`).join(''); body.appendChild(row);
    });
    $('#join-key-token').textContent=key;
    $('#join-key-token').dataset.valid=String(key==='case_id');
    $('#clinical-join-summary').innerHTML=key==='case_id'
      ?`得到 <strong>${matches.length} 行</strong> file-level 结果，但仍只有 <strong>${new Set(matches.map(item=>item.clinical.case_id)).size} 位独立 case</strong>。Stage 和 vital_status 会在同一病例的多份文件上重复。`
      :`得到 <strong>0 行</strong>：临床表没有 ${key}。必须先通过 GDC 的实体关系回到 case_id，再连接病例级字段。`;
    $('#join-empty').hidden=matches.length>0; $('#clinical-join-table').hidden=!matches.length;
  }
  function renderPipeline(index,announce=true){
    pipelineStep=index; const item=pipeline[index];
    $('#pipeline-progress').style.width=`${(index+1)/pipeline.length*100}%`;
    $('#pipeline-counter').textContent=`${String(index+1).padStart(2,'0')} / ${pipeline.length}`;
    $('#pipeline-title').textContent=item.title; $('#pipeline-body').textContent=item.body;
    $('#pipeline-artifact').textContent=item.artifact; $('#pipeline-guard').textContent=item.guard;
    $$('[data-pipeline-step]').forEach((button,i)=>{button.setAttribute('aria-pressed',String(i===index));button.classList.toggle('visited',i<index);});
    $('#pipeline-prev').disabled=index===0; $('#pipeline-next').disabled=index===pipeline.length-1;
    if(announce)$('#pipeline-title').focus({preventScroll:true}); paintPipeline();
  }
  function paintPipeline(){const button=$('#pipeline-play');button.textContent=playing?'Ⅱ 暂停流程':pipelineStep===pipeline.length-1?'↻ 重播完整流程':'▶ 播放完整流程';button.setAttribute('aria-pressed',String(playing));}
  function stopPipeline(){clearTimeout(timer);timer=null;playing=false;paintPipeline();}
  function schedulePipeline(){clearTimeout(timer);if(!playing)return;timer=setTimeout(()=>{if(pipelineStep<pipeline.length-1){renderPipeline(pipelineStep+1,false);schedulePipeline();}else stopPipeline();},1700);}
  function setupPipeline(){
    $('#pipeline-steps').innerHTML=pipeline.map((item,index)=>`<button type="button" data-pipeline-step="${index}" aria-pressed="false"><span>${String(index+1).padStart(2,'0')}</span>${item.title}</button>`).join('');
    $$('[data-pipeline-step]').forEach((button,index)=>button.addEventListener('click',()=>{stopPipeline();renderPipeline(index);}));
    $('#pipeline-prev').addEventListener('click',()=>{stopPipeline();renderPipeline(Math.max(0,pipelineStep-1));});
    $('#pipeline-next').addEventListener('click',()=>{stopPipeline();renderPipeline(Math.min(pipeline.length-1,pipelineStep+1));});
    $('#pipeline-play').addEventListener('click',()=>{if(playing){stopPipeline();return;}if(pipelineStep===pipeline.length-1)renderPipeline(0,false);playing=true;paintPipeline();schedulePipeline();});
    renderPipeline(0,false);
  }
  function renderPairEffect(){
    const gene=$('#pair-gene').value,field=$('#pair-metric').value;
    const pairs=snapshot.clinical_cases.map(clinical=>{
      const related=snapshot.files.filter(file=>caseOf(file).case_id===clinical.case_id);
      const tumor=related.find(isTumor),normal=related.find(file=>!isTumor(file));
      const t=Number(tumor.rows.find(row=>row.gene_name===gene)[field]);
      const n=Number(normal.rows.find(row=>row.gene_name===gene)[field]);
      return {case:clinical.submitter_id,tumor:t,normal:n,delta:Math.log2(t+1)-Math.log2(n+1)};
    });
    const max=Math.max(...pairs.flatMap(pair=>[pair.tumor,pair.normal]),1);
    $('#pair-bars').innerHTML=pairs.map(pair=>`<article><h4>${pair.case}</h4><div><span>Normal</span><i style="--width:${pair.normal/max*100}%"></i><b>${pair.normal.toLocaleString()}</b></div><div><span>Tumor</span><i class="tumor" style="--width:${pair.tumor/max*100}%"></i><b>${pair.tumor.toLocaleString()}</b></div><p>Δ log₂(value+1) = <strong>${pair.delta.toFixed(2)}</strong></p></article>`).join('');
    $('#pair-effect-summary').textContent=`${gene} · ${field==='unstranded'?'raw count':'TPM'}：图中只有 2 个独立配对病例；柱长只在当前基因与尺度内缩放，不计算 p 值。`;
  }
  try{
    const response=await fetch(snapshotUrl);if(!response.ok)throw Error(`HTTP ${response.status}`);snapshot=await response.json();
    if(!snapshot.cohort_inventory||!snapshot.clinical_cases)throw Error('快照缺少 cohort_inventory 或 clinical_cases');
    renderInventory();renderClinicalTables();setupPipeline();
    $('#pair-gene').innerHTML=['TSPAN6','ESR1','ERBB2','INS'].map(gene=>`<option>${gene}</option>`).join('');
    $('#pair-gene').value='ESR1';renderPairEffect();
    $('#pair-gene').addEventListener('change',renderPairEffect);$('#pair-metric').addEventListener('change',renderPairEffect);
    $$('[data-workbench-tab]').forEach(button=>button.addEventListener('click',()=>switchPanel(button.dataset.workbenchTab)));
    $$('[data-join-key]').forEach(button=>button.addEventListener('click',()=>renderJoin(button.dataset.joinKey)));
    document.addEventListener('visibilitychange',()=>{if(document.hidden)stopPipeline();});
    new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)stopPipeline();},{threshold:0}).observe(host);
    switchPanel('inventory');$('#workbench-loading').hidden=true;$('#workbench-content').hidden=false;
  }catch(error){$('#workbench-loading').textContent=`无法载入完整队列工作台（${error.message}）。请使用本地 HTTP 服务或 GitHub Pages 打开。`;}
})();
