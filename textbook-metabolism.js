/* UIUC MCB 354-aligned metabolism and project-facing metabolomics. */
(() => {
  const chapter = window.BIOCS_MAKE_BREADTH_CHAPTER;
  const term = window.BIOCS_TERM;
  const addCourse = course => window.BIOCS_BOOK.push(course);

  addCourse({
    code:'18',
    title:'Metabolism & Metabolomics',
    description:'从 energy coupling、redox 与 pathway regulation 走到糖、脂质、氨基酸的整合代谢，再学习 LC–MS/NMR 与 isotope tracing 怎样把代谢状态变成数据。',
    chapters:[
      chapter({
        id:'a01', title:'Bioenergetics：为什么反应会向前走', subtitle:'细胞不“制造能量”；它把有利过程与不利过程耦合，使总自由能变化可行。',
        intuition:'把代谢想成带高度差的水路。某些反应像水往低处流，会释放可用自由能；细胞用 enzyme 与共享中间体把这股“下坡力”接到需要“上坡”的合成、运输或运动上。',
        mental:'先画两个反应盒：一个 thermodynamically favorable，一个 unfavorable。用 ATP hydrolysis 或 ion gradient 作为接头，并始终计算整个 coupled system，而不是只看其中一步。',
        mechanism:'Gibbs free energy change ΔG 同时受标准状态与细胞内 reactant/product ratio 影响，因此课本的 ΔG°′ 不是细胞里的固定方向。ATP 常通过 phosphoryl transfer 改变 substrate 或 enzyme state；它是高周转的 coupling currency，不是“装着能量的电池”。Enzyme 降低 activation energy、加快正反向到达平衡，却不改变 equilibrium 本身。Pathway 方向常由远离平衡的步骤、substrate supply、product removal 与 compartment 共同建立。',
        evidence:'Calorimetry、equilibrium measurement、ATP/ADP ratio 与 time-resolved metabolite data 回答不同问题。看到 enzyme abundance 升高只说明潜在 capacity 改变；若 substrate 缺失或 reaction 接近平衡，net flux 可以几乎不变。',
        project:'解释 pathway score 时先把 “gene expression”“enzyme abundance”“metabolite pool” 与 “reaction flux” 分成四列。若主张 energy stress，应至少检查 ATP/ADP 或 AMP-related readout、oxygen/nutrient context 与采样速度，因为 extraction 后代谢仍可继续。',
        pitfall:'“释放能量”不代表分子内部没有能量；它指给定条件下产物相对反应物具有更低可用 free energy。ATP 也不是所有反应唯一使用的 energy carrier。',
        terms:[term('Gibbs free energy','在给定温度和压力下判断反应方向与可用功的热力学量。','uiucMcb354'),term('Reaction coupling','把总体有利反应与不利反应连接，使合并过程可进行。','uiucMcb354'),term('Activation energy','反应到达 transition state 所需跨越的能垒。','os6'),term('ATP','常用于 phosphoryl transfer 与过程耦合的 nucleotide。','uiucMcb354'),term('Equilibrium','正反反应速率相等、net change 为零的状态。','uiucMcb354')],
        check:['一个 enzyme 的 RNA 增加两倍，能否断言该反应释放了更多 energy、flux 也增加两倍？','不能。RNA 不等于 active enzyme；flux 还受 substrate、product、cofactor、allostery、compartment 和 ΔG 影响。'],
        sources:['uiucMcb354','os6'], prereq:['b02','b04'], core:'Energy & Matter / 能量与物质',
        flow:[['Reaction state','反应物与产物比例'],['ΔG','判断 net direction'],['Coupling','ATP/gradient 接力'],['Cell work','合成/运输/运动']]
      }),
      chapter({
        id:'a02', title:'Redox、electron carrier 与 metabolic flux', subtitle:'碳原子流动时，electron 也必须有去处；NADH 与 NADPH 服务于不同的 redox 任务。',
        intuition:'把 electron 想成必须记账的货物。Fuel 被 oxidation 时卸下 electron，NAD⁺/FAD 接走；biosynthesis 和 antioxidant defense 则常从 NADPH 领取 reducing power。',
        mental:'画两本账：carbon ledger 追踪原子去了哪里，electron ledger 追踪谁被 oxidized、谁被 reduced。再画 carrier 的 oxidized/reduced 两种状态，检查每一步是否守恒。',
        mechanism:'Oxidation 是失去 electron，reduction 是获得 electron。NAD⁺ 接受 hydride 形成 NADH，常把 catabolic electron 送往 electron transport chain；NADPH pool 主要支持 reductive biosynthesis 与 glutathione/thioredoxin defense。FAD 常紧密结合 enzyme 并可一次传递一个或两个 electron。Cell 通过 compartment、enzyme specificity 和不同 ratio 维持 NADH/NAD⁺ 与 NADPH/NADP⁺ 的功能分工。Metabolic flux 是单位时间穿过 reaction 的量，不等于某 metabolite 的 pool size。',
        evidence:'Redox sensor、cofactor assay、oxygen consumption、extracellular acidification 与 stable-isotope tracing 从不同角度测状态或通量。一个 metabolite 增多可能因为 production 加快，也可能因为 consumption 变慢；single endpoint 无法区分。',
        project:'代谢组结果出现 lactate 或 glutathione 改变时，先列 production 与 consumption 两端的候选解释。若要回答 flux，设计 labeled substrate 和时间序列，并把 label enrichment、pool size 与 absolute amount 分开报告。',
        pitfall:'NADH 与 NADPH 化学上相近，却不是可随意交换的“同一种电子”。它们由不同 enzyme network 与 cellular ratio 维持，承担的系统角色不同。',
        terms:[term('Oxidation','失去 electron 的过程。','uiucMcb354'),term('Reduction','获得 electron 的过程。','uiucMcb354'),term('NADH','常把 catabolic reaction 的 electron 运往再氧化过程的 carrier。','uiucMcb354'),term('NADPH','常为 biosynthesis 与 antioxidant system 提供 reducing power 的 carrier。','uiucMcb354'),term('Metabolic flux','单位时间通过某 reaction 或 pathway 的物质量。','ebiMetabolomics')],
        check:['某细胞的 citrate pool 变大，能否说明 TCA-cycle flux 一定变快？','不能。Pool size 是库存；生成增加、下游消耗降低、transport 改变都可让它变大。'],
        sources:['uiucMcb354','ebiMetabolomics'], prereq:['a01','b03'], core:'Energy & Matter / 能量与物质',
        flow:[['Fuel oxidation','释放 electron'],['Carrier reduction','NADH/FADH₂'],['Electron use','ETC 或 biosynthesis'],['Regeneration','恢复 carrier pool']]
      }),
      chapter({
        id:'a03', title:'Glycolysis、fermentation 与 gluconeogenesis', subtitle:'同一 glucose 可被拆解供 ATP、转成 lactate 再生 NAD⁺，也可被保留为 biosynthetic intermediate。',
        intuition:'Glycolysis 像十站生产线：先投资 ATP 把 glucose 留在 cell 并重新排列，后半段回收更多 ATP 与 NADH。出口不是固定的；pyruvate 去向取决于 oxygen、mitochondria、cell type 与需求。',
        mental:'把 pathway 分为 investment、cleavage、payoff 三段。每次只追踪三件事：carbon number、ATP 收支、NAD⁺/NADH 收支；最后再决定 pyruvate 的出口。',
        mechanism:'Glucose 经 hexokinase/glucokinase 等步骤进入 glycolysis；phosphofructokinase-1 是重要 regulation point，感受 energy 与 metabolite signal。每个 glucose 产生两个 pyruvate、net ATP 与 NADH。若 mitochondrial oxidation 受限或 glycolytic demand 很高，lactate dehydrogenase 把 pyruvate 还原为 lactate，同时再生 NAD⁺。Gluconeogenesis 不只是逆放 glycolysis；它用不同 enzyme 绕过强烈不可逆步骤，并主要在 liver 等组织维持 blood glucose。Cori cycle 在 tissue 间转运 lactate 与 glucose，但有全身 energy cost。',
        evidence:'Extracellular glucose/lactate、enzyme activity、13C-glucose isotopologue 与 oxygen consumption 可共同定位碳流。仅用 extracellular acidification 当 glycolysis proxy 要考虑 CO₂ hydration 与 buffer；只看 lactate abundance 也无法分辨生产和清除。',
        project:'Cancer 或 immune-cell 项目常把 lactate 高写成 “glycolysis activated”。更稳妥的证据链是 glucose uptake、labeled carbon into lactate、ATP/redox state、oxygen context 与 perturbation。比较 media 与 tissue 时要记录 glucose、glutamine、serum 和 cell density。',
        pitfall:'Fermentation 并不是“没有 oxygen 时才会发生”的绝对开关；有氧环境下，高 glycolytic flux 的 cell 也可产生大量 lactate。',
        terms:[term('Glycolysis','把 glucose 转为 pyruvate 并产生 ATP/NADH 的 reaction sequence。','uiucMcb354'),term('Substrate-level phosphorylation','直接从高能 substrate 把 phosphate 转给 ADP 生成 ATP。','uiucMcb354'),term('Fermentation','通过 organic product 再氧化 NADH、维持 glycolysis 的过程。','uiucMcb354'),term('Gluconeogenesis','从 lactate、glycerol 等 precursor 合成 glucose 的 pathway。','uiucMcb354'),term('Cori cycle','lactate 与 glucose 在 peripheral tissue 和 liver 间循环的系统。','uiucMcb354')],
        check:['观察到 lactate 上升，能否断言 mitochondria “坏了”？','不能。Lactate 可来自高 glycolytic rate、NAD⁺ regeneration、transport 或 clearance 改变；需 mitochondrial function 与 isotope evidence。'],
        sources:['uiucMcb354','os6'], prereq:['a01','a02'], core:'Energy & Matter / 能量与物质',
        flow:[['Glucose','6-carbon input'],['Investment','消耗 ATP'],['Payoff','ATP + NADH'],['Pyruvate fate','lactate/mitochondria/合成']]
      }),
      chapter({
        id:'a04', title:'Pentose phosphate pathway、NADPH 与 biosynthesis', subtitle:'Glucose 的价值不只在 ATP；它也能提供 nucleotide 原料和 antioxidant reducing power。',
        intuition:'Pentose phosphate pathway 是 glucose 交通环岛：oxidative branch 产生 NADPH，non-oxidative branch 调整不同 carbon-number 的 sugar，并把它们接回 glycolysis。',
        mental:'画两个输出旋钮：一个控制 NADPH，一个控制 ribose-5-phosphate。Cell 可根据 antioxidant 与 nucleotide demand 让 carbon 在支路和 glycolysis 间重排。',
        mechanism:'Oxidative phase 由 glucose-6-phosphate dehydrogenase 开始，生成 NADPH 与 ribulose-5-phosphate；non-oxidative phase 通过 transketolase/transaldolase 重排 sugar phosphate，可产生 ribose-5-phosphate 或返回 fructose-6-phosphate/glyceraldehyde-3-phosphate。NADPH 支持 fatty-acid/cholesterol synthesis 与 reduced glutathione regeneration。G6PD deficiency 展示 tissue context：red blood cell 高度依赖此 pathway 抵抗 oxidative stress。',
        evidence:'NADPH/NADP⁺、glutathione redox ratio、ROS probe 和 isotope pattern 测的是不同环节。ROS dye 易受 probe chemistry 与 cell handling 影响；G6PD RNA 也不等于 oxidative PPP flux。13C tracer 的位置标记能帮助区分 carbon 进入支路还是沿 glycolysis 前进。',
        project:'遇到 oxidative-stress signature 时同时考虑 ROS production 与 detoxification capacity。代谢模型要写清 compartment 和 cofactor；把 NADH 与 NADPH 合并会破坏可解释性。',
        pitfall:'Pentose phosphate pathway 不是一条只为 nucleotide 服务的旁路；NADPH、carbon rearrangement 与 redox defense 在不同 cell state 下可成为主要目的。',
        terms:[term('Pentose phosphate pathway','从 glucose-6-phosphate 产生 NADPH 与 pentose phosphate 的 network。','uiucMcb354'),term('Glucose-6-phosphate dehydrogenase','oxidative branch 的起始 enzyme。','uiucMcb354'),term('Ribose-5-phosphate','nucleotide synthesis 所需的 pentose precursor。','uiucMcb354'),term('Glutathione','参与 cellular redox buffering 的 tripeptide system。','uiucMcb354'),term('Oxidative stress','oxidant production 超过 antioxidant capacity 的状态。','uiucMcb354')],
        check:['G6PD expression 高是否等于 cell 里的 ROS 一定较低？','不等于。它可能是补偿反应；ROS 取决于产生、清除、enzyme activity 与 substrate/cofactor。'],
        sources:['uiucMcb354','reactome'], prereq:['a02','a03'], core:'Energy & Matter / 能量与物质',
        flow:[['Glucose-6-P','共同入口'],['Oxidative branch','NADPH'],['Sugar rearrangement','不同碳数'],['Cell need','redox 或 nucleotide']]
      }),
      chapter({
        id:'a05', title:'TCA cycle 与 oxidative phosphorylation', subtitle:'Mitochondrion 把 carbon oxidation、electron transfer 和 proton gradient 串成一套可调系统。',
        intuition:'TCA cycle 像圆形分拣中心：acetyl-CoA 进入后 carbon 最终释放为 CO₂，同时把 electron 装进 NADH/FADH₂；electron transport chain 再用 electron flow 把 proton 泵到 membrane 另一侧。',
        mental:'分三层画图：matrix 中 carbon cycle，inner membrane 上 electron chain，membrane 两侧 proton gradient。ATP synthase 连接 gradient 回流与 ATP production。',
        mechanism:'Pyruvate dehydrogenase 把 pyruvate 转为 acetyl-CoA。TCA cycle 经 citrate、α-ketoglutarate、succinyl-CoA、succinate、fumarate、malate 回到 oxaloacetate，并产生 reduced carrier 与 GTP/ATP equivalent。Intermediates 也流向 amino acid、lipid 与 heme synthesis，必须由 anaplerotic reaction 补充。ETC complex I–IV 把 electron 最终交给 O₂，并跨 inner membrane 建 proton-motive force；ATP synthase 利用回流。Uncoupling 让 oxidation 与 ATP synthesis 分离并可产生 heat。',
        evidence:'Oxygen-consumption rate 可分 basal、ATP-linked、maximal 与 non-mitochondrial components，但依 inhibitor 与 normalization。Membrane potential dye、ATP assay、metabolomics、isotope tracing 和 respirometry 不能互相替代。Mitochondrial number 增多不保证 function 更强。',
        project:'读 Seahorse 或 respirometry 数据时先确认每个 perturbation、cell number/protein normalization、media substrate 与时间。若看到 TCA intermediate 改变，检查它是 energy oxidation 还是 biosynthetic withdrawal/anaplerosis。',
        pitfall:'TCA cycle 不是只为“烧糖”；fatty acid、amino acid 也能进入，intermediate 又可离开做合成，因此它是 hub 而不是封闭圆环。',
        terms:[term('Tricarboxylic acid cycle','oxidize acetyl-CoA 并连接多种 biosynthetic intermediate 的 central cycle。','uiucMcb354'),term('Electron transport chain','把 electron transfer 与 proton pumping 耦合的 membrane complexes。','uiucMcb354'),term('Proton-motive force','由 membrane voltage 与 proton concentration difference 组成的势能。','uiucMcb354'),term('Oxidative phosphorylation','利用 respiratory electron transfer 建立的 gradient 合成 ATP。','uiucMcb354'),term('Anaplerosis','补充被抽走 TCA intermediate 的 reaction。','uiucMcb354')],
        check:['Oxygen consumption 下降能否直接说明 ATP 下降且 cell 正在死亡？','不能。ATP 可由 glycolysis 补偿，呼吸下降也可来自 substrate、cell number、state 或 assay condition；需多层 readout。'],
        sources:['uiucMcb354','os6'], prereq:['a02','a03'], core:'Energy & Matter / 能量与物质',
        flow:[['Acetyl-CoA','carbon 输入'],['TCA cycle','NADH/FADH₂'],['ETC','pump proton'],['ATP synthase','gradient → ATP']]
      }),
      chapter({
        id:'a06', title:'Lipid metabolism：storage、β-oxidation 与 synthesis', subtitle:'Fatty acid 同时是高密度 fuel、membrane material 和 signaling precursor。',
        intuition:'脂质系统像仓库与建筑材料供应链。Triacylglycerol 适合长期、无水储存；phospholipid 构成 membrane；cholesterol 调节 membrane 并提供 steroid precursor。',
        mental:'把 fatty-acid fate 画成三叉路：esterify 储存、oxidize 供能、elongate/desaturate 或装进 membrane。每条路都要标 cellular compartment 与 transport gate。',
        mechanism:'Fatty acid 被 activated 为 acyl-CoA；long-chain acyl group 经 carnitine shuttle 进入 mitochondrial matrix，β-oxidation 每轮释放 acetyl-CoA 并产生 NADH/FADH₂。Fatty-acid synthesis 多在 cytosol，以 acetyl-CoA/malonyl-CoA 和 NADPH 为原料。Malonyl-CoA 抑制 carnitine entry，帮助避免同一 compartment 同时大量 synthesis 与 oxidation。Liver 在 fasting 可由 acetyl-CoA 生成 ketone body。Cholesterol 来自 synthesis 与 uptake，并经 feedback 受控。',
        evidence:'Acylcarnitine profile、ketone、lipidomics、tracer 和 oxidation assay 可定位不同环节。Lipid droplet 增多可能代表 synthesis/uptake 增加，也可能是 oxidation/export 下降或 protective sequestration；染色面积不等于单一 pathway flux。',
        project:'Lipidomics 必须保留 molecular species 层级：chain length、double bond 和 isomer 可能有不同 biology。Extraction 与 ionization 对 lipid class 有强偏差；比较组间 total intensity 前检查 internal standard、batch 与 tissue amount。',
        pitfall:'“Fat” 不是一个分子类别。Free fatty acid、triacylglycerol、phospholipid、sphingolipid 与 cholesterol ester 的位置和功能不同。',
        terms:[term('β-oxidation','逐轮缩短 fatty acyl-CoA 并生成 acetyl-CoA 与 reduced carrier 的 pathway。','uiucMcb354'),term('Carnitine shuttle','把 long-chain acyl group 转入 mitochondrial matrix 的 transport system。','uiucMcb354'),term('Fatty-acid synthesis','由 acetyl-derived carbon 与 NADPH 合成 fatty acid 的 pathway。','uiucMcb354'),term('Ketone body','fasting 等状态下 liver 生成并供其他 tissue 使用的 water-soluble fuel。','uiucMcb354'),term('Lipidomics','系统测量 sample 中 lipid species 的方法集合。','ebiMetabolomics')],
        check:['Lipid droplet 变多能否证明 fatty-acid synthesis 增强？','不能。Uptake、esterification、lipolysis、oxidation 和 export 的任一变化都可能改变库存。'],
        sources:['uiucMcb354','ebiMetabolomics'], prereq:['a02','a05'], core:'Energy & Matter / 能量与物质',
        flow:[['Fatty acid','activate/transport'],['Storage','triacylglycerol'],['Oxidation','acetyl-CoA + carriers'],['Synthesis','membrane/signaling']]
      }),
      chapter({
        id:'a07', title:'Amino acid、nitrogen 与 nucleotide metabolism', subtitle:'拆解 amino acid 时，carbon skeleton 可回收，但 toxic nitrogen 必须被安全转运与排出。',
        intuition:'Amino acid 像同时带着“可再利用的 carbon 骨架”和“需要特别处理的 nitrogen 标签”。Cell 会先转移 nitrogen，再决定 carbon 进入 TCA、gluconeogenesis、ketogenesis 或 synthesis。',
        mental:'为每个 amino acid 画两条出口：amino group → glutamate/glutamine → urea 或其他 nitrogen product；carbon skeleton → central metabolism。Nucleotide 则拆成 base、sugar 与 phosphate 分别处理。',
        mechanism:'Transaminase 把 amino group 在 amino acid 与 α-keto acid 间转移，glutamate 常作为 nitrogen hub；glutamine 在 tissue 间安全携带 ammonia-related nitrogen。Liver urea cycle 把 nitrogen 转为 urea，且与 TCA intermediate 连接。Amino acid carbon skeleton 可成为 pyruvate、acetyl-CoA 或 TCA intermediate。Purine/pyrimidine synthesis 需要 ribose-5-phosphate、amino-acid-derived nitrogen 与一碳单位；salvage pathway 回收 base，降低 de novo synthesis 成本。Nucleotide pool imbalance 会影响 DNA replication 与 mutation risk。',
        evidence:'Plasma amino acid、urea/ammonia、enzyme assay、tracer 与 nucleotide pool 测量覆盖不同层级。Circulating metabolite 同时受 organ exchange、diet、microbiome 与 renal clearance 影响，不能直接指定 cellular source。',
        project:'研究 one-carbon 或 nucleotide metabolism 时记录 culture folate、serine/glycine、cell-cycle state 与 proliferation。以 isotope tracing 区分 de novo 与 salvage，并避免把 total nucleotide abundance 直接解释为 DNA synthesis rate。',
        pitfall:'Amino acid 不是只有“合成 protein”这一种命运；它们也是 carbon/nitrogen donor、neurotransmitter precursor 与 signaling input。',
        terms:[term('Transamination','在 amino acid 与 α-keto acid 间转移 amino group 的 reaction。','uiucMcb354'),term('Urea cycle','在 liver 将 excess nitrogen 转成 urea 的 pathway。','uiucMcb354'),term('Glutamine','常运输 nitrogen 并支持 nucleotide 等 biosynthesis 的 amino acid。','uiucMcb354'),term('De novo nucleotide synthesis','从小分子 precursor 重新构建 nucleotide 的 pathway。','uiucMcb354'),term('Salvage pathway','回收已有 base 或 nucleoside 再生成 nucleotide 的 pathway。','uiucMcb354')],
        check:['血浆 glutamine 下降能否直接说明 tumor cell 消耗增加？','不能。Diet、liver/muscle production、immune cells、kidney 与 tumor uptake 都会影响 circulating pool。'],
        sources:['uiucMcb354','reactome'], prereq:['a04','a05'], core:'Energy & Matter / 能量与物质',
        flow:[['Amino acid','carbon + nitrogen'],['Nitrogen transfer','glutamate/glutamine'],['Urea/export','安全排出'],['Carbon skeleton','TCA/glucose/ketone']]
      }),
      chapter({
        id:'a08', title:'Metabolic integration：fed、fasted 与 diabetes', subtitle:'全身代谢不是一张 cell pathway 图；它是 liver、muscle、adipose、brain 等 tissue 的分工与交换。',
        intuition:'把 body 想成多部门城市。Fed state 适合储存与合成；fasted state 要动员 fuel 并把有限 glucose 留给特定需求。Insulin 与 glucagon 是协调信号，不是简单的“降糖/升糖按钮”。',
        mental:'画 liver、muscle、adipose、brain 四个盒，再画 glucose、fatty acid、lactate、alanine、ketone 的箭头。对每个 state 标出 source、sink 与 hormone context。',
        mechanism:'Fed state 中 insulin 促进部分 tissue 的 glucose uptake、glycogen/lipid synthesis，并抑制 hepatic glucose output 与 adipose lipolysis。Fasting 时 glucagon/low insulin 支持 liver glycogenolysis、gluconeogenesis、fatty-acid oxidation 与 ketogenesis；muscle 与 adipose 提供 substrate。Type 1 diabetes 以 insulin deficiency 为核心，type 2 diabetes 常涉及 insulin resistance、β-cell compensation/failure 与 organ-specific dysfunction。Chronic hyperglycemia 是系统结果，同时可造成 downstream damage。',
        evidence:'Fasting glucose、HbA1c、insulin、C-peptide、clamp 与 tolerance test 衡量的时间窗和 mechanism 不同。Blood concentration 是 appearance 与 clearance 的平衡，不等于 production rate。Single time point 也可能错过 meal/circadian dynamics。',
        project:'临床代谢数据先对齐 fasting status、time of day、medication、recent exercise 与 sample tube/processing。比较 diabetes group 时 obesity、kidney/liver function 与 treatment 都是重要 context；不要从相关 metabolite 直接推断 causal pathway。',
        pitfall:'Insulin resistance 不是“完全没有 insulin effect”；它可 tissue-specific，且早期 insulin level 可能因 compensation 而升高。',
        terms:[term('Fed state','进食后 nutrient 丰富、以利用和储存为主的 integrated state。','uiucMcb354'),term('Fasted state','无近期 nutrient intake、以维持 blood fuel 与动员储存为主的 state。','uiucMcb354'),term('Insulin resistance','target tissue 对给定 insulin signal 的 response 降低。','uiucMcb354'),term('Glycogenolysis','把 glycogen 分解为可利用 glucose unit 的过程。','uiucMcb354'),term('Ketogenesis','liver 由 acetyl-CoA 生成 ketone body 的过程。','uiucMcb354')],
        check:['空腹 insulin 高是否意味着 insulin signaling 很强、代谢一定健康？','不一定。它可能反映对 insulin resistance 的 compensation；需结合 glucose、C-peptide、tissue context 与动态 test。'],
        sources:['uiucMcb354','hmdb'], prereq:['a03','a06','a07','h03'], core:'Systems / 系统',
        flow:[['Nutrient state','fed / fasted'],['Hormone signal','insulin / glucagon'],['Organ exchange','liver/muscle/adipose'],['Blood homeostasis','fuel supply 与 clearance']]
      }),
      chapter({
        id:'a09', title:'Cancer & immune metabolism', subtitle:'Rapid growth、activation 与 tissue competition 会重排 carbon、nitrogen、redox 和 oxygen 的使用方式。',
        intuition:'Tumor 与 activated immune cell 都像临时扩建的城市：它们不仅需要 ATP，还要 building block、redox control 与快速 signal response。谁能取得 nutrient、位于什么 oxygen zone，会改变功能。',
        mental:'不要用 “glycolysis high” 一句话概括。分别画 energy、biomass、redox、signaling 四个需求，再把 tumor cell、T cell、myeloid cell 与 stromal cell 放进同一 nutrient/oxygen environment。',
        mechanism:'Warburg effect 描述许多 proliferating cell 即使有 oxygen 仍保持高 glucose uptake 与 lactate production，但 mitochondria 往往仍然工作。Glutamine 可提供 TCA anaplerosis、nitrogen 与 redox support。Hypoxia 通过 HIF program 改变 glycolysis、angiogenesis 与 transport。Activated lymphocyte 会进行 state-dependent metabolic remodeling；tumor microenvironment 中 low glucose、low oxygen、acidic pH 与 suppressive metabolite 可限制 effector function。不同 tumor、region 和 treatment 下依赖并不相同。',
        evidence:'FDG-PET、bulk metabolomics、spatial metabolite imaging、tracer、flux model 与 ex vivo functional assay 各有盲区。Culture media 的 nutrient concentration 常远离 human tissue；cell-line dependency 不等于 patient tumor dependency。',
        project:'做 tumor metabolomics 时至少记录 pathology region、ischemia time、tumor purity、diet/fasting 与 treatment。若研究 immune metabolism，按 donor/tissue/state 分层，避免把 cell proportion change 当 intracellular metabolic change。把 therapeutic target 的 selectivity 问题写进结论。',
        pitfall:'Warburg effect 不等于 mitochondria 缺失，也不等于所有 cancer 使用同一种 fuel。Metabolic phenotype 是 genotype、cell state、tissue supply 与 competition 的共同结果。',
        terms:[term('Warburg effect','有 oxygen 时仍保持较高 glucose uptake 与 lactate production 的常见 proliferative phenotype。','uiucMcb354'),term('Metabolic reprogramming','cell state 改变伴随的 pathway use 与 nutrient allocation 重排。','reactome'),term('Hypoxia-inducible factor','low-oxygen context 下调节 gene program 的 transcription factor family。','reactome'),term('Nutrient competition','同一 microenvironment 中不同 cell 对有限 nutrient 的竞争。','nciCancer'),term('Anaplerosis','补充 central-cycle intermediate 以维持 oxidation 或 biosynthesis。','uiucMcb354')],
        check:['Tumor 中 glycolysis gene 高，能否断言 cancer cell 抢走了 T cell 的 glucose？','不能。Bulk signal 混合 cell type；competition 还需 cell-specific uptake、空间 supply 与功能 perturbation。'],
        sources:['uiucMcb354','nciCancer','reactome'], prereq:['a03','a05','i01','t03'], core:'Systems / 系统',
        flow:[['Cell demand','ATP/biomass/redox'],['Tissue supply','oxygen/nutrient'],['Competition','tumor/immune/stroma'],['Phenotype','growth/effector/suppression']]
      }),
      chapter({
        id:'a10', title:'Metabolomics 与 isotope tracing', subtitle:'Metabolite abundance 是一个快速变化的状态快照；flux 需要时间与 label 才能直接逼近。',
        intuition:'Metabolomics 像在繁忙路网拍一张航拍照：能看到哪些路口堆了多少车，却不知道车从哪里来、往哪里走。Isotope tracing 给一批车涂上可追踪颜色，时间序列才开始揭示路线。',
        mental:'把 workflow 分成六格：question → quench/sample → separation/detection → feature table → identification/normalization → pathway/inference。每一格都写一个可能产生 bias 的因素。',
        mechanism:'NMR 根据信号环境识别 molecule，reproducibility 高但 sensitivity 相对有限；LC–MS/GC–MS 通过 separation、mass-to-charge 与 fragmentation 检测更广 metabolite。Untargeted study 先得到 feature，再做 annotation；同一 m/z 可对应 isomer/adduct，identification 需 standard 与 MS/MS 等 evidence。Targeted assay 用 calibrated method 定量指定 analyte。Stable-isotope tracer（如 13C）通过 isotopologue distribution 追踪 atom fate；label enrichment 与 flux 仍需 model、time course 和 pool size。',
        evidence:'QC pool、blank、internal standard、randomized run order、batch correction 与 replicate 各捕获不同误差。Peak area 通常是 instrument response，不天然等于 concentration。Pathway enrichment 受 database coverage、ambiguous ID 与 correlated metabolite 影响。',
        project:'在分析前固定 biological matrix、collection tube、quench、storage、freeze–thaw 与 covariate。先画 PCA/QC drift 与 missingness，再做 group model。报告 metabolite identification confidence；未知 feature 可作为 reproducible signal，但不能给它编造具体 molecule mechanism。数据与 metadata 可参考 MetaboLights 的 study-level organization。',
        pitfall:'Metabolomics 不会自动测到“全部 metabolome”。Extraction、chromatography、ionization、library 与 abundance range 决定哪些 molecule 可见。',
        terms:[term('Metabolome','特定 biological system 在给定时间与条件下的 small-molecule 集合。','ebiMetabolomics'),term('Untargeted metabolomics','广泛检测 feature、随后进行 annotation 的 discovery strategy。','ebiMetabolomics'),term('Targeted metabolomics','针对预先指定 analyte 进行优化和校准的 measurement strategy。','ebiMetabolomics'),term('Isotopologue','元素组成相同但 isotope 组合不同的 molecule form。','ebiMetabolomics'),term('MetaboLights','存放 metabolomics study、metadata 与 data 的公共 repository。','metabolights')],
        check:['Untargeted LC–MS 中一个 feature 在病例组升高，能否立即称它为某已知 metabolite 并断言该 pathway flux 上升？','不能。先确认 identification；abundance 也不是 flux，需 tracer/time-course 或其他 mechanistic evidence。'],
        sources:['ebiMetabolomics','metabolights','hmdb'], prereq:['a02','d01','d06','k06'], core:'Science Practice / 科学实践',
        flow:[['Sample/quench','冻结 biological state'],['NMR/MS','产生 spectrum/feature'],['Identify/normalize','建立可比表'],['Infer/test','pathway 与 tracer validation']]
      })
    ]
  });
})();
