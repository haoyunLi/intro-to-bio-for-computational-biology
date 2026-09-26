/* Wet-lab measurement terms: what the instrument reads and what it cannot infer. */
(() => {
  const details = {
    'Accuracy':['已知标准浓度为 10，测得平均 9.9，说明结果接近真值。','单次读数接近真值可能是偶然；还要看重复和校准。'],
    'Precision':['同一样本重复测得 8.1、8.0、8.1，重复性较高。','读数集中但都偏离真值时，precision 高而 accuracy 仍低。'],
    'Serial dilution':['把 1 份样本与 9 份稀释液混合，再重复得到 1:10、1:100 梯度。','每步误差会累积；标称倍数不保证实际浓度精确。'],
    'Calibration curve':['用已知 0、1、2、5 单位标准品建立 signal 与浓度的关系。','不能随意把测量范围外的 signal 外推成准确浓度。'],
    'Limit of detection':['低于某浓度时，signal 无法可靠区别于 blank。','检测不到不等于样本中绝对没有该分子。'],
    'Buffer':['实验液中的 phosphate buffer 帮助 pH 在反应中保持稳定。','buffer 有有限容量；加太多酸碱仍会明显改变 pH。'],
    'Positive control':['PCR 中放入已知含目标 DNA 的样本，确认引物和体系能扩增。','阳性对照成功不保证每个研究样本没有抑制剂。'],
    'Vehicle control':['药物溶于 DMSO 时，对照组加入相同浓度 DMSO。','只比较药物组与无任何添加组，可能把 solvent 效应归给药物。'],
    'Randomization':['随机分配处理组样本到不同孔位，避免边缘孔只落在一组。','随机化减少系统偏差，不替代足够的独立 biological replicates。'],
    'Polymerase chain reaction':['两条 primers 夹住目标 DNA 区间，经循环扩增产生可检测产物。','看到扩增 band 不自动证明起始样本含量高。'],
    'Transformation':['bacterium 摄取带 resistance marker 的 plasmid 后，可在选择培养基生长。','长出 colony 仍应验证 plasmid insert 是否正确。'],
    'Selectable marker':['plasmid 上的 resistance gene 让带 plasmid 的 bacteria 在指定药物下存活。','marker 只筛选携带状态，不保证目标 gene 表达正确。'],
    'Sanger sequencing':['用 chain-terminating nucleotide 产生不同长度片段，读取目标 PCR 产物。','混合样本中的低频 variant 可能被主信号掩盖。'],
    'Reverse transcription':['用 RNA 做 template 合成 cDNA，之后可做 qPCR。','cDNA 信号受 RNA 质量和 RT efficiency 影响。'],
    'Quantitative PCR':['每轮监测 fluorescence，并比较目标 cDNA 的扩增曲线。','Cq 差异不能脱离 primer efficiency 与 normalization 直接叫 expression 倍数。'],
    'Quantification cycle':['某样本第 22 轮超过 fluorescence threshold，记为 Cq≈22。','Cq 越小通常起始模板越多，但阈值和效率也影响它。'],
    'Reference gene':['用经验证稳定的 gene 帮助比较不同样本的 qPCR target signal。','所谓 housekeeping gene 在处理条件下也可能变化。'],
    'Amplification efficiency':['理想 PCR 每轮目标量接近翻倍，对应效率接近 100%。','两组 primers 效率不同会扭曲 ΔΔCq 推断。'],
    'SDS–PAGE':['SDS 处理后的 protein 在凝胶中主要按 apparent size 分开。','band 位置不能独自确定 protein 身份或活性。'],
    'Western blot':['凝胶分离后将 protein 转膜，用 antibody 检测目标 band。','band 深浅还受 loading、transfer 和曝光饱和影响。'],
    'Epitope':['某 antibody 识别目标 protein 上的一段结构或序列。','protein 被修饰或变性后，epitope 可能暴露或消失。'],
    'Loading control':['比较 Western lanes 时，用总 protein stain 或验证稳定的参考 signal 检查投入量。','参考 band 若随处理改变，就不是可靠的归一化依据。'],
    'Linear range':['标准样本量翻倍时，检测 signal 也约翻倍的区间。','饱和 band 的亮度不能按比例比较 protein abundance。'],
    'Spatial resolution':['显微系统能否分开两个相邻荧光点，受光学和处理影响。','像素尺寸小不自动意味着真实可分辨结构同样小。'],
    'Fluorophore':['荧光染料吸收一段 wavelength 的光，再发出另一段。','两个 fluorophores 的光谱可能重叠，需要控制串色。'],
    'Point-spread function':['一个理想点光源在显微图里扩散成模糊光斑。','图像中一团亮光未必是一颗大分子或一颗 cell。'],
    'Aseptic technique':['培养 cell 时消毒工作台并使用无菌移液耗材。','操作规范降低污染概率，却不保证培养物绝对无微生物。'],
    'Confluency':['培养皿表面约 80% 面积被 adherent cells 覆盖。','confluency 是覆盖面积，不是 cell 总数或活细胞比例。'],
    'Passage':['cell 长满后分开转入新培养皿，记下一次 passage。','passage 数会影响状态，不能假定不同批次 cell 完全相同。'],
    'Transfection':['把 siRNA 或 plasmid 导入 eukaryotic cells，观察后续响应。','导入成功比例和毒性需控制；加入试剂不等于每颗 cell 都收到。'],
    'Cell line authentication':['用 STR profile 等方法确认培养 cell 的身份。','鉴定身份不等于排除了 mycoplasma 或其他污染。'],
    'Flow cytometry':['悬浮 cell 逐个穿过检测点，记录多通道 fluorescence。','记录的是 events；doublets、碎片和补偿错误需要排查。'],
    'Gating':['先排除碎片与 doublets，再在余下 events 中定义 CD45⁺ 群。','gate 位置会改变比例，需说明控制与选择规则。'],
    'Spectral compensation':['一个 fluorophore 的光漏到另一 detector，计算后作校正。','补偿不能修复抗体非特异性或生物样本污染。'],
    'Fluorescence minus one control':['染色组合少放 CD8 抗体，观察其余通道给 CD8 gate 的背景。','FMO 帮助设 gate，不等同于完整的未染色或同型对照。'],
    'Cell sorting':['流式仪按 marker 组合选取并收集目标 cell 群。','排序纯度与 cell 活性需复查，门控标签不保证绝对纯净。'],
    'Perturbation':['敲低一个 gene 后测 pERK 和增殖变化。','处理还可能有 off-target 或一般毒性，需相应对照。'],
    'Dose–response relationship':['把药物剂量从低到高排列，观察 cell viability 如何变化。','曲线位置受暴露时间与 assay 影响，不是药物永久固定属性。'],
    'Target engagement':['检测药物是否在样本中占据或影响预期 target。','看到下游 phenotype 不足以证明药物确实作用于目标分子。'],
    'Orthogonal validation':['RNA-seq 指示 gene 下降，再用独立 qPCR 或 protein assay 检查。','两种方法共享同一样本偏差时，独立性仍有限。'],
    'Data provenance':['图上的一个点可追到样本 ID、仪器原始文件和处理脚本。','有可追溯性不自动证明实验对照充分。'],
    'Blinding':['量显微图时，分析者不知道图来自药物组还是对照组。','blinding 可降低主观偏差，不能修复糟糕的随机分配。'],
    'Research integrity':['保留所有实验批次和排除理由，避免只报告显著结果。','结果可复现仍需如实说明限制，不应把相关写成因果。']
  };
  const glossary = window.BIOCS_GLOSSARY;
  for (const [label, [example, caution]] of Object.entries(details)) {
    const entry = glossary.get(label);
    if (!entry) throw new Error(`Unknown glossary term: ${label}`);
    entry.example = example;
    entry.caution = caution;
    entry.category = '实验与数据';
  }
})();
