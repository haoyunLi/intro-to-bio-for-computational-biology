/* Original teaching examples: trace a mechanism before discussing inference limits. */
(() => {
  const chapters = (window.BIOCS_BOOK || []).flatMap(course => course.chapters);
  const byId = id => chapters.find(chapter => chapter.id === id);
  const pedigree = byId('x09');
  pedigree.sections.push([
    '从 1/2 到 2/3：观察怎样改变条件概率',
    `<p>这是虚构的单个位点课堂模型：亲本已知都是 Aa，aa 表现指定表型，AA 与 Aa 不表现；先假定完全外显、没有 phenocopy 或观察错误。一次妊娠的先验是 <code>P(AA)=1/4，P(Aa)=1/2，P(aa)=1/4</code>。现在只知道该子代没有表现，记为 U。</p><div class="lesson-table-wrap"><table class="lesson-table"><thead><tr><th>Genotype</th><th>Prior</th><th>P(U | genotype)</th><th>未归一化权重</th></tr></thead><tbody><tr><td>AA</td><td>1/4</td><td>1</td><td>1/4</td></tr><tr><td>Aa</td><td>1/2</td><td>1</td><td>1/2</td></tr><tr><td>aa</td><td>1/4</td><td>0</td><td>0</td></tr></tbody></table></div><p>权重合计 <code>P(U)=3/4</code>，所以 <code>P(Aa | U)=(1/2)/(3/4)=2/3</code>。观察没有改变这个人的 DNA；它改变了我们对隐藏 genotype 的判断。若 aa 的表型外显率改为 80%，aa 也有 20% 概率不表现：其权重变为 <code>1/4×0.2=1/20</code>，总权重 0.8，carrier posterior 变为 <code>0.5/0.8=5/8</code>。这时不能把 aa 从候选中删掉。实际家系还需年龄、检测和纳入模型；此例不用于个体临床风险。</p>`,
    ['osMendel','nhPenetrance'],
  ]);
  pedigree.worked = ['已知子代未表现，重新归一化 genotype',[
    '先写 Aa×Aa 的三个 genotype 先验：1/4、1/2、1/4；不要直接把 1/2 当作条件概率。',
    '完全外显模型下，未表现事件 U 对应 likelihood：AA=1、Aa=1、aa=0。逐项乘 prior。',
    '把剩余权重之和 3/4 作为分母，得到 P(Aa | U)=2/3，而不是 1/2。',
    '改成 80% 外显率时，aa 的未表现权重为 1/20；分母变为 0.8，Aa posterior=5/8。被观察筛掉的是模型中的可能性，不是分子。',
  ]];
  pedigree.check = ['沿用 Aa×Aa 课堂模型，只有 aa 可表现且外显率为 80%。已知子代未表现，P(aa | U) 是多少？',
    'P(aa 且 U)=1/4×0.2=0.05；P(U)=1/4+1/2+0.05=0.8，因此 P(aa | U)=0.05/0.8=1/16。Aa 的 posterior 是 5/8；不能用未表现排除 aa。此计算依赖已声明的模型。'];

  const antigen = byId('i03');
  antigen.sections.push([
    '同一蛋白，起点与呈递路线怎样改变',
    `<p>先追踪蛋白在哪里，再追踪 peptide 如何到达 MHC。下表画常见路线；真实系统有例外，且任一 peptide 都须适配具体 HLA 才能被稳定展示。</p><div class="lesson-table-wrap"><table class="lesson-table"><thead><tr><th>起点</th><th>加工与装载位置</th><th>表面展示</th><th>对应常规 T cell</th></tr></thead><tbody><tr><td>细胞自身 cytosol 中的蛋白</td><td>proteasome → peptide → TAP 进入 ER → 装载</td><td>MHC I–peptide</td><td>CD8</td></tr><tr><td>APC 摄入外部蛋白</td><td>endosomal/lysosomal protease → endosomal 装载</td><td>MHC II–peptide</td><td>CD4</td></tr><tr><td>部分 dendritic cell 摄入外部蛋白</td><td>cross-presentation，可进入 MHC I 路线</td><td>MHC I–peptide</td><td>CD8</td></tr></tbody></table></div><p>第三行说明“外部来源”不必然等于 MHC II；cross-presentation 也有多种机制。显示 peptide–MHC 后，仍须匹配 TCR、co-stimulation 与细胞状态，才能判断 activation 或 killing。</p>`,
    ['antigenProcessing2013'],
  ]);
  antigen.worked = ['追踪 cytosolic peptide，再预测阻断 TAP 的结果',[
    '设教学蛋白在 cell 的 cytosol 合成；其中一个 peptide 可结合该 cell 的 HLA I，其他条件保持一致。',
    '常见路径是 proteasome 产生 peptide → TAP 运输入 ER → MHC I 装载 → 细胞表面展示。识别这个组合的是匹配的常规 CD8 TCR。',
    '若仅阻断本例的 TAP-dependent 路径，预期该 peptide–MHC I 展示减少；不能用 protein RNA 仍高来否定这个中间环节的缺口。',
    '外部蛋白的 MHC II/endosomal 路线没有同一个 TAP 运输步骤；cross-presentation 与 TAP-independent 例外要另列。呈递减少可能限制识别，但功能还需单独测。',
  ]];
  antigen.check = ['本例只有 TAP-dependent 的 cytosolic peptide 路线被阻断，蛋白仍正常产生。该 peptide 的 MHC I 展示会怎样？能据此说所有 CD4 response 都消失吗？',
    '该 peptide 的常规 MHC I 展示预计减少，因为进入 ER 的运输被阻断。不能断言全部 CD4 response 消失：MHC II 的 endosomal 路线不同，且呈递、TCR 匹配与功能是不同环节。判断只适用于本例设定，真实系统有其他呈递路线。'];

  const respiration = byId('a05');
  respiration.sections[1][1] = respiration.sections[1][1].replace(
    'ETC complex I–IV 把 electron 最终交给 O₂，并跨 inner membrane 建 proton-motive force；',
    'ETC 把 electron 最终交给 O₂。Complex I、III、IV 泵 proton，complex II 传 electron 但不泵 proton；这些过程跨 inner membrane 建 proton-motive force；',
  );
  respiration.sections.push([
    '先预测：氧耗增加，ATP synthesis 为何反而下降',
    `<p>把 electron flow、proton-motive force 和 mitochondrial ATP synthesis 分成三个 readout。下表是假设底物、O₂ 与 ADP 充足，呼吸尚未到最大容量，且只改变指定环节的短时方向预测；箭头不是实测数据。Proton-motive force 同时含 voltage 与浓度差。</p><div class="lesson-table-wrap"><table class="lesson-table"><thead><tr><th>单独改变的环节</th><th>O₂ consumption</th><th>Proton-motive force</th><th>Mitochondrial ATP synthesis</th></tr></thead><tbody><tr><td>ETC 被抑制</td><td>下降</td><td>随后因泄漏耗散而下降</td><td>下降</td></tr><tr><td>ATP synthase 被抑制</td><td>通常下降：回压增大</td><td>早期通常升高</td><td>下降</td></tr><tr><td>Uncoupling：增加绕过 ATP synthase 的 H⁺ 回流</td><td>可上升：回压减小</td><td>下降</td><td>下降</td></tr></tbody></table></div><p>Uncoupling 消耗梯度，却没有把这部分回流耦合到 ATP synthesis；更多 electron 最终交给 O₂ 也不表示更多 mitochondrial ATP。完整细胞可用 glycolysis 补偿 ATP，过强扰动也可能损伤呼吸，所以这些方向不能无条件外推到所有 assay。</p>`,
    ['osOxPhos'],
  ]);
  respiration.worked = ['沿 uncoupling 推演三个方向',[
    '起点是 ETC 用 electron transfer 泵 proton，ATP synthase 用回流驱动 ATP synthesis；这是两种相连的流。',
    '增加绕过 ATP synthase 的 proton 回流后，proton-motive force 降低。回流本身不会都制造 ATP。',
    '在上述底物和容量条件下，ETC 的回压降低，electron flow/O₂ consumption 可上升，同时 mitochondrial ATP synthesis 下降。',
    '若看到 O₂ consumption 上升，另测 gradient 与 ATP synthesis，才能区分耦合供能和 uncoupling；不要用单个 OCR 代替三个量。',
  ]];
  respiration.check = ['沿用表中的短时模型，ETC inhibition 与 uncoupling 都使 mitochondrial ATP synthesis 下降。哪项 readout 有望区分两者，方向是什么？',
    'O₂ consumption：ETC inhibition 使它下降；在底物/O₂/ADP 充足、呼吸未达上限且未损伤系统的 uncoupling 情况，它可上升。两者的 gradient 都可降低。完整细胞的总 ATP 还受 glycolysis 补偿，需单独测量。'];
  const repair = byId('x04');
  repair.sections.push([
    '断裂修好了，序列为何仍可能改变',
    `<p>用虚构短序列区分 damage 与 mutation：只画一条链的 5′→3′ 顺序，互补链省略。原来是 <code>ACGTTA</code>；在 <code>ACG | TTA</code> 处发生 double-strand break。断裂先改变分子的完整性，并不必然删去某个 base。</p><div class="lesson-table-wrap"><table class="lesson-table"><thead><tr><th>本例后续处理</th><th>连接后的序列</th><th>结果</th></tr></thead><tbody><tr><td>compatible ends 原样连接</td><td>ACGTTA</td><td>恢复原序列</td></tr><tr><td>假定端处理丢掉右端一个 T，再连接</td><td>ACGTA</td><td>1-base deletion：序列已改变</td></tr><tr><td>持续损伤导致细胞死亡</td><td>未得到存活细胞中的修复产物</td><td>不能把全部 damage 都算成后代 mutation</td></tr></tbody></table></div><p>第二行是人为指定的修复结果，不是 NHEJ 必然删 1 base，也不是实际发生率。NHEJ 既可准确连接，也可因端处理形成 indel。Mutation 可来自复制错误或损伤后的复制，也可直接由错误修复产生；不是所有 mutation 都要等下一次完整 chromosome replication。γH2AX、修复产物序列和存活细胞的 variant burden 测的是不同阶段。</p>`,
    ['nhMutation','cnvRepairMechanisms'],
  ]);
  repair.worked = ['从断裂追到一个已形成的 deletion',[
    '原序列 ACGTTA 在 ACG | TTA 处断开：这是完整性受损，尚不等于已经丢掉一个字母。',
    '原样连接可恢复 ACGTTA；本例另假定端处理移除右端一个 T。',
    '连接后得到 ACGTA，长度从 6 变成 5；删除已在修复时形成，不必等待下一轮完整染色体复制。',
    '若只测到当前 damage response，仍不知道原样修复、带 indel 存活或死亡各占多少；需区分测量阶段。',
  ]];
  repair.check = ['本例 ACG | TTA 的右端失去一个 T 后重新连接。结果是什么？这是否必须等到下一次完整 chromosome replication 才成为序列改变？',
    '结果是 ACGTA，比原来短 1 base，属于 deletion。它已在端处理与重接中形成，不必等待下一轮完整染色体复制；NHEJ 并不必然产生这个结果，也可以原样连接。'];

  const transcription = byId('x05');
  transcription.sections.push([
    '两种过程，为什么得到同样两倍的 RNA',
    `<p>课堂中只考虑一个固定细胞中的 RNA 合成和一阶降解，忽略 export、processing、cell division 与体积变化。设 <code>dR/dt=s−kR</code>：R 是模型 RNA molecules/cell，s 是 molecules/cell/min，k 是 min⁻¹。稳态时 <code>R*=s/k</code>。</p><div class="lesson-table-wrap"><table class="lesson-table"><thead><tr><th>课堂条件</th><th>s</th><th>k</th><th>稳态 R*</th></tr></thead><tbody><tr><td>基线</td><td>10</td><td>0.1</td><td>100</td></tr><tr><td>合成加倍</td><td>20</td><td>0.1</td><td>200</td></tr><tr><td>降解常数减半</td><td>10</td><td>0.05</td><td>200</td></tr></tbody></table></div><p>后两行的终点丰度相同，生成机制却不同。Nascent RNA 标记和 decay time course 有望区分它们；取样时刻、标记时长、细胞分裂与处理步骤仍需纳入。此表是原创模型中的分子数，不是把 raw RNA-seq counts 直接解释为每个 cell 的绝对分子数。真实系统不一定符合一阶稳态假设。</p>`,
    ['ncbiGeneExpression'],
  ]);
  transcription.worked = ['用合成与降解平衡算 RNA 丰度',[
    '写出模型 dR/dt=s−kR；在稳态把变化率设为 0，得 R*=s/k。',
    '基线 s=10、k=0.1，R*=100；合成改为 20、k 不变，R*=200。',
    '保持 s=10、只把 k 改为 0.05，也得到 R*=200。相同终点不能唯一反推 initiation。',
    '比较 nascent synthesis 与 decay time course，并检查模型的稳态、时间和计量单位；丰度与速率是不同量。',
  ]];
  transcription.check = ['沿用本章一阶稳态模型，s=10 molecules/cell/min，k 从 0.1 改为 0.2 min⁻¹。稳态 RNA 数是多少，合成是否下降？',
    'R*=10/0.2=50 molecules/cell，只有基线的一半。模型中的合成 s 仍是 10；下降来自降解常数增加，不能由较低丰度直接判定 transcription 降低。'];

  const splicing = byId('x08');
  splicing.sections.push([
    '先归一化：80 个 inclusion reads 为什么不等于 2/3 PSI',
    `<p>以 rMATS 的 inclusion-level 计算为例，I、S 是该事件的 inclusion/skipping counts，Lᵢ、Lₛ 是工具给出的 effective form lengths，不是随意取整条 gene 长度。<code>PSI=(I/Lᵢ)/[(I/Lᵢ)+(S/Lₛ)]</code>。JC 与 JCEC 的计数规则不同，必须和对应长度一起使用。</p><p>虚构事件设 <code>I=80，S=40，Lᵢ=200，Lₛ=100</code>：归一化后都是 0.4，PSI=0.5；直接用 <code>80/(80+40)</code> 会得到 2/3。只有两种 effective length 相同且其他模型条件成立时，简化的 raw-count 比例才与这个公式相等。I=S=0 时没有比例信息，rMATS 输出 NA，而不是 PSI=0。低 coverage、mapping 与 biological replicate 仍决定解释可靠性；PSI 不是 protein activity。</p>`,
    ['rmatsOfficial','rmats'],
  ]);
  splicing.worked = ['按事件计数机会计算 PSI',[
    '记录 inclusion 80、skipping 40；同时取该事件对应的 effective lengths 200 与 100。',
    '分别归一化：80/200=0.4，40/100=0.4；它们在原始 counts 上有不同计数机会。',
    '纳入比例为 0.4/(0.4+0.4)=0.5，不能直接把 80/120 当作此工具的结果。',
    '两个 counts 都为 0 时记缺少信息/NA；比较组别还要保留 biological replicate 和 coverage，不从单次比例推功能。',
  ]];
  splicing.check = ['按本章 rMATS 公式，I=60、S=30，Lᵢ=200、Lₛ=100，PSI 是多少？若 I=S=0 呢？',
    '60/200=0.3、30/100=0.3，所以 PSI=0.3/0.6=0.5，而不是 raw 60/90。两者为 0 时分母为 0，应记 NA/无比例信息，不能解释成完全跳过。'];

  const phasing = byId('x10');
  phasing.sections.push([
    '同一 phase set：知道 cis，仍不知道来自谁',
    `<p>虚构两个 diploid heterozygous 位点，REF/ALT 均按各自记录编码。若它们已可靠定相且处于<strong>同一 phase set</strong>：</p><div class="lesson-table-wrap"><table class="lesson-table"><thead><tr><th>记录</th><th>位点 A 的 GT</th><th>位点 B 的 GT</th><th>两条 ALT 的关系</th></tr></thead><tbody><tr><td>情形 1</td><td>0|1</td><td>0|1</td><td>都在 haplotype 2：cis</td></tr><tr><td>情形 2</td><td>0|1</td><td>1|0</td><td>分在 haplotype 2 与 1：trans</td></tr><tr><td>未定相</td><td>0/1</td><td>0/1</td><td>仅由 GT 无法二选一</td></tr></tbody></table></div><p>将情形 1 两条 haplotype 的编号整体交换，会把两个 GT 都写成 1|0，却保留同一个 cis 关系。编号不是亲本标签。单个样本的 read-backed/statistical phasing 通常不自动确定 parental origin；家系资料和相应推断才可给来源。WhatsHap 的 pedigree 模式可按 paternal|maternal 输出，这是具体模式的约定，不能泛化到所有带 | 的 VCF。不同 phase set 之间也不能直接按左右位置拼接。</p>`,
    ['whatshapGuide','nhHaplotype'],
  ]);
  phasing.worked = ['读 GT，再分清定相与亲本来源',[
    '同一 phase set 的 A=0|1、B=1|0：A 的 ALT 在 haplotype 2，B 的 ALT 在 haplotype 1。',
    '因此 ALT 在 trans；0/1、0/1 的未定相记录则同时兼容 cis 和 trans。',
    '没有亲本资料时，只把它们叫 haplotype 1/2；不要把左侧自动叫 paternal。',
    '核对 phase set、phasing uncertainty、样本和工具模式，再用于 recessive variant 或 ASE 推断。',
  ]];
  phasing.check = ['同一可靠 phase set 内，两个位点的 GT 都是 1|0。两条 ALT 是 cis 还是 trans？这能否单独说明来自父亲？',
    '它们都位于 haplotype 1，所以是 cis。仅这些 GT 不给 parental origin；需要亲本资料和相应推断/模式。不同 phase set 不能直接比较左右位置。'];

  const survival = byId('r04');
  survival.sections.push([
    '五人手算：删失改变之后的 risk set',
    `<p>这是原创的五人课堂队列，时间单位为月。A–E 都在 t=0 开始观察，研究单一终末事件，没有延迟入组或同时事件。A 在 t=2 发生事件；B 在 t=3 最后确认未发生事件后右删失；C 在 t=4 发生事件；D、E 分别在 t=5、6 最后确认未发生事件后右删失。右删失者后来的事件时间未知。</p><p><strong>Risk set / 风险集</strong>是某一时点之前仍被观察、且尚未发生事件的人。Kaplan–Meier 从 Ŝ(0)=1 开始，在每个事件时点乘 <code>(n−d)/n</code>；n 是事件之前的风险集人数，d 是该时点事件数。本例的删失时点没有事件，因此不直接让曲线下降。</p><div class="lesson-table-wrap"><table class="lesson-table"><thead><tr><th>t（月）</th><th>本时点记录</th><th>时点之前的 n</th><th>d</th><th>更新后的 Ŝ(t)</th></tr></thead><tbody><tr><td>2</td><td>A：event</td><td>5</td><td>1</td><td>1×4/5=0.8</td></tr><tr><td>3</td><td>B：censored</td><td>4</td><td>0</td><td>仍为 0.8；之后只余 3 人</td></tr><tr><td>4</td><td>C：event</td><td>3</td><td>1</td><td>0.8×2/3=8/15≈0.533</td></tr><tr><td>5</td><td>D：censored</td><td>2</td><td>0</td><td>仍为 8/15；之后只余 E</td></tr><tr><td>6</td><td>E：censored</td><td>1</td><td>0</td><td>仍为 8/15；之后无人观察</td></tr></tbody></table></div><p>t=4 的分母是 3：A 已发生事件，B 已结束观察，不能把 B 当成一直未发生事件的人留在分母。曲线尾部不下降只说明没有新的已观察事件；它不保证被删失者永不发生事件，也不能外推到 t=6 之后。后期风险集很小，估计不确定性也需报告。用此估计推断目标人群的生存分布依赖独立删失等假设；若离开观察的原因关联尚未观察到的事件时间，简单 KM 可产生偏差。此例不是个体临床预测。</p>`,
    ['survivalVignette'],
  ]);
  survival.check = ['本例 B 在 t=3 右删失，会立刻使 Ŝ 下降吗？C 在 t=4 发生事件时，n 与 Ŝ 各是多少？诊断时预测能使用六个月后的治疗反应吗？',
    'B 的删失不直接使 Ŝ 下降，但会把之后的风险集从 4 减到 3。C 的事件之前 n=3，所以 Ŝ=0.8×(3−1)/3=8/15≈0.533；不能保留已删失的 B 当分母。诊断时还不可得的六个月治疗反应属于未来信息，不能作为诊断时预测特征。'];

  const evolution = byId('e03');
  evolution.sections.push([
    '手算一代：先数 allele copies，再比较后代贡献',
    `<p>原创的 haploid 课堂模型：100 个个体在该位点各有一个 allele，其中 A 有 40 个、a 有 60 个，因此 <code>p(A)=40/100=0.4</code>。假定没有 mutation 或 migration，A 个体在指定环境中的后代贡献恰为每个 2 个、a 恰为每个 1 个，且后代保留亲本 allele。</p><p>下一代的 A 为 <code>40×2=80</code>，a 为 <code>60×1=60</code>，所以 <code>p′(A)=80/(80+60)=4/7≈0.571</code>。分母也增长了，不能只把原频率乘 2 而报 0.8。这里人为固定了贡献，只展示 selection 的确定性计算；真实的繁殖、存活和抽样都有随机性。</p><p>另看中性模型：两种 allele 的后代贡献相同，下一代仅从 allele pool 独立、有放回地抽取 4 个 copies。可能恰好抽到 3 个 A、1 个 a，于是观察频率为 0.75；这不需要 A 有优势。这次抽样代表有限群体生成下一代的 toy genetic drift。若只是从一个已存在的大群体测 4 个个体，那是 sampling uncertainty，而不是该大群体本身一定改变。真实项目必须区分群体变化与测量抽样，多个独立群体、更多世代与贡献测量才有望区分解释。此处 allele copies 也不是测序 reads 的分母。</p>`,
    ['osPopulationEvolution'],
  ]);
  evolution.worked = ['用后代贡献重新计算频率',[
    'haploid toy 起点 A=40、a=60；每个个体该位点有一个 allele，A 频率为 0.4。',
    '在固定贡献 2 与 1 下，下一代 A=80、a=60，总数为 140。',
    'A 的下一代频率为 80/140=4/7；不能把起点频率乘 2 后继续用原分母。',
    '中性有限抽样也可能提高 A 的频率；明确生成群体的 drift 与抽样测量误差，再比较多个世代与贡献。',
  ]];
  evolution.check = ['沿用本章 haploid 固定贡献模型，若 A 与 a 都恰好各贡献 2 个后代，下一代 p(A) 是多少？只看到频率上升就能证明 selection 吗？',
    'A=80、a=120，p(A)=80/(80+120)=0.4；共同增加不改变比例。只见频率上升不能证明 selection：有限群体的 genetic drift、migration、mutation 或测量抽样也可能改变观察值，需要额外证据。'];

  const binding = byId('l01');
  binding.sections.push([
    '先算 occupancy：Kd 是浓度尺度，不是开关',
    `<p>原创的简单可逆结合模型：<code>R+L ⇌ RL</code>，只有一类相互独立的 1:1 binding sites，没有 cooperativity 或其他竞争 ligand，并已达到 equilibrium。这里 L 指<strong>free ligand concentration</strong>，不是把加入的总量直接当游离量。由 <code>Kd=[R][L]/[RL]</code>，占据比例 <code>θ=[RL]/([R]+[RL])=L/(Kd+L)</code>。θ 无量纲，L 与 Kd 的浓度单位须一致。</p><div class="lesson-table-wrap"><table class="lesson-table"><thead><tr><th>Free L（nM）</th><th>Kd（nM）</th><th>Occupancy θ</th></tr></thead><tbody><tr><td>0.5</td><td>5</td><td>0.5/5.5≈0.091</td></tr><tr><td>5</td><td>5</td><td>5/10=0.5</td></tr><tr><td>50</td><td>5</td><td>50/55≈0.909</td></tr></tbody></table></div><p>L 低于 Kd 仍有 binding；等于 Kd 时在本模型下为一半占据，而非“刚开始有信号”。若受体大量消耗 ligand，free L 与加样浓度不再接近，需要处理质量守恒；若未达平衡、存在不同位点或协同性，也不能直接套这个表。Occupancy 还不能直接替代 downstream effect：antagonist 可结合而不产生相同激活，signal amplification 和 receptor reserve 也可改变曲线。EC50 是指定 response 曲线的半最大浓度，不能由此表认定必为 5 nM。</p>`,
    ['assayBindingKinetics'],
  ]);
  binding.worked = ['用 free ligand 算受体占据，再问响应',[
    '声明单类独立 1:1 sites、可逆结合且达到平衡；取 free L，而非未经核对的总加样浓度。',
    '设 Kd=5 nM、free L=0.5 nM，θ=0.5/(5+0.5)≈0.091；低于 Kd 并不等于完全没有 binding。',
    'free L=5 nM 时 θ=0.5，50 nM 时约0.909；θ 是比例，不是浓度。',
    '另外测 activation 与指定 downstream response；此 occupancy 模型没有给出 EC50 或最终 phenotype。',
  ]];
  binding.check = ['沿用本章模型，Kd=5 nM、free L=15 nM 时 occupancy 是多少？能否由此直接说 response 已达到最大值的75%？',
    'θ=15/(5+15)=0.75，即75% sites 被占据。不能直接认定 response 为75%：模型只描述平衡binding，响应还依赖激活、amplification、receptor reserve及其他环节。'];

  const cancerImmunity = byId('i10');
  cancerImmunity.sections.push([
    'TCR 与常见 CAR：识别关口怎样改变',
    `<p>以匹配 peptide–HLA I 的常规 CD8 TCR，与直接识别<strong>细胞表面 CD19</strong>的常见抗体来源 CAR 作机制对照。TCR 识别 peptide 与 HLA 构成的复合物；本例 CAR 的外部 antibody-derived domain 直接结合表面 antigen，内部 signaling/co-stimulatory domains 传递信号，不要求把 CD19 加工成匹配的 peptide–HLA 后才结合。</p><div class="lesson-table-wrap"><table class="lesson-table"><thead><tr><th>识别方式</th><th>目标端必须给出的东西</th><th>直接识别的限制</th></tr></thead><tbody><tr><td>本例常规 CD8 TCR</td><td>匹配的 peptide–HLA I</td><td>有蛋白也未必形成或展示匹配复合物</td></tr><tr><td>本例 CD19 CAR</td><td>可到达、可结合的 surface CD19</td><td>只在细胞内部的蛋白不能由此 CAR 直接识别</td></tr></tbody></table></div><p>在虚构的“其他条件不变”比较中，若 target 丢失 HLA I 展示却保留可结合的 surface CD19，本例 TCR 的识别关口受损；不能把同一 peptide–HLA 缺口直接套到 CD19 CAR。反过来，surface CD19 丢失会破坏这个 CAR 的目标识别。两者在到场、功能抑制和 target death 等关口仍可能失败；能结合不保证能杀伤，也不代表只结合 tumor，正常细胞也可能有同一 antigen。这里限定常见 surface-antigen CAR；针对 peptide–HLA 等其他设计应另查具体识别对象。此表解释机制，不预测个体疗效。</p>`,
    ['nciCarEngineering','carAntibodyRecognition1989'],
  ]);
  cancerImmunity.check = ['本例 target 的 HLA I 展示丢失，但可结合的 surface CD19 保留。能否因此断定常规 peptide–HLA I TCR 与 CD19 CAR 都必然无法结合目标？',
    '不能。本例常规 TCR 需要匹配的 peptide–HLA I，展示丢失会损害这一识别；常见 CD19 CAR 直接结合 surface CD19，不经过同一呈递关口。CAR 能结合仍不保证 killing 或临床疗效，其他链路也可能失败；若 CD19 丢失，则其目标识别同样受损。'];
})();
