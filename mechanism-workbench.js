/* Established Bio/CS reading surface: question → controlled experiment → calculation → interpretation.
   All numeric examples are synthetic. These diagrams describe explicit mathematical toy models. */
(function (root) {
  'use strict';
  const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, Number(x)));
  function enzyme(S, Km, ratio, mode) {
    const vmax = mode === 'noncompetitive' ? 100 / (1 + ratio) : 100;
    const apparentKm = mode === 'competitive' ? Km * (1 + ratio) : Km;
    return { rate: vmax * S / (apparentKm + S), vmax, apparentKm, baseline: 100 * S / (Km + S) };
  }
  function receptor(L, ec50, hill) {
    return { occupancy: L / (20 + L), response: L ** hill / (ec50 ** hill + L ** hill) };
  }
  // Exact deterministic first moments of a two-stage, linear birth/death model.
  function expression(t, alpha, rnaHalf, proteinHalf, stop = 10) {
    const gm = Math.LN2 / rnaHalf, gp = Math.LN2 / proteinHalf, beta = 2;
    function evolve(dt, a, m0, p0) {
      const ms = a / gm, em = Math.exp(-gm * dt), ep = Math.exp(-gp * dt);
      const convolution = Math.abs(gp - gm) < 1e-10 ? dt * ep : (em - ep) / (gp - gm);
      return { rna: ms + (m0 - ms) * em, protein: p0 * ep + beta * ms * (1 - ep) / gp + beta * (m0 - ms) * convolution };
    }
    const on = evolve(Math.min(t, stop), alpha, 0, 0);
    const result = t > stop ? evolve(t - stop, 0, on.rna, on.protein) : on;
    return { ...result, gm, gp, transcription: t >= stop ? 0 : alpha, translation: beta * result.rna, rnaLoss: gm * result.rna, proteinLoss: gp * result.protein };
  }
  function seeded(seed) {
    let x = (seed >>> 0) || 1;
    return () => { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return (x >>> 0) / 4294967296; };
  }
  function population(copies, initial, selection, seed, generations = 30) {
    const n = Math.round(copies), rng = seeded(seed);
    const points = [initial];
    for (let g = 0; g < generations; g++) {
      const p = points[g], selected = p * (1 + selection) / (1 + selection * p);
      let a = 0;
      for (let i = 0; i < n; i++) a += rng() < selected ? 1 : 0;
      points.push(a / n);
    }
    return points;
  }
  function selectionPath(initial, selection, generations = 30) {
    const points = [initial];
    for (let i = 0; i < generations; i++) { const p = points[i]; points.push(p * (1 + selection) / (1 + selection * p)); }
    return points;
  }
  const math = { enzyme, receptor, expression, population, selectionPath, seeded };
  root.MechanismMath = math;
  if (typeof module !== 'undefined' && module.exports) module.exports = math;
  if (!root.document) return;
  const host = root.document.getElementById('mechanism-workbench');
  if (!host) return;
  const fmt = (n, digits = 2) => Number(n).toFixed(digits);
  const palette = ['#1b55b5', '#13736c', '#974c76', '#536984'];
  const topics = {
    enzyme: {
      name: 'Enzyme kinetics', title: '增加 Substrate，能否恢复被抑制的反应？',
      intro: '把 enzyme assay 的 Input [S]、Km 与 inhibitor ratio 变成 Output initial velocity。比较曲线的水平位置和饱和值，理解为什么一个 endpoint 读数不能独立识别机制。',
      inputs: [{ key: 'substrate', label: 'Substrate [S] (µM)', min: 0, max: 100, step: 1, initial: 20 }, { key: 'km', label: 'Baseline Km (µM)', min: 5, max: 40, step: 1, initial: 10 }, { key: 'ratio', label: 'Inhibitor ratio [I]/Ki', min: 0, max: 4, step: .1, initial: 1 }],
      select: { key: 'mode', label: 'Inhibition model', initial: 'competitive', options: [['competitive', 'Competitive'], ['noncompetitive', 'Pure noncompetitive'], ['none', 'No inhibitor']] },
      steps: [
        ['Define the assay', '测 initial velocity，保持 enzyme amount、温度、pH 与反应窗口一致。这里 Vmax=100 µM/min；[S]、Km 使用相同浓度单位。'],
        ['Change an apparent parameter', 'Competitive：Km,app=Km(1+[I]/Ki)，Vmax 不变。Pure noncompetitive：Vmax,app=Vmax/(1+[I]/Ki)，Km 不变；这是 mixed inhibition 中两种结合常数相等的特例。'],
        ['Compute the velocity', '将当前 apparent parameters 代入 v=Vmax,app[S]/(Km,app+[S])。图中圆点与下面读数采用同一个计算。灰色虚线是相同 baseline Km 下的无 inhibitor 对照。'],
        ['Interpret the experiment', '多测几个 [S] 并比较 curve shape。高 [S] 能接近 competitive 的原 Vmax；pure noncompetitive 的上限降低。Km 一般包含 binding 与 catalysis，不能一律视为 Kd。']
      ],
      settings: [['什么时候用', '在 initial-rate enzyme assay 中比较 saturation 与理想 inhibition patterns；优点是参数和单位清楚。'], ['怎么设置', '覆盖低于、接近和高于 Km 的 [S]；另做无 inhibitor 对照。真实拟合保留 replicate、blank correction 与误差，优先 nonlinear regression。'], ['边界与排错', '本图忽略 substrate depletion、product inhibition、irreversible binding 和 assay interference。纯 noncompetitive 是特殊模型；曲线形状本身不能证明 inhibitor 的结合位点。']],
      question: '在 pure noncompetitive 模型中，[I]/Ki=1。即使 [S] 很大，v 的上限是多少？', answers: ['100 µM/min', '50 µM/min', '由当前 [S] 决定，永远无上限'], correct: 1,
      feedback: 'Vmax,app=100/(1+1)=50 µM/min。提高 [S] 让 v 接近 50，无法使这个模型的 active capacity 回到 100。',
      source: [['NCBI Assay Guidance Manual · Enzymatic assays', 'https://www.ncbi.nlm.nih.gov/books/NBK92007/']],
      boundary: 'Synthetic enzyme assay，单一 substrate、initial-rate Michaelis–Menten model。Ki 与 inhibitor concentration 只通过 ratio 进入，未拟合任何实验。'
    },
    receptor: {
      name: 'Binding & response', title: 'Receptor occupancy 与细胞 response 为什么可能不同？',
      intro: '同一个 ligand concentration 进入两个测量：bound receptor 的比例与 downstream response 的比例。用两条曲线看清 Kd、EC50 和 Hill coefficient 各自描述什么。',
      inputs: [{ key: 'ligand', label: 'Ligand [L] (nM)', min: 0, max: 100, step: 1, initial: 20 }, { key: 'ec50', label: 'Response EC50 (nM)', min: 5, max: 60, step: 1, initial: 10 }, { key: 'hill', label: 'Response Hill coefficient n', min: 1, max: 4, step: .25, initial: 2 }],
      steps: [
        ['Specify two measurements', 'Binding assay 测 bound fraction；functional assay 测指定的 downstream readout。这里 binding 使用单一 independent site，Kd 固定为 20 nM。'],
        ['Compute occupancy', 'θ=[L]/(Kd+[L])。当 [L]=Kd=20 nM 时 θ=0.5。假设 free ligand 近似输入浓度、已达 equilibrium，忽略 ligand depletion 和 nonspecific binding。'],
        ['Compute a response curve', 'R=[L]^n/(EC50^n+[L]^n)，Rmax=1。这里的 R 是单独指定的 phenomenological response；n 控制曲线陡峭程度，不能仅由 n>1 宣称分子发生 cooperativity。'],
        ['Compare the outputs', 'EC50<Kd 时，本 toy 可在低 occupancy 下有较高 response，提示 assay 层级或 signal amplification 值得检查。实际机制需要独立 binding、kinetic 与 functional evidence。']
      ],
      settings: [['什么时候用', '阅读 dose–response 与 binding experiment；区分 affinity、potency 和 response amplitude。'], ['怎么设置', '覆盖 EC50/Kd 两侧浓度；记录 free/total ligand、incubation time、background、最大响应和 assay endpoint。'], ['边界与排错', '本图两条曲线独立指定，未模拟 receptor signaling network、spare receptors 或 toxicity。Kd 与 EC50 相等或不等都不能单独识别机制。']],
      question: '实验中 EC50 < Kd，可以直接证明 receptor binding 是 cooperative 吗？', answers: ['可以，EC50 小就意味着 cooperative binding', '不能；需区分 binding 与 functional readout', '可以，只要 Hill coefficient > 1'], correct: 1,
      feedback: 'EC50 描述这个 functional assay 的半最大响应，Kd 描述 binding equilibrium。Signal amplification、测量时间和 readout 都可能改变两者关系；Hill slope 也不是独立的 molecular mechanism 证据。',
      source: [['NCBI Assay Guidance Manual · Receptor binding', 'https://www.ncbi.nlm.nih.gov/books/NBK91992/']],
      boundary: 'Synthetic independent binding curve 与 phenomenological Hill response。纵轴均为 fraction，但分母不同；不将 response 当成 receptor occupancy。'
    },
    expression: {
      name: 'RNA / protein turnover', title: '停止 transcription 后，Protein 为什么还可能增加？',
      intro: '沿着 DNA → mRNA → Protein 的 production 与 degradation rates 逐步计算。观察 mRNA 下降和 Protein 变化的时间差，把 snapshot abundance 放回动态过程。',
      inputs: [{ key: 'alpha', label: 'Transcription α (mRNA/min)', min: 0, max: 20, step: 1, initial: 10 }, { key: 'rnaHalf', label: 'mRNA half-life (min)', min: 1, max: 8, step: .5, initial: 2 }, { key: 'proteinHalf', label: 'Protein half-life (min)', min: 2, max: 16, step: .5, initial: 6 }, { key: 'time', label: '观察时间 t (min)', min: 0, max: 40, step: .5, initial: 11 }],
      steps: [
        ['Define production and loss', 'm(0)=p(0)=0；transcription 在 0≤t<10 min 恒定为 α，此后设为 0。Translation β=2 proteins/(mRNA·min)。RNA 与 Protein 都以一阶 rate 降解。'],
        ['Convert half-life to rate', 'γm=ln2/t½,m；γp=ln2/t½,p。更长 half-life 意味着更小 loss rate。这里使用精确线性 ODE 解；没有通过粗大 timestep 人为制造震荡。'],
        ['Balance the two fluxes', 'dm/dt=α(t)−γm·m；dp/dt=β·m−γp·p。Protein 的 production 来自现存 mRNA；停止 transcription 不会立刻删除这些 mRNA。'],
        ['Read a snapshot cautiously', '当 βm>γp p 时 Protein 仍增加，即使 transcription 已关闭。RNA-seq snapshot 不能单独给出 translation 或 Protein abundance；真实系统还含 bursting、反馈与 dilution。']
      ],
      settings: [['什么时候用', '解释 RNA–Protein lag、perturbation time course、half-life 和 steady state。此图展示期望/连续丰度，不表示每个细胞的整数分子轨迹。'], ['怎么设置', '在 perturbation 前后取多个时间点；明确 min/hour，保存 production 与 degradation 的单位。比较 abundance 时同时报告测量层。'], ['边界与排错', '固定 β、瞬时关闭 transcription、无反馈和细胞分裂。真实 half-life 与 synthesis rate 需要专门实验，不能凭这两条 toy 曲线推断。']],
      question: 't=10 min 时停止 transcription，Protein 是否必定立即下降？', answers: ['是，因为 RNA 已全部消失', '否；现存 mRNA 的 translation 可能仍大于 Protein loss', '否，因为 Protein 永远不降解'], correct: 1,
      feedback: '看 dp/dt=βm−γp p 的符号。Transcription off 只令新的 RNA production 为零；已经存在的 RNA 继续翻译，直到 translation 不再抵消 Protein degradation。',
      source: [['Shahrezaei & Swain · Two-stage gene expression (2008)', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2582303/']],
      boundary: 'Synthetic deterministic mean model。t=10 min 关闭 transcription；本图不展示 stochastic bursting，也不复现论文的完整 protein distribution。'
    },
    population: {
      name: 'Drift & selection', title: '同样的 selection，为什么得到不同的 allele trajectories？',
      intro: '先按 allele-copy fitness 加权，再有限次抽样下一代。对照 deterministic selection curve 与三条 seeded Wright–Fisher trajectories，观察 population size 怎样影响随机波动。',
      inputs: [{ key: 'copies', label: 'Gene copies M (每一代)', min: 20, max: 400, step: 20, initial: 40 }, { key: 'initial', label: '初始 A frequency p₀', min: .1, max: .9, step: .05, initial: .5 }, { key: 'selection', label: 'A selection coefficient s', min: -.2, max: .2, step: .02, initial: .08 }, { key: 'generation', label: '观察 generation g', min: 0, max: 30, step: 1, initial: 10 }, { key: 'seed', label: 'Random seed', min: 1, max: 20, step: 1, initial: 7 }],
      steps: [
        ['Define the sampling unit', 'M 是 gene copies 的个数，非 cells、reads 或 patients。固定 M、离散不重叠 generations、随机抽样；无 mutation、migration 和 linkage。'],
        ['Apply selection', '给 A-copy fitness=1+s，a-copy fitness=1。抽样前 q=p(1+s)/(1+sp)。这是简化的 allele-copy selection；未显式建模 diploid genotype 与 dominance。'],
        ['Sample a finite generation', 'K~Binomial(M,q)，下一代 p′=K/M。E[p′|q]=q，Var(p′|q)=q(1−q)/M。相同 q 在小 M 时通常有更大的抽样波动。'],
        ['Compare repeat realizations', '三条实线使用不同固定 seeds；虚线只做 selection，不抽样。某次 A 下降不证明 s<0。无 mutation 时 p=0 和 p=1 是 absorbing states；三条重复不足以估计真实 fixation probability。']
      ],
      settings: [['什么时候用', '建立 drift、selection、fixation 与 finite population 的直觉，学习为什么单一时间轨迹不足以证明选择。'], ['怎么设置', '先设 s=0 比较不同 M，再固定 M 比较 s；修改 seed 得到另一组可复现抽样。此 toy M 不自动等于真实 census size 或 effective population size。'], ['边界与排错', '未包含测序误差、sampling individuals、structured populations、mutation 与 linkage。真实 allele frequency data 要把观察噪声与 evolutionary process 分开建模。']],
      question: '一条 A-frequency trajectory 在下一代下降，就能断定 s<0 吗？', answers: ['能，frequency 的方向就是 selection 的方向', '不能，有限群体的 drift 可以抵消这一代的 selection', '能，只要数据没有缺失'], correct: 1,
      feedback: '即使 s>0，Binomial sampling 仍可能抽出更少 A copies。判断 selection 需要适当的 population model、更多时间点/重复及 observation uncertainty，不能只看一段曲线的斜率。',
      source: [['Tataru et al. · Statistical inference in the Wright–Fisher model', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5837693/']],
      boundary: 'Synthetic seeded Wright–Fisher gene-copy model。三条路径展示随机性，非人群数据、选择证据或可靠的 fixation-probability estimate。'
    }
  };
  let active = 'enzyme', step = 0, playback = null;
  const reducedMotion = () => Boolean(root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches);
  function stopPlayback() {
    if (playback !== null) root.clearInterval(playback);
    playback = null;
    const button = host.querySelector('[data-mw-play]');
    if (button) { button.textContent = active === 'expression' ? '播放时间变化' : '播放 generation 变化'; button.setAttribute('aria-pressed', 'false'); }
    const readout = host.querySelector('.mw-readout'); if (readout) readout.setAttribute('aria-live', 'polite');
  }
  const states = Object.fromEntries(Object.entries(topics).map(([id, topic]) => [id, { ...Object.fromEntries(topic.inputs.map(p => [p.key, p.initial])), ...(topic.select ? { [topic.select.key]: topic.select.initial } : {}) }]));
  const selectedAnswers = {};
  const submitted = {};
  function plot({ title, xLabel, yLabel, xmax, ymax, series, markerX, markerValues, yTicks = [0,.5,1] }) {
    const width = 640, height = 300, l = 66, r = 22, top = 33, bottom = 55;
    const X = x => l + x / xmax * (width-l-r), Y = y => height-bottom-y/ymax*(height-top-bottom);
    return `<div class="mw-plot-scroll" tabindex="0" role="region" aria-label="${title}；可横向滚动"><svg class="mw-plot" viewBox="0 0 ${width} ${height}" role="img" aria-label="${title}。当前 ${xLabel}=${fmt(markerX)}；${series.map((s,i)=>`${s.name}=${fmt(markerValues[i])}`).join('；')}"><text x="${l}" y="20" class="mw-plot-title">${title}</text>${yTicks.map(t=>`<path d="M${l} ${Y(t*ymax)}H${width-r}" class="mw-grid"/><text x="${l-10}" y="${Y(t*ymax)+4}" text-anchor="end">${fmt(t*ymax,t*ymax<1?2:0)}</text>`).join('')}<path d="M${l} ${top}V${height-bottom}H${width-r}" class="mw-axis"/>${[0,.25,.5,.75,1].map(t=>`<text x="${X(t*xmax)}" y="${height-bottom+22}" text-anchor="middle">${fmt(t*xmax,t*xmax%1?1:0)}</text>`).join('')}<text x="${(l+width-r)/2}" y="${height-9}" text-anchor="middle">${xLabel}</text><text transform="translate(17 ${(top+height-bottom)/2}) rotate(-90)" text-anchor="middle">${yLabel}</text>${series.map((s,i)=>`<path d="${s.values.map((v,j)=>`${j?'L':'M'}${X(j*xmax/(s.values.length-1)).toFixed(2)},${Y(v).toFixed(2)}`).join(' ')}" fill="none" stroke="${palette[i]}" stroke-width="${s.dash?2:2.7}" ${s.dash?'stroke-dasharray="6 5"':''}/>`).join('')}<path d="M${X(markerX)} ${top}V${height-bottom}" stroke="#677e99" stroke-dasharray="3 5"/>${markerValues.map((v,i)=>`<circle cx="${X(markerX)}" cy="${Y(v)}" r="4.5" fill="${palette[i]}" stroke="white" stroke-width="1.5"/>`).join('')}</svg></div><div class="mw-legend">${series.map((s,i)=>`<span><i style="background:${palette[i]}" class="${s.dash?'mw-dashed':''}"></i>${s.name}${s.dash?' · dashed':''}</span>`).join('')}</div>`;
  }
  function process(labels) {
    return `<div class="mw-process" role="list" aria-label="当前计算流程">${labels.map((label,i)=>`<div role="listitem" class="${i===step?'is-current':''}"><span>${i+1}</span><b>${label}</b>${i<3?'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h17m-6-6 6 6-6 6"/></svg>':''}</div>`).join('')}</div>`;
  }
  function result() {
    const p = states[active], samples = Array.from({length:101},(_,i)=>i);
    if (active === 'enzyme') {
      const r = enzyme(p.substrate,p.km,p.ratio,p.mode);
      return { plots:plot({title:'Initial-rate curve',xLabel:'Substrate [S] (µM)',yLabel:'v (µM/min)',xmax:100,ymax:100,markerX:p.substrate,markerValues:[r.rate,r.baseline],series:[{name:'当前 inhibition model',values:samples.map(s=>enzyme(s,p.km,p.ratio,p.mode).rate)},{name:'No inhibitor',values:samples.map(s=>enzyme(s,p.km,0,'none').rate),dash:true}]}), readout:[['Km,app',`${fmt(r.apparentKm)} µM`],['Vmax,app',`${fmt(r.vmax)} µM/min`],['当前 v',`${fmt(r.rate)} µM/min`],['No inhibitor v',`${fmt(r.baseline)} µM/min`]], flow:['设定 [S] / Km','计算 apparent parameters','代入 v equation',`输出 ${fmt(r.rate)} µM/min`], equation:`v = ${fmt(r.vmax)} × ${fmt(p.substrate)} / (${fmt(r.apparentKm)} + ${fmt(p.substrate)}) = ${fmt(r.rate)} µM/min` };
    }
    if (active === 'receptor') {
      const r = receptor(p.ligand,p.ec50,p.hill);
      return { plots:plot({title:'Binding 与 response 是不同的读数',xLabel:'Free ligand [L] (nM)',yLabel:'Fraction (0–1)',xmax:100,ymax:1,markerX:p.ligand,markerValues:[r.occupancy,r.response],series:[{name:'Receptor occupancy θ',values:samples.map(l=>receptor(l,p.ec50,p.hill).occupancy)},{name:'Functional response R',values:samples.map(l=>receptor(l,p.ec50,p.hill).response)}]}),readout:[['Kd (固定)', '20 nM'],['EC50',`${p.ec50} nM`],['Bound fraction θ',fmt(r.occupancy,3)],['Response fraction R',fmt(r.response,3)]],flow:['Free ligand 浓度','Receptor binding θ','独立的 response model','比较两种测量'],equation:`θ=${p.ligand}/(20+${p.ligand})=${fmt(r.occupancy,3)}；R=${p.ligand}^${p.hill}/(${p.ec50}^${p.hill}+${p.ligand}^${p.hill})=${fmt(r.response,3)}` };
    }
    if (active === 'expression') {
      const current=expression(p.time,p.alpha,p.rnaHalf,p.proteinHalf), curve=Array.from({length:161},(_,i)=>expression(i/4,p.alpha,p.rnaHalf,p.proteinHalf));
      return {plots:['rna','protein'].map((key,i)=>plot({title:i?'Protein：production 与 loss 竞争':'mRNA：10 min 后停止新的 production',xLabel:'Time (min)',yLabel:i?'Mean Protein molecules':'Mean mRNA molecules',xmax:40,ymax:Math.max(1,...curve.map(x=>x[key]))*1.12,markerX:p.time,markerValues:[current[key]],series:[{name:i?'Protein':'mRNA',values:curve.map(x=>x[key])}]})).join(''),readout:[['mRNA',fmt(current.rna)],['Protein',fmt(current.protein)],['Translation βm',`${fmt(current.translation)} /min`],['Protein loss γp·p',`${fmt(current.proteinLoss)} /min`],['dm/dt',`${fmt(current.transcription-current.rnaLoss)} /min`],['dp/dt',`${fmt(current.translation-current.proteinLoss)} /min`]],flow:[`Transcription ${current.transcription}/min`,`mRNA ${fmt(current.rna)}`,`Translation ${fmt(current.translation)}/min`,`Protein ${fmt(current.protein)}`],equation:`γm=${fmt(current.gm,3)} /min；γp=${fmt(current.gp,3)} /min；dp/dt=${fmt(current.translation)}−${fmt(current.proteinLoss)}=${fmt(current.translation-current.proteinLoss)} /min`};
    }
    const paths=[0,1,2].map(i=>population(p.copies,p.initial,p.selection,p.seed+1009*i)), expected=selectionPath(p.initial,p.selection), q=paths[0][p.generation]*(1+p.selection)/(1+p.selection*paths[0][p.generation]);
    return {plots:plot({title:'同一模型的三次有限抽样',xLabel:'Generation',yLabel:'A frequency p',xmax:30,ymax:1,markerX:p.generation,markerValues:[...paths.map(a=>a[p.generation]),expected[p.generation]],series:[...paths.map((values,i)=>({name:`Seed ${p.seed+1009*i}`,values})),{name:'Selection only',values:expected,dash:true}]}),readout:[[`第一条路径 p (seed ${p.seed})`,fmt(paths[0][p.generation],3)],['A copies',`${Math.round(paths[0][p.generation]*p.copies)} / ${p.copies}`],['下一代抽样前 q',fmt(q,3)],['Var(p′ | q)',fmt(q*(1-q)/p.copies,5)]],flow:[`当前 p=${fmt(paths[0][p.generation],3)}`,`Selection q=${fmt(q,3)}`,`Binomial(M=${p.copies}, q)`,'p′=K/M'],equation:`q=p(1+s)/(1+sp)=${fmt(q,3)}；E[p′|q]=q；Var(p′|q)=${fmt(q*(1-q)/p.copies,5)}`};
  }
  function controls(topic) {
    return `<div class="mw-controls">${topic.select?`<label for="mw-${topic.select.key}">${topic.select.label}<select id="mw-${topic.select.key}" data-mw-param="${topic.select.key}">${topic.select.options.map(([v,l])=>`<option value="${v}" ${states[active][topic.select.key]===v?'selected':''}>${l}</option>`).join('')}</select></label>`:''}${topic.inputs.map(p=>`<div><label for="mw-${p.key}">${p.label} <output id="mw-output-${p.key}" for="mw-${p.key}">${states[active][p.key]}</output></label><input id="mw-${p.key}" data-mw-param="${p.key}" type="range" min="${p.min}" max="${p.max}" step="${p.step}" value="${states[active][p.key]}"></div>`).join('')}</div>`;
  }
  function updateResults() {
    const r=result(), topic=topics[active];
    host.querySelector('.mw-visuals').innerHTML=r.plots;
    host.querySelector('.mw-process-wrap').innerHTML=process(r.flow);
    host.querySelector('.mw-readout').innerHTML=r.readout.map(([label,value])=>`<div><dt>${label}</dt><dd>${value}</dd></div>`).join('');
    host.querySelector('.mw-equation').textContent=r.equation;
    const stepText = host.querySelector('.mw-step-text');
    const stepKey = `${active}:${step}`;
    if (stepText.dataset.stepKey !== stepKey) {
      stepText.innerHTML = `<h4>${step+1}. ${topic.steps[step][0]}</h4><p>${topic.steps[step][1]}</p>`;
      stepText.dataset.stepKey = stepKey;
    }
    host.querySelectorAll('[data-mw-step]').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===step)));
    host.querySelectorAll('[data-mw-param]').forEach(input=>{const out=host.querySelector(`#mw-output-${input.dataset.mwParam}`);if(out)out.textContent=String(states[active][input.dataset.mwParam]);});
  }
  function render() {
    const topic=topics[active];
    host.innerHTML=`<div class="lesson-head"><h2 id="mechanism-title">把一个生物过程，拆成可计算的步骤。</h2><p>选择一个机制，先预测参数的作用，再调节、观察图形与中间数值。四个模型均为 synthetic examples；每个结论都带有适用条件。</p></div><div class="mw-topics" role="group" aria-label="选择生物机制">${Object.entries(topics).map(([id,t])=>`<button type="button" data-mw-topic="${id}" aria-pressed="${id===active}">${t.name}</button>`).join('')}</div><div class="mw-question"><h3>${topic.title}</h3><p>${topic.intro}</p></div><fieldset class="mw-check"><legend>预测与解释：${topic.question}</legend>${topic.answers.map((answer,i)=>`<label><input type="radio" name="mw-answer-${active}" value="${i}" ${selectedAnswers[active]===i?'checked':''}>${answer}</label>`).join('')}<button type="button" data-mw-check ${selectedAnswers[active]===undefined?'disabled':''}>检查我的判断</button><p class="mw-feedback" role="status">${submitted[active]?`${selectedAnswers[active]===topic.correct?'判断正确。':'重新检查本模型的假设。'}${topic.feedback}`:''}</p></fieldset>${controls(topic)}<div class="mw-visuals"></div><div class="mw-process-wrap"></div><p class="mw-equation"></p><dl class="mw-readout" aria-live="polite"></dl><div class="mw-stage-controls" role="group" aria-label="逐步理解 ${topic.name}">${topic.steps.map(([title],i)=>`<button type="button" data-mw-step="${i}" aria-pressed="${i===step}">${i+1}. ${title}</button>`).join('')}</div><div class="mw-step-text" aria-live="polite"></div><div class="mw-actions"><button type="button" data-mw-reset>恢复本模型初始设置</button>${active==='population'?'<button type="button" data-mw-seed>换一次随机实现</button>':''}${['expression','population'].includes(active)?`<button type="button" data-mw-play aria-pressed="false" ${reducedMotion()?'disabled title="系统已启用 reduced motion，请手动调节观察时间"':''}>${active==='expression'?'播放时间变化':'播放 generation 变化'}</button>`:''}</div><p class="mw-boundary">${topic.boundary}</p><details class="mw-detail"><summary>什么时候用、怎么设置、如何排错？</summary>${topic.settings.map(([title,body])=>`<h4>${title}</h4><p>${body}</p>`).join('')}</details><p class="mw-sources">方法依据：${topic.source.map(([title,url])=>`<a href="${url}" target="_blank" rel="noopener noreferrer">${title}</a>`).join(' · ')}。图与数字为本站原创教学模型。</p><a class="mw-cross" href="https://haoyunli.github.io/deep-learning-atlas/#/practice?research=spatial">把这些机制放回算法与研究选型：Deep Learning Atlas</a>`;
    updateResults();
  }
  host.addEventListener('input', event=>{
    const key=event.target.dataset.mwParam;
    if(!key)return;
    stopPlayback();
    states[active][key]=event.target.type==='range'?Number(event.target.value):event.target.value;
    updateResults();
  });
  host.addEventListener('change', event=>{
    if(event.target.name===`mw-answer-${active}`){selectedAnswers[active]=Number(event.target.value);submitted[active]=false;host.querySelector('[data-mw-check]').disabled=false;host.querySelector('.mw-feedback').textContent='';}
  });
  host.addEventListener('click', event=>{
    const button=event.target.closest('button');if(!button)return;
    if (button.hasAttribute('data-mw-play')) {
      if (playback !== null) { stopPlayback(); return; }
      if (reducedMotion()) return;
      const key = active === 'expression' ? 'time' : 'generation', max = active === 'expression' ? 40 : 30;
      states[active][key] = 0;
      host.querySelector(`#mw-${key}`).value = 0;
      updateResults();
      button.textContent = '暂停时间推进'; button.setAttribute('aria-pressed', 'true');
      host.querySelector('.mw-readout').setAttribute('aria-live', 'off');
      playback = root.setInterval(() => {
        if (root.document.hidden || reducedMotion()) { stopPlayback(); return; }
        states[active][key] = Math.min(max, states[active][key] + 1);
        host.querySelector(`#mw-${key}`).value = states[active][key];
        updateResults();
        if (states[active][key] >= max) stopPlayback();
      }, 600);
      return;
    }
    stopPlayback();
    if(button.dataset.mwTopic){active=button.dataset.mwTopic;step=0;render();host.querySelector(`[data-mw-topic="${active}"]`).focus();}
    else if(button.dataset.mwStep!==undefined){step=Number(button.dataset.mwStep);updateResults();}
    else if(button.hasAttribute('data-mw-reset')){const t=topics[active];states[active]={...Object.fromEntries(t.inputs.map(p=>[p.key,p.initial])),...(t.select?{[t.select.key]:t.select.initial}:{})};step=0;render();host.querySelector('[data-mw-reset]').focus();}
    else if(button.hasAttribute('data-mw-seed')){states[active].seed=states[active].seed%20+1;host.querySelector('#mw-seed').value=states[active].seed;updateResults();}
    else if(button.hasAttribute('data-mw-check')){submitted[active]=true;host.querySelector('.mw-feedback').textContent=`${selectedAnswers[active]===topics[active].correct?'判断正确。':'重新检查本模型的假设。'}${topics[active].feedback}`;}
  });
  root.document.addEventListener('visibilitychange', () => { if (root.document.hidden) stopPlayback(); });
  render();
})(typeof globalThis !== 'undefined' ? globalThis : this);
