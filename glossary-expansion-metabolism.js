/* Metabolism terms: distinguish pools, rates, energy, and measured signals. */
(() => {
  const details = {
    'Gibbs free energy':['ATP hydrolysis 与某不利反应耦联后，整体 ΔG 可变为负。','ΔG 告诉方向倾向，不告诉反应在 cell 里实际有多快。'],
    'Activation energy':['enzyme 降低到达 transition state 的能垒，让反应更快。','降低能垒不等于改变反应物与产物之间的平衡 ΔG。'],
    'Oxidation':['NADH 把 electron 交给呼吸链时，NADH 被氧化。','氧化指失去 electron，不要求反应里一定出现 oxygen 原子。'],
    'Reduction':['NAD⁺ 接受 electron 成为 NADH，是还原。','还原与氧化总是配对发生，不能只追一半电子去向。'],
    'NADPH':['脂肪酸合成可使用 NADPH 提供 reducing power。','NADPH 与 NADH 角色常不同，不能只因名字相似就互换。'],
    'Substrate-level phosphorylation':['glycolysis 某一步直接把 substrate 上的 phosphate 转给 ADP。','它不同于利用 proton gradient 的 oxidative phosphorylation。'],
    'Gluconeogenesis':['肝脏可利用 lactate 等前体重新形成 glucose。','它不是 glycolysis 简单倒放；若干步骤需要不同 enzyme。'],
    'Cori cycle':['肌肉产生的 lactate 运到肝脏，可用于再造 glucose。','只测血中 lactate 高，不能证明整条 Cori cycle 流量增加。'],
    'Pentose phosphate pathway':['glucose-6-phosphate 可进入 PPP，提供 NADPH 与 ribose precursor。','PPP 不是单纯“产 ATP”的通路。'],
    'Glucose-6-phosphate dehydrogenase':['G6PD 催化 oxidative PPP 的起始反应，影响 NADPH 供给。','G6PD RNA 高不自动表示该 pathway 实际 flux 更高。'],
    'Ribose-5-phosphate':['cell 可用 ribose-5-phosphate 构建 nucleotide 的糖骨架。','有这个 precursor 不等于 DNA replication 一定加快。'],
    'Glutathione':['还原型 glutathione 可参与清除某些 oxidant。','只测总 glutathione 含量，未必知道当前 redox 状态。'],
    'Oxidative stress':['活性氧产生超过 cell 可处理能力时，损伤风险上升。','检测一种 ROS probe 信号高，仍需考虑 probe 特异性与位置。'],
    'Electron transport chain':['电子依次经过内膜复合物，部分步骤推动 proton 跨膜。','electron transport 与 ATP synthase 相连，但不是同一个 enzyme。'],
    'Proton-motive force':['mitochondrion 内膜两侧的电压和 H⁺ 差共同推动 ATP synthase。','只量 pH 差会漏掉 membrane voltage 的贡献。'],
    'Anaplerosis':['TCA 中间物被抽去做 amino acid 后，glutamine 可补充部分碳。','池中浓度不变也可能同时有很大的流出与补入。'],
    'β-oxidation':['fatty acyl-CoA 每轮缩短两个碳，产生 acetyl-CoA 与电子载体。','脂肪酸含量下降不独自证明 β-oxidation 增加。'],
    'Carnitine shuttle':['long-chain fatty acyl group 借 carnitine 相关步骤进入 mitochondrial matrix。','并非所有脂肪酸都以完全相同方式通过这一系统。'],
    'Fatty-acid synthesis':['cell 用 acetyl-derived carbon 和 NADPH 逐步做出 fatty acid。','高 lipid abundance 可来自摄取，不必来自自身合成。'],
    'Ketone body':['禁食时肝脏产生的 ketone bodies 可供其他 tissue 使用。','血中 ketone 高不等于每个 tissue 都以相同速率使用它。'],
    'Lipidomics':['质谱比较两组样本的多种 phospholipid species。','一个 m/z feature 的 annotation 与精确定量仍需核对。'],
    'Transamination':['一个 amino acid 的氨基转移给 α-keto acid，形成另一 amino acid。','转移 nitrogen 不等于把 nitrogen 从 body 排出。'],
    'Urea cycle':['liver 把 excess nitrogen 纳入 urea，之后由肾脏排出。','血中 urea 变化也受肾功能和体液状态影响。'],
    'Glutamine':['glutamine 可携带 nitrogen，也可给增殖 cell 提供碳骨架。','glutamine 丰度高不自动证明它被用于哪条 pathway。'],
    'De novo nucleotide synthesis':['增殖 cell 可从小分子前体逐步构建 purine nucleotide。','nucleotide 总量升高也可能来自 salvage 或摄取。'],
    'Salvage pathway':['cell 回收已有 base 或 nucleoside，再合成 nucleotide。','salvage 不是新造全部原子；要区分原料来源。'],
    'Fed state':['饭后 insulin 上升，部分 tissue 增加 nutrient 使用或储存。','真实 metabolic state 不是所有 cell 同时切换的单一开关。'],
    'Fasted state':['禁食一段时间后，liver 更重视维持可用 blood fuel。','fasted 不等于身体所有地方停止 glucose 利用。'],
    'Insulin resistance':['相同 insulin exposure 下，某 tissue 的 glucose uptake 反应变弱。','空腹 insulin 高只是线索；机制和组织差异需进一步测量。'],
    'Glycogenolysis':['liver 分解 glycogen，提供可释放或可使用的 glucose unit。','它与从非碳水前体新造 glucose 的 gluconeogenesis 不同。'],
    'Ketogenesis':['liver 将部分 acetyl-CoA 转成 acetoacetate 等 ketone bodies。','ketogenesis 与其他 tissue 消耗 ketone 是两个不同过程。'],
    'Warburg effect':['某些肿瘤 cell 即使有 oxygen 也产生大量 lactate。','这不表示 mitochondrion 完全失活或所有 cancer cell 都一样。'],
    'Metabolic reprogramming':['同一 cell 在增殖状态下可能重新分配 glucose 的碳去向。','RNA pathway score 改变只能提出假说，不能直接读成 flux 重排。'],
    'Hypoxia-inducible factor':['低氧时 HIF 相关调控可改变血管与代谢 gene program。','HIF gene RNA 高不等于 HIF protein 已稳定并具活性。'],
    'Nutrient competition':['tumor cell 与 T cell 在同一局部环境争用有限 glucose。','两者都表达 transporter 不足以证明发生了实际竞争。'],
    'Metabolome':['采样时的 blood plasma 中可测到一组小分子。','metabolome 随时间、组织和检测平台变化，不是固定完整清单。'],
    'Untargeted metabolomics':['先尽量记录大量质谱 features，再逐步 annotation。','untargeted 不等于所有 metabolites 都能被识别和定量。'],
    'Targeted metabolomics':['为预先指定的 lactate 等 analytes 建标准曲线并测量。','高定量准确度仅适用于设定的目标与验证范围。'],
    'Isotopologue':['用 ¹³C-glucose 后，含两个 ¹³C 的 lactate 是一种 isotopologue。','标记比例受输入与时间影响，不能只看一个时间点就断言 flux。'],
    'MetaboLights':['研究可在 MetaboLights 提交 metabolomics 原始文件与样本 metadata。','repository 收录不等于不同研究的处理和定量口径自动可比。']
  };
  const glossary = window.BIOCS_GLOSSARY;
  for (const [label, [example, caution]] of Object.entries(details)) {
    const entry = glossary.get(label);
    if (!entry) throw new Error(`Unknown glossary term: ${label}`);
    entry.example = example;
    entry.caution = caution;
    entry.category = '能量与代谢';
  }
})();
