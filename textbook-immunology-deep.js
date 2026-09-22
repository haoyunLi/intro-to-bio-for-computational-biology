/* Deep immunology expansion aligned to UIUC MCB 408. */
(() => {
  const chapter = window.BIOCS_MAKE_BREADTH_CHAPTER;
  const term = window.BIOCS_TERM;
  const course = window.BIOCS_BOOK.find(item => item.code === '15');
  if (!course) return;

  course.description = '从 barrier、innate sensing 与 complement，深入到 receptor diversity、lymphocyte development、effector function、vaccines、tolerance、autoimmunity 与 cancer immunotherapy。';
  course.chapters.push(
    chapter({
      id:'i06', title:'Receptor diversity 与 lymphocyte development', subtitle:'Adaptive immunity 在遇见 pathogen 之前先随机生成巨大 receptor repertoire，再用 selection 降低自体伤害。',
      intuition:'把 B/T-cell receptor repertoire 想成预先制作的巨大钥匙库。身体不知道未来会遇到什么 lock，于是先随机组装许多 key；developmental selection 再淘汰无法工作或过度识别 self 的 clone。',
      mental:'画两条生产线：bone marrow 中 B cell、thymus 中 T cell。每条线都标出 gene rearrangement、functional checkpoint、self-reactivity test 与 mature-naive exit。',
      mechanism:'RAG protein 介导 V(D)J recombination，把分散的 V、D、J gene segment 组合成 unique receptor sequence；junctional addition/deletion 进一步增加 diversity。B cell 在 bone marrow 检查 BCR expression 与 self-reactivity，可经历 deletion、anergy 或 receptor editing。T cell precursor 在 thymus 先经 positive selection 保留能读取 self-MHC 的 cell，再经 negative selection 删除部分高 self-reactivity clone；CD4/CD8 lineage choice 与 recognized MHC class 相关。Selection 不可能清除所有危险 clone，因此 peripheral tolerance 仍必要。',
      evidence:'Flow cytometry 用 surface marker 追踪 developmental stage；repertoire sequencing 测 clone sequence 与 frequency；knockout、bone-marrow chimera 和 thymic model 测机制。看到 repertoire diversity 下降不自动说明 V(D)J generation 失败，也可能是 expansion、age、sampling depth 或 treatment。',
      project:'分析 BCR/TCR-seq 时区分 read、cell、clone、sample 与 person。Chain pairing、PCR amplification、clone-definition threshold 和 sampling tissue 都改变 repertoire。比较 group 时以 donor 为 independent n，并报告 richness 对 sequencing depth 的敏感性。',
      pitfall:'Receptor gene 不是每个人 genome 中预先存着上百万个完整版本；diversity 主要在 individual lymphocyte development 时由 somatic DNA rearrangement 建立。',
      terms:[term('V(D)J recombination','在 developing lymphocyte 中重组 receptor gene segment 的 somatic process。','uiucMcb408'),term('Positive selection','在 thymus 保留能适当识别 self-MHC 的 developing T cell。','uiucMcb408'),term('Negative selection','删除部分过强识别 self antigen 的 developing lymphocyte。','uiucMcb408'),term('Receptor editing','self-reactive immature B cell 再次改变 light-chain rearrangement 的机制。','uiucMcb408'),term('Immune repertoire','一个个体或 sample 中 BCR/TCR sequence 与 clone 的集合。','uiucMcb408')],
      check:['TCR repertoire 中某 clone 很大，能否仅凭 sequence 判断它识别哪个 antigen？','通常不能。Expansion 不等于已知 specificity；需要 tetramer、stimulation、paired receptor expression 或其他 functional evidence。'],
      sources:['uiucMcb408','osAdaptiveImmune'], prereq:['i03','x04'], core:'Information Flow / 信息流',
      flow:[['Gene segments','V/D/J repertoire'],['Rearrangement','每个 cell 一套 receptor'],['Selection','可用且较安全'],['Naive pool','等待 antigen']]
    }),
    chapter({
      id:'i07', title:'T-cell activation、effector function 与 migration', subtitle:'T cell 必须在正确位置同时获得 antigen、co-signal 与 cytokine context，随后再迁往感染或 tumor tissue。',
      intuition:'T-cell response 像需要多重授权的调度系统：TCR 确认目标，co-stimulation 确认情境值得响应，cytokine 决定任务类型；adhesion/chemokine 再把效应 cell 导航到现场。',
      mental:'画时间轴：dendritic cell 在 tissue 取样 → lymph node 呈递 → naive T cell activation/expansion → effector migration → target recognition → contraction/memory。',
      mechanism:'Naive T-cell activation 常概括为 signal 1（TCR–peptide–MHC）、signal 2（co-stimulation）与 signal 3（cytokine context）。CD4 T cell 可分化为不同 helper/regulatory state，协调 macrophage、B cell 与 barrier response；CD8 T cell 可用 perforin/granzyme 或 death-receptor pathway 杀伤 target。Selectin、integrin 与 chemokine receptor 控制 rolling、firm adhesion 与 tissue entry。Response 后多数 effector cell contraction，部分形成 memory。Persistent antigen 可推动 exhaustion-like state，但这不是简单“没活性”。',
      evidence:'Intracellular cytokine staining、tetramer、proliferation assay、degranulation、live killing 和 tissue imaging 测不同功能。CD8 marker 或 cytotoxic RNA signature 只说明 identity/state 候选；真正 killing 还需 target-specific assay 与空间接触。',
      project:'Tumor single-cell 项目要区分 abundance、activation、dysfunction、clonality 与 location。Cell 数不能替代 patient n；TCR clone expansion 需结合 tissue/time。Cell–cell communication model 基于 expression co-occurrence，不能证明 ligand 到 receptor 的真实接触与 downstream response。',
      pitfall:'“Activated T cell 越多越好”过于简单。过强或持续 response 会造成 tissue damage，且 exhaustion、regulation 与 contraction 是不同时间/功能状态。',
      terms:[term('Co-stimulation','与 antigen-receptor signal 配合、调节 lymphocyte activation 的第二类 signal。','uiucMcb408'),term('Cytotoxic T lymphocyte','可识别并杀伤特定 target cell 的 effector CD8 T cell。','osAdaptiveImmune'),term('Chemokine','引导 cell migration 并组织 tissue positioning 的 cytokine family。','uiucMcb408'),term('Extravasation','leukocyte 从 blood vessel 进入 tissue 的多步骤过程。','uiucMcb408'),term('T-cell exhaustion','persistent stimulation context 下出现的适应性 transcriptional/functional state。','uiucMcb408')],
      check:['Tumor 中 cytotoxicity score 高能否证明 T cell 正在有效杀死 cancer cell？','不能。Score 来自 RNA proxy；还需 target recognition、空间接触、degranulation/killing 与 tumor sensitivity 等 evidence。'],
      sources:['uiucMcb408','osAdaptiveImmune','nciCheckpoint'], prereq:['i03','i06','l04'], core:'Systems / 系统',
      flow:[['Prime','antigen + co-signal'],['Expand','clone 增殖'],['Traffic','chemokine/adhesion'],['Execute','cytokine 或 killing']]
    }),
    chapter({
      id:'i08', title:'Infection、vaccines 与 commensal microbes', subtitle:'Protective immunity 取决于 pathogen life cycle、tissue site 与 response timing；microbiota 同时训练和约束 immunity。',
      intuition:'Vaccine 像在安全条件下预演一次特定威胁，让系统建立可快速调动的 memory；但“保护”不是只有 antibody titer，一个 respiratory virus 和 intracellular pathogen 需要的 defense 组合可能不同。',
      mental:'为一种 pathogen 画四格：entry site、replication niche、damage mechanism、effective immune mechanism。再问 vaccine 把 antigen 送到哪里、提供什么 innate context、建立哪类 memory。',
      mechanism:'Innate response 早期限制 spread 并为 adaptive priming 提供 context。Neutralizing antibody 可阻止 attachment/entry，opsonizing antibody 促进 clearance；CD4 T cell 协调 response，CD8 T cell 处理部分 intracellular infection。Vaccine platform 可使用 attenuated/inactivated organism、protein、vector 或 nucleic acid，各自改变 antigen expression、presentation 与 adjuvant signal。Booster 可提高 quantity/quality 并扩展 memory。Commensal microbiota 参与 barrier development、metabolite production 与 immune education；loss of balance 是 context-dependent dysbiosis，不是单一“坏菌增加”。',
      evidence:'Binding titer、neutralization、memory-cell assay、challenge study 与 real-world effectiveness 的 endpoint 不同。Microbiome association 易受 diet、antibiotic、geography、stool handling 与 compositionality 影响；cross-sectional association 不能证明 microbe 导致 immune phenotype。',
      project:'Vaccine longitudinal data 对齐 dose、days post vaccination、prior exposure 与 age，并用 person-level split。Microbiome–immunity multi-omics 先画 sample pairing 和 medication timeline；功能主张需要 isolate、metabolite、gnotobiotic model 或 controlled perturbation。',
      pitfall:'Vaccine 不保证完全阻止 infection，也不是只产生 antibody。目标可包括降低 infection、severe disease、transmission 或 duration，需看具体 endpoint。',
      terms:[term('Neutralizing antibody','通过阻止 pathogen entry 或关键 step 降低 infectivity 的 antibody。','cdcVaccines'),term('Adjuvant','增强或塑造 vaccine immune response 的成分。','uiucMcb408'),term('Booster','在 initial immunization 后再次给予以强化或更新 response 的 dose。','cdcVaccines'),term('Commensal microbe','通常与 host 共存、可影响 barrier 与 immune state 的 microorganism。','uiucMcb408'),term('Dysbiosis','microbial community 与 host context 失衡的描述性状态。','uiucMcb408')],
      check:['Vaccine 后 binding antibody titer 高，是否足以证明一定阻止 infection？','不足。还要看 specificity、neutralization、site、durability、cellular immunity 与具体 effectiveness endpoint。'],
      sources:['uiucMcb408','cdcVaccines','osAdaptiveImmune'], prereq:['i01','i04','i07','u04'], core:'Systems / 系统',
      flow:[['Exposure','entry 与 niche'],['Innate context','限制 + priming'],['Adaptive effectors','antibody/T cell'],['Memory','更快再次响应']]
    }),
    chapter({
      id:'i09', title:'Allergy、chronic inflammation 与 autoimmunity', subtitle:'Immune pathology 不是“免疫力太强”一个维度，而是 target、location、timing 与 regulation 的组合错误。',
      intuition:'把 immune response 看成需要回答四问的武器系统：打谁、在哪里打、何时开始、何时停止。Allergy、autoimmunity 和 chronic inflammation 往往在不同问题上出错。',
      mental:'画二维表：target 是 external/self，response 是 acute/resolving 或 persistent。把 allergy、autoimmune disease、chronic infection 与 sterile inflammation 放到不同格，再标 tissue damage feedback。',
      mechanism:'Type I hypersensitivity 常由 allergen-specific IgE、mast cell 与 rapid mediator release 驱动；其他 hypersensitivity 涉及 antibody、immune complex 或 T-cell mechanism。Autoimmunity 需要 genetic susceptibility 与 tolerance breakdown，并受 infection、tissue damage、hormone/environment 等 context 影响。Chronic inflammation 可在 trigger 持续、resolution 失败或 repair loop 自我维持时发生。Regulatory T cell、inhibitory receptor、anti-inflammatory mediator 与 tissue-resident mechanism 共同限制损伤。不同 disease 的 dominant pathway 并不相同。',
      evidence:'Autoantibody 可是 diagnostic clue，却不一定 causal 或 disease-specific；cytokine level 是系统 readout，不给 source。Longitudinal flare/remission sample、tissue biopsy、functional assay 与 treatment response 有助于区分 driver 和 consequence。',
      project:'Case–control immune data要匹配 disease activity、treatment、infection status、age/sex 与 sample timing。药物本身会重塑 cell composition 和 gene program；不要把 treated disease 与 healthy 的差异都归因于 disease mechanism。',
      pitfall:'“Inflammation marker 高”不是一种 diagnosis，也不能说明 suppression immune system 就一定有益。有效治疗必须匹配 causal pathway 并平衡 infection/tissue risk。',
      terms:[term('Hypersensitivity','对 antigen 的 immune response 造成 disproportionate tissue injury 的状态。','uiucMcb408'),term('Allergen','可在 susceptible individual 触发 allergic response 的 antigen。','uiucMcb408'),term('Autoimmunity','immune response 针对 self component 并参与 disease 的状态。','uiucMcb408'),term('Regulatory T cell','帮助限制 immune activation 并维持 tolerance 的 T-cell subset。','osAdaptiveImmune'),term('Resolution','主动终止 inflammation 并恢复 tissue homeostasis 的过程。','uiucMcb408')],
      check:['某 patient autoantibody 阳性，能否断定该 antibody 就是症状的直接原因？','不能。它可能是 marker、consequence 或 causal factor；需 specificity、timing、tissue mechanism 与 functional evidence。'],
      sources:['uiucMcb408','osImmunity','osAdaptiveImmune'], prereq:['i01','i05','i07'], core:'Systems / 系统',
      flow:[['Trigger/target','allergen/self/damage'],['Effector','antibody/T cell/myeloid'],['Tissue injury','症状与新 DAMP'],['Regulation','resolution 或 chronic loop']]
    }),
    chapter({
      id:'i10', title:'Cancer immunology 与 immunotherapy evidence chain', subtitle:'治疗能否工作取决于 antigen、presentation、traffic、activation、suppression 与 tumor sensitivity 的整条链。',
      intuition:'把 anti-tumor immunity 看成串联电路：任何一环断开，最后的 killing 都可能失败。Checkpoint inhibitor 只修其中一些调节环节，不是给 immune system 无条件“加速”。',
      mental:'依次画六道门：tumor antigen → MHC presentation → T-cell repertoire/priming → tissue entry → local effector function → tumor death。为每道门放一个可测 readout 和一个 escape mechanism。',
      mechanism:'Tumor mutation、viral antigen 或 aberrant expression 可提供 antigen，但 processing/HLA presentation 决定可见性。Dendritic-cell priming、T-cell clonality 与 trafficking 决定 responder 是否到场。PD-1/PD-L1、CTLA-4 等 checkpoint 限制 activation；blocking antibody 可解除部分 inhibition，同时带来 immune-related adverse event。Tumor 还可通过 antigen loss、HLA/β2M disruption、suppressive myeloid/Treg、metabolite、physical exclusion 或 death resistance 逃逸。CAR-T 把 engineered recognition 接到 T cell，尤其在部分 blood cancer 有效，但 antigen escape 与 toxicity 仍重要。',
      evidence:'PD-L1 staining、tumor mutational burden、TCR clonality、immune infiltration 与 interferon signature 各覆盖不同环节，单一 biomarker 很少充分。Response analysis 需 baseline sample、defined clinical endpoint、treatment line、steroid use 与 patient-level validation。On-treatment change 可解释 mechanism，但不可冒充 pretreatment predictor。',
      project:'建立 immunotherapy model 时先画 causal chain，再选 feature；按 patient 划分 train/test，并避免把同一 patient 多 lesion 泄漏到两边。报告 calibration 与 decision threshold，而不只 AUC。Mechanistic claim 要说明是 association、ex vivo perturbation、animal model 还是 clinical response evidence。',
      pitfall:'“Cold tumor”与“hot tumor”是粗略描述，不是固定 disease type。Low infiltration 可能来自低 antigenicity、presentation defect、vascular/ECM barrier、chemokine mismatch 或 sampling region。',
      terms:[term('Cancer immunity cycle','从 antigen release/presentation 到 T-cell killing 的多步骤 conceptual model。','nciImmunotherapy'),term('Checkpoint blockade','用 therapy 阻断 inhibitory receptor–ligand interaction 以恢复部分 immune activity。','nciCheckpoint'),term('Immune escape','tumor 避免 recognition、entry 或 killing 的 mechanism。','nciImmunotherapy'),term('CAR-T cell','表达 engineered chimeric antigen receptor 的 T cell。','nciImmunotherapy'),term('Immune-related adverse event','immune activation 影响 normal tissue 所致的 treatment toxicity。','nciCheckpoint')],
      check:['Tumor mutational burden 高是否保证 checkpoint blockade response？','不能。Mutation 还需形成可表达/呈递的 antigen，并有 compatible T cell、entry、activation 与 susceptible tumor；clinical context 也重要。'],
      sources:['uiucMcb408','nciCheckpoint','nciImmunotherapy'], prereq:['i03','i05','i07','t03'], core:'Systems / 系统',
      flow:[['Antigen','产生且可见'],['Prime/traffic','T cell 到场'],['Checkpoint/context','允许 effector'],['Tumor death','敏感并被清除']]
    })
  );
})();
