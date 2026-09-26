/* Infection, viral replication, transmission, and drug interpretation. */
(() => {
  const details = {
    'Colonization':['鼻腔中检出某种 bacterium，但人没有症状，也没有组织损伤。','检出 microbe 只说明它在场；不能直接把 colonization 诊断为 infection。'],
    'Infection':['virus 进入 airway cells 并复制，随后出现局部炎症。','有 infection 不一定立刻有症状；症状也可能由非感染原因造成。'],
    'Virulence':['两株同种 bacterium 都能进入宿主，但一株更易造成严重组织损伤。','virulence 是在特定宿主和环境下的致病程度，不是传播速度的同义词。'],
    'Opportunistic pathogen':['免疫抑制病人的正常菌群进入血液后造成疾病。','这种 microbe 并非在任何健康宿主、任何部位都必然致病。'],
    'Colonization resistance':['原有 gut microbiota 占据空间和资源，使新进入的 pathogen 难以建立种群。','这种保护不是绝对屏障；antibiotics 也可能削弱它。'],
    'Adhesin':['bacterium 表面的 adhesin 抓住宿主细胞表面，使其不易被冲走。','能黏附只是感染过程的一步，不保证入侵或疾病。'],
    'Secretion system':['某 bacterium 用 secretion system 把效应 protein 送入宿主 cell。','发现系统基因不等于已证明它在该条件下表达并运作。'],
    'Exotoxin':['bacterium 分泌 toxin，少量 toxin 也可能扰乱宿主 cell 功能。','不要把所有细菌引起的损伤都归因于 exotoxin；免疫反应也可造成损伤。'],
    'Biofilm':['导管表面的 bacteria 黏在一起，包在共同形成的 matrix 中。','biofilm 不是单纯“菌很多”；空间结构与基质会改变药物和免疫接触。'],
    'Quorum sensing':['bacteria 释放并感知信号分子，信号累积后共同改变某些基因的表达。','它不是细菌在“有意识地数数”；具体阈值与环境有关。'],
    'Positive-sense RNA':['某 virus 的 genomic RNA 进入 cell 后可被 ribosome 直接读取以合成 protein。','能直接翻译不代表不需要复制中间体或其他病毒 protein。'],
    'RNA-dependent RNA polymerase':['RNA virus 用 RdRP 以 RNA 为模板复制新的 RNA。','它不同于宿主常规的 DNA-dependent RNA polymerase。'],
    'Reverse transcriptase':['retrovirus 用 reverse transcriptase 从 RNA 做出 DNA copy。','逆转录是 RNA→DNA，不等于整条 viral life cycle 只有这一步。'],
    'Replication intermediate':['正链 RNA virus 复制时可能先造负链 RNA，作为更多正链的模板。','检测到 intermediate 才能更有力支持正在复制；只检测 viral genome 不够。'],
    'Reassortment':['两株 segmented influenza viruses 共感染一个 cell，后代得到混合的 genome segments。','reassortment 是整段互换，不等同单个 nucleotide mutation；还要求可交换的分节 genome。'],
    'Viral tropism':['某 virus 更容易在表达合适受体且支持复制的特定 cell type 中扩增。','受体存在不保证 productive infection；进入后的宿主限制同样重要。'],
    'Uncoating':['virus 进入 cell 后拆开 capsid，让 genome 可被复制或翻译 machinery 接触。','进入 cell 与 uncoating 是不同步骤，不能把二者混成同一事件。'],
    'Budding':['enveloped virus 从宿主 membrane 向外出芽并取得外膜。','不是所有 virus 都靠 budding 离开；也有通过 cell lysis 释放的。'],
    'Latency':['herpesvirus genome 可长期保留，暂时不产生大量新病毒，之后再活化。','latency 不等于 virus 已被清除，也不等于持续大量复制。'],
    'Cytopathic effect':['感染培养细胞后看到 cells 变圆、融合或死亡。','形态变化提示影响，不单独证明是哪种机制或临床严重程度。'],
    'Bacteriophage':['某 phage 感染 bacterium，把其 nucleic acid 送入细菌 cell。','phage 的宿主是 bacteria；不能把它当作直接感染人细胞的 virus。'],
    'Transduction':['phage 偶然把前一个 bacterium 的 DNA 带到下一个 bacterium。','这里是 phage 介导基因转移，不是细菌直接接触的 conjugation。'],
    'Conjugation':['带 plasmid 的 bacterium 经细胞接触把 DNA copy 传给另一 bacterium。','conjugation 不等于有性生殖；接受者未必得到完整供体 genome。'],
    'Prophage':['temperate phage 的 genome 整合到 bacterial chromosome，随细菌复制。','prophage 是潜伏的遗传状态，不是成熟的游离 phage particle。'],
    'CRISPR–Cas system':['某 bacterium 保留 phage 序列片段，之后用 guide RNA 帮助 Cas 蛋白识别入侵序列。','天然系统和实验室 gene editing 工具有关，但不是完全相同的使用情境。'],
    'Minimum inhibitory concentration':['培养皿中最低能阻止可见 bacterial growth 的 antibiotic 浓度被记为 MIC。','MIC 是标准化体外条件下的值，不直接保证病人体内能安全达到有效浓度。'],
    'Persistence':['一小群 bacteria 在药物暴露时暂时不生长，停药后又恢复生长。','persister cells 不一定有遗传性 resistance；需区分可逆状态与耐药突变。'],
    'Efflux pump':['bacterium 的 membrane pump 把某 antibiotic 排到 cell 外，降低内浓度。','检测到 pump 基因不等于它正在表达，也不说明它是唯一 resistance 机制。'],
    'Combination therapy':['用作用机制不同的两种药物治疗某 infection，并监测反应。','两药合用未必相加或协同；也可能增毒或相互拮抗。'],
    'Basic reproduction number':['完全易感人群中，平均一个感染者造成约 2 个继发病例，可写 R₀≈2。','R₀ 不是某天实际传播数；行为、免疫和干预变化会影响实际 Rt。'],
    'Transmission bottleneck':['一个宿主体内有许多 viral variants，传给下一宿主的可能只有少数。','下一个宿主的序列频率不一定代表原宿主中所有 variants 的频率。'],
    'Spillover':['原本主要在动物宿主传播的 pathogen 偶尔感染人。','一次 spillover 不证明它已能持续人传人。'],
    'One Health':['研究 zoonotic infection 时同时考虑人、动物和共同环境的接触网络。','它是跨领域分析框架，不是一项单独的检测技术。'],
    'Biosecurity':['实验室用出入控制和样本台账降低生物材料被误用或丢失的风险。','biosecurity 关注获取与误用风险；与防止意外暴露的 biosafety 有交集但不相同。'],
    'Pharmacokinetics':['给药后测血中药物浓度随时间先升后降，研究吸收、分布、代谢和排泄。','PK 说身体怎样处理药物，不直接说明药物对靶点的效应。'],
    'Pharmacodynamics':['同一药物不同浓度下，比较 receptor occupancy 或下游效应。','PD 描述药物造成什么效应，不能只凭血药浓度推断临床收益。'],
    'Efficacy':['随机试验中比较药物组与对照组的预设结局，估计指定条件下的疗效。','实验室抑菌效果、临床 efficacy 与真实世界 effectiveness 是不同层次。'],
    'Therapeutic window':['药物浓度太低可能无效，太高可能有毒；目标是两者之间的可用范围。','“窗口”不是人人相同的固定数字，会受个体和共同用药影响。']
  };
  const glossary = window.BIOCS_GLOSSARY;
  for (const [label, [example, caution]] of Object.entries(details)) {
    const entry = glossary.get(label);
    if (!entry) throw new Error(`Unknown glossary term: ${label}`);
    entry.example = example;
    entry.caution = caution;
    entry.category = '拓展概念';
  }
})();
