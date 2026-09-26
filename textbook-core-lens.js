/* Fill data bridges for core chapters added after the initial lens inventory. */
(() => {
  const details = {
    x01:['ATAC、DNA topology 与 histone mark assay 从不同角度看 genome 包装。','区间、样本、cell type 和 genome build 要一起保存。','开放或带某 mark 的区域，不等于对应 gene 一定转录。'],
    x02:['DNA synthesis 的标记实验可测 replication fork 方向与速度。','读数依 cell-cycle 阶段、标记时长及单条 DNA fiber 而变化。','一次测序中某位点读数多，不直接证明那里复制得更快。'],
    x04:['DNA damage marker、修复产物和测序 variant 分别对应不同阶段。','把损伤发生、修复、保留下来的 mutation 与采样时间分开。','看到 mutation 不足以判定是哪条 repair pathway 失败。'],
    x05:['nascent RNA、成熟 RNA 和 polymerase 结合是不同 transcription 读数。','按 gene、transcript、方向和时间整理，而不是只看 gene 总量。','RNA abundance 也受降解影响，不是 transcription rate 的直接测量。'],
    x06:['TF binding、ATAC peak 与 RNA readout 提供调控的不同证据。','peak 是坐标区间；target gene 连接是候选边，不是直接观测。','最近 gene 与 TF binding signal 都不能单独证明 enhancer 的功能。'],
    x08:['junction read、transcript estimate 和 gene count 观察不同 RNA 层级。','同一 gene 的不同 isoform 要保留 transcript ID 和注释版本。','gene 总量不变时，splicing 或 regulatory RNA 仍可改变功能。'],
    x09:['Pedigree 记录家庭关系、genotype 和 phenotype。','计算 Bayes 概率前写清先验频率、检测准确度和纳入方式。','一户家系的观察比例不是一般人群 penetrance；概率也非确定诊断。'],
    x10:['家系和 long-read/linked-read 数据可帮助判定 allele 位于哪条 homolog。','单个位点 GT、跨位点 haplotype 与群体 LD 是不同数据层。','两个杂合位点不自动告诉你它们是 cis 还是 trans。'],
    x14:['Tumor sequencing 给 ALT/REF reads，CNV assay 给 copy-number 估计。','在 case、sample、locus 层对齐 VAF、purity、total/minor CN 和 depth。','VAF 是 read 比例，不是 mutation cell fraction；多个参数可给同一 VAF。'],
    x15:['Repeat annotation、copy number 和比较基因组显示 mobile element 或 duplication 痕迹。','read 是否多重比对及 genome build 会改变重复区域的调用。','相似序列未必是近期移动；gene copy 增多也不保证新功能。'],
    e01:['化石、解剖与 DNA sequence 是重建共同历史的不同证据。','对齐的是 homologous feature 或 ortholog，而非只看同名标签。','相似功能可能独立出现；单一 gene tree 也不总等于 species tree。'],
    e03:['多代群体样本记录 allele count 的变化。','分母是采样个体的 allele copies，而非单份 DNA 的 reads。','频率变化可由选择、漂变、迁移和采样偏差等多种机制造成。'],
    h01:['体温、glucose 或 osmolarity 的时间序列可显示调节结果。','按 person、时间、环境与干预记录，不只保留平均值。','数值稳定可能来自持续的主动调节，并非系统没有活动。'],
    l01:['binding assay 测 ligand–receptor 接触，下游 assay 测功能响应。','同一条件下分别记录 ligand 浓度、occupancy、时间与 response。','结合不等于激活；receptor 存在也不等于通路正在运行。'],
    l04:['phospho-protein、转录 reporter 与 cell phenotype 观察 pathway 不同层。','JAK–STAT、TGF-β、Wnt 和 Notch 的输入与时间不能混成同一“活性”列。','一个 pathway marker 上升不证明它是最终 phenotype 的唯一原因。'],
    v01:['单细胞 RNA 与 lineage tracing 分别观察 cell state 和来源。','一个 cell type label 是分类；追踪分化需记录祖先与时间。','两个 cell 的 RNA 不同不自动说明它们的 genome 不同。'],
    i01:['屏障完整性、PAMP sensing 和 cytokine 各有独立 assay。','保留组织位置、刺激、时间及 cell 来源。','炎症 signal 高不能单独指出 pathogen，也不等于保护一定有效。'],
    i03:['HLA peptide、TCR 结合与 T-cell killing 分别处于证据链三段。','匹配 antigen、HLA allele、cell type 和实验时间。','预测 peptide–HLA 结合不等于实际呈递，更不等于杀伤。'],
    i04:['B-cell receptor sequence、antibody titer 与中和试验测不同能力。','按 donor、clone、antigen 与采样时间对齐。','antibody 能结合 antigen 不等于它能中和感染或保护患者。'],
    i05:['耐受、记忆和肿瘤免疫需不同时间点和功能读数。','把 antigen、反复暴露、T/B-cell clone 和临床状态分列。','观察到记忆 cell 不自动说明有保护；免疫活跃也可伴组织损伤。'],
    a01:['反应的底物/产物与 ATP 变化可测能量转换。','浓度、ΔG 与单位时间的反应速率是不同量。','反应热力学上可行不表示它会在 cell 中足够快地发生。'],
    a02:['NADH/NAD⁺ 比值、氧耗和 isotope label 各显示 redox 与 flux 的不同侧面。','把分子库存、电子载体状态和时间序列分开。','NADH 高不等于 electron transport 或 ATP 产量一定高。'],
    a03:['glucose、lactate 与 tracer 记录 glycolysis 和后续碳流。','按 cell/tissue、培养条件与时间存浓度和 label 比例。','lactate 增多不意味着 cell 完全不用 mitochondrion。'],
    a05:['氧耗、ATP 和 TCA metabolite assay 测呼吸的不同环节。','OCR 是速率，代谢物 abundance 是库存，不能互换。','氧耗高不保证所有 ATP 都来自 oxidative phosphorylation。'],
    w01:['balance、pipette 和 standard curve 把材料量转换成记录数字。','每个数要带 unit、dilution factor、instrument 和 calibration。','小数位多不等于准确；technical replicate 也不能代替 biological replicate。'],
    w02:['pH 读数和 positive/negative/vehicle controls 检查实验环境与背景。','对照与 treatment 应来自可比较 sample 和相同流程。','没有合适对照时，signal 变化不一定来自目标处理。'],
    w03:['gel、colony PCR 与 Sanger read 依次检查构建的不同层。','保留 plasmid map、insert 方向、junction 和完整 sequence。','长出抗药 colony 或出现正确大小 band，不等于构建完全正确。'],
    w04:['RNA quality、Cq 曲线与 no-RT/no-template controls 检查 qPCR 各步。','按 biological sample 汇总；reference gene 和扩增效率要验证。','Cq 相差 1 仅在效率等条件合适时才近似两倍。'],
    w05:['gel band 和 antibody signal 是提取、上样、转膜与曝光后的结果。','记录 lane、分子量、曝光时间、loading control 和独立实验。','band 更黑不自动等于 protein 更多；饱和与抗体特异性会影响解释。'],
    w06:['显微图把 label 和光学系统输出为 pixels，再由分割变成 cell 表。','记录 pixel size、通道、曝光、field 和 biological sample。','两个亮点重叠不直接证明两种 protein 物理结合。'],
    w07:['培养皿读数来自在特定 media、密度与 passage 下的 cell model。','保留 cell line 身份、污染检查、transfection efficiency 与 plate/day。','同名 cell line 不保证状态一致；体外响应不能直接代表组织内响应。'],
    w09:['dose–response 与 knockout/rescue assay 检验候选因果路线。','把剂量、时间、guide、control 和独立模型都保留下来。','相关性或单一干预有效，尚不能证明特异性或患者疗效。']
  };
  const chapters = window.BIOCS_BOOK.flatMap(course => course.chapters);
  for (const [id, [signal, unit, limit]] of Object.entries(details)) {
    const chapter = chapters.find(item => item.id === id);
    if (!chapter) throw new Error(`Unknown chapter for core data lens: ${id}`);
    if (window.BIOCS_DATA_LENS[id]) throw new Error(`Duplicate data lens: ${id}`);
    const keys = [...new Set(chapter.sections.flatMap(section => section[2] || []))].slice(0, 2);
    window.BIOCS_DATA_LENS[id] = [signal, unit, limit, keys, null];
  }
})();
