(() => {
  'use strict';
  const M = window.BIOCS_REGULATION_MATH;
  const host = document.querySelector('#regulation-lab');
  const esc = x => String(x).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const f = x => x === 0 ? '0' : Math.abs(x) < .001 || Math.abs(x) >= 1e6 ? x.toExponential(3) : Number(x.toFixed(4)).toString();
  const range = (id, label, min, max, step, value, hint) => ({ id, label, min, max, step, value, hint, type:'range' });
  const select = (id, label, options, value, hint) => ({ id, label, options, value, hint, type:'select' });
  const bars = (labels, values, unit, maximum) => ({ kind:'bars', labels, values, unit, maximum });
  const line = (points, xLabel, yLabel, reference, highlight) => ({ kind:'line', points, xLabel, yLabel, reference, highlight });
  const matrix = (rows, columns, values, unit) => ({ kind:'matrix', rows, columns, values, unit });
  const stage = (title, description, formula, chart) => ({ title, description, formula, chart });
  const sources = {
    model:['NC3Rs · Experimental model','https://nc3rs.org.uk/3rs-resources/driver-recommendations/experimental-model'],
    unit:['NC3Rs · Experimental unit','https://eda.nc3rs.org.uk/experimental-design-unit'],
    mosaic:['NHGRI · Mosaicism','https://www.genome.gov/genetics-glossary/Mosaicism'],
    variant:['MedlinePlus Genetics · Variant origins','https://medlineplus.gov/genetics/understanding/mutationsanddisorders/genemutation/'],
    motif:['MEME Suite · FIMO scoring and background','https://meme-suite.org/meme/doc/fimo.html'],
    abc:['Fulco et al. · Activity-by-Contact','https://pmc.ncbi.nlm.nih.gov/articles/PMC6886585/'],
    binding:['Hulme & Trevethick · Equilibrium ligand binding','https://pmc.ncbi.nlm.nih.gov/articles/PMC3000649/'],
    cpdb:['CellPhoneDB · Methods and specificity null','https://cellphonedb.readthedocs.io/en/stable/RESULTS-DOCUMENTATION.html']
  };
  const platforms = {
    vivo:['In vivo','在完整 living organism 内研究；可保留多器官、circulation 与 immune context，但结果仍依赖 species、年龄、处理与设计。','适合必须包含系统性相互作用的问题；不能仅凭“更接近整体”就推定更适合当前机制或人类。'],
    vitro:['In vitro','在 organism 外的定义系统中研究，可为 cell-free assay、cell culture、co-culture 或 organoid；系统复杂度不由这个词单独决定。','便于控制条件与拆分机制，但要核对 cell identity、passage、matrix、media 与缺失的 interactions。'],
    exvivo:['Ex vivo','取出 tissue/organ 后研究，常保留部分原有 architecture；在研究用语中可与 in vitro 重叠，应描述实际材料和维持状态。','适合需要 tissue context 又需直接观察/扰动的问题；离体环境、存活时间与组织来源限制外推。'],
    silico:['In silico','在计算模型内推演。它可整合数据与明确假设，但没有自动新增 biological replication。','适合检查可识别性、比较假设或生成候选；需要独立数据或实验检验模型没有直接测到的连接。']
  };
  const origins = {
    inherited:['Inherited constitutional','上一代已有 allele，经 gamete 传入本模型 zygote；后代的 somatic 与 germ-cell progenitor compartments 都携带。'],
    'de-novo':['De novo constitutional','本模型在形成 zygote 时已有新 allele；三类 compartment 与 inherited 情形有相同 expected VAF，来源证据不同。'],
    early:['Early postzygotic mosaic','一个早期 clone 的后代进入三类 compartment；本例为简单算术，特设各 compartment 的贡献比例相同。'],
    somatic:['Blood-lineage somatic','本模型把 variant 限在 blood lineage 的一个 clone；skin 与 germ-cell progenitors 不含此 allele。'],
    'germ-only':['Germ-cell-lineage mosaic','本模型仅一部分 diploid germ-cell progenitors 携带；blood 阴性不能排除这类未采样的 lineage。']
  };
  const config = {
    models:{name:'Model systems',title:'多测同一个 donor 的 wells，能替代增加 donors 吗？',
      input:'估计跨 donor 的 population mean。Synthetic model：yᵢⱼ=μ+bᵢ+εᵢⱼ，independent donor effects Var(b)=4，within-donor noise Var(ε)=9；每个 donor 有相同 m 个 measurements。',
      controls:[select('platform','Experimental context',Object.entries(platforms).map(([k,v])=>[k,v[0]]),'vitro','选择改变 context 说明，不改变或虚构平台性能。'),range('n','Independent donor clusters n',2,12,1,4,'这里的 inference target 是跨 donor mean。'),range('m','Measurements per donor m',1,20,1,3,'同一 donor 的 measurements 共享 bᵢ；更多 wells 主要减少 within-donor noise。')],
      titles:['定义 cluster 与观测','拆开 variance 来源','比较两种 standard error','看增加 measurements 的极限'],
      calculate:s=>{const r=M.models(s.n,s.m);return {stages:[
        stage('定义 cluster 与观测','同色行表示同一个 donor。Treatment assignment 的单位仍由实际 randomization 决定；这里计算的是 grand mean 的 sampling uncertainty。',`n=${r.n}; m=${r.m}; rows=n×m=${r.total}`,{kind:'donors',n:r.n,m:r.m}),
        stage('拆开 variance 来源','Between-donor variation 只能通过增加独立 donor clusters 降低；重复 measurements 可平均掉部分 within-donor noise。',`Var(mean)=4/${r.n}+9/(${r.n}×${r.m})=${f(r.between)}+${f(r.within)}`,bars(['Between-donor part','Within-donor part'],[r.between,r.within],'variance units²')),
        stage('比较两种 standard error','若把所有 nm rows 当互相独立，会把 shared donor effect 也错误平均掉。m=1 时两种计算相同。',`SE=${f(r.se)}; naive SE=√[13/(nm)]=${f(r.naiveSE)}`,bars(['Cluster-aware SE','Naive independent-row SE'],[r.se,r.naiveSE],'outcome units')),
        stage('看增加 measurements 的极限','曲线固定当前 n，只改变 m。橙色虚线是 m→∞ 的 SE 下限；这里不包含测量 bias 或 donor selection bias。',`SE(m)=√(4/n+9/(nm)); limit=√(4/n)=${f(r.limitSE)}`,line(r.curve,'measurements per donor m','SE · outcome units',r.limitSE,[r.m,r.se]))
      ],summary:`当前 ${r.total} rows 来自 ${r.n} donors；SE=${f(r.se)}，把 rows 当独立会得到 ${f(r.naiveSE)}。ICC=4/13=${f(r.icc)}；同方差模型的 effective N=${f(r.effectiveN)}，不等于实际 donor 数。`};},
      use:['先明确要保留的过程：isolated binding、cell-intrinsic response、cell–cell interaction，还是 systemic physiology，再选择 model system。','本例适合理解 hierarchical sampling；well/cell 可能是 treatment assignment unit，donor 又可能是 population inference unit，两者需分别记录。'],
      tuning:['先从 pilot 或既有数据估计 between/within variation；这里的 4 与 9 是已声明的教学常数，不是实验通用参数。','预算增加时，比较新增 donors 与新增 within-donor measurements 的贡献；同时考虑 batch balance、randomization 与 blinding。'],
      debug:[['显著性随着加 wells 急剧变强','检查是否忽略 donor/culture batch 的 shared variation。','按设计使用 paired/grouped 或 multilevel analysis；不能只改图上 n。'],['换 model system 后结果不同','检查 species、cell state、architecture、treatment exposure 和 readout。','分别列出被保留/缺失的过程，用 matched context 或独立模型验证。']],
      boundary:'这是 balanced random-intercept 模型的解析 SE，不做 power calculation，不把某一种平台排成普遍最优。',
      question:'固定 n，只无限增加同 donor 的 m，SE 会降到 0 吗？',options:['不会；本模型仍保留 between-donor variance 4/n','会；总 rows 无限多就没有 uncertainty','只有 in vivo 会降到 0'],answer:0,feedback:'SE 下限为 √(4/n)。平台名称不能替代 variance structure、randomization 或 independent-unit 定义。',chapters:['rb01','rb02'],ai:'hierarchical-partial-pooling',sources:['model','unit']},
    lineage:{name:'Somatic / Germline',title:'相同的 VAF，能告诉你 variant 是 inherited 还是 de novo 吗？',
      input:'三类 hypothetical compartments：blood、skin 和 pre-meiotic diploid germ-cell progenitors。这里明确只数 meiosis 前的 diploid cells，不是成熟 haploid gametes。每个携带者是 diploid heterozygote，ALT copy=1、total copies=2；没有 CNV、LOH、read bias 或测序抽样。',
      controls:[select('origin','Known origin in the simulation',Object.entries(origins).map(([k,v])=>[k,v[0]]),'early','这是指定的生成机制，不是从 VAF 诊断的结果。'),select('tissue','Sampled compartment',[['blood','Blood'],['skin','Skin'],['germ','Diploid germ-cell progenitors']],'blood','成熟 gametes 是 haploid；本例没有把它们混入 diploid VAF 公式。'),range('fraction','Mosaic clone fraction f',0,1,.05,.5,'仅 mosaic 三种情形使用；constitutional 情形中所有 cells 携带。')],
      titles:['把 origin 放到 lineage','查看 compartment 分布','先数 DNA copies','再得到 expected VAF'],
      calculate:s=>{const r=M.lineage(s.origin,s.tissue,s.fraction);return {stages:[
        stage('把 origin 放到 lineage',origins[s.origin][1],'Origin / inheritance history 与 sampled lineage 是不同维度。',{kind:'lineage',origin:s.origin,fractions:r.fractions}),
        stage('查看 compartment 分布','这是模型已知的 carrier fraction。真实 tissues 可能有不同 clone fractions，不能从 blood 自动复制到其他 compartments。',`carrier fractions=[${r.fractions.map(v=>f(v)).join(', ')}]`,bars(['Blood carrier fraction','Skin carrier fraction','Germ progenitor carrier fraction'],r.fractions,'cell fraction',1)),
        stage('先数 DNA copies','为简便用100个等权 cell-equivalents计数；这是期望量，不是实际 sequencing read count。',`ALT=100×${f(r.selectedFraction)}=${f(r.altCopies)}; total=100×2=200`,bars(['ALT copies','Reference copies'],[r.altCopies,200-r.altCopies],'expected DNA copies')),
        stage('再得到 expected VAF','同一个 expected VAF 可由不同 origins 产生。Germ-cell progenitor carrier fraction 也不能在此直接换成实际 offspring risk。',`VAF=ALT/total=f/2; selected=${f(r.expectedVAF)}`,bars(['Blood expected VAF','Skin expected VAF','Germ progenitor expected VAF'],r.vafs,'allele fraction',.5))
      ],summary:`选中 ${s.tissue}：carrier fraction=${f(r.selectedFraction)}，expected VAF=${f(r.expectedVAF)}。Inherited constitutional 与 de novo constitutional 的三类 VAF 都为0.5；需要来源与家系证据区分。`};},
      use:['先区分 somatic/germ-cell lineage 与 inherited/de novo history；early postzygotic mosaic 可以涉及 somatic 和 germ-cell lineages。','真实变异分析把 sampled tissue、read depth、calling sensitivity 与 matched-normal 来源写在同一证据表。'],
      tuning:['把 fraction 从0到1改变，观察在声明的 diploid heterozygous 条件下 VAF=f/2；一旦有 CNV、LOH 或 mixture，就换完整 copy-count model。','换 sampled compartment 检查“未检出”是否只是未采到相关 lineage；实际检测还需 coverage、error model 与 detection limit。'],
      debug:[['看到 VAF≈0.5 就写 germline','核对 purity、copy number、clone structure 与 matched-normal evidence。','将 VAF 保留为 read/allele-level observation；不要单凭数值分类来源。'],['Blood negative 就排除 germline mosaicism','检查是否只测了 blood，且检测灵敏度是否足够。','报告 sampled-tissue 与 detection bounds，必要时寻求合适的额外证据。']],
      boundary:'粗粒度 lineage bookkeeping；不是 developmental lineage tracing，不估计疾病风险、临床致病性或遗传咨询结果。',
      question:'Inherited constitutional 与 de novo constitutional 都给 VAF=.5，这说明什么？',options:['VAF 单独不能识别 inherited/de novo history','De novo variant 必须只存在于 somatic cells','所有 VAF=.5 的 variants 都必然可遗传'],answer:0,feedback:'观测相同不等于来源相同。Lineage、发生时间、家系与采样信息必须一起解释。',chapters:['rb03','x14','x17'],ai:'variant-mixture-inference',sources:['mosaic','variant']},
    motif:{name:'TF motif',title:'同一段 DNA，为什么换 background 后 motif score 会改变？',
      input:'四位置 PFM，每行总数10：[[8,1,1,0],[0,2,7,1],[1,1,1,7],[3,3,2,2]]，列为 A/C/G/T。扫描单个4-base window，不模拟 genome-wide search。',
      controls:[select('sequence','Sequence window',[['AGTA','AGTA'],['CGTA','CGTA · first-base substitution']],'AGTA','只比较这两个相同长度的 windows。'),range('alpha','Total pseudocount mass α',.5,5,.5,1,'按 background 分配 αq_b；α 是每位置总质量，不是每个 base 加 α。'),range('gc','Background GC fraction',.2,.8,.05,.5,'qC=qG=GC/2；qA=qT=(1−GC)/2。')],
      titles:['从 PFM 读 counts','加 prior 并归一化','逐位置计算 log-odds','合并一个 window 的证据'],
      calculate:s=>{const r=M.motif(s.alpha,s.gc,s.sequence);return {stages:[
        stage('从 PFM 读 counts','行是 motif position，列是 base；高 count 描述训练位点里的偏好，不直接表示当前 tissue 的 TF binding。','每行 N=10；bases=A,C,G,T',matrix(['Position 1','Position 2','Position 3','Position 4'],r.bases,r.counts,'counts')),
        stage('加 prior 并归一化','在本例中 pseudocount prior 使用同一个 background；每行 probability 总和为1。',`Pᵢ(b)=(countᵢb+${s.alpha}×q_b)/(10+${s.alpha}); q=[${r.background.map(v=>f(v)).join(', ')}]`,matrix(['Position 1','Position 2','Position 3','Position 4'],r.bases,r.probabilities,'probability')),
        stage('逐位置计算 log-odds','比值大于1提供正 evidence；该 base 在 background 也常见时，同样 motif probability 的贡献较小。',`sᵢ=log₂[Pᵢ(baseᵢ)/q(baseᵢ)]`,bars([...s.sequence].map((b,i)=>`Position ${i+1} · ${b}`),r.contributions,'bits')),
        stage('合并一个 window 的证据','位置独立的模型把 likelihood ratios 相乘，所以 log-odds 可以相加。这个 score 不是 calibrated binding probability。',`Score=Σsᵢ=${f(r.score)} bits; P(window|motif)=${f(r.motifLikelihood)}; P(window|background)=${f(r.backgroundLikelihood)}`,line([[0,0],...r.contributions.map((_,i)=>[i+1,r.contributions.slice(0,i+1).reduce((a,b)=>a+b,0)])],'positions included','cumulative log-odds · bits'))
      ],summary:`${s.sequence} 的 score=${f(r.score)} bits。它回答 sequence compatibility；TF expression、chromatin access、occupancy 和 downstream activity 仍是不同证据。`};},
      use:['需要从 DNA sequence 生成候选 motif occurrences，或理解 noncoding variant 对 sequence compatibility 的影响时使用。','TF family 可共享相近 motif；motif hit 不能单独指定实际 binding 的家族成员。'],
      tuning:['记录 motif database/version、genome build、strand 与 matched background；明确 pseudocount 的定义。','Genome-wide scanning 要定义 testing family、p/q-value threshold 和重复序列处理；本例只有一个 window，不产生 genome-wide FDR。'],
      debug:[['GC-rich 区域全部高分','检查 background 是否与待扫描 sequences 的组成不匹配。','先核 input/background，再比较 score calibration；不要只提高 threshold。'],['Motif hit 多，但 TF RNA 低或 assay 无 binding','检查 TF family、protein/localization、chromatin 与 motif model。','用 occupancy/activity 等独立 assay 验证；不要把 score 当 binding。']],
      boundary:'手写 PFM→PWM score，非完整 FIMO：未进行 strand scanning、动态规划 p-value 或 multiple-testing correction。',
      question:'同一 motif hit 与 ATAC peak 重叠，足以证明具体 TF 正在结合吗？',options:['不足，还需区分 family、protein state 与 occupancy evidence','足够，ATAC 直接测了 TF identity','足够，高 PWM score 就是 binding probability'],answer:0,feedback:'Motif 表示 sequence compatibility，ATAC 表示可及性相关测量；它们都不直接给出具体 TF 的实际 occupancy。',chapters:['rb04','x06'],ai:'motif-pwm-scoring',sources:['motif']},
    enhancer:{name:'Enhancer → Gene',title:'加进一个候选 enhancer，旧 enhancer 的 score 为什么下降？',
      input:'对同一个 gene G，候选 E1/E2/E3 的 activity=[A1,1,4]，contact=[.4,.5,.1]。这些是已归一化的 synthetic inputs；只演示 ABC 的乘积和竞争分母。',
      controls:[range('activity','E1 activity A1',0,5,.25,2,'改变 E1 的 activity proxy，contact 固定为.4。'),select('third','Candidate set',[['yes','E1 + E2 + E3'],['no','E1 + E2 only']],'yes','候选集合是分母的一部分；删除候选不是改变已观测的 E1 activity。')],
      titles:['确认 activity 与 context','加入 gene-specific contact','计算 competing weights','归一化到候选集合'],
      calculate:s=>{const r=M.enhancer(s.activity,s.third==='yes');return {stages:[
        stage('确认 activity 与 context','Activity 是同一 context 下的 proxy，不是已测得该 enhancer 对 G 的 causal effect。','A=[A1,1,4]；显示当前纳入的 candidates',bars(r.labels,r.activities,'activity proxy · arbitrary units')),
        stage('加入 gene-specific contact','Contact 表示当前 gene–element pair 的 proximity evidence；接触不自动证明调控。','C=[.4,.5,.1]；不要把不同 assays 的 raw counts 直接当可比 C',bars(r.labels,r.contacts,'contact proxy · arbitrary units')),
        stage('计算 competing weights','把 activity 与 contact 相乘，得到每个候选的未归一化 contribution。',`w=A×C=[${r.weights.map(v=>f(v)).join(', ')}]; Σw=${f(r.denominator)}`,bars(r.labels,r.weights,'activity × contact units')),
        stage('归一化到候选集合','同一个 gene 的候选共同进入分母。新增 E3 会改变 E1 score，即使 E1 的 activity/contact 没变。',`ABCᵢ=wᵢ/Σw; E1=${f(r.scores[0])}; E1 with only E1/E2=${f(r.twoCandidateScore)}`,bars(r.labels,r.scores,'normalized score',1))
      ],summary:`E1 score=${f(r.scores[0])}；同一 E1 在仅 E1/E2 的候选集内为 ${f(r.twoCandidateScore)}。Score 总和为1是归一化性质，不表示已得到 causal probabilities。`};},
      use:['需要把 candidate regulatory elements 与 potential target genes 连接时，可把 ABC 与 distance、co-accessibility、QTL、contact 和 perturbation evidence 比较。','适用于 activity/contact proxies 与当前 cell context 可对应的情形；缺失 assay 或 context mismatch 要单独标记。'],
      tuning:['记录 candidate intervals、promoter inclusion、gene window、activity normalization 与 contact 来源。','阈值应按所用实现、assay与独立验证校准；不要把当前 toy score 的某个数当通用 cutoff。'],
      debug:[['同一 E1 在两个分析里 score 差很多','检查 candidate universe、window、normalization 与 gene annotation 是否改变。','同时保存未归一化 weights 和分母，再比较 score。'],['高 score 候选没有 perturbation effect','检查 cell context、redundancy、perturbation efficacy 与 readout timing。','区分预测失败、未有效扰动与调控冗余；不要只删掉不符合预期的候选。']],
      boundary:'只演示 ABC 核心 normalization；没有构建 chromatin tracks、Hi-C contact 或完整 implementation 的候选窗口。',
      question:'E1 的 A、C 不变，加入正 weight 的 E3 后，E1 score 会怎样？',options:['下降，因为分母增加；不代表 E1 变弱了','不变，score 只看 E1','上升，因为总证据更多'],answer:0,feedback:'分母从 w1+w2 变为 w1+w2+w3。Relative score 可以下降，而 E1 的原始 weight 完全不变。',chapters:['rb05','s06'],ai:'enhancer-gene-abc',sources:['abc']},
    complex:{name:'Receptor complex',title:'Ligand 足够多，但缺少一个 subunit，会发生什么？',
      input:'假设一个完整 receptor complex 需要2份R1和1份R2；R1固定60份，R2可调。先求 assembly capacity 上界，再假设每个完整 complex 只有一个独立 ligand site，Kd=5 nM。',
      controls:[range('r2','R2 subunit copies',0,60,2,20,'2:1 是本例声明的假想 stoichiometry，不代表所有 receptors。'),range('ligand','Free ligand concentration L · nM',0,20,1,5,'使用 free L 而非总加入量；假设 equilibrium、无 depletion、无 competition。')],
      titles:['先检查所有 subunits','找 assembly bottleneck','计算 equilibrium occupancy','区分 binding 与 response'],
      calculate:s=>{const r=M.complex(s.r2,s.ligand);return {stages:[
        stage('先检查所有 subunits','R1 很多不等于完整 receptor 多；所有必需 subunits 都要存在并正确定位。',`R1=60 copies; R2=${r.r2} copies`,bars(['R1 copies','R2 copies'],[r.r1,r.r2],'subunit copies')),
        stage('找 assembly bottleneck','只有在完全有效组装的理想假设下才能达到这个 capacity；实际 surface complexes 可以更少。',`capacity≤min(R1/2,R2)=min(30,${r.r2})=${r.capacity}`,bars(['Capacity allowed by R1','Capacity allowed by R2','Maximum complete complexes'],[30,r.r2,r.capacity],'complete-complex equivalents')),
        stage('计算 equilibrium occupancy','一位点 equilibrium 模型给 binding fraction。Kd 对应50% occupancy，不自动等于 EC50。',`θ=L/(Kd+L)=${r.ligand}/(5+${r.ligand})=${f(r.occupancy)}`,line(r.curve,'free ligand L · nM','bound fraction θ',undefined,[r.ligand,r.occupancy])),
        stage('区分 binding 与 response','这里按 capacity 上界计算 expected bound complexes；不能据此推定 receptor activation 或 downstream phenotype。',`bound=capacity×θ=${f(r.bound)}; unbound=${f(r.free)}`,bars(['Bound complexes','Unbound complete complexes'],[r.bound,r.free],'expected complex count'))
      ],summary:`Capacity 上界=${r.capacity}，occupancy=${f(r.occupancy)}，在理想组装假设下 expected bound=${f(r.bound)}。即使提高 L，也不能弥补缺失 subunit 或证明下游 activation。`};},
      use:['分清 receptor RNA、完整 surface complex、ligand binding 与 functional response，尤其是 multi-subunit receptors。','检查 LR database 的 complex definition 与测量范围，不能随意把多个 subunits 相加当作完整 receptor。'],
      tuning:['先核 stoichiometry、protein/localization evidence 和 ligand concentration units，再考虑 Kd 与 equilibrium 假设。','实际 response 需要单独的 dose/time curve、target engagement 与下游 readout；binding model 不提供生物或药物推荐剂量。'],
      debug:[['增加 ligand 后 response 仍很低','检查 required subunits、surface localization、antagonism、desensitization 与 downstream state。','分别测 binding 和 activation，不把 RNA 共表达当作完整 signaling chain。'],['拟合 Kd 后直接解释 EC50','检查 binding endpoint 与 functional endpoint 是否相同。','分开报告 affinity、occupancy 和 efficacy/amplification 的证据。']],
      boundary:'Hypothetical stoichiometric capacity + Langmuir occupancy；不是特定 receptor 的 assembly/kinetic model，也不模拟 activation。',
      question:'当 R2=0 时，继续增加 ligand，在本模型中能得到 bound complex 吗？',options:['不能；完整 complex 的 capacity 为0','能；ligand 足够多能替代 R2','能；R1=60 已经说明 receptor 足够'],answer:0,feedback:'Capacity=min(60/2,0)=0，所以 bound=capacity×occupancy=0。先有可用的完整 receptor，才谈这个 binding model。',chapters:['rb06','l01','z03'],ai:'ligand-receptor-inference',sources:['binding','cpdb']},
    lr:{name:'Ligand–Receptor inference',title:'表达和距离都合理，是否就证明发生了 cell communication？',
      input:'4个 paired donors。Control ligand=[2,3,4,5]；Treatment ligand=[4,4,6,6]；R1=4，Control R2=4，Treatment R2可调。Distances Control=[10,20,30,40]、Treatment=[10,35,60,80] μm。',
      controls:[range('r2','Treatment R2 mean expression',0,6,.25,4,'本toy用 min(R1,R2) 作 complex bottleneck；RNA units不是 surface receptor copies。'),range('length','Distance length scale λ · μm',10,100,5,40,'Gate=exp(−distance/λ)，是人为 sensitivity setting，不是测得的 diffusion length。')],
      titles:['把 expression 与 context 分开','构建声明过的 score','以 donor 为单位配对','枚举一个明确的 null'],
      calculate:s=>{const r=M.lr(s.r2,s.length);const order=[...r.permutations].sort((a,b)=>a.value-b.value);return {stages:[
        stage('把 expression 与 context 分开','每行是一个 donor；这些是预先给定的 per-cell mean expression summaries，不乘 cell abundance，也不测 protein secretion。',`Treatment bottleneck=min(4,${s.r2})=${r.limitingReceptor}`,matrix(r.labels,['Control L','Treatment L'],r.labels.map((_,i)=>[r.controlLigand[i],r.treatmentLigand[i]]),'expression · arbitrary units')),
        stage('构建声明过的 score','本例自定义 S=L×min(R1,R2)×exp(−d/λ)。它结合候选共表达与距离，但不等于 CellPhoneDB/CellChat 的完整 score。',`S=L×R_limiting×exp(−d/${s.length}); control R_limiting=4`,matrix(r.labels,['Control S','Treatment S'],r.labels.map((_,i)=>[r.controlScores[i],r.treatmentScores[i]]),'toy score units')),
        stage('以 donor 为单位配对','先在每个 donor 内做 Treatment−Control，再求4个差异的平均。增加同 donor 的 cells 不会增加这里的可交换 donor pairs。',`Δ=[${r.differences.map(v=>f(v)).join(', ')}]; mean Δ=${f(r.observed)}`,bars(r.labels,r.differences,'paired score difference')),
        stage('枚举一个明确的 null','在 donor 内交换条件相当于翻转该 pair 的差异符号；4 pairs 共2⁴=16种。横轴是排序编号，不是时间；离散点之间不插值。橙色虚线为 observed mean Δ。需要随机化或合适的 exchangeability/symmetry 假设。',`one-sided exact p=#{null mean≥observed}/16=${r.extremeCount}/16=${f(r.pValue)}`,{...line(order.map((p,i)=>[i+1,p.value]),'sorted sign-flip configuration','mean paired score difference',r.observed),connect:false})
      ],summary:`Observed mean Δ=${f(r.observed)}；one-sided paired sign-flip p=${f(r.pValue)}。最小可能值是1/16=.0625；这是单个预先指定的 synthetic contrast，未做跨 LR pairs 的 multiple-testing correction。`};},
      use:['本例用于拆开 LR candidate score、spatial assumption 与 donor-level condition contrast；LR 在这里指 Ligand–Receptor。','CellPhoneDB 的 cell-label specificity null、NicheNet 的 ligand-to-target ranking 与这里的 paired condition null 回答不同问题。'],
      tuning:['先固定 gene IDs、complex database、annotation、normalization 与 expression filter；检查缺失 subunits 和各 donor 的 coverage。','Distance gate 要按 signaling mode 与组织尺度讨论；比较 gate 敏感性，并保留无 spatial gate 的分析。Endocrine signaling 不适合仅用局部相邻规则。'],
      debug:[['很多 cells 得到很小 p，却只有1个 donor','检查 null 的置换单位及目标是否是 population-level condition effect。','保留 donor structure；增加 cells 不能提供缺少的独立 donors。'],['换 database 或距离参数，top LR 就换了','检查是否更换了候选集合、complex definition 或空间机会。','报告排名稳定性与输入差异，用 ligand/receptor perturbation 和 downstream response 验证候选。']],
      boundary:'自定义表达×距离 teaching score和4 paired donors的 exact sign-flip null；不是 CellPhoneDB、CellChat、LIANA 或 NicheNet 的复现，统计差异不能证明物理传递或 causality。',
      question:'这个 paired sign-flip p-value 检验的是哪件事？',options:['声明的 exchangeability null 下，donor-level score contrast 是否异常','某两个 cells 是否真的发生 ligand binding','这个 LR pair 为真实机制的 posterior probability'],answer:0,feedback:'P-value依赖明确的score、单位与null。Co-expression、邻近与统计差异仍需要 protein、activation、time或perturbation evidence连接到communication。',chapters:['rb07','sp07','l06'],ai:'ligand-receptor-inference',sources:['cpdb']}
  };

  const states=Object.fromEntries(Object.entries(config).map(([key,c])=>[key,Object.fromEntries(c.controls.map(v=>[v.id,v.value]))]));
  let active=Object.hasOwn(config,location.hash.slice(1))?location.hash.slice(1):'models', stepIndex=0, timer=null, speed=1, observer=null;
  const mq=matchMedia('(prefers-reduced-motion: reduce)');
  const text=(x,y,value,extra='')=>`<text x="${x}" y="${y}" ${extra}>${esc(value)}</text>`;
  const svg=(body,height,label,width=720)=>`<div class="ow-plot" role="region" tabindex="0" aria-label="${esc(label)}，图内可横向滚动"><svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(label)}" style="min-width:${width}px">${body}</svg></div>`;
  const shorten=(value,max=22)=>value.length>max?value.slice(0,max-1)+'…':value;
  function chart(c,label){
    if(c.kind==='bars'){
      let lo=Math.min(0,...c.values),hi=Math.max(c.maximum||0,...c.values,0);if(lo===hi)hi=lo+1;
      const x=v=>210+(v-lo)/(hi-lo)*380,h=90+c.values.length*49;
      let body=text(18,27,c.unit,'class="reg-svg-title"');
      [lo,(lo+hi)/2,hi].forEach(v=>{body+=`<line x1="${x(v)}" x2="${x(v)}" y1="43" y2="${h-33}" stroke="#d4e1f0"/>`+text(x(v),h-10,f(v),'text-anchor="middle"');});
      body+=`<line x1="${x(0)}" x2="${x(0)}" y1="43" y2="${h-33}" stroke="#47617f"/>`;
      c.values.forEach((v,i)=>{const y=52+i*49;body+=`<text x="18" y="${y+20}" class="reg-svg-small"><title>${esc(c.labels[i])}</title>${esc(shorten(c.labels[i]))}</text><rect x="${Math.min(x(0),x(v))}" y="${y}" width="${Math.abs(x(v)-x(0))}" height="29" fill="${v<0?'#a44920':'#1b55b5'}"/>`+text(610,y+21,f(v));});
      return svg(body,h,label);
    }
    if(c.kind==='line'){
      const xs=c.points.map(p=>p[0]),ys=c.points.map(p=>p[1]);let xmin=Math.min(...xs),xmax=Math.max(...xs),ymin=Math.min(0,...ys,c.reference??0),ymax=Math.max(0,...ys,c.reference??0);
      if(xmin===xmax)xmax=xmin+1;if(ymin===ymax)ymax=ymin+1;const span=ymax-ymin;ymin-=ymin<0?.08*span:0;ymax+=.08*span;
      const x=v=>100+(v-xmin)/(xmax-xmin)*520,y=v=>295-(v-ymin)/(ymax-ymin)*230;
      let body=text(18,27,c.yLabel,'class="reg-svg-title"');
      [0,.25,.5,.75,1].forEach(t=>{const v=ymin+(ymax-ymin)*t;body+=`<line x1="100" x2="620" y1="${y(v)}" y2="${y(v)}" stroke="#d4e1f0"/>`+text(88,y(v)+5,f(v),'text-anchor="end" class="reg-svg-small"');});
      if(c.connect!==false)body+=`<path d="${c.points.map((p,i)=>`${i?'L':'M'}${x(p[0])},${y(p[1])}`).join(' ')}" fill="none" stroke="#1b55b5" stroke-width="3"/>`;
      c.points.forEach(p=>{body+=`<circle cx="${x(p[0])}" cy="${y(p[1])}" r="3.5" fill="#1b55b5"><title>${esc(c.xLabel)}=${p[0]}; ${esc(c.yLabel)}=${p[1]}</title></circle>`;});
      if(c.reference!==undefined)body+=`<line x1="100" x2="620" y1="${y(c.reference)}" y2="${y(c.reference)}" stroke="#a44920" stroke-width="2" stroke-dasharray="7 5"/>`+text(625,y(c.reference)+5,f(c.reference),'class="reg-svg-small"');
      if(c.highlight)body+=`<circle cx="${x(c.highlight[0])}" cy="${y(c.highlight[1])}" r="7" fill="white" stroke="#08766e" stroke-width="3"/>`;
      [xmin,(xmin+xmax)/2,xmax].forEach(v=>{body+=text(x(v),322,f(v),'text-anchor="middle"');});body+=text(360,353,c.xLabel,'text-anchor="middle"');
      return svg(body,370,label);
    }
    if(c.kind==='matrix'){
      const cell=115,width=Math.max(720,180+c.columns.length*cell),height=100+c.rows.length*49,max=Math.max(1e-10,...c.values.flat().map(Math.abs));
      let body=text(18,27,c.unit,'class="reg-svg-title"');c.columns.forEach((name,j)=>body+=text(195+j*cell,60,name,'text-anchor="middle"'));
      c.rows.forEach((name,i)=>{body+=text(18,96+i*49,name);c.values[i].forEach((v,j)=>{body+=`<rect x="${143+j*cell}" y="${74+i*49}" width="105" height="35" fill="${v<0?'#a44920':'#1b55b5'}" fill-opacity="${.06+.2*Math.abs(v)/max}"/>`+text(195+j*cell,98+i*49,f(v),'text-anchor="middle"');});});return svg(body,height,label,width);
    }
    if(c.kind==='donors'){
      const height=80+c.n*35;let body=text(18,26,'Each row shares one donor effect bᵢ','class="reg-svg-title"');
      for(let i=0;i<c.n;i++){body+=text(18,70+i*35,`Donor ${i+1}`);for(let j=0;j<c.m;j++)body+=`<circle cx="${140+j*25}" cy="${64+i*35}" r="8" fill="${i%2?'#08766e':'#1b55b5'}"/>`;}
      return svg(body,height,label);
    }
    const title=origins[c.origin][0];let body=text(20,28,title,'class="reg-svg-title"');
    body+=`<path d="M350,40 L350,145" fill="none" stroke="#8da6c4" stroke-width="2"/><rect x="245" y="55" width="210" height="50" fill="#edf4ff" stroke="#8da6c4"/>`+text(350,86,'Zygote / early ancestors','text-anchor="middle"');
    const names=['Blood lineage','Skin lineage','Germ-cell progenitors'];names.forEach((name,i)=>{const x=125+i*230;body+=`<path d="M350,145 L${x},200" fill="none" stroke="#8da6c4" stroke-width="2"/><rect x="${x-100}" y="200" width="200" height="70" fill="${c.fractions[i]>0?'#e1edfb':'white'}" stroke="#8da6c4"/>`+text(x,226,name,'text-anchor="middle"')+text(x,255,`carrier fraction ${f(c.fractions[i])}`,'text-anchor="middle" class="reg-svg-small"');});
    const marker={inherited:[350,40],'de-novo':[350,105],early:[350,145],somatic:[237.5,172.5],'germ-only':[467.5,172.5]}[c.origin];
    body+=`<circle cx="${marker[0]}" cy="${marker[1]}" r="11" fill="#a44920"><title>${esc(origins[c.origin][1])}</title></circle>`+text(marker[0],marker[1]+5,'A','text-anchor="middle" class="reg-svg-inverse"');
    body+=text(20,310,'A = declared allele origin/history; not inferred from VAF.','class="reg-svg-small"');
    body+=text(20,337,'Coarse compartments, not a reconstructed developmental lineage.','class="reg-svg-small"');
    return svg(body,360,label,720);
  }
  function table(c){
    let headings,rows;
    if(c.kind==='matrix'){headings=['Row / Column',...c.columns];rows=c.rows.map((r,i)=>[r,...c.values[i].map(f)]);}
    else if(c.kind==='line'){headings=[c.xLabel,c.yLabel];rows=c.points.map(p=>p.map(f));if(c.reference!==undefined)rows.push(['Reference line',f(c.reference)]);}
    else if(c.kind==='bars'){headings=['Quantity',c.unit];rows=c.labels.map((l,i)=>[l,f(c.values[i])]);}
    else if(c.kind==='donors'){headings=['Donor','Measurements'];rows=Array.from({length:c.n},(_,i)=>[`D${i+1}`,String(c.m)]);}
    else{headings=['Compartment','Carrier fraction'];rows=['Blood','Skin','Diploid germ-cell progenitors'].map((l,i)=>[l,f(c.fractions[i])]);}
    return `<details class="reg-data"><summary>查看完整标签与中间数值</summary><div class="ow-table" role="region" tabindex="0" aria-label="图形精确数据，可横向滚动"><table><caption>当前步骤的计算数据</caption><thead><tr>${headings.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map((v,i)=>`<${i?'td':'th scope="row"'}>${esc(v)}</${i?'td':'th'}>`).join('')}</tr>`).join('')}</tbody></table></div></details>`;
  }
  function control(c){return `<label for="reg-${c.id}">${esc(c.label)}${c.type==='range'?`<output for="reg-${c.id}" id="reg-output-${c.id}">${f(states[active][c.id])}</output><input type="range" id="reg-${c.id}" data-control="${c.id}" min="${c.min}" max="${c.max}" step="${c.step}" value="${states[active][c.id]}" aria-describedby="reg-hint-${c.id}">`:`<select id="reg-${c.id}" data-control="${c.id}" aria-describedby="reg-hint-${c.id}">${c.options.map(([v,l])=>`<option value="${esc(v)}" ${v===states[active][c.id]?'selected':''}>${esc(l)}</option>`).join('')}</select>`}<small id="reg-hint-${c.id}">${esc(c.hint)}</small></label>`;}
  function context(){const s=states[active];let values;if(active==='models')values=platforms[s.platform];else if(active==='lineage')values=[origins[s.origin][0],origins[s.origin][1],'Germ-cell progenitors 在本例是 diploid；不从 tissue VAF 估计 offspring risk。'];else return '';return `<div class="reg-context"><strong>${esc(values[0])}</strong><p>${esc(values[1])}</p><p>${esc(values[2])}</p></div>`;}
  function stop(){if(timer){clearInterval(timer);timer=null;}const b=host.querySelector('[data-play]');if(b){b.textContent='播放四步';b.setAttribute('aria-pressed','false');}const copy=host.querySelector('#reg-stage-copy');if(copy)copy.setAttribute('aria-live','polite');}
  function stageVisible(){const rect=host.querySelector('#reg-stage')?.getBoundingClientRect();return Boolean(rect&&rect.bottom>0&&rect.top<window.innerHeight&&rect.right>0&&rect.left<window.innerWidth);}
  function update(){const c=config[active],result=c.calculate(states[active]),s=result.stages[stepIndex];
    host.querySelector('#reg-context').innerHTML=context();
    c.controls.forEach(control=>{if(control.type==='range')host.querySelector(`#reg-output-${control.id}`).textContent=f(states[active][control.id]);});
    host.querySelectorAll('[data-stage]').forEach((b,i)=>{if(i===stepIndex)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
    host.querySelector('[data-back]').disabled=stepIndex===0;host.querySelector('[data-next]').disabled=stepIndex===3;
    host.querySelector('[data-play]').disabled=mq.matches;host.querySelector('.reg-step-count').textContent=`Step ${stepIndex+1} / 4`;
    host.querySelector('#reg-stage-copy').innerHTML=`<h3>${esc(s.title)}</h3><p>${esc(s.description)}</p><p class="ow-equation">${esc(s.formula)}</p>`;
    host.querySelector('#reg-chart').innerHTML=chart(s.chart,`${c.name} · Step ${stepIndex+1} · ${s.title}`)+`<p class="reg-chart-note">数值由当前参数计算。图形可在自身区域内横向滚动；完整标签和数值可在下方展开。蓝/橙柱区分正负；曲线中的橙色虚线是文字说明的 reference，绿色圈标记当前参数。</p>`+table(s.chart);
    host.querySelector('#reg-result').textContent=result.summary;
    host.querySelector('#reg-motion-status').textContent=mq.matches?'Reduced Motion 已开启：使用手动步骤查看完整计算。':'改变参数会暂停播放，并保留当前步骤。';
  }
  function render(){stop();observer?.disconnect();const c=config[active];
    document.querySelectorAll('.reg-tabs a').forEach(a=>{if(a.hash==='#'+active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
    document.title=`${c.name} · Model Systems & Regulation Lab · Bio/CS`;
    host.innerHTML=`<h2>${esc(c.title)}</h2><p><strong>输入：</strong>${esc(c.input)}</p><p class="ow-boundary"><strong>Synthetic model boundary：</strong>${esc(c.boundary)}</p><div class="ow-controls">${c.controls.map(control).join('')}</div><div id="reg-context"></div><div class="ow-actions"><button type="button" data-reset>恢复本实验默认值</button></div><nav class="reg-stage-nav" aria-label="四步机制计算">${c.titles.map((t,i)=>`<button type="button" data-stage="${i}"><span>${i+1}</span>${esc(t)}</button>`).join('')}</nav><div class="reg-playback"><button type="button" data-back>上一步</button><span class="reg-step-count"></span><button type="button" data-next>下一步</button><button type="button" data-play aria-pressed="false">播放四步</button><label>播放速度<select data-speed aria-label="播放速度"><option value="0.5">慢速 · 6秒/步</option><option value="1" selected>标准 · 3秒/步</option><option value="2">快速 · 1.5秒/步</option></select></label></div><p id="reg-motion-status" class="reg-status"></p><section id="reg-stage" class="reg-stage" aria-label="当前计算阶段"><div id="reg-stage-copy" aria-live="polite"></div><div id="reg-chart"></div></section><div class="reg-output"><h3>完整计算得到什么？</h3><p id="reg-result"></p></div><fieldset class="ow-check"><legend>${esc(c.question)}</legend>${c.options.map((o,i)=>`<label><input type="radio" name="reg-check" value="${i}">${esc(o)}</label>`).join('')}<button type="button" data-check disabled>检查解释</button><p class="ow-feedback reg-feedback" role="status"></p></fieldset><div class="reg-guidance"><section><h3>什么时候用</h3><ul>${c.use.map(t=>`<li>${esc(t)}</li>`).join('')}</ul></section><section><h3>怎么设置与调参</h3><ul>${c.tuning.map(t=>`<li>${esc(t)}</li>`).join('')}</ul></section><section class="reg-debug"><h3>怎么排错</h3><dl>${c.debug.map(([a,b,d])=>`<dt>${esc(a)}</dt><dd><strong>先检查：</strong>${esc(b)}</dd><dd><strong>再处理：</strong>${esc(d)}</dd>`).join('')}</dl></section></div><div class="reg-sources"><strong>继续连接概念与算法</strong><p>${c.chapters.map(id=>`<a href="textbook.html#${id}">教材 ${id.toUpperCase()}</a>`).join('')}<a href="https://haoyunli.github.io/deep-learning-atlas/#/lesson/${c.ai}?animation=1">AI / ML · ${esc(c.ai)}</a></p><strong>Primary sources</strong><p>${c.sources.map(key=>`<a href="${sources[key][1]}" target="_blank" rel="noopener noreferrer">${esc(sources[key][0])}</a>`).join('')}</p></div>`;
    speed=1;update();if('IntersectionObserver' in window){observer=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)stop();});observer.observe(host.querySelector('#reg-stage'));}
  }
  host.addEventListener('input',e=>{const key=e.target.dataset.control;if(!key)return;const control=config[active].controls.find(c=>c.id===key);if(control.type!=='range')return;stop();states[active][key]=Number(e.target.value);update();});
  host.addEventListener('change',e=>{const key=e.target.dataset.control;if(key){const control=config[active].controls.find(c=>c.id===key);stop();states[active][key]=control.type==='range'?Number(e.target.value):e.target.value;update();}if(e.target.matches('[data-speed]')){stop();speed=Number(e.target.value);}if(e.target.name==='reg-check'){host.querySelector('[data-check]').disabled=false;host.querySelector('.reg-feedback').textContent='';}});
  host.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    if(b.hasAttribute('data-stage')){stop();stepIndex=Number(b.dataset.stage);update();}
    if(b.hasAttribute('data-back')||b.hasAttribute('data-next')){stop();stepIndex=Math.max(0,Math.min(3,stepIndex+(b.hasAttribute('data-next')?1:-1)));update();}
    if(b.hasAttribute('data-reset')){stop();states[active]=Object.fromEntries(config[active].controls.map(c=>[c.id,c.value]));stepIndex=0;render();host.querySelector('[data-reset]').focus();}
    if(b.hasAttribute('data-play')){if(timer){stop();return;}if(mq.matches)return;if(!stageVisible()){host.querySelector('#reg-motion-status').textContent='当前计算图在屏幕外；滚动到计算区域后即可播放，手动步骤始终可用。';return;}if(stepIndex===3)stepIndex=0;update();b.textContent='暂停播放';b.setAttribute('aria-pressed','true');host.querySelector('#reg-stage-copy').setAttribute('aria-live','off');timer=setInterval(()=>{if(document.hidden||mq.matches||!stageVisible()){stop();return;}stepIndex=Math.min(3,stepIndex+1);update();if(stepIndex===3)stop();},3000/speed);}
    if(b.hasAttribute('data-check')){const selected=host.querySelector('input[name=reg-check]:checked');if(selected)host.querySelector('.reg-feedback').textContent=(Number(selected.value)===config[active].answer?'判断正确。':'再看一下对象和证据边界。')+config[active].feedback;}
  });
  window.addEventListener('hashchange',()=>{const next=location.hash.slice(1);if(Object.hasOwn(config,next)&&next!==active){active=next;stepIndex=0;render();}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});mq.addEventListener('change',()=>{stop();update();});
  render();
})();
