(() => {
  const specimens = [
    {sample:'S01',case:'P01',type:'tumor'},
    {sample:'S02',case:'P01',type:'normal'},
    {sample:'S03',case:'P02',type:'tumor'},
    {sample:'S04',case:'P03',type:'tumor'}
  ];
  const stages = {P01:'II',P02:'III',P03:'I'};
  const counts = [
    {gene:'Gene X',a:100,b:200},
    {gene:'Gene Y',a:50,b:50},
    {gene:'Other genes',a:850,b:1750}
  ];
  const totals = {a:1000,b:2000};
  const $ = selector => document.querySelector(selector);
  const toggle = (selector, attribute, value) => document.querySelectorAll(selector).forEach(button => button.setAttribute('aria-pressed',String(button.dataset[attribute]===value)));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const changeHighlight = element => {
    if (!element || reducedMotion.matches || !element.animate) return;
    element.animate([{backgroundColor:'#fff0bf'},{backgroundColor:'transparent'}],{duration:750,easing:'ease-out'});
  };
  let lastJoin = [];

  function showJoin(mode) {
    toggle('[data-join]','join',mode);
    const selected = specimens.filter(item => mode === 'all' || item.type === 'tumor');
    const cases = new Set(selected.map(item => item.case));
    $('#join-result').innerHTML = selected.map(item => `<tr data-sample="${item.sample}"${item.case==='P01'&&mode==='all'?' class="join-shared-case"':''}><td>${item.case}</td><td>${item.sample}</td><td>${item.type}</td><td>${stages[item.case]}</td></tr>`).join('');
    if(lastJoin.length) $('#join-result').querySelectorAll('tr').forEach(row=>{if(!lastJoin.includes(row.dataset.sample))changeHighlight(row);});
    lastJoin = selected.map(item=>item.sample);
    $('#join-summary').innerHTML = `<strong>${selected.length} 行材料记录</strong> · ${cases.size} 位独立患者。${mode==='all'?'P01 出现两次，因为同时有 tumor 和 normal。':'每位病例在这个教学例子中恰有一份 tumor。'}`;
  }
  document.querySelectorAll('[data-join]').forEach(button => button.addEventListener('click',() => showJoin(button.dataset.join)));

  function showCounts(mode) {
    toggle('[data-count-mode]','countMode',mode);
    const amount = (count,total) => mode==='raw' ? count : Math.round(count/total*1_000_000);
    $('#count-result').innerHTML = counts.map(row => `<tr><td>${row.gene}</td><td>${amount(row.a,totals.a).toLocaleString()}</td><td>${amount(row.b,totals.b).toLocaleString()}</td></tr>`).join('');
    const a=amount(100,totals.a), b=amount(200,totals.b), max=Math.max(a,b);
    if(!$('#count-bars').children.length) $('#count-bars').innerHTML=['样本 A','样本 B'].map(name=>`<div><span>${name} · Gene X</span><i></i><b></b></div>`).join('');
    [...$('#count-bars').children].forEach((bar,i)=>{const value=[a,b][i];bar.querySelector('i').style.width=`${value/max*100}%`;bar.querySelector('b').textContent=`${value.toLocaleString()} ${mode==='raw'?'count':'CPM'}`;});
    $('#count-summary').innerHTML = mode==='raw' ? 'Raw count：<strong>Gene X 在 B 是 A 的两倍</strong>，本题纳入的 gene count 合计也翻倍。' : '简化 CPM：<strong>Gene X 在两个样本都是 100,000 CPM</strong>。按本题三行合计缩放后，此例中的比例相同。';
  }
  document.querySelectorAll('[data-count-mode]').forEach(button => button.addEventListener('click',() => showCounts(button.dataset.countMode)));

  function showCoordinate() {
    const raw=$('#vcf-pos').value;
    const position=Number(raw);
    if (!Number.isSafeInteger(position) || position<1 || position>1_000_000_000) {
      $('#coordinate-output').textContent='请输入 1 到 1,000,000,000 之间的整数位置。';
      $('.coordinate-track').textContent='';
      return;
    }
    $('#coordinate-output').innerHTML = `VCF coordinate: <strong>toy_chr:${position.toLocaleString()}</strong><br>BED interval: <strong>toy_chr ${String(position-1)} ${String(position)}</strong><small>同一教学 contig 上的单碱基示意：BED start = VCF POS − 1；end = VCF POS。此处未核对真实 REF/ALT，左边不是完整 VCF 记录。</small>`;
    $('.coordinate-track').innerHTML = [position-2,position-1,position,position+1,position+2].map((n,i) => i===2 ? `<strong>${n} · selected POS</strong>` : `<span>${n<1?'—':n}</span>`).join('');
  }
  $('#vcf-pos').addEventListener('input',showCoordinate);

  const tiles=Array.from({length:4},(_,i)=>[`P0${i+1}-T1`,`P0${i+1}-T2`]).flat();
  const tileNodes=new Map();
  function showSplit(mode) {
    toggle('[data-split]','split',mode);
    const train=tiles.filter(tile => mode==='tile' ? tile.endsWith('T1') : ['P01','P02'].includes(tile.slice(0,3)));
    const test=tiles.filter(tile => !train.includes(tile));
    const patient=tile=>tile.slice(0,3);
    const overlap=new Set(train.map(patient).filter(id=>test.some(tile=>patient(tile)===id)));
    const positions = new Map([...tileNodes].map(([tile,node])=>{node.getAnimations?.().forEach(animation=>animation.cancel());return [tile,node.getBoundingClientRect()];}));
    [[train,'#split-train'],[test,'#split-test']].forEach(([group,selector])=>group.forEach(tile=>{
      let node=tileNodes.get(tile);
      if(!node){node=document.createElement('span');node.innerHTML=`${tile}<small>${patient(tile)} · tile</small>`;node.dataset.patient=patient(tile);tileNodes.set(tile,node);}
      node.classList.toggle('shared-patient',overlap.has(patient(tile)));
      $(selector).appendChild(node);
    }));
    if(!reducedMotion.matches) tileNodes.forEach((node,tile)=>{
      const old=positions.get(tile),now=node.getBoundingClientRect();
      if(old&&node.animate&&(old.left!==now.left||old.top!==now.top))node.animate([{transform:`translate(${old.left-now.left}px,${old.top-now.top}px)`},{transform:'translate(0,0)'}],{duration:650,easing:'cubic-bezier(.2,.65,.25,1)'});
    });
    $('#split-summary').innerHTML=mode==='tile' ? `<strong>${overlap.size} 位患者同时出现在 TRAIN 与 TEST</strong>。此拆分会使患者级评估泄漏。` : `<strong>TRAIN 与 TEST 共享患者：${overlap.size} 位</strong>。各组有 2 位独立患者；这是教学示意，真实建模需要更大队列。`;
  }
  document.querySelectorAll('[data-split]').forEach(button=>button.addEventListener('click',()=>showSplit(button.dataset.split)));

  const sbsTemplate = ['T','G','C','A','T','G'];
  const complement = {A:'T',T:'A',C:'G',G:'C'};
  let sbsCycle = 0;
  let sbsPhase=2,sbsTimer=null,sbsPlaying=false;
  function stopSBS(message) {
    if(!sbsPlaying)return;clearTimeout(sbsTimer);sbsTimer=null;sbsPlaying=false;
    $('#sbs-play').textContent='继续播放 cycles';$('#sbs-play').setAttribute('aria-pressed','false');
    if(message)$('#sbs-motion-status').textContent=message;
  }
  function showSBS() {
    if(!$('#sbs-bases').children.length)$('#sbs-bases').innerHTML=sbsTemplate.map(()=>'<span>·</span>').join('');
    [...$('#sbs-bases').children].forEach((node,i)=>{
      node.textContent=i<sbsCycle?complement[sbsTemplate[i]]:'·';
      node.className=`${i<sbsCycle?'read':''}${i===sbsCycle-1?' current':''}${i===sbsCycle-1&&sbsPhase===1?' imaging':''}`;
      node.setAttribute('aria-label',i<sbsCycle?`第 ${i+1} 轮：${complement[sbsTemplate[i]]}`:'尚未读取');
    });
    $('#sbs-template-output').innerHTML=`3′ — ${sbsTemplate.map((base,i)=>`<span${i===sbsCycle-1?' class="current"':''}>${base}</span>`).join(' ')} — 5′`;
    document.querySelectorAll('[data-sbs-phase]').forEach(node=>{
      const active=sbsCycle>0&&Number(node.dataset.sbsPhase)===sbsPhase;
      node.classList.toggle('active',active);if(active)node.setAttribute('aria-current','step');else node.removeAttribute('aria-current');
    });
    const phaseNotes=['加入互补碱基（可逆终止使本轮只延长一步）','成像读取信号（颜色仅为概念高亮）','解除阻断，准备下一轮合成'];
    $('#sbs-summary').innerHTML = sbsCycle === 0 ? '尚未开始：新链为空。每轮按互补配对加入一个碱基，再由仪器读取信号。' : `<strong>Cycle ${sbsCycle} / ${sbsTemplate.length} · ${phaseNotes[sbsPhase]}</strong>模板 ${sbsTemplate[sbsCycle-1]} → 新链 ${complement[sbsTemplate[sbsCycle-1]]}。当前合成的新链：5′-${sbsTemplate.slice(0,sbsCycle).map(base=>complement[base]).join('')}-3′。${sbsPhase===0?'本轮尚未成像读出；合成的碱基和仪器已读取的碱基要分开理解。':''}`;
    $('#sbs-next').disabled = sbsCycle === sbsTemplate.length && sbsPhase===2;
    $('#sbs-next').textContent=sbsPhase<2?'完成本轮 cycle':'进行下一轮 cycle';
  }
  function playSBS() {
    if(!sbsPlaying)return;
    if(sbsPhase===2){
      if(sbsCycle>=sbsTemplate.length){stopSBS('六轮完成：新链为 5′-ACGTAC-3′。read 还需质量评分、比对与定量，才能成为 gene count。');$('#sbs-play').textContent='重播全部 cycles';return;}
      sbsCycle++;sbsPhase=0;
    }else sbsPhase++;
    showSBS();sbsTimer=setTimeout(playSBS,1000);
  }
  $('#sbs-play').addEventListener('click',()=>{
    if(sbsPlaying){stopSBS('已暂停在当前 cycle 和步骤；可继续播放或完成本轮。');return;}
    if(sbsCycle===sbsTemplate.length&&sbsPhase===2){sbsCycle=0;}
    sbsPlaying=true;$('#sbs-play').textContent='暂停 cycles';$('#sbs-play').setAttribute('aria-pressed','true');$('#sbs-motion-status').textContent='每轮依次演示加入 → 成像 → 解除阻断；速度仅为教学设定。';playSBS();
  });
  $('#sbs-next').addEventListener('click',()=>{stopSBS('已切换为手动逐轮查看。');if(sbsPhase===2&&sbsCycle<sbsTemplate.length)sbsCycle++;sbsPhase=2;showSBS();});
  $('#sbs-reset').addEventListener('click',()=>{stopSBS();sbsCycle=0;sbsPhase=2;$('#sbs-play').textContent='自动播放 cycles';$('#sbs-motion-status').textContent='已重置。逐轮查看或自动播放；字母颜色不对应真实荧光通道。';showSBS();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopSBS('已暂停：页面已切到后台。');});
  if('IntersectionObserver' in window)new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)stopSBS('已暂停：测序模型已离开视口。');}).observe($('#sbs'));
  reducedMotion.addEventListener?.('change',()=>{if(reducedMotion.matches)stopSBS('减少动态效果已开启；可以继续手动逐轮查看。');});

  const normRows=[{gene:'A',length:1,s1:100,s2:100},{gene:'B',length:2,s1:200,s2:200},{gene:'C',length:1,s1:700,s2:1700}];
  const normTotals={s1:1000,s2:2000};
  const rates={s1:normRows.reduce((sum,row)=>sum+row.s1/row.length,0),s2:normRows.reduce((sum,row)=>sum+row.s2/row.length,0)};
  const geometric=normRows.map(row=>Math.sqrt(row.s1*row.s2));
  const median = values => [...values].sort((a,b)=>a-b)[Math.floor(values.length/2)];
  const sizeFactors={s1:median(normRows.map((row,i)=>row.s1/geometric[i])),s2:median(normRows.map((row,i)=>row.s2/geometric[i]))};
  const fmt = value => value.toLocaleString('en-US',{maximumFractionDigits:1});
  function normalized(row,sample,mode) {
    const count=row[sample], total=normTotals[sample];
    if(mode==='raw') return count;
    if(mode==='cpm') return count/total*1_000_000;
    if(mode==='fpkm') return count/(row.length*(total/1_000_000));
    if(mode==='tpm') return count/row.length/rates[sample]*1_000_000;
    return count/sizeFactors[sample];
  }
  function showNormalization(mode) {
    toggle('[data-norm]','norm',mode);
    if(!$('#norm-result').children.length)$('#norm-result').innerHTML=normRows.map(row=>`<tr><td>Gene ${row.gene}</td><td>${row.length} kb</td><td></td><td></td></tr>`).join('');
    [...$('#norm-result').children].forEach((tr,i)=>['s1','s2'].forEach((sample,j)=>{
      const cell=tr.children[j+2],value=fmt(normalized(normRows[i],sample,mode)),previous=cell.textContent;
      cell.textContent=value;if(previous&&previous!==value)changeHighlight(cell);
    }));
    const summaries={
      raw:'A/B 的 raw 没变；只有 C 从 700 增到 1,700。样本 S2 的总 count 因此翻倍。',
      cpm:'A 的 CPM 从 100,000 降到 50,000，即使 raw 一直是 100；固定总量引入了组成效应。',
      fpkm:'B 长 2 kb，count=200；长度校正后它与 count=100、长 1 kb 的 A 数值相同。RPKM/FPKM 的列总和不固定。',
      tpm:'本题三行覆盖全部纳入的 feature；先按长度缩放，再按这三行 rate 的总量缩放，未四舍五入的 TPM 和为 1,000,000。A 仍会受 C 增加影响。',
      median:`三个基因的 median-of-ratios 给 S1/S2 的 size factor 都是 ${sizeFactors.s1.toFixed(2)}/${sizeFactors.s2.toFixed(2)}。A/B 因而保持不变；这只是说明思想。`
    };
    const formulas={
      raw:'Raw = 定量流程分配给 gene 的 reads 或 fragments；不是细胞中的绝对 RNA 分子数。',
      cpm:'本题 CPM = raw ÷ 三行 gene count 合计 × 1,000,000；真实文件要核对 feature 集合和分母。',
      fpkm:'本题 RPKM/FPKM = raw ÷ (假设长度 kb × mapped reads/fragments 总量 million)，并假定用于分母的计数都在三行内。按 fragment 计数称 FPKM。',
      tpm:'rate = raw ÷ 假设长度 kb；本题 TPM = rate ÷ 三行全部 rate 之和 × 1,000,000。',
      median:'每 gene 几何平均 → 每样本除以几何平均 → 中位数为 size factor；本例中 A/B 稳定。'
    };
    $('#norm-summary').innerHTML=`<strong>${mode==='median'?'Size factor':mode.toUpperCase()}</strong>：${summaries[mode]}`;
    $('#norm-formula').textContent=formulas[mode];
    const denominators={raw:'没有做分母缩放。以下每次变换均从原始 count 重新计算，不在前一种结果上重复归一化。',cpm:'本题分母：S1 = 1,000；S2 = 2,000（纳入的 count 合计）。',fpkm:'本题分母：每行长度 kb × 样本总量 million；S1 总量 = 0.001 million，S2 = 0.002 million。',tpm:`先 count ÷ 长度 kb；再除以本题 rate 合计：S1 = ${fmt(rates.s1)}，S2 = ${fmt(rates.s2)}。`,median:`本题分母为 size factor：S1 = ${fmt(sizeFactors.s1)}，S2 = ${fmt(sizeFactors.s2)}。总 count 翻倍不强制 size factor 翻倍。`};
    const denominator=$('#norm-denominator'),previous=denominator.textContent;denominator.textContent=denominators[mode];if(previous&&previous!==denominator.textContent)changeHighlight(denominator);
    const purposes={
      raw:{meaning:'定量流程分配给 gene 的 read 或 fragment 计数。',use:'保存最接近定量输出的证据；作为支持计数分布的模型起点。',avoid:'不能跨文库直接比较，也不是每细胞绝对 RNA 分子数。',next:'核对 workflow、样本设计和 QC，再让模型估计规模与离散度。'},
      cpm:{meaning:'每一百万纳入 count 中，这个 gene 占多少。',use:'快速检查文库规模校正后的相对比例、过滤阈值和 QC。',avoid:'没有长度校正；CPM 本身不是正式差异表达检验。',next:'描述或过滤时写清分母；组间推断回到合适的 count 模型。'},
      fpkm:{meaning:'同时按 feature 长度和每百万 mapped reads 或 fragments 缩放的 rate。',use:'理解较长 feature 获得更多计数机会的问题，或读取遗留结果。',avoid:'列和不固定，gene-level length 还会受 transcript 与 isoform 定义影响。',next:'核对 R/F、长度定义和流程版本；不要把它直接作为常规 DESeq2 输入。'},
      tpm:{meaning:'长度校正后的相对 RNA 组成；每个样本纳入 feature 的总和为一百万。',use:'在相同流程与 feature 集下描述样本内部的相对 abundance。',avoid:'不是每细胞绝对分子数，也不自带重复、离散度或 p 值。',next:'展示时报告病例点和组成限制；正式差异表达使用相应的 count 输入。'},
      median:{meaning:'raw count 除以模型从许多 gene 估计的相对 size factor。',use:'理解“多数 gene 没有整体同向变化”假设下的有效文库规模调整。',avoid:'不会自动消除 batch、肿瘤纯度或细胞组成，也不是统计显著性。',next:'把 size factor 放入包含设计和离散度的计数模型，再定义 contrast。'}
    };
    document.querySelectorAll('[data-norm-purpose]').forEach(node=>{node.textContent=purposes[mode][node.dataset.normPurpose];});
  }
  document.querySelectorAll('[data-norm]').forEach(button=>button.addEventListener('click',()=>showNormalization(button.dataset.norm)));

  showJoin('tumor');
  showCounts('raw');
  showCoordinate();
  showSplit('patient');
  showSBS();
  showNormalization('raw');
})();
